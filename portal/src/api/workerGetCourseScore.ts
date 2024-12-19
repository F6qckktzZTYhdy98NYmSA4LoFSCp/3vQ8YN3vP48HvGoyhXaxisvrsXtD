import { supabase } from "@/lib/supabase";
import { z } from "zod";

const WORKER_BASE_URL = import.meta.env.VITE_WORKER_BASE_URL;

export const CourseScoreInputSchema = z.object({
  message: z.object({
    question: z.string(),
    answer: z.string(),
    userAnswer: z.string(),
  }),
});

export const CourseScoreSchema = z.object({
  score: z.number(),
  feedback: z.string(),
  voiceover: z.string(),
});

export type CourseScoreInput = {
    question: string;
    answer: string;
    userAnswer: string;
  };

export type CourseScore = z.infer<typeof CourseScoreSchema>;

export async function workerGetCourseScore(
  input: CourseScoreInput
): Promise<CourseScore> {
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  const message = CourseScoreInputSchema.parse(input);
  const response = await fetch(`${WORKER_BASE_URL}/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error("Failed to get course score");
  }

  const data = await response.json();
  return CourseScoreSchema.parse(data);
}
