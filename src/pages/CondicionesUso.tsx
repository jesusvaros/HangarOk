import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function CondicionesUso() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Condiciones de uso</h1>
      <p className="text-sm text-gray-500 mb-6">Última actualización: 19/08/2025</p>

      <h2 className="text-xl font-semibold mb-2">1) Objeto</h2>
      <p className="text-gray-700 mb-6">Regular el acceso y uso de [Nombre/Proyecto], una plataforma/blog de reseñas anónimas sobre experiencias de alquiler.</p>

      <h2 className="text-xl font-semibold mb-2">2) Alta y publicación</h2>
      <p className="text-gray-700 mb-6">El usuario es responsable de la veracidad de lo que publica y de cumplir estas normas.</p>

      <h2 className="text-xl font-semibold mb-2">3) Prohibiciones (contenido)</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Está terminantemente prohibido publicar en texto libre: datos personales de terceros en claro (nombre completo, teléfono, email, dirección exacta u otros identificadores).</li>
        <li>Lenguaje injurioso, difamatorio, incitaciones al odio o a la violencia.</li>
        <li>Información falsa o que vulnere derechos de terceros.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">4) Campo “identificador” seguro (hash)</h2>
      <div className="text-gray-700 mb-6 space-y-2">
        <p>Para agrupar reseñas del mismo casero/gestor y evitar duplicados, el sistema puede solicitar al usuario introducir un teléfono o email del casero solo en los campos designados.</p>
        <p>Ese dato NUNCA se envía en claro: se normaliza y hashea localmente (p. ej., SHA‑256) y solo se envía el hash.</p>
        <p>Queda prohibido publicar esos datos en el texto de la reseña u otros campos visibles.</p>
        <p>El usuario se compromete a no intentar reidentificar a nadie ni usar los hashes para fines distintos a la consulta dentro del servicio.</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">5) Extensión de navegador</h2>
      <div className="text-gray-700 mb-6 space-y-2">
        <p>La extensión oficial de [Nombre/Proyecto]:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Solo procesa información visible en sitios como Idealista.</li>
          <li>Calcula hash local y consulta al backend con ese hash para mostrar si existen opiniones asociadas.</li>
          <li>No descarga ni almacena datos personales en claro.</li>
        </ul>
      </div>

      <h2 className="text-xl font-semibold mb-2">6) Moderación y retirada</h2>
      <p className="text-gray-700 mb-6">Podemos moderar, ocultar o eliminar contenidos que infrinjan estas condiciones o la ley. Dispones de [email] para comunicar abusos o solicitar revisión.</p>

      <h2 className="text-xl font-semibold mb-2">7) Responsabilidad</h2>
      <p className="text-gray-700 mb-6">Las opiniones son de sus autores. [Nombre/Proyecto] no garantiza exactitud ni asume responsabilidad por decisiones tomadas en base a las reseñas.</p>

      <h2 className="text-xl font-semibold mb-2">8) Propiedad intelectual</h2>
      <p className="text-gray-700 mb-6">El usuario garantiza tener derechos para publicar su contenido y concede a [Nombre/Proyecto] una licencia no exclusiva y gratuita para alojarlo y mostrarlo.</p>

      <h2 className="text-xl font-semibold mb-2">9) Terminación</h2>
      <p className="text-gray-700 mb-6">Podemos suspender cuentas o publicaciones por incumplimientos graves o reiterados.</p>

      <h2 className="text-xl font-semibold mb-2">10) Ley y jurisdicción</h2>
      <p className="text-gray-700">Ley española; fueros de {LEGAL_META.jurisdictionCity}, salvo norma imperativa.</p>
    </LegalContainer>
  );
}
