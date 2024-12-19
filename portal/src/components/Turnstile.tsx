import { useEffect, useRef, useCallback } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback: () => void;
  }
}

export function Turnstile({ siteKey, onVerify }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string>();

  const resetWidget = useCallback(() => {
    if (widgetId.current) {
      try {
        window.turnstile.reset(widgetId.current);
      } catch (error) {
        console.error('Turnstile: Error resetting widget:', error);
      }
    }
  }, []);

  useEffect(() => {
    let scriptLoaded = false;
    // ('Turnstile: Initializing with site key:', siteKey);

    // Check if script is already loaded
    if (window.turnstile) {
      scriptLoaded = true;
      // ('Turnstile: Script already loaded');
    }

    const renderWidget = () => {
      // ('Turnstile: Rendering widget');
      if (containerRef.current && window.turnstile) {
        try {
          // Remove existing widget if any
          if (widgetId.current) {
            try {
              window.turnstile.remove(widgetId.current);
            } catch (error) {
              console.error('Turnstile: Error removing old widget:', error);
            }
          }

          // Render new widget
          widgetId.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              // ('Turnstile: Verification successful');
              onVerify(token);
            },
            'expired-callback': () => {
              // ('Turnstile: Token expired, resetting');
              resetWidget();
            },
            'error-callback': () => {
              console.error('Turnstile: Widget errored');
              resetWidget();
            },
            theme: 'light',
            appearance: 'interaction-only',
          });
          // ('Turnstile: Widget rendered with ID:', widgetId.current);
        } catch (error) {
          console.error('Turnstile: Error rendering widget:', error);
        }
      }
    };

    if (!scriptLoaded) {
      // Load the Turnstile script
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;

      // Define the callback function that will be called when Turnstile is loaded
      window.onloadTurnstileCallback = () => {
        // ('Turnstile: Script loaded');
        renderWidget();
      };

      document.head.appendChild(script);
    } else {
      // If script is already loaded, render widget immediately
      renderWidget();
    }

    return () => {
      // Cleanup
      if (widgetId.current) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch (error) {
          console.error('Turnstile: Error cleaning up widget:', error);
        }
      }
    };
  }, [siteKey, onVerify, resetWidget]);

  return <div ref={containerRef} className="inline-block" />;
}
