import React, { createContext, useContext, useState, useCallback } from 'react';

interface FeedbackParams {
  currentPage?: string;
  courseSlug?: string;
  roleSlug?: string;
  duration?: number;
}

interface FeedbackContextType {
  setFeedbackParams: (params: FeedbackParams) => void;
  params: FeedbackParams;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useState<FeedbackParams>({});

  const setFeedbackParams = useCallback((newParams: FeedbackParams) => {
    setParams(newParams);
  }, []);

  return (
    <FeedbackContext.Provider value={{ setFeedbackParams, params }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}
