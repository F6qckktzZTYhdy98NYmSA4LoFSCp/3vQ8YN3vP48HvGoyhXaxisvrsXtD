import { allCourses } from "@/data/courses";
import { allRoles } from "@/data/roles";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const WORKER_BASE_URL = import.meta.env.VITE_WORKER_BASE_URL;


export interface CourseOutlineInput {
  courseSlug: string;
  roleSlug: string;
  duration: number;
}

export const CourseOutlineInputSchema = z.object({
  courseSlug: z
    .string()
    .refine((slug) => allCourses.some((c) => c.slug === slug), {
      message: "Course not found",
    }),
  roleSlug: z.string().refine((slug) => allRoles.some((r) => r.id === slug), {
    message: "Role not found",
  }),
  duration: z.number().gt(0).lte(60),
});


export interface CourseOutline {
    slide: number;
    totalSlides: number;
    progress: number;
    title: string;
    subtitle: string;
    content: string;
    slides: Array<
      {
        number: number;
        title: string;
        objective: string;
        duration: number;
      }
    >;
    voiceover: string;
    duration: number;
    question: string;
    questionVoiceover: string;
    answer: string;
    difficulty: number;
  }
  
  export const CourseOutlineSchema = z.object({
    slide: z.number(),
    totalSlides: z.number(),
    progress: z.number(),
    title: z.string(),
    subtitle: z.string(),
    content: z.string(),
    slides: z.array(z.object({
      number: z.number(),
      title: z.string(),
      objective: z.string(),
      duration: z.number(),
    })),
    voiceover: z.string(),
    duration: z.number(),
    question: z.string(),
    questionVoiceover: z.string(),
    answer: z.string(),
    difficulty: z.number(),
  });

  
export async function workerGetCourseOutline(
  input: CourseOutlineInput
): Promise<CourseOutline> {

    // await new Promise((resolve) => setTimeout(resolve, 1500));

    // const sampleResponse = "{\"slide\":1,\"totalSlides\":6,\"progress\":0,\"title\":\"Course Overview (SAMPLE)\",\"subtitle\":\"Enhance your awareness against phishing and social engineering.\",\"content\":\"In this course, you'll dive into the critical realm of cybersecurity, focusing on recognizing phishing emails and social engineering attacks. As the Production Manager, your role is pivotal in safeguarding production data and processes.  \\n\\n### Key Learning Points:  \\n- Understanding phishing tactics and social engineering  \\n- Identifying warning signs in suspicious communications  \\n- Responding appropriately to potential threats  \\n- Strengthening production data security and access control  \\n\\n### Why This Training Matters to You:  \\nAs someone who oversees production processes, your ability to identify phishing and social engineering attempts directly impacts the security of sensitive data and equipment. Enhancing your awareness will not only protect your team but also strengthen NexusForge's security posture in the aerospace and defense sector.  \\n\\n### Course Structure:  \\n1. Introduction to Phishing (2 minutes)  \\n2. Types of Social Engineering Attacks (2 minutes)  \\n3. Warning Signs and Red Flags (2 minutes)  \\n4. Best Practices for Response (2 minutes)  \\n5. Real-World Examples (1 minute)  \\n6. Summary and Q&A (1 minute)\",\"slides\":[{\"number\":1,\"title\":\"Course Overview\",\"objective\":\"This slide introduces the course objectives and key points that will be covered. It highlights the importance of recognizing phishing and social engineering attacks, especially for someone in a critical role like Production Manager.\",\"duration\":60}],\"voiceover\":\"Welcome to the course on recognizing phishing and social engineering attacks! In this session, we'll enhance your ability to identify and respond to cyber threats that could impact our production processes and sensitive data. You will learn about the tactics used by cybercriminals and how to spot warning signs in suspicious communications. This training is essential for maintaining the integrity of our operations at NexusForge. Click next to answer an initial knowledge check to assess your familiarity with this topic.\",\"duration\":60,\"question\":\"What is phishing in the context of cybersecurity?  \\n- A) Sending fake emails to steal sensitive information  \\n- B) A method for securing data  \\n- C) A type of firewall  \\n- D) None of the above\",\"questionVoiceover\":\"Now, let's see how familiar you are with the topic. What is phishing in the context of cybersecurity? Choose the best answer from the options provided.\",\"answer\":\"A) Sending fake emails to steal sensitive information\",\"difficulty\":3}";
    // const sampleJson = JSON.parse(sampleResponse);
    // const sampleCourseContent = CourseOutlineSchema.parse(sampleJson);
    // console.log("Sample Course outline content:", sampleCourseContent);
    // return sampleCourseContent;



  try {
    // console.log("input:", input);
    input = CourseOutlineInputSchema.parse(input);
    // console.log("Input Parsed:", input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0].message);
    }
    throw error;
  }

  const token = (await supabase.auth.getSession()).data.session?.access_token;

  const URL = WORKER_BASE_URL + "/getCourseOutline";
  const courseResponse = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: input }),
  });

  // console.log("Course outline response:", courseResponse);

  if (!courseResponse.ok) {
    throw new Error("Failed to fetch course outline");
  }

  const courseJson = await courseResponse.json();
  const courseContent = CourseOutlineSchema.parse(courseJson);
  // console.log("Course outline content:", courseContent);

  return courseContent;
}
