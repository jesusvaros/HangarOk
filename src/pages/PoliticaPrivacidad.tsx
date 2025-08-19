import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function PoliticaPrivacidad() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Política de privacidad</h1>
      <p className="text-sm text-gray-500 mb-6">Última actualización: 19/08/2025</p>

      <h2 className="text-xl font-semibold mb-2">1) Responsable del tratamiento</h2>
      <p className="text-gray-700 mb-6">{LEGAL_META.ownerName} – Contacto: {LEGAL_META.contactEmail}.</p>

      <h2 className="text-xl font-semibold mb-2">2) Qué datos tratamos</h2>
      <div className="space-y-4 text-gray-700 mb-6">
        <p><strong>Datos aportados por usuarios que publican opiniones:</strong> texto de la reseña, valoración y metadatos técnicos mínimos anti‑spam (p. ej., IP/UA).</p>
        <div>
          <p className="mb-2"><strong>Identificadores de caseros/gestores para deduplicar y agrupar reseñas:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>No guardamos datos personales en claro (nombre, teléfono, email).</li>
            <li>Guardamos únicamente un hash irreversible (p. ej. SHA‑256) de datos normalizados (ej.: teléfono normalizado o email normalizado).</li>
            <li>El hash se calcula en tu dispositivo (frontend o extensión) y solo se envía el hash, nunca el dato original.</li>
          </ul>
        </div>
        <p><strong>Datos de uso/analítica (solo si habilitas analítica con consentimiento):</strong> páginas vistas, eventos agregados.</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">3) Origen de los datos</h2>
      <div className="space-y-2 text-gray-700 mb-6">
        <p>Aportación voluntaria del usuario al publicar su reseña.</p>
        <p>
          Extensión de navegador (Chrome/Firefox): capta únicamente información visible en páginas como Idealista; calcula el hash localmente y consulta el backend con ese hash. No realiza scraping masivo ni descarga datos personales en claro.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">4) Finalidades</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Publicar y moderar opiniones.</li>
        <li>Agrupar reseñas por casero/gestor mediante hashes para evitar duplicidades y mejorar la consulta.</li>
        <li>Prevención de abuso y spam (limitación de frecuencia, señales técnicas).</li>
        <li>(Opcional) Analítica para mejorar el servicio.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">5) Base jurídica</h2>
      <div className="text-gray-700 mb-6 space-y-2">
        <p>Consentimiento del usuario que envía la reseña.</p>
        <p>
          Interés legítimo (art. 6.1.f RGPD) para: moderación, seguridad, deduplicación mediante hash y correcto funcionamiento del servicio. No se usan decisiones automatizadas con efectos jurídicos.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">6) Cesiones y encargados</h2>
      <p className="text-gray-700 mb-6">
        No cedemos datos a terceros salvo obligación legal. Usamos proveedores de infraestructura como encargados del tratamiento (p. ej., Supabase, {LEGAL_META.hostingProvider}), bajo contrato conforme al RGPD. Pueden existir transferencias internacionales; en tal caso aplicamos garantías adecuadas (Cláusulas Contractuales Tipo de la UE).
      </p>

      <h2 className="text-xl font-semibold mb-2">7) Plazos de conservación</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Reseñas y hashes: mientras el servicio esté activo o hasta que solicites su supresión/bloqueo.</li>
        <li>Logs técnicos anti‑spam: {LEGAL_META.logsRetentionDays}.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">8) Derechos</h2>
      <p className="text-gray-700 mb-6">
        Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {LEGAL_META.contactEmail}. Nota sobre los hashes: al no almacenar el dato original, la supresión se realiza bloqueando o eliminando el hash asociado. Si eres un tercero afectado (p. ej., casero) y crees que existe una identificación indirecta, contáctanos para bloqueo del hash y desindexación del agrupado.
      </p>

      <h2 className="text-xl font-semibold mb-2">9) Menores</h2>
      <p className="text-gray-700 mb-6">El servicio no está dirigido a menores de 14 años. No se aceptan envíos de datos por menores.</p>

      <h2 className="text-xl font-semibold mb-2">10) Cambios</h2>
      <p className="text-gray-700">Podemos actualizar esta política. Publicaremos la versión vigente con fecha de actualización.</p>
    </LegalContainer>
  );
}
