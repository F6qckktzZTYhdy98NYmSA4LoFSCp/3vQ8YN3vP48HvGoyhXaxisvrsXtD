import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

const steps = [
  {
    target: '.back-to-home',
    content: 'Return to the home page to access your dashboard and recent activities.',
    disableBeacon: true,
  },
  {
    target: '.company-overview',
    content: 'View a summary of the company\'s information and key metrics.',
  },
  {
    target: '.org-chart',
    content: 'Explore the company\'s structure and see how teams are organized.',
  },
  {
    target: '.post-feedback',
    content: 'Share your feedback with us.',
  },
  {
    target: '.next-button',
    content: 'Click here to proceed to the next step.',
  },
];

export const SiteTour: React.FC = () => {
  const [run, setRun] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.IDLE) return;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED || status === STATUS.ERROR) {
      // Mark the tour as completed
      localStorage.setItem('hasSeenTour', 'true');
    } else {
      // Optionally handle other statuses if needed
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      locale={{
        last: "Get Started!"
      }}
      styles={{
        options: {
          primaryColor: '#4F46E5',
          backgroundColor: '#ffffff',
          textColor: '#11181C',
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};
