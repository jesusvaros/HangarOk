import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function PoliticaPrivacidad() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Privacy policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 19/08/2025</p>

      <h2 className="text-xl font-semibold mb-2">1) Data controller</h2>
      <p className="text-gray-700 mb-6">{LEGAL_META.ownerName} – Contact: {LEGAL_META.contactEmail}.</p>

      <h2 className="text-xl font-semibold mb-2">2) Data we process</h2>
      <div className="space-y-4 text-gray-700 mb-6">
        <p><strong>Information provided by users who publish reviews:</strong> review text, rating, and minimal anti-spam technical metadata (e.g., IP/UA).</p>
        <div>
          <p className="mb-2"><strong>Landlord/manager identifiers to deduplicate and group reviews:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>We do not store personal data in plain text (name, phone, email).</li>
            <li>We only store an irreversible hash (e.g. SHA-256) of normalised data (such as normalised phone number or email).</li>
            <li>The hash is computed on your device (web or extension) and only the hash is sent, never the original data.</li>
          </ul>
        </div>
        <p><strong>Usage/analytics data (only if you consent):</strong> page views and aggregated events.</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">3) Data sources</h2>
      <div className="space-y-2 text-gray-700 mb-6">
        <p>Voluntary contribution from the user when submitting a review.</p>
        <p>
          Browser extension (Chrome/Firefox): only captures information visible on listing sites (e.g., Idealista); computes hashes locally and queries the backend with that hash. It does not scrape at scale or download personal data in plain text.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">4) Purposes</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Publishing and moderating reviews.</li>
        <li>Grouping reviews by landlord/manager via hashes to avoid duplicates and aid discovery.</li>
        <li>Preventing abuse and spam (rate limiting, technical signals).</li>
        <li>(Optional) Analytics to improve the service.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">5) Legal basis</h2>
      <div className="text-gray-700 mb-6 space-y-2">
        <p>User consent when submitting a review.</p>
        <p>
          Legitimate interest (Art. 6.1.f GDPR) for moderation, security, deduplication via hash, and proper service operation. No automated decisions with legal effects are made.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">6) Sharing and processors</h2>
      <p className="text-gray-700 mb-6">
        We do not share data with third parties unless legally required. We rely on infrastructure providers as data processors (e.g., Supabase, {LEGAL_META.hostingProvider}) under GDPR-compliant agreements. International transfers may occur; in that case we apply appropriate safeguards (EU Standard Contractual Clauses).
      </p>

      <h2 className="text-xl font-semibold mb-2">7) Retention periods</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Reviews and hashes: while the service remains active or until you request deletion/blocking.</li>
        <li>Anti-spam technical logs: {LEGAL_META.logsRetentionDays}.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">8) Rights</h2>
      <p className="text-gray-700 mb-6">
        You can request access, rectification, deletion, opposition, restriction, and portability by emailing {LEGAL_META.contactEmail}.
        Regarding hashes: because we do not store the original data, deletion means blocking or removing the associated hash.
        If you are a third party (e.g., a landlord) and believe there is indirect identification, contact us to block the hash and remove the grouping.
      </p>

      <h2 className="text-xl font-semibold mb-2">9) Minors</h2>
      <p className="text-gray-700 mb-6">The service is not directed at minors under 14. We do not accept submissions from minors.</p>

      <h2 className="text-xl font-semibold mb-2">10) Changes</h2>
      <p className="text-gray-700">We may update this policy. We will publish the current version with its revision date.</p>
    </LegalContainer>
  );
}
