import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function CondicionesUso() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Terms of use</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 03/11/2025</p>

      <h2 className="text-xl font-semibold mb-2">1) Purpose</h2>
      <p className="text-gray-700 mb-6">
        These terms govern access to and use of {LEGAL_META.projectName}, a community platform where cyclists review public and private bike hangars, report
        maintenance issues, and discover safer places to store a bicycle.
      </p>

      <h2 className="text-xl font-semibold mb-2">2) Registration and submissions</h2>
      <p className="text-gray-700 mb-6">
        You are responsible for the accuracy of the information you share about hangars, surrounding streets, and operators. Reviews must reflect genuine
        experiences and comply with UK law and these rules.
      </p>

      <h2 className="text-xl font-semibold mb-2">3) Content standards</h2>
      <div className="text-gray-700 mb-6 space-y-2">
        <p>To keep the map useful for riders, please avoid the following:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Publishing personal data about key holders, councils, or other riders (names, phone numbers, emails, vehicle plates, etc.).</li>
          <li>Uploading photos of people without their consent or sharing CCTV footage.</li>
          <li>Spreading false claims, defamatory statements, or hate speech.</li>
          <li>Promoting commercial offers unrelated to bike parking.</li>
        </ul>
      </div>

      <h2 className="text-xl font-semibold mb-2">4) Location accuracy</h2>
      <p className="text-gray-700 mb-6">
        Each review must correspond to the correct hangar, street, or postcode. Do not mislabel hangars or intentionally mark private sheds, residential
        buildings, or unrelated infrastructure.
      </p>

      <h2 className="text-xl font-semibold mb-2">5) Photos and maintenance evidence</h2>
      <p className="text-gray-700 mb-6">
        Upload only photos you took yourself. Images should focus on the hangar, racks, locks, lighting, or maintenance issues. Blur or crop any people or
        licence plates that appear by accident.
      </p>

      <h2 className="text-xl font-semibold mb-2">6) Moderation</h2>
      <p className="text-gray-700 mb-6">
        {LEGAL_META.projectName} may moderate, edit, or remove contributions that breach these terms, local bylaws, or basic standards of respect. You can flag
        content by contacting {LEGAL_META.contactEmail}.
      </p>

      <h2 className="text-xl font-semibold mb-2">7) Liability</h2>
      <p className="text-gray-700 mb-6">
        Reviews belong to their authors. {LEGAL_META.projectName} does not guarantee availability of hangars, nor accept liability for theft, damage, or incidents
        occurring in or near a hangar.
      </p>

      <h2 className="text-xl font-semibold mb-2">8) Intellectual property</h2>
      <p className="text-gray-700 mb-6">
        By posting, you confirm you hold the rights to share your text and media, and grant {LEGAL_META.projectName} a non-exclusive licence to host and display
        them on its website, apps, and datasets.
      </p>

      <h2 className="text-xl font-semibold mb-2">9) Termination</h2>
      <p className="text-gray-700 mb-6">
        We may suspend accounts, hide reviews, or block submissions for serious or repeated breaches of these terms or misuse of the mapping tools.
      </p>

      <h2 className="text-xl font-semibold mb-2">10) Law and jurisdiction</h2>
      <p className="text-gray-700">
        These terms are governed by the laws of England and Wales; jurisdiction lies with the courts of {LEGAL_META.jurisdictionCity}, unless mandatory rules
        state otherwise.
      </p>
    </LegalContainer>
  );
}
