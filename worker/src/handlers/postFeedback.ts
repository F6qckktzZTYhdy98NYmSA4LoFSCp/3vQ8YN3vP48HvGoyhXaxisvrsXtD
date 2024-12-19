import { CORS_HEADERS, Env } from "env";
import { z } from "zod";
import { allCourses } from "data/courses";
import { allRoles } from "data/roles";
import { createClient } from '@supabase/supabase-js';
import { getEmailFromToken } from "utils/getEmailFromToken";

const CollectFeedbackInputSchema = z.object({
  message: z.object({
    feedback: z.string().max(10000),
    rating: z.number().min(1).max(5),
    keepMeUpdated: z.boolean().optional().default(false),
    currentPage: z.string().min(1).max(4096).default("undefined"),
    courseSlug: z.string().max(4096).optional().default("undefined"),
    roleSlug: z.string().max(4096).optional().default("undefined"),
    duration: z.number().max(60).optional().default(-1),
    userEmail: z.string().email().optional(),
    ipAddress: z.string().optional(),
  }),
});


export interface Status {
  success: boolean;
  message: string;
}

export const StatusSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export async function HandlerPostFeedback(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    try {
        // Get authorization token
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return new Response('Missing or invalid authorization header', {
                status: 401,
                headers: CORS_HEADERS,
            });
        }

        const token = authHeader.split(' ')[1];
        const userEmail = await getEmailFromToken(token, env.SUPABASE_JWT_SECRET);

        if (!userEmail) {
            return new Response('Invalid authentication token', {
                status: 401,
                headers: CORS_HEADERS,
            });
        }

        // Parse and validate input
        const inputRaw = await request.json();
        const input = CollectFeedbackInputSchema.parse(inputRaw);

        // Initialize Supabase client
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // Insert feedback into Supabase
        const { data, error } = await supabase
            .from('feedback')
            .insert({
                feedback: input.message.feedback,
                rating: input.message.rating,
                keep_me_updated: input.message.keepMeUpdated,
                current_page: input.message.currentPage,
                course_slug: input.message.courseSlug,
                role_slug: input.message.roleSlug,
                duration: input.message.duration,
                user_email: userEmail,
                ip_address: request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || request.headers.get('X-Real-IP') || request.headers.get('Remote-Addr') || "",
            });

        if (error) {
            console.error('Error inserting feedback:', error);
            return new Response(JSON.stringify(StatusSchema.parse({ success: false, message: "Error inserting feedback. Please try again." })), {
                status: 500,
                headers: {
                    ...CORS_HEADERS,
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify(StatusSchema.parse({ success: true, message: "Feedback submitted successfully." })), {
            status: 200,
            headers: {
                ...CORS_HEADERS,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error processing feedback:", error);
        return new Response(JSON.stringify(StatusSchema.parse({ success: false, message: "Error inserting feedback. Please try again." })), {
            status: 400,
            headers: CORS_HEADERS,
        });
    }
}