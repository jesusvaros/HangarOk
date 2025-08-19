import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function PoliticaCookies() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Política de cookies</h1>
      <p className="text-sm text-gray-500 mb-6">Última actualización: 19/08/2025</p>

      <h2 className="text-xl font-semibold mb-2">¿Usamos cookies?</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li><strong>Cookies técnicas/necesarias:</strong> imprescindibles para que la web funcione (sesión, seguridad, preferencias básicas).</li>
        <li><strong>Cookies de analítica (opcionales):</strong> solo si das tu consentimiento en el banner; se usan para medir uso y mejorar la experiencia.</li>
      </ul>

      <p className="text-gray-700 mb-6">No usamos cookies para mostrar datos personales.</p>

      <h2 className="text-xl font-semibold mb-2">Gestión del consentimiento</h2>
      <p className="text-gray-700 mb-6">
        En tu primera visita mostramos un banner para aceptar, rechazar o configurar cookies no esenciales. Puedes cambiar tu elección en <a href={LEGAL_META.cookieSettingsPath} className="text-[rgb(74,94,50)] underline">Configurar cookies</a>.
      </p>

      <h2 className="text-xl font-semibold mb-2">Cómo gestionar cookies en tu navegador</h2>
      <p className="text-gray-700 mb-6">Puedes permitir, bloquear o eliminar cookies desde la configuración de tu navegador.</p>

      <h2 className="text-xl font-semibold mb-2">Proveedores</h2>
      <p className="text-gray-700">
        Si activas analítica, podremos usar {LEGAL_META.analyticsProvider}. {/* Rellena el proveedor exacto, finalidad y duración cuando lo configures */}
      </p>
    </LegalContainer>
  );
}
