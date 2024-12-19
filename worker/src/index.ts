// src/index.ts

import { HandlerGetCourseOutline } from "handlers/getCourseOutline";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { Env, CORS_HEADERS } from "./env";
import { HandlerGetTTS } from "handlers/getTTS";
import { HandlerGetCoursePage } from "handlers/getCoursePage";
import { HandlerPostFeedback } from "handlers/postFeedback";
import { HandlerGetSTT } from "handlers/getSTT";
import { HandlerGetCourseScore } from "handlers/getCourseScore";
import { HandlerClientLog } from "handlers/clientLog";
import { Logger } from "utils/logger";

// Define the expected response format
const responseSchema = z.object({
  api_response_message: z.object({
    setup: z.string(),
    answer: z.string(),
  }),
});

type ResponseFormat = z.infer<typeof responseSchema>;

// URL Prefix, required from our client
const URL_PREFIX = "yuV2sQzomDdE";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      // Handle CORS preflight request
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("method not allowed", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const url = new URL(request.url);
    if (!url.pathname.startsWith("/" + URL_PREFIX + "/")) {
      // Not a request for this worker
      return new Response("router not found", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const uri = url.pathname.replace("/" + URL_PREFIX + "/", "");

    if (
      ![
        "text",
        "tts",
        "getCourseOutline",
        "getCoursePage",
        "postFeedback",
        "stt",
        "score",
        "clientLog",
      ].includes(uri)
    ) {
      return new Response("route not found", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // Handle client logging before auth check
    if (uri === "clientLog") {
      return HandlerClientLog(request, env, ctx);
    }

    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("missing authorization header.", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const supabaseToken = authHeader.replace("Bearer ", "");
    const isValid = await validateSupabaseToken(
      supabaseToken,
      env.SUPABASE_JWT_SECRET
    );

    if (!isValid) {
      // Create unauthorized response
      const unauthorizedResponse = new Response(
        "invalid authorization token.",
        {
          status: 401,
          headers: CORS_HEADERS,
        }
      );

      // Use waitUntil to ensure logging completes
      ctx.waitUntil(
        // log the unauthorized request
        new Logger(env).logRequest(
          request,
          null,
          "unauthorized_user|anonymous_user|hasInvalidToken"
        )
      );

      return unauthorizedResponse;
    }

    const openai = new OpenAI({
      baseURL: "https://api.openai.com/v1/",
      apiKey: env.OPENAI_API_KEY,
    });

    switch (uri) {
      case "getCourseOutline":
        return HandlerGetCourseOutline(request, env, ctx);
      case "getCoursePage":
        return HandlerGetCoursePage(request, env, ctx);
      case "tts":
        return HandlerGetTTS(request, env, ctx);
      case "postFeedback":
        return HandlerPostFeedback(request, env, ctx);
      case "stt":
        return HandlerGetSTT(request, env, ctx);
      case "score":
        return HandlerGetCourseScore(request, env, ctx);
      default:
        return new Response("route not found", {
          status: 400,
          headers: CORS_HEADERS,
        });
    }

    // should not be reachable
    return new Response("end", {
      status: 500,
      headers: CORS_HEADERS,
    });
  },
};

async function validateSupabaseToken(
  token: string,
  jwtSecret: string
): Promise<boolean> {
  try {
    // Remove 'Bearer ' prefix if present
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    const [header, payload, signature] = actualToken.split(".");
    if (!header || !payload || !signature) {
      console.error("Invalid token format: missing parts");
      return false;
    }

    // Add padding to base64 if needed
    const addPadding = (str: string) => {
      while (str.length % 4) str += "=";
      return str;
    };

    // Replace URL-safe chars and add padding
    const base64Payload = addPadding(
      payload.replace(/-/g, "+").replace(/_/g, "/")
    );

    try {
      const payloadJson = JSON.parse(atob(base64Payload));
      if (payloadJson.exp && payloadJson.exp < Math.floor(Date.now() / 1000)) {
        console.error("Token expired");
        return false;
      }
    } catch (err) {
      console.error("Failed to parse token payload:", err);
      return false;
    }

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(jwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const base64Signature = addPadding(
      signature.replace(/-/g, "+").replace(/_/g, "/")
    );

    return await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      Uint8Array.from(atob(base64Signature), (c) => c.charCodeAt(0)),
      new TextEncoder().encode(`${header}.${payload}`)
    );
  } catch (err) {
    console.error("Supabase token validation error:", err);
    return false;
  }
}
