import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function BuenasPracticas() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Good Practice Guidelines</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 19/08/2025</p>

      <h2 className="text-xl font-semibold mb-2">To keep this space useful and respectful:</h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">Do (recommended)</h3>
      <ul className="list-disc pl-6 text-gray-900 mb-4 space-y-1">
        <li>Describe concrete details from your experience as a tenant.</li>
        <li>Be honest, respectful, and specific (approximate dates, objective incidents).</li>
        <li>
          If you add a landlord’s phone/email in the designated fields, remember:
          <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-900">
            <li>It is normalized and hashed (e.g., SHA-256) on your device.</li>
            <li>The original data is never stored.</li>
            <li>The hash is only used to group reviews and match with platforms like Idealista through the browser extension.</li>
          </ul>
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Don’t (prohibited)</h3>
      <ul className="list-disc pl-6 text-gray-900 mb-4 space-y-1">
        <li>Share personal data in plain text inside the review.</li>
        <li>Use insults, slurs, rumors, or unverified accusations.</li>
        <li>Post advertising, spam, or malicious links.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">How to report</h3>
      <p className="text-gray-900">
        If you see content that breaks these rules, email us at {LEGAL_META.contactEmail} with the URL and your reason.
        We review reports as a priority.
      </p>
    </LegalContainer>
  );
}
