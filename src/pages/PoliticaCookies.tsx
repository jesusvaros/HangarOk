import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function PoliticaCookies() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Cookie policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 19/08/2025</p>

      <h2 className="text-xl font-semibold mb-2">Do we use cookies?</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li><strong>Technical/necessary cookies:</strong> essential for the site to work (session, security, basic preferences).</li>
        <li><strong>Analytics cookies (optional):</strong> only if you give consent in the banner; we use them to measure usage and improve the service.</li>
      </ul>

      <p className="text-gray-700 mb-6">We do not use cookies to display personal data.</p>

      <h2 className="text-xl font-semibold mb-2">Consent management</h2>
      <p className="text-gray-700 mb-6">
        On your first visit we show a banner so you can accept, reject, or customise non-essential cookies.
        You can change your choice at <a href={LEGAL_META.cookieSettingsPath} className="text-[rgb(74,94,50)] underline">Cookie settings</a>.
      </p>

      <h2 className="text-xl font-semibold mb-2">Managing cookies in your browser</h2>
      <p className="text-gray-700 mb-6">You can allow, block, or delete cookies through your browser settings.</p>

      <h2 className="text-xl font-semibold mb-2">Providers</h2>
      <p className="text-gray-700">
        If you enable analytics, we may use {LEGAL_META.analyticsProvider}. {/* Fill in the specific provider, purpose, and retention once configured */}
      </p>
    </LegalContainer>
  );
}
