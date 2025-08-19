import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function BuenasPracticas() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Protocolo de buenas prácticas</h1>
      <p className="text-sm text-gray-500 mb-6">Última actualización: 19/08/2025</p>

      <h2 className="text-xl font-semibold mb-2">Para mantener un espacio útil y respetuoso:</h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">Sí (recomendado)</h3>
      <ul className="list-disc pl-6 text-gray-900 mb-4 space-y-1">
        <li>Describe hechos concretos de tu experiencia como inquilino.</li>
        <li>Sé honesto, respetuoso y específico (fechas aproximadas, incidencias objetivas).</li>
        <li>
          Si añades teléfono/email del casero en los campos designados, recuerda que:
          <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-900">
            <li>Se normaliza y hashea (p. ej., SHA‑256) en tu dispositivo.</li>
            <li>Nunca se almacena el dato original.</li>
            <li>El hash solo se usa para agrupar reseñas y matching con plataformas como Idealista mediante la extensión de navegador.</li>
          </ul>
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">No (prohibido)</h3>
      <ul className="list-disc pl-6 text-gray-900 mb-4 space-y-1">
        <li>Incluir datos personales en claro dentro del texto de la reseña.</li>
        <li>Insultos, descalificaciones, rumores o acusaciones sin base.</li>
        <li>Publicidad, spam o enlaces maliciosos.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Cómo reportar</h3>
      <p className="text-gray-900">
        Si ves un contenido que vulnera estas normas, escríbenos a {LEGAL_META.contactEmail} indicando la URL y el motivo. Revisamos los avisos con prioridad.
      </p>
    </LegalContainer>
  );
}
