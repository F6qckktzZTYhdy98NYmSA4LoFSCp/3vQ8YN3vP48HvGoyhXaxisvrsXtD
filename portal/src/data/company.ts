export interface CompanyInfo {
  name: string;
  description: string;
  founded: string;
  headquarters: string;
  employees: string;
  industry: string;
  revenue: string;
  facilities: string;
  leadership: {
    ceo: {
      name: string;
      title: string;
      image: string;
    };
    directReports: {
      name: string;
      title: string;
      department: string;
      image: string;
      reports: {
        name: string;
        title: string;
        image: string;
      }[];
    }[];
  };
  certifications: {
    id: string;
    name: string;
    description: string;
  }[];
  products: {
    title: string;
    mainDescription: string;
    keyProducts: {
      title: string;
      description: string;
      features: string[];
    };
    customers: string;
    photos: {
      src: string;
      alt: string;
      caption: string;
    }[];
  };
}

export const companyInfo: CompanyInfo = {
  name: "NexusForge Industries",
  description: "Leading manufacturer of precision-engineered titanium components for aerospace and defense applications, with a 35+ year legacy of excellence.",
  founded: "1985",
  headquarters: "Rochester, NY",
  employees: "400+",
  industry: "Aerospace & Defense",
  revenue: "$150M+ Annual",
  facilities: "3 Manufacturing Plants",
  leadership: {
    ceo: {
      name: "Sarah Chen",
      title: "Chief Executive Officer",
      image: "/avatars/sarah.jpg"
    },
    directReports: [
      {
        name: "Michael Torres",
        title: "Chief Operations Officer",
        department: "Operations",
        image: "/avatars/michael.jpg",
        reports: [
          {
            name: "Robert Martinez",
            title: "Production Manager",
            image: "/avatars/robert.jpg"
          },
          {
            name: "Emily Parker",
            title: "Quality Control Manager",
            image: "/avatars/emily.jpg"
          }
        ]
      },
      {
        name: "Dr. James Wilson",
        title: "Chief Technology Officer",
        department: "Engineering",
        image: "/avatars/james.jpg",
        reports: [
          {
            name: "David Chen",
            title: "Lead Engineer",
            image: "/avatars/david.jpg"
          },
          {
            name: "Alex Thompson",
            title: "Security Engineer",
            image: "/avatars/alex.jpg"
          }
        ]
      },
      {
        name: "Lisa Patel",
        title: "Chief Financial Officer",
        department: "Finance",
        image: "/avatars/lisa.jpg",
        reports: [
          {
            name: "Jennifer Kim",
            title: "Financial Analyst",
            image: "/avatars/jennifer.jpg"
          },
          {
            name: "Marcus Johnson",
            title: "Accounting Manager",
            image: "/avatars/marcus.jpg"
          }
        ]
      }
    ]
  },
  certifications: [
    {
      id: "cmmc",
      name: "CMMC L2",
      description: "Cybersecurity Maturity Model Certification Level 2 demonstrates our advanced cyber hygiene practices."
    },
    {
      id: "iso",
      name: "ISO 9001",
      description: "International standard for quality management systems, demonstrating our commitment to quality."
    },
    {
      id: "itar",
      name: "ITAR",
      description: "International Traffic in Arms Regulations registration for defense articles manufacturing."
    },
    {
      id: "pci",
      name: "PCI DSS",
      description: "Payment Card Industry Data Security Standard compliance for secure payment processing."
    },
    {
      id: "dfars",
      name: "DFARS",
      description: "Defense Federal Acquisition Regulation Supplement compliance for DoD requirements."
    }
  ],
  products: {
    title: "Precision Titanium Components",
    mainDescription: "We specialize in manufacturing high-precision titanium components that are critical to aircraft safety and performance. Our components can be found in the engine mounting systems and landing gear assemblies of many commercial and military aircraft.",
    keyProducts: {
      title: "Key Product Lines",
      description: "Our primary product lines focus on critical aerospace and defense applications:",
      features: [
        "Engine mounting brackets and fasteners",
        "Landing gear components",
        "Structural reinforcement elements",
        "Control surface attachments",
        "Custom titanium solutions"
      ]
    },
    customers: "Our components are trusted by leading aerospace manufacturers and defense contractors worldwide.",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1646073980877-10d8abcc8605?auto=format&fit=crop&q=80&w=800",
        alt: "Precision-engineered titanium components",
        caption: "High-precision titanium components for aerospace applications"
      },
      {
        src: "https://images.unsplash.com/photo-1717386255773-a456c611dc4e?auto=format&fit=crop&q=80&w=800",
        alt: "Advanced manufacturing facility",
        caption: "State-of-the-art manufacturing facility with quality control systems"
      }
    ]
  }
};
