import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function PoliticaPrivacidad() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Privacy policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 03/11/2025</p>

      <h2 className="text-xl font-semibold mb-2">1) Data controller</h2>
      <p className="text-gray-700 mb-6">{LEGAL_META.ownerName} – Contact: {LEGAL_META.contactEmail}.</p>

      <h2 className="text-xl font-semibold mb-2">2) Data we process</h2>
      <div className="space-y-4 text-gray-700 mb-6">
        <p>
          <strong>Information provided when submitting a review:</strong> hangar location (address or map coordinates), ratings, tags, free-text comments,
          optional photos, and the fact that you currently use or are on the waiting list for the hangar.
        </p>
        <p>
          <strong>User account details:</strong> email address or social login identifier handled by Supabase Auth (used solely to let you manage your reviews).
        </p>
        <p>
          <strong>Technical metadata:</strong> IP address truncated to city level, browser/device information, and security logs to detect abuse or duplicate
          submissions.
        </p>
        <p>
          <strong>Analytics (only if you consent):</strong> aggregated page views, map interactions, and event counts provided by {LEGAL_META.analyticsProvider}.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">3) Data sources</h2>
      <div className="space-y-2 text-gray-700 mb-6">
        <p>Voluntary contribution from cyclists using the website or mobile interface.</p>
        <p>Optional device geolocation if you allow it when centring the map, which is stored only in session and never saved on our servers.</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">4) Purposes</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Publishing a public map of hangar reviews and maintenance feedback.</li>
        <li>Helping riders compare safety, usability, and responsiveness of different hangars.</li>
        <li>Moderating contributions, preventing spam, and securing the service.</li>
        <li>Improving the product through optional analytics.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">5) Legal basis</h2>
      <div className="text-gray-700 mb-6 space-y-2">
        <p>Consent when you submit a review, upload photos, or activate optional analytics.</p>
        <p>Legitimate interest (Art. 6.1.f GDPR / UK GDPR) for moderation, security, and core product analytics. No automated decisions with legal effects are made.</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">6) Sharing and processors</h2>
      <p className="text-gray-700 mb-6">
        We do not sell or share personal data with third parties. We rely on service providers (e.g., Supabase, {LEGAL_META.hostingProvider}, email providers,
        analytics) under GDPR/UK GDPR compliant agreements. When data leaves the UK/EEA we apply appropriate safeguards such as Standard Contractual Clauses.
      </p>

      <h2 className="text-xl font-semibold mb-2">7) Retention periods</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Reviews and associated media: while HangarOK remains active or until you request deletion.</li>
        <li>User accounts: until you close the account or request removal.</li>
        <li>Security and anti-spam logs: {LEGAL_META.logsRetentionDays}.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">8) Rights</h2>
      <p className="text-gray-700 mb-6">
        You can request access, rectification, erasure, restriction, portability, or object to processing by emailing {LEGAL_META.contactEmail}. You may also
        withdraw consent for analytics at any time via the cookie settings page ({LEGAL_META.cookieSettingsPath}).
      </p>

      <h2 className="text-xl font-semibold mb-2">9) Minors</h2>
      <p className="text-gray-700 mb-6">The service is not directed at minors under 14. We do not knowingly accept submissions from minors.</p>

      <h2 className="text-xl font-semibold mb-2">10) Changes</h2>
      <p className="text-gray-700">We may update this policy. We will publish the current version with its revision date.</p>
    </LegalContainer>
  );
}
