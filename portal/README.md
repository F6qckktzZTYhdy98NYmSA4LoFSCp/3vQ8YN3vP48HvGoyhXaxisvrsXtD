# Zybertrain

## Overview
Zybertrain is an AI-enhanced role-based security awareness training platform with multimodal user interaction. This repository contains the frontend implementation of the Zybertrain platform.

## Features
- Interactive role selection interface
- Role-based personalized training paths
- Toast notifications for user feedback
- Responsive design with fixed content area (1440×900)
- Company profile integration

## Demo Company: NexusForge Industries
A demonstration implementation for NexusForge Industries, a precision manufacturing company:
- Founded: 1985
- Location: Rochester, NY
- Specialization: Defense and aerospace components
- Compliance: CMMC Level 2, PCI DSS, DFARS, ISO 9001:2015, ITAR

### Organization Structure
The platform features a comprehensive role selection interface with three main departments:
1. Operations
   - Chief Operations Officer
   - Production Manager
   - Quality Control Manager

2. Engineering
   - Chief Technology Officer
   - Lead Engineer
   - Security Engineer

3. Finance
   - Chief Financial Officer
   - Financial Analyst
   - Accounting Manager

Each role includes:
- Professional profile image
- Role title and description
- Key responsibilities
- Security focus areas

## Technical Stack
- React with TypeScript
- Vite build tool
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives
  - HoverCard
  - Toast
  - Context Menu

## Getting Started
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
```
src/
  ├── components/
  │   ├── CompanyDetails.tsx
  │   ├── RoleCard.tsx
  │   ├── RoleHoverCard.tsx
  │   └── ui/
  │       ├── context-menu.tsx
  │       ├── hover-card.tsx
  │       ├── toast.tsx
  │       └── toaster.tsx
  ├── pages/
  │   ├── RoleSelection.tsx
  │   └── DemoOverview.tsx
  ├── data/
  │   └── roles.ts
  ├── App.tsx
  └── index.css
```

## License
AGPL-3.0
