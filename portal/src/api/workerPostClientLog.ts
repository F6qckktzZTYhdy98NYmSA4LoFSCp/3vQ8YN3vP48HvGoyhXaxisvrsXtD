import { supabase } from "@/lib/supabase";
import { z } from "zod";

const WORKER_BASE_URL = import.meta.env.VITE_WORKER_BASE_URL;

const ClientLogInputSchema = z.object({
  event_type: z.string(),
  event_name: z.string(),
  event_data: z.any().optional(),
});

export type ClientLogInput = {
  event_type: string;
  event_name: string;
  event_data?: any;
};

export async function workerPostClientLog(input: ClientLogInput): Promise<void> {
  try {
    input = ClientLogInputSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0].message);
    }
    throw error;
  }

  try {
    const token = (await supabase.auth.getSession()).data.session?.access_token;

    const URL = WORKER_BASE_URL + "/clientLog";
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        message: {
          ...input,
          event_data: {
            ...(input.event_data ?? {}),
            domain: window.location.hostname,
            uri: window.location.href,
          },
        },
      }),
    });
  } catch (error) {
    console.error("Failed to post client log:", error);
    throw error;
  }
}
