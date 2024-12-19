export interface Role {
  id: string;
  name: string;
  title: string;
  department: string;
  description: string;
  responsibilities: string[];
  securityFocus: string[];
  image?: string;
  object?: any;
}

// Create roles based on the exact organizational structure
export const allRoles: Role[] = [
  // CEO
  {
    id: 'ceo',
    name: 'Sarah Chen',
    title: 'Chief Executive Officer',
    department: 'Executive',
    description: 'Leads overall company strategy and operations.',
    responsibilities: [
      'Strategic planning and execution',
      'Executive team leadership',
      'Stakeholder management',
      'Corporate governance'
    ],
    securityFocus: [
      'Corporate security strategy',
      'Risk management oversight',
      'Compliance governance',
      'Data protection policies'
    ],
    image: '/nexusforge/avatars/photo-1573496799652-408c2ac9fe98.jpg'
  },
  // Operations
  {
    id: 'coo',
    name: 'Michael Torres',
    title: 'Chief Operations Officer',
    department: 'Operations',
    description: 'Oversees company operations and production.',
    responsibilities: [
      'Operations management',
      'Production oversight',
      'Supply chain optimization',
      'Quality control'
    ],
    securityFocus: [
      'Operational security',
      'Physical security',
      'Supply chain security',
      'Quality assurance'
    ],
    image: '/nexusforge/avatars/photo-1560250097-0b93528c311a.jpg'
  },
  {
    id: 'production-manager',
    name: 'Robert Martinez',
    title: 'Production Manager',
    department: 'Operations',
    description: 'Manages production processes and team.',
    responsibilities: [
      'Production planning',
      'Team supervision',
      'Process optimization',
      'Quality standards maintenance'
    ],
    securityFocus: [
      'Production data security',
      'Access control management',
      'Equipment security',
      'Safety protocols'
    ],
    image: '/nexusforge/avatars/photo-1506794778202-cad84cf45f1d.jpg'
  },
  {
    id: 'quality-manager',
    name: 'Emily Parker',
    title: 'Quality Control Manager',
    department: 'Operations',
    description: 'Ensures product quality and compliance.',
    responsibilities: [
      'Quality assurance',
      'Compliance monitoring',
      'Process improvement',
      'Team leadership'
    ],
    securityFocus: [
      'Quality data protection',
      'Testing security',
      'Compliance documentation',
      'Audit management'
    ],
    image: '/nexusforge/avatars/photo-1573497019940-1c28c88b4f3e.jpg'
  },
  // Engineering
  {
    id: 'cto',
    name: 'Dr. James Wilson',
    title: 'Chief Technology Officer',
    department: 'Engineering',
    description: 'Leads technology strategy and innovation.',
    responsibilities: [
      'Technology strategy',
      'Innovation leadership',
      'Technical oversight',
      'R&D direction'
    ],
    securityFocus: [
      'Technical security strategy',
      'Innovation security',
      'R&D protection',
      'Technology risk management'
    ],
    image: '/nexusforge/avatars/photo-1519085360753-af0119f7cbe7.jpg'
  },
  {
    id: 'lead-engineer',
    name: 'David Chen',
    title: 'Lead Engineer',
    department: 'Engineering',
    description: 'Leads engineering team and technical projects.',
    responsibilities: [
      'Technical leadership',
      'Project management',
      'Team mentoring',
      'Architecture design'
    ],
    securityFocus: [
      'Code security',
      'System architecture security',
      'Technical standards',
      'Security best practices'
    ],
    image: '/nexusforge/avatars/photo-1507003211169-0a1dd7228f2d.jpg'
  },
  {
    id: 'security-engineer',
    name: 'Alex Thompson',
    title: 'Security Engineer',
    department: 'Engineering',
    description: 'Manages technical security implementation.',
    responsibilities: [
      'Security implementation',
      'Vulnerability assessment',
      'Security monitoring',
      'Incident response'
    ],
    securityFocus: [
      'Application security',
      'Infrastructure security',
      'Security testing',
      'Threat analysis'
    ],
    image: '/nexusforge/avatars/photo-1628157588553-5eeea00af15c.jpg'
  },
  // Finance
  {
    id: 'cfo',
    name: 'Lisa Patel',
    title: 'Chief Financial Officer',
    department: 'Finance',
    description: 'Manages company financial strategy and ops.',
    responsibilities: [
      'Financial strategy',
      'Budget oversight',
      'Investment management',
      'Financial reporting'
    ],
    securityFocus: [
      'Financial data security',
      'Transaction security',
      'Audit compliance',
      'Risk management'
    ],
    image: '/nexusforge/avatars/photo-1594744803329-e58b31de8bf5.jpg'
  },
  {
    id: 'financial-analyst',
    name: 'Jennifer Kim',
    title: 'Financial Analyst',
    department: 'Finance',
    description: 'Analyzes financial data and performance.',
    responsibilities: [
      'Financial analysis',
      'Performance reporting',
      'Budget planning',
      'Investment analysis'
    ],
    securityFocus: [
      'Financial data protection',
      'Secure analysis practices',
      'Confidential handling',
      'Access control'
    ],
    image: '/nexusforge/avatars/photo-1580489944761-15a19d654956.jpg'
  },
  {
    id: 'accounting-manager',
    name: 'Marcus Johnson',
    title: 'Accounting Manager',
    department: 'Finance',
    description: 'Manages accounting operations and reporting.',
    responsibilities: [
      'Accounting operations',
      'Financial reporting',
      'Team management',
      'Compliance oversight'
    ],
    securityFocus: [
      'Accounting data security',
      'Transaction protection',
      'Audit trails',
      'Access management'
    ],
    image: '/nexusforge/avatars/photo-1500648767791-00dcc994a43e.jpg'
  }
];

// Group roles by department
export const departments: Record<string, Role[]> = {
  'Executive': allRoles.filter(role => role.department === 'Executive'),
  'Operations': allRoles.filter(role => role.department === 'Operations'),
  'Engineering': allRoles.filter(role => role.department === 'Engineering'),
  'Finance': allRoles.filter(role => role.department === 'Finance')
};
