import { createClient } from '@supabase/supabase-js';
import { Env } from '../env';
import { getEmailFromToken } from './getEmailFromToken';

interface LogEntry {
  // Request metadata
  id: string;
  timestamp: string;
  duration_ms?: number;
  
  // Request details
  request_method: string;
  request_url: string;
  request_path: string;
  query_params?: Record<string, string>;
  request_headers: Record<string, string>;
  request_body?: any;
  request_size?: number;
  
  // Client information
  client_ip?: string;
  user_email?: string;
  user_agent?: string;
  referrer?: string;
  origin?: string;
  
  // Response information
  response_status?: number;
  response_body?: any;
  response_headers?: Record<string, string>;
  response_size?: number;
  content_type?: string;
  cache_status?: string;
  
  // Error information
  error?: string;
  error_stack?: string;
  error_type?: string;
  error_source?: string;

  // Client logging
  client_timestamp?: string;
  event_type?: string;
  event_name?: string;
  event_data?: any;
}

export interface ClientLogEntry {
  event_type: string;
  event_name: string;
  event_data?: any;
}

export class Logger {
  private supabase;
  private env: Env;
  private requestStartTime: number;
  private requestId: string;

  constructor(env: Env) {
    this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    this.env = env;
    this.requestStartTime = Date.now();
    this.requestId = crypto.randomUUID();
  }

  private async getUserEmail(request: Request): Promise<string> {
    try {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader) return "anonymous_user";
      
      const token = authHeader.replace('Bearer ', '');
      const email = await getEmailFromToken(token, this.env.SUPABASE_JWT_SECRET);
      return email || "anonymous_user";
    } catch (error) {
      console.error('Error getting user email:', error);
      return "anonymous_user";
    }
  }

  private getClientIP(request: Request): string | undefined {
    return request.headers.get('CF-Connecting-IP') || 
           request.headers.get('X-Real-IP') || 
           request.headers.get('X-Forwarded-For')?.split(',')[0] || 
           undefined;
  }

  private getUserAgent(request: Request): string | undefined {
    return request.headers.get('User-Agent') || undefined;
  }

  private getQueryParams(url: string): Record<string, string> {
    try {
      const urlObj = new URL(url);
      const params: Record<string, string> = {};
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    } catch {
      return {};
    }
  }

  private async getRequestSize(request: Request): Promise<number | undefined> {
    try {
      const clone = request.clone();
      const body = await clone.blob();
      return body.size;
    } catch {
      return undefined;
    }
  }

  async logRequest(request: Request, requestBody?: any, overrideEmail?: string): Promise<void> {
    const userEmail = overrideEmail || await this.getUserEmail(request);
    const clientIP = this.getClientIP(request);
    const userAgent = this.getUserAgent(request);
    const url = new URL(request.url);
    const requestSize = await this.getRequestSize(request);

    const entry: Partial<LogEntry> = {
      id: this.requestId,
      timestamp: new Date().toISOString(),
      request_method: request.method,
      request_url: request.url,
      request_path: url.pathname,
      query_params: this.getQueryParams(request.url),
      request_headers: Object.fromEntries(request.headers),
      request_body: requestBody,
      request_size: requestSize,
      client_ip: clientIP,
      user_email: userEmail,
      user_agent: userAgent,
      referrer: request.headers.get('Referer') || undefined,
      origin: request.headers.get('Origin') || undefined
    };

    await this.saveLog(entry);
  }

  async logClientEvent(request: Request, clientLog: ClientLogEntry): Promise<void> {
    const clientIP = this.getClientIP(request);
    const userAgent = this.getUserAgent(request);
    const url = new URL(request.url);
    const userEmail = await this.getUserEmail(request);

    const entry: Partial<LogEntry> = {
      id: this.requestId,
      timestamp: new Date().toISOString(),
      request_method: request.method,
      request_url: request.url,
      request_path: url.pathname,
      client_ip: clientIP,
      user_email: userEmail,
      user_agent: userAgent,
      referrer: request.headers.get('Referer') || undefined,
      origin: request.headers.get('Origin') || undefined,
      event_type: clientLog.event_type,
      event_name: clientLog.event_name,
      event_data: clientLog.event_data
    };

    // console.log('Logging client event:', {
    //   event_type: clientLog.event_type,
    //   event_name: clientLog.event_name,
    //   event_data: clientLog.event_data
    // });

    await this.saveLog(entry);
  }

  async logResponse(response: Response, responseBody?: any): Promise<void> {
    const entry: Partial<LogEntry> = {
      id: this.requestId,
      timestamp: new Date().toISOString(),
      duration_ms: Date.now() - this.requestStartTime,
      response_status: response.status,
      response_body: responseBody,
      response_headers: Object.fromEntries(response.headers),
      response_size: parseInt(response.headers.get('content-length') || '0') || undefined,
      content_type: response.headers.get('content-type') || undefined,
      cache_status: response.headers.get('cf-cache-status') || undefined
    };

    await this.saveLog(entry);
  }

  async logError(error: Error, source?: string): Promise<void> {
    const entry: Partial<LogEntry> = {
      id: this.requestId,
      timestamp: new Date().toISOString(),
      duration_ms: Date.now() - this.requestStartTime,
      error: error.message,
      error_stack: error.stack,
      error_type: error.name,
      error_source: source
    };

    await this.saveLog(entry);
  }

  private async saveLog(entry: Partial<LogEntry>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('request_logs')
        .insert([entry]);

      if (error) {
        console.error('Error saving log:', error);
      }
    } catch (err) {
      console.error('Failed to save log:', err);
    }
  }
}

export function withLogging(handler: (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>) {
  return async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
    const logger = new Logger(env);
    let requestBody;
    
    try {
      // Clone the request to read the body
      if (request.body) {
        const clonedRequest = request.clone();
        requestBody = await clonedRequest.json();
      }
      
      // Log the request
      ctx.waitUntil(logger.logRequest(request, requestBody));

      // Execute the handler
      const response = await handler(request, env, ctx);
      
      // Clone the response to read the body
      const clonedResponse = response.clone();
      let responseBody;
      try {
        responseBody = await clonedResponse.json();
      } catch {
        // Response might not be JSON
        responseBody = null;
      }

      // Log the response
      ctx.waitUntil(logger.logResponse(response, responseBody));

      return response;
    } catch (error) {
      // Log any errors
      ctx.waitUntil(logger.logError(error as Error));
      throw error;
    }
  };
}
