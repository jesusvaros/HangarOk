import { useEffect } from 'react';

const SCRIPT_ID = 'umami-analytics-script';

export default function UmamiTracker() {
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL ?? 'https://analytics.umami.is/script.js';

  useEffect(() => {
    if (!websiteId) {
      if (import.meta.env.DEV) {
        console.warn('UmamiTracker: VITE_UMAMI_WEBSITE_ID no está definido, se omite el script.');
      }
      return;
    }

    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = scriptUrl;
    script.setAttribute('data-website-id', websiteId);
    script.id = SCRIPT_ID;
    document.body.appendChild(script);

    return () => {
      // No retiramos el script para evitar recargas innecesarias en SPA
    };
  }, [websiteId, scriptUrl]);

  return null;
}
