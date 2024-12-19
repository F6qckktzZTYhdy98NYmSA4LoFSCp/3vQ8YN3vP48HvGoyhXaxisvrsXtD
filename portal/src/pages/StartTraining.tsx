import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { workerPostClientLog } from '@/api/workerPostClientLog';
import { useEffect } from 'react';

export const StartTraining = () => {
  const navigate = useNavigate();
    
  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'start_training_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
      }
    }).catch(console.error);
  }, []);

  return (
    <PageContainer>
      <PageHeader title="Start Training Now" className="bg-transparent">
        <button
          onClick={() => navigate('/company')}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg text-base font-medium
                    hover:bg-blue-600 transition-colors flex-shrink-0"
        >
          Next
        </button>
      </PageHeader>

      <div className="grid grid-cols-12 gap-8 mb-6">
      </div>
    </PageContainer>
  );
};
