// This file contains the initial prompt template for the course
// The placeholders are replaced with the appropriate values
// The placeholders are marked with:
// EMPLOYEE.NAME, EMPLOYEE.OBJECT, 
// COURSE.TITLE, COURSE.DESCRIPTION, COURSE.DURATION

import { Course } from "data/courses";
import { Role } from "data/roles";

export function getPromptCourseOutline_User(employee: Role, course: Course, duration: number) {

    // read the content from the prompt_initial.ts file
    // Replace the following placeholders with appropriate values
    // EMPLOYEE.NAME
    // EMPLOYEE.OBJECT    
    // COURSE.TITLE
    // COURSE.DESCRIPTION
    // COURSE.DURATION
    const prompt = PromptCourseOutline_User
        .replace('EMPLOYEE.NAME', employee.name)
        .replace('EMPLOYEE.OBJECT', JSON.stringify(employee, null, 2))
        .replace('COURSE.TITLE', course.title)
        .replace('COURSE.DESCRIPTION', course.description)
        .replace('COURSE.DURATION', duration.toString());
    return prompt;
}


export const PromptCourseOutline_User = `
# User Prompt

## Instructions for this prompt

### Employee Details
Today, you are giving a one-on-one training to 'EMPLOYEE.NAME', an employee of NexusForge.

\`\`\`json
EMPLOYEE.OBJECT
\`\`\`

### Course Details
The course you are presenting is:
Course Title: 'COURSE.TITLE'
Course Description: 'COURSE.DESCRIPTION'
Course Duration: 'COURSE.DURATION' minutes, plus/minus 1 minute, in total duration.

## The immediate task for this prompt and your response

To get started, provide me with the content for the first slide of the course which is the course overview that outlines what will be covered in the course.
The title should align with the course title, and the subtitle should align with the course description.
It should include an overview of the course, what the employee will learn, and any key points to remember.
It should include a short summary of why this training is important uniquely to this employee and how it will benefit the employee.
It should include a listing of the pages/slides to be presented during the course and the time it will take to cover each page (in whole minutes).
Ensure the content aligns with the course title, description, and duration, and is relevant to the individual employee.
For the first question, provide a question on the broader topic of the course to gauge their understanding of the content - something of moderate difficulty.
`;

