import { z } from "zod";
import { Env, CORS_HEADERS } from "../env";
import OpenAI from "openai";
import { withLogging } from "../utils/logger";

export interface STTInput {
  audioFile: File;
}

export const STTInputSchema = z.object({
  audioFile: z.instanceof(File),
});

export const HandlerGetSTT = withLogging(
  async (
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> => {
    try {
      const formData = await request.formData();
      const audioFile = formData.get("audio") as File;

      if (!audioFile) {
        throw new Error("No audio file provided");
      }

      const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });

      try {
        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1",
          language: "en",
          response_format: "json",
        });

        return new Response(JSON.stringify({ text: transcription.text }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
          },
        });
      } catch (error) {
        console.error("OpenAI API Error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to transcribe audio" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...CORS_HEADERS,
            },
          }
        );
      }
    } catch (error) {
      console.error("Request Processing Error:", error);
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        },
      });
    }
  }
);
