import { useNavigate } from 'react-router-dom';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { Shield, CreditCard, BadgeCheck, FileCheck, FileWarning } from 'lucide-react';

import { SiteTour } from '../components/SiteTour';
import { useEffect } from 'react';
import { workerPostClientLog } from '@/api/workerPostClientLog';

const companyInfo = {
  name: "NexusForge Industries",
  founded: "1985",
  headquarters: "Rochester, NY",
  description: "NexusForge Industries specializes in precision-engineered titanium components for the aerospace and defense industries. Our advanced manufacturing processes and rigorous quality control systems ensure our components meet the highest standards for critical applications.",
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
      name: "CMMC Level 2 Certified",
      description: "Cybersecurity Maturity Model Certification Level 2 demonstrates our advanced cyber hygiene practices and ability to protect controlled unclassified information (CUI) in the defense industrial base.",
      icon: Shield
    },
    {
      name: "PCI DSS Compliant",
      description: "Payment Card Industry Data Security Standard compliance ensures we maintain secure processing of payment card data, protecting our customers' financial information.",
      icon: CreditCard
    },
    {
      name: "ISO 9001:2015",
      description: "International standard for quality management systems, demonstrating our commitment to consistent quality and continuous improvement in manufacturing processes.",
      icon: BadgeCheck
    },
    {
      name: "DFARS Compliant",
      description: "Defense Federal Acquisition Regulation Supplement compliance ensures our cybersecurity practices meet DoD requirements for handling controlled unclassified information.",
      icon: FileCheck
    },
    {
      name: "ITAR Registered",
      description: "International Traffic in Arms Regulations registration allows us to manufacture and export defense articles while maintaining strict security controls on technical data.",
      icon: FileWarning
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

const StyledTree = styled(Tree)`
  width: 100%;
  text-align: center;

  .rst__lineHalfHorizontalRight::before,
  .rst__lineHalfHorizontalLeft::before,
  .rst__lineFullVertical::after {
    border-color: #E5E7EB !important;
  }

  .rst__lineChildren::after {
    background-color: #E5E7EB !important;
  }
`;

const StyledNode = styled.div`
  padding: 5px;
  display: inline-block;
`;

const NodeCard = ({ title, name, department = '' }: { title: string; name: string; department?: string }) => (
  <div className={`
    inline-flex flex-col items-center p-2 rounded-lg border
    ${department ? 'bg-blue-50/50 border-gray-200' : 'bg-blue-50 border-blue-100'}
  `}>
    <div className="font-semibold text-sm text-gray-800">{name}</div>
    <div className="text-xs text-gray-600">{title}</div>
    {department && <div className="text-xs text-gray-500 mt-0.5">{department}</div>}
  </div>
);

export function CompanyDetails() {
  const navigate = useNavigate();

  
  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'company_details_page_load',
      event_data: {
        timestamp: new Date().toISOString()
      }
    }).catch(console.error);
  }, []);

  
  return (
    <PageContainer>
      <SiteTour />
      <PageHeader title="Company Profile" className="bg-transparent">
        <button
          onClick={() => navigate('/video')}
          className="next-button px-8 py-3 bg-blue-500 text-white rounded-lg text-base font-medium
                    hover:bg-blue-600 transition-colors flex-shrink-0"
        >
          Next
        </button>
      </PageHeader>

      <div className="w-full h-full p-2">
        <div className="h-full flex flex-col">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="col-span-5 space-y-4">
              <section className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">About the Company</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{companyInfo.description}</p>
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-500">Founded:</span>
                  <span className="text-gray-700">{companyInfo.founded}</span>
                  <span className="text-gray-500 ml-4">HQ:</span>
                  <span className="text-gray-700">{companyInfo.headquarters}</span>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">Products & Services</h2>
                <div>
                  <h3 className="text-base font-semibold text-gray-700">{companyInfo.products.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {companyInfo.products.mainDescription}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700">{companyInfo.products.keyProducts.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {companyInfo.products.keyProducts.description}
                  </p>
                  <ul className="mt-2 grid grid-cols-1 gap-1">
                    {companyInfo.products.keyProducts.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="text-blue-500 flex-shrink-0">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-gray-600">
                  {companyInfo.products.customers}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  {companyInfo.products.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        {photo.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="col-span-7 space-y-4">
              <section>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Organizational Structure</h2>
                </div>
                <div className="org-tree">
                  <StyledTree
                    lineWidth={'2px'}
                    lineColor={'#E5E7EB'}
                    lineBorderRadius={'4px'}
                    label={
                      <StyledNode>
                        <NodeCard
                          name={companyInfo.leadership.ceo.name}
                          title={companyInfo.leadership.ceo.title}
                        />
                      </StyledNode>
                    }
                  >
                    {companyInfo.leadership.directReports.map((executive, index) => (
                      <TreeNode
                        key={index}
                        label={
                          <StyledNode>
                            <NodeCard
                              name={executive.name}
                              title={executive.title}
                              department={executive.department}
                            />
                          </StyledNode>
                        }
                      >
                        {executive.reports.map((report, reportIndex) => (
                          <TreeNode
                            key={reportIndex}
                            label={
                              <StyledNode>
                                <NodeCard
                                  name={report.name}
                                  title={report.title}
                                />
                              </StyledNode>
                            }
                          />
                        ))}
                      </TreeNode>
                    ))}
                  </StyledTree>
                </div>
              </section>

              <section className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Certifications & Compliance</h2>
                <div className="grid grid-cols-2 gap-3">
                  {companyInfo.certifications.map((cert, index) => {
                    const Icon = cert.icon;
                    return (
                      <div key={index} className="bg-blue-50 p-2 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <h3 className="text-sm font-semibold text-gray-700">{cert.name}</h3>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-3">{cert.description}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
