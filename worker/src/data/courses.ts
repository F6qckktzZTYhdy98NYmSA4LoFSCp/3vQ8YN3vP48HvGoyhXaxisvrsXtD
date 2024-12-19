
export interface Course {
  duration?: any;
  slug: string;
  title: string;
  description: string;
  priority: string;
  points: number;
  IsCompleted: boolean;
  color: string
}

export const allCourses: Course[] = [
  {
    slug: "employee-handbook",
    title: "Employee Handbook",
    description:
      "This course covers the employee handbook and answers questions about company policies, procedures, and expectations. It provides a comprehensive overview of the company culture, values, and expectations, ensuring a positive and inclusive working environment for employees.",
    priority: "required",
    points: 50,
    IsCompleted: true,
    color: "bg-red-400",
  },
  {
    slug: "phishing-and-social-engineering",
    title: "Recognizing Phishing and Social Engineering Attacks",
    description:
      "Focused on enhancing cybersecurity awareness, this course helps employees identify and respond appropriately to phishing emails and social engineering attempts. It covers common tactics used by cybercriminals, warning signs to watch for, and steps to take if suspicious communications are received, thereby strengthening the company's overall security posture.",
    priority: "required",
    points: 100,
    IsCompleted: false,
    color: "bg-blue-400",
  },
  {
    slug: "protecting-ip-and-trade-secrets",
    title: "Protecting Intellectual Property and Trade Secrets",
    description:
      "This course emphasizes the critical importance of safeguarding NexusForge Industries' proprietary information, including designs, manufacturing processes, and technical data. Participants will learn about different types of intellectual property, common threats like industrial espionage, and best practices for protecting sensitive information pertinent to their roles.",
    priority: "high",
    points: 100,
    IsCompleted: false,
    color: "bg-green-400",
  },
  {
    slug: "itar-compliance",
    title: "Compliance with ITAR Regulations",
    description:
      "This training provides an overview of the International Traffic in Arms Regulations (ITAR) and their application to the company's operations. Employees will understand the legal requirements for handling defense-related technical data and the significance of adhering to export control laws to avoid severe penalties and maintain contract eligibility.",
    priority: "high",
    points: 100,
    IsCompleted: false,
    color: "bg-yellow-400",
  },
  {
    slug: "secure-ai",
    title: "Securely Using AI",
    description:
      "This course focuses on the responsible and secure use of artificial intelligence tools within the company. Participants will learn about the potential risks associated with AI, such as data privacy concerns, inadvertent sharing of sensitive information, and compliance implications. The training will cover best practices for utilizing AI technologies securely, adhering to company policies, and ensuring that AI applications enhance productivity without compromising security.",
    priority: "medium",
    points: 50,
    IsCompleted: false,
    color: "bg-purple-400",
  },
  {
    slug: "mission-complete",
    title: "Mission Complete",
    description: "Requires completion of all training modules to be marked as complete.",
    priority: "",
    points: 0,
    IsCompleted: false,
    color: "bg-pink-400",
  },
];

