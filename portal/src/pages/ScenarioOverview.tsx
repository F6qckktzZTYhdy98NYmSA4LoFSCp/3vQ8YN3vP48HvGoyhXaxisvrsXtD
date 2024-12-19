import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Role } from '../data/roles';
import { companyInfo } from '../data/company';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { workerPostClientLog } from '@/api/workerPostClientLog';

export const ScenarioOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  var selectedRole = location.state?.role as Role;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3);

    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'scenario_overview_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
      }
    }).catch(console.error);
  }, []);

  if (!selectedRole) {
    // set selectedRole to third item in allRoles
    // selectedRole = allRoles.find(role => role.title === 'Production Manager') as Role ?? undefined
    navigate('/role');
    return null;
  }

  return (
    <PageContainer>
      <div className="h-full flex flex-col">
        <PageHeader title="Your Training Adventure Awaits" className="bg-transparent flex-shrink-0" />
        
        <div className="flex-1 p-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Role Information */}
            <div className="grid grid-rows-[auto_1fr] gap-8">
              {/* Role Overview */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 h-[250px] flex flex-col">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-4">
                    <img 
                      src={selectedRole.image} 
                      alt={selectedRole.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedRole.title}
                      
                      <span className="inline-flex items-center px-2 py-0.5 ml-2 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {selectedRole.department}
                      </span>
                    </h2>
                    <p className="text-base text-gray-600 mb-2">{selectedRole.name}</p>
                    <p className="text-sm text-gray-600 max-w-md mx-auto">{selectedRole.description}</p>
                  </div>
                </div>
              </div>

              {/* Role Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 h-[250px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Role & Responsibilities</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Key Responsibilities</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {selectedRole.responsibilities.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Security Focus Areas</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {selectedRole.securityFocus.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Company & Next Steps */}
            <div className="grid grid-rows-[auto_1fr] gap-8">
              {/* Company Context */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 h-[250px] flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About {companyInfo.name}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 leading-snug">
                      {companyInfo.description}
                    </p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Founded:</span> {companyInfo.founded}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Location:</span> {companyInfo.headquarters}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Employees:</span> {companyInfo.employees}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Industry:</span> {companyInfo.industry}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Revenue:</span> {companyInfo.revenue}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Facilities:</span> {companyInfo.facilities}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Key Certifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {companyInfo.certifications.map((cert) => (
                          <span key={cert.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            {cert.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 h-[250px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Expect Next</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">Training Journey</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex gap-2">
                        <span className="text-green-500">1.</span>
                        <span>Role-specific security scenarios</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">2.</span>
                        <span>Interactive decision-making</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">3.</span>
                        <span>Real-time feedback & guidance</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">Learning Outcomes</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        <span>Security best practices</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        <span>Threat identification</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        <span>Incident response skills</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Begin Button */}
          <div className="flex justify-center mt-24">
            <button
              onClick={() => navigate('/training-journey', { state: { role: selectedRole } })}
              disabled={isLoading}
              className={`
                px-8 py-3 rounded-lg text-lg font-medium w-2/3
                flex items-center justify-center gap-2 transition-all duration-300
                ${isLoading 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating your adventure</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>Begin Your Adventure</span>
                  <span className="text-xl">→</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
