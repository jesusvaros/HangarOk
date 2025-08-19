import { LEGAL_META } from '../config/legal';
import LegalContainer from '../components/legal/LegalContainer';

export default function AvisoLegal() {
  return (
    <LegalContainer>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Aviso legal</h1>
      <p className="text-sm text-gray-500 mb-6">Última actualización: 19/08/2025</p>

      <h2 className="text-xl font-semibold mb-2">Responsable del sitio</h2>
      <p className="text-gray-900 mb-6">
        Este sitio web es titularidad de {LEGAL_META.ownerName}, con domicilio en {LEGAL_META.cityCountry}.<br />
        Contacto: {LEGAL_META.contactEmail}.
      </p>

      <h2 className="text-xl font-semibold mb-2">Objeto</h2>
      <p className="text-gray-700 mb-6">
        Este sitio ofrece un blog/plataforma de opiniones de inquilinos sobre experiencias de alquiler, con funcionalidades de publicación y consulta de reseñas anónimas.
      </p>

      <h2 className="text-xl font-semibold mb-2">Propiedad intelectual</h2>
      <p className="text-gray-900 mb-6">
        Los contenidos propios (marca, logotipo, textos, código) pertenecen a {LEGAL_META.projectName} o a sus autores y quedan protegidos por la normativa de propiedad intelectual. El uso del sitio no concede licencia alguna sobre dichos derechos.
      </p>

      <h2 className="text-xl font-semibold mb-2">Responsabilidad de contenidos</h2>
      <p className="text-gray-900 mb-6">
        Las opiniones publicadas son responsabilidad exclusiva de sus autores. {LEGAL_META.projectName} puede moderar o retirar contenidos que vulneren estas condiciones, la ley o los principios de respeto.
      </p>

      <h2 className="text-xl font-semibold mb-2">Enlaces</h2>
      <p className="text-gray-900 mb-6">Este sitio puede enlazar a webs de terceros sin que ello implique responsabilidad sobre sus contenidos.</p>

      <h2 className="text-xl font-semibold mb-2">Disponibilidad</h2>
      <p className="text-gray-900 mb-6">No se garantiza la continuidad del servicio ni la ausencia de errores. Se procurará solventarlos con la mayor diligencia posible.</p>

      <h2 className="text-xl font-semibold mb-2">Ley aplicable y jurisdicción</h2>
      <p className="text-gray-900">
        Se aplica la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de {LEGAL_META.jurisdictionCity}, salvo norma imperativa en contrario.
      </p>
    </LegalContainer>
  );
}
