import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function AvisoLegal() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Legal notice</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 03/11/2025</p>

      <h2 className="text-xl font-semibold mb-2">Site owner</h2>
      <p className="text-gray-900 mb-6">
        This website is owned by {LEGAL_META.ownerName}, based in {LEGAL_META.cityCountry}.<br />
        Contact: {LEGAL_META.contactEmail}.
      </p>

      <h2 className="text-xl font-semibold mb-2">Purpose</h2>
      <p className="text-gray-700 mb-6">
        {LEGAL_META.siteName} helps cyclists discover, review, and compare bicycle hangars and other secure bike storage options. The service aggregates community
        feedback, provides interactive maps, and publishes guidance to improve everyday cycling infrastructure across the UK.
      </p>

      <h2 className="text-xl font-semibold mb-2">Intellectual property</h2>
      <p className="text-gray-900 mb-6">
        Site assets (brand, logo, copy, code, illustrations) belong to {LEGAL_META.projectName} or their respective authors and are protected by intellectual
        property laws. Using the site does not grant any licence over those rights.
      </p>

      <h2 className="text-xl font-semibold mb-2">Content responsibility</h2>
      <p className="text-gray-900 mb-6">
        Reviews and comments are the sole responsibility of their authors. {LEGAL_META.projectName} moderates contributions about hangars, councils, or operators
        and may edit, hide, or remove content that breaches these terms, privacy requirements, or community standards.
      </p>

      <h2 className="text-xl font-semibold mb-2">Links</h2>
      <p className="text-gray-900 mb-6">The site may link to third-party pages without assuming responsibility for their content.</p>

      <h2 className="text-xl font-semibold mb-2">Availability</h2>
      <p className="text-gray-900 mb-6">
        Service continuity or error-free operation cannot be guaranteed, though we will fix issues as quickly as possible and keep riders informed of relevant
        interruptions.
      </p>

      <h2 className="text-xl font-semibold mb-2">Applicable law and jurisdiction</h2>
      <p className="text-gray-900">
        The laws of England and Wales apply. Any dispute will be handled by the Courts of {LEGAL_META.jurisdictionCity}, unless mandatory rules state otherwise.
      </p>
    </LegalContainer>
  );
}
