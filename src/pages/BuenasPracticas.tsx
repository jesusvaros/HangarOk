import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function BuenasPracticas() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Good Practice Guidelines</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 03/11/2025</p>

      <h2 className="text-xl font-semibold mb-2">To keep this space useful and respectful:</h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">Do (recommended)</h3>
      <ul className="list-disc pl-6 text-gray-900 mb-4 space-y-1">
        <li>Describe concrete details about the hangar: access, lighting, locking mechanism, and how well it is maintained.</li>
        <li>Include time references (e.g., “evenings in October 2025”) to help other riders gauge recency.</li>
        <li>Add clear photos of the bike parking infrastructure when possible, while respecting people’s privacy.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Don’t (prohibited)</h3>
      <ul className="list-disc pl-6 text-gray-900 mb-4 space-y-1">
        <li>Share personal data about key holders, councils, or neighbours.</li>
        <li>Use insults, slurs, rumours, or unverified accusations.</li>
        <li>Post advertising, crowdfunding links, or unrelated promotions.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">How to report</h3>
      <p className="text-gray-900">
        If you see content that breaks these rules, email us at {LEGAL_META.contactEmail} with the URL and your reason.
        We review reports as a priority.
      </p>
    </LegalContainer>
  );
}
