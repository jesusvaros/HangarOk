import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function CondicionesUso() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Terms of use</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 19/08/2025</p>

      <h2 className="text-xl font-semibold mb-2">1) Purpose</h2>
      <p className="text-gray-700 mb-6">These terms govern access to and use of [Project Name], a platform/blog for anonymous rental experiences.</p>

      <h2 className="text-xl font-semibold mb-2">2) Registration and publication</h2>
      <p className="text-gray-700 mb-6">Users are responsible for the accuracy of what they publish and for complying with these rules.</p>

      <h2 className="text-xl font-semibold mb-2">3) Content restrictions</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Never post personal data about third parties in plain text (full name, phone, email, exact address, or other identifiers).</li>
        <li>No abusive language, defamation, hate speech, or incitement to violence.</li>
        <li>No false information or content that infringes third-party rights.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">4) Secure “identifier” field (hash)</h2>
      <div className="text-gray-700 mb-6 space-y-2">
        <p>To group reviews for the same landlord/manager and avoid duplicates, the system may ask you to provide a landlord phone or email in designated fields only.</p>
        <p>This information is NEVER sent in plain text: it is normalised and hashed locally (e.g., SHA-256) and only the hash is sent.</p>
        <p>Do not publish such data inside the review text or other visible fields.</p>
        <p>Users agree not to attempt re-identification or use hashes for purposes beyond the service.</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">5) Browser extension</h2>
      <div className="text-gray-700 mb-6 space-y-2">
        <p>The official [Project Name] extension:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Only processes information visible on sites such as Idealista.</li>
          <li>Generates the hash locally and queries the backend with it to show any related reviews.</li>
          <li>Does not download or store personal data in plain text.</li>
        </ul>
      </div>

      <h2 className="text-xl font-semibold mb-2">6) Moderation and takedowns</h2>
      <p className="text-gray-700 mb-6">We may moderate, hide, or delete content that breaches these terms or the law. Use [email] to report abuse or request a review.</p>

      <h2 className="text-xl font-semibold mb-2">7) Liability</h2>
      <p className="text-gray-700 mb-6">Reviews are the authors’ responsibility. [Project Name] does not guarantee accuracy or accept liability for decisions made based on the reviews.</p>

      <h2 className="text-xl font-semibold mb-2">8) Intellectual property</h2>
      <p className="text-gray-700 mb-6">Users guarantee they hold the rights to publish their content and grant [Project Name] a non-exclusive, free licence to host and display it.</p>

      <h2 className="text-xl font-semibold mb-2">9) Termination</h2>
      <p className="text-gray-700 mb-6">We may suspend accounts or publications for serious or repeated breaches.</p>

      <h2 className="text-xl font-semibold mb-2">10) Law and jurisdiction</h2>
      <p className="text-gray-700">Spanish law applies; jurisdiction lies with the courts of {LEGAL_META.jurisdictionCity}, unless mandatory rules state otherwise.</p>
    </LegalContainer>
  );
}
