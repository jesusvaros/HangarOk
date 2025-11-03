import { useEffect } from 'react';

const SCRIPT_ID = 'umami-analytics-script';

export default function UmamiTracker() {
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL ?? 'https://cloud.umami.is/script.js';

  useEffect(() => {
    if (!websiteId) {
      if (import.meta.env.DEV) {
        console.warn('UmamiTracker: VITE_UMAMI_WEBSITE_ID is not defined, skipping script injection.');
      }
      return;
    }

    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.defer = true;
    script.async = true;
    script.src = scriptUrl;
    script.setAttribute('data-website-id', websiteId);
    script.id = SCRIPT_ID;
    (document.head ?? document.body).appendChild(script);

    return () => {
      // Keep the script mounted to avoid unnecessary reloads in the SPA
    };
  }, [websiteId, scriptUrl]);

  return null;
}
