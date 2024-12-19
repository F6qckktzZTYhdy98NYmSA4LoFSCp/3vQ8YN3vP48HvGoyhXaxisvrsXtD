import { z } from "zod";
import { Env, CORS_HEADERS } from "env";
import OpenAI from "openai";
import { withLogging } from "../utils/logger";

export interface TTSInput {
  voiceover: string;
}

export const TTSInputSchema = z.object({
  voiceover: z.string().min(1).max(4096),
});

export const HandlerGetTTS = withLogging(
  async (
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> => {
    try {
      const inputRaw = await request.json();
      const input = TTSInputSchema.parse(inputRaw);
      const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });

      const ttsVersion = "tts-1"; // "tts-1-hd"
      const ttsVoice = "alloy"; // https://platform.openai.com/docs/guides/text-to-speech#voice-options

      let response;
      try {
        response = await openai.audio.speech.create({
          model: ttsVersion,
          input: input.voiceover,
          response_format: "mp3",
          voice: ttsVoice,
          speed: 1.0,
        });
        // Get the audio data as an ArrayBuffer
        const audioData = await response.arrayBuffer();

        // Return the audio data with appropriate headers
        return new Response(audioData, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": audioData.byteLength.toString(),
            ...CORS_HEADERS,
          },
        });
      } catch (error) {
        return new Response("failed to generate audio from backend api", {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    } catch (error) {
      console.error("Error handling request:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: CORS_HEADERS,
      });
    }
  }
);
