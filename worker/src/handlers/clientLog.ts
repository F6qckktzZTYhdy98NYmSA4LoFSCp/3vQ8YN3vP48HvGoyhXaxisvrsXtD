import { z } from "zod";
import { Env, CORS_HEADERS } from "env";
import { Logger, ClientLogEntry } from "../utils/logger";

const ClientLogSchema = z.object({
  message: z.object({
    event_type: z.string().min(1),
    event_name: z.string().min(1),
    event_data: z.any().optional(),
  }),
});

export const HandlerClientLog = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> => {
  try {
    const inputRaw = await request.json();
    // console.log('Received client log:', inputRaw);
    const input = ClientLogSchema.parse(inputRaw);

    if (!input.message.event_type || !input.message.event_name) {
      return new Response("Missing event type or event name", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const logger = new Logger(env);
    await logger.logClientEvent(request, input.message as ClientLogEntry);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: 400,
        headers: CORS_HEADERS,
      });
    } else {
      console.error('Error in clientLog:', error);
      return new Response("Internal server error", {
        status: 500,
        headers: CORS_HEADERS,
      });
    }
  }
};
