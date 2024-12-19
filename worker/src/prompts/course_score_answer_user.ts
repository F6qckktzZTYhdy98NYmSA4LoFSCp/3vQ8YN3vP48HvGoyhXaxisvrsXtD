export function getPromptCourseScoreAnswer_User(
  question: string,
  answer: string,
  userAnswer: string
) {
  const prompt = PromptCourseScoreAnswer_User
    .replace("QUESTION", question)
    .replace("ANSWER", answer)
    .replace("USER_ANSWER", userAnswer);
  return prompt;
}

export const PromptCourseScoreAnswer_User = `
Question (as asked by the system to the user):

\`\`\`
QUESTION
\`\`\`

Reference Answer (provided as the textbook answer for context and intent):

\`\`\`
ANSWER
\`\`\`

The user's answer to the question is:

\`\`\`
USER_ANSWER
\`\`\`

`;
