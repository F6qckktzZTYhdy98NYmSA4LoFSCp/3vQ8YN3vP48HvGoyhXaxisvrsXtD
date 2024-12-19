import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { workerPostClientLog } from '@/api/workerPostClientLog';
import { useEffect } from 'react';

export const DemoOverview = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'demo_overview_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
      }
    }).catch(console.error);
  }, []);

  return (
    <PageContainer>
      <PageHeader title="Welcome to the Zybertrain Demo" className="bg-transparent">
        <button
          onClick={() => navigate('/company')}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg text-base font-medium
                    hover:bg-blue-600 transition-colors flex-shrink-0"
        >
          Next
        </button>
      </PageHeader>

      <div className="grid grid-cols-12 gap-8 mb-6">
        {/* Left Column */}
        <div className="col-span-5 space-y-6">
          <div>
            <p className="text-xl text-gray-600">
              Welcome to Zybertrain's interactive security awareness training demo! You're about to experience 
              a personalized training session that adapts to different employee roles and responsibilities.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">What to Expect</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">1.</span>
                <p className="text-base text-gray-600">
                  First, you'll learn about NexusForge Industries, a precision manufacturing company 
                  that has implemented Zybertrain for their security awareness program.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">2.</span>
                <p className="text-base text-gray-600">
                  Then, you'll select an employee role to experience security training from their perspective, 
                  with scenarios tailored to their specific responsibilities and risks.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">3.</span>
                <p className="text-base text-gray-600">
                  The training will demonstrate how Zybertrain creates personalized scenarios based on 
                  email patterns, daily workflows, and common interactions.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-7">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Training Comparison</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-red-50/50 p-5 rounded-lg">
                <h3 className="text-base font-semibold text-gray-700 mb-3">Traditional Training</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <p className="text-sm text-gray-600">Generic scenarios that don't reflect real work situations</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <p className="text-sm text-gray-600">Same content for all employees regardless of role</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <p className="text-sm text-gray-600">Annual or quarterly sessions with low retention</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <p className="text-sm text-gray-600">Limited engagement and practical application</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <p className="text-sm text-gray-600">Static content that doesn't adapt to emerging threats</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <p className="text-sm text-gray-600">No tracking of individual progress or weak points</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <p className="text-sm text-gray-600">Passive learning with minimal interaction</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <p className="text-sm text-gray-600">One-way communication with no personalized feedback</p>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50/50 p-5 rounded-lg">
                <h3 className="text-base font-semibold text-gray-700 mb-3">Zybertrain</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-600">Personalized scenarios based on actual work patterns</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-600">Role-specific training focused on relevant threats</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-600">Continuous learning with adaptive difficulty</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-600">Interactive scenarios with real-time feedback</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-600">AI-driven content updates based on emerging threats</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-600">Detailed analytics on individual learning progress</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-600">Active learning through scenario-based challenges</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-600">Two-way learning with personalized improvement suggestions</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">Why Personalized Training Matters</h2>
        <div className="space-y-3">
          <p className="text-base text-gray-600">
            Traditional one-size-fits-all security training often fails because different roles face different risks. 
            A finance team member needs to be especially vigilant about wire fraud attempts, while an engineer might 
            need to focus on protecting intellectual property.
          </p>
          <p className="text-base text-gray-600">
            Zybertrain analyzes each employee's digital interactions and responsibilities to create relevant, 
            engaging scenarios that reflect their actual work environment. This approach leads to better retention 
            and more effective security practices.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};
