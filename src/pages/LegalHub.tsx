import { Link } from 'react-router-dom';
import LegalContainer from '../components/legal/LegalContainer';
import { LEGAL_META } from '../config/legal';

export default function LegalHub() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Términos y condiciones</h1>
      <p className="text-gray-700 mb-6">Documentación legal de {LEGAL_META.siteName}.</p>
      <ul className="list-disc pl-6 space-y-2 text-[rgb(74,94,50)] underline">
        <li><Link to="/aviso-legal">Aviso Legal</Link></li>
        <li><Link to="/politica-privacidad">Política de Privacidad</Link></li>
        <li><Link to="/cookies">Política de Cookies</Link></li>
        <li><Link to="/condiciones-uso">Condiciones de Uso</Link></li>
        <li><Link to="/buenas-practicas">Protocolo de Buenas Prácticas</Link></li>
        <li><Link to="/terminosycondiciones">Términos y Condiciones</Link></li>
      </ul>
    </LegalContainer>
  );
}
