import { supabase } from "@/lib/supabase";
import { z } from "zod";

const WORKER_BASE_URL = import.meta.env.VITE_WORKER_BASE_URL;

export interface FeedbackInput {
  courseSlug?: string;
  roleSlug?: string;
  duration?: number;
  feedback: string;
  rating: number;
  keepMeUpdated: boolean;
  currentPage: string;
}

export const FeedbackInputSchema = z.object({
  courseSlug: z.string().optional(),
  roleSlug: z.string().optional(),
  duration: z.number().default(-1),
  currentPage: z.string(),
  feedback: z.string(),
  rating: z.number().gt(0).lte(5),
  keepMeUpdated: z.boolean().default(false),
});

export interface Status {
  success: boolean;
  message: string;
}

export const StatusSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export async function workerPostFeedback(
  input: FeedbackInput
): Promise<Status> {


  try {
    // ("input:", input);
    input = FeedbackInputSchema.parse(input);
    // ("Input Parsed:", input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0].message);
    }
    throw error;
  }

  const token = (await supabase.auth.getSession()).data.session?.access_token;

  const URL = WORKER_BASE_URL + "/postFeedback";
  const feedbackResponse = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: input }),
  });

  // ("Feedback page response:", feedbackResponse);

  if (!feedbackResponse.ok) {
    throw new Error("Failed to fetch post feedback page");
  }

  const feedbackJson = await feedbackResponse.json();
  const feedbackContent = StatusSchema.parse(feedbackJson);
  // ("Feedback page content:", feedbackContent);

  return feedbackContent;
}
