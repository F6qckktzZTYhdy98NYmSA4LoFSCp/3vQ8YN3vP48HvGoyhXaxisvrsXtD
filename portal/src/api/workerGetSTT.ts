import { supabase } from "@/lib/supabase";
import { z } from "zod";

const WORKER_BASE_URL = import.meta.env.VITE_WORKER_BASE_URL;

export interface GETSTTInput {
  audioBlob: Blob;
}

export const GETSTTInputSchema = z.object({
  audioBlob: z.instanceof(Blob),
});

export async function workerGetSTT(input: GETSTTInput): Promise<string> {
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  
  // Create form data to send the audio blob
  const formData = new FormData();
  formData.append('audio', input.audioBlob, 'recording.webm');

  const response = await fetch(`${WORKER_BASE_URL}/stt`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    console.error("Failed to transcribe speech");
    // (response);
    throw new Error("Failed to transcribe speech");
  }

  const result = await response.json();
  return result.text;
}
