export function getPromptCoursePage_User(page: number) {

    const prompt = PromptCoursePage_User
        .replace('SLIDE_NUMBER', page.toString());
    return prompt;
}


export const PromptCoursePage_User = `
# User Prompt

Critical, utilize the information from the system prompt (e.g., course details, slide overviews, previous content, individual employee details, company details, etc.)

We are progressing along the course and need to generate the content for the the upcoming slide - slide number 'SLIDE_NUMBER'

## The immediate task for this prompt and your response

To get started, provide me with the content for the upcoming slide/page in the course.
The title, subtitle, content, and question should align with the slide title and objective from the course outline associated with this slide number.
Adjust the content to align with the user's performance (i.e., questions, answers, difficulty), the content covered thus far and the content to be covered on subsequent slides and this slide's objective.
Generate a relevant and engaging question based on the user's performance and the content being delivered - leveraging the type of question to ask and the associated difficulty level.

The response should be in the format described in the system prompt and include all specified elements.

If this is the "Recognizing Phishing and Social Engineering Attacks" course, and the slide you're about to generate is about detecting phishing emails, check the previous content first. Only generate a sample phishing email if no sample phishing email has been generated in previous slides. The sample email should include:
- A sample phishing email in markdown format, including the sender, recipient, subject, and body. Include links that when hovered over will display a tooltip with a suspicious url that has the TLD of ".phish" so it's not valid in case the user clicks on it.
- For the recipient's email address, include the following, use the employee's email address as defined in the system prompt with their first and last name.
- For the sender's email address, use an email address that look similar to a legitmate sender the user would expect to see emails from but make it invalid with a typo or other phishing-type of modification.
- For the subject line, use a subject line that looks like a legitimate email subject line the user would expect to see but with some urgency.
- For the body of the email, use a body that looks like a legitimate email body the user would expect to see but with some urgency, have it use proper grammar, spelling, and punctuation. Have it ask for information or details that you would expect the user to provide.

`;
