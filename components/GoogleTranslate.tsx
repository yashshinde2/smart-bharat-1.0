// types/global.d.ts
export {};

declare global {
  interface Window {
    google: {
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
    googleTranslateElementInit: () => void;
  }

  // Define google globally once
  var google: typeof window.google;
}
