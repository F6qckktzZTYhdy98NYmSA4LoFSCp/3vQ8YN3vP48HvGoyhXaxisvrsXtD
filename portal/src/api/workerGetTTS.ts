import { supabase } from "@/lib/supabase";
import { z } from "zod";

const WORKER_BASE_URL = import.meta.env.VITE_WORKER_BASE_URL;

export interface TTSInput {
  voiceover: string;
}

export const TTSInputSchema = z.object({
  voiceover: z.string().min(1).max(10000),
});

export async function workerGetTTS(input: TTSInput): Promise<string> {
    // return workerGetTTSFromSampleFile();
    
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  const response = await fetch(`${WORKER_BASE_URL}/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    console.error("Failed to generate speech");
    // (response);
    throw new Error("Failed to generate speech");
  }

  const audioBlob = await response.blob();

  const audioUrl = URL.createObjectURL(audioBlob);

  return audioUrl;
}

export async function workerGetTTSFromSampleFile(): Promise<string> {
    // load /public/sounds/sample_audio.mp3
    const response = await fetch('/sounds/sample_audio.mp3');
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
}
