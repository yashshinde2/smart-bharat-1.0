import { useEffect } from 'react';

// types/global.d.ts
export {};

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: any;
            autoDisplay: boolean;
            gaTrack?: boolean;
            gaId?: string;
          },
          element: string
        ) => void;
        InlineLayout: {
          SIMPLE: any;
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }

  // Define google globally once
  var google: typeof window.google;
}

const GoogleTranslate = () => {
  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
      };
      document.body.appendChild(script);
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'hi,en,gu,bn,mr,ta,te,kn,ml',
            layout: window.google.translate.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      } catch (error) {
        console.error('Failed to initialize Google Translate:', error);
      }
    };

    addScript();
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
