import { allCourses } from "data/courses";
import { allRoles } from "data/roles";
import { z } from "zod";
import { Env, CORS_HEADERS } from "env";
import { getPromptCourseScoreAnswer_System } from "prompts/course_score_answer_system";
import { getPromptCourseScoreAnswer_User } from "prompts/course_score_answer_user";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { withLogging } from "../utils/logger";

export interface CourseScoreInput {
  question: string;
  answer: string;
  userAnswer: string;
}

export const CourseScoreInputSchema = z.object({
  message: z.object({
    question: z.string(),
    answer: z.string(),
    userAnswer: z.string(),
  }),
});

export interface CourseScore {
  score: number;
  feedback: string;
  voiceover: string;
}

export const CourseScoreSchema = z.object({
  score: z.number(),
  feedback: z.string(),
  voiceover: z.string(),
});

export const HandlerGetCourseScore = withLogging(
  async (
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> => {
    try {
      const inputRaw = await request.json();
      const input = CourseScoreInputSchema.parse(inputRaw);

      const promptSystem = getPromptCourseScoreAnswer_System();
      const promptUser = getPromptCourseScoreAnswer_User(
        input.message.question,
        input.message.answer,
        input.message.userAnswer
      );

      const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });

      let response;
      try {
        response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 10000,
          messages: [
            { role: "system", content: promptSystem },
            { role: "user", content: promptUser },
          ],
          temperature: 0.7,
          response_format: zodResponseFormat(CourseScoreSchema, "content"),
        });
      } catch (error) {
        console.error(error);
        return new Response(
          "Internal server error - error fetching AI response",
          {
            status: 500,
            headers: CORS_HEADERS,
          }
        );
      }

      // console.log(response);

      let content;
      try {
        const parsedContent = JSON.parse(response.choices[0].message.content);
        content = CourseScoreSchema.parse(parsedContent);
      } catch (error) {
        console.error(error);
        return new Response("Internal server error - invalid AI response", {
          status: 500,
          headers: CORS_HEADERS,
        });
      }

      return new Response(JSON.stringify(content), {
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
        console.error(error);
        return new Response("Internal server error", {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }
  }
);
