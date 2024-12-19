import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { SiteTour } from '../components/SiteTour';
import { useFeedback } from '../contexts/FeedbackContext';
import { workerPostClientLog } from '@/api/workerPostClientLog';

export const VideoPresentation = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { setFeedbackParams } = useFeedback();

  useEffect(() => {
    const params = {
      currentPage: 'video-presentation',
    };
    setFeedbackParams(params);
  }, []);

  const handleContinue = () => {
    navigate('/role');
  };

  
  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'video_presentation_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
      }
    }).catch(console.error);
  }, []);

  return (
    <PageContainer>
      <SiteTour />
      <div className="h-full flex flex-col">
        <PageHeader
          title="Welcome to the Zybertrain Demo!"
          subtitle="Experience a personalized training session that progressively adapts to different employee roles and cyber skills."
          className='pb-1'
        >
          <button
            onClick={handleContinue}
            className="next-button px-8 py-3 bg-blue-500 text-white rounded-lg text-base font-medium
                      hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </PageHeader>

        <div className="flex-1 flex justify-center items-center">
          <div className="w-full aspect-video overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-contain rounded-2xl"
              controls
              playsInline
              preload='auto'
              autoPlay={false}
              controlsList="nodownload"
            >
              <source src="/videos/NexusForge_Titanium_Solutions.mp4" type="video/mp4" />
              Your browser does not support the video tag. 
            </video>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
