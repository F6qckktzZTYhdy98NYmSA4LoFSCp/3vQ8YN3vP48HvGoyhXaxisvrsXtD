import { allCourses } from "data/courses";
import { allRoles } from "data/roles";
import { z } from "zod";
import { Env, CORS_HEADERS } from "env";
import { getPromptCoursePage_System } from "prompts/course_page_system";
import { getPromptCoursePage_User } from "prompts/course_page_user";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { withLogging } from "../utils/logger";

export interface CoursePageInput {
  courseSlug: string;
  roleSlug: string;
  duration: number;
  page: number;
  courseContent: string;
  slides: string;
}

export const CoursePageInputSchema = z.object({
  message: z.object({
    courseSlug: z
      .string()
      .refine((slug) => allCourses.some((c) => c.slug === slug), {
        message: "Course not found",
      }),
    roleSlug: z.string().refine((slug) => allRoles.some((r) => r.id === slug), {
      message: "Role not found",
    }),
    duration: z.number().gt(0).lte(60),
    page: z.number().gt(0),
    courseContent: z.string(),
    slides: z.string(),
  }),
});

export interface CoursePage {
  slide: number;
  progress: number;
  title: string;
  subtitle: string;
  content: string;
  voiceover: string;
  duration: number;
  question: string;
  questionVoiceover: string;
  answer: string;
  difficulty: number;
  hasSampleEmail: boolean;
}

export const CoursePageSchema = z.object({
  slide: z.number(),
  progress: z.number(),
  title: z.string(),
  subtitle: z.string(),
  content: z.string(),
  voiceover: z.string(),
  duration: z.number(),
  question: z.string(),
  questionVoiceover: z.string(),
  answer: z.string(),
  difficulty: z.number(),
  hasSampleEmail: z.boolean(),
});

export const HandlerGetCoursePage = withLogging(
  async (
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> => {
    try {
      const inputRaw = await request.json();
      const input = CoursePageInputSchema.parse(inputRaw);

      const course = allCourses.find(
        (c) => c.slug === input.message.courseSlug
      );
      const role = allRoles.find((r) => r.id === input.message.roleSlug);

      if (!course || !role) {
        return new Response("Course or role not found", {
          status: 400,
          headers: CORS_HEADERS,
        });
      }

      const promptSystem = getPromptCoursePage_System(
        role,
        course,
        input.message.slides,
        input.message.courseContent
      );
      const promptUser = getPromptCoursePage_User(input.message.page);

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
          response_format: zodResponseFormat(CoursePageSchema, "content"),
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
        content = CoursePageSchema.parse(parsedContent);
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
