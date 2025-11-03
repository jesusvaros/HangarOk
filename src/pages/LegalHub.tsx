import { Link } from 'react-router-dom';
import LegalContainer from '../components/legal/LegalContainer';
import { LEGAL_META } from '../config/legal';

export default function LegalHub() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Terms and conditions</h1>
      <p className="text-gray-700 mb-6">Legal documentation for {LEGAL_META.siteName}.</p>
      <ul className="list-disc pl-6 space-y-2 text-[rgb(74,94,50)] underline">
        <li><Link to="/aviso-legal">Legal notice</Link></li>
        <li><Link to="/politica-privacidad">Privacy policy</Link></li>
        <li><Link to="/cookies">Cookie policy</Link></li>
        <li><Link to="/condiciones-uso">Terms of use</Link></li>
        <li><Link to="/buenas-practicas">Good practice guidelines</Link></li>
        <li><Link to="/terminosycondiciones">Terms and conditions</Link></li>
      </ul>
    </LegalContainer>
  );
}
