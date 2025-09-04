import type { FormDataType } from '../store/formTypes';

// Prefer calling our serverless function. If VITE_TELEGRAM_WEBHOOK_URL is set,
// we will call that instead (useful for staging or custom backends).
const WEBHOOK_URL = (import.meta.env.VITE_TELEGRAM_WEBHOOK_URL as string | undefined) || '/api/notify-telegram';

const safe = (val?: string | number | boolean | null) =>
  val === undefined || val === null || val === '' ? '-' : String(val);

const join = (arr?: (string | undefined)[]) =>
  Array.isArray(arr) && arr.length ? arr.filter(Boolean).join(', ') : '-';

export function buildReviewSummary(sessionId: string, userId: string, data: FormDataType) {
  const addr = data.addressDetails;
  const addressLine = addr?.fullAddress
    || [addr?.street, addr?.number, addr?.floor, addr?.door, addr?.city]
      .filter(Boolean)
      .join(' ');

  const lines = [
    `✅ Nueva reseña finalizada` ,
    `Session: ${sessionId}`,
    `User: ${userId}`,
    '',
    `Dirección: ${safe(addressLine)}`,
    '',
    '— Estancia —',
    `Años: ${safe(data.startYear)} - ${safe(data.endYear ?? 'Presente')}`,
    `Precio: ${safe(data.price)}`,
    `Servicios incluidos: ${join(data.includedServices)}`,
    `Recomendaría: ${safe(data.wouldRecommend)}`,
    `Fianza devuelta: ${safe(data.depositReturned)}`,
    '',
    '— Piso —',
    `Verano: ${safe(data.summerTemperature)}`,
    `Invierno: ${safe(data.winterTemperature)}`,
    `Ruido: ${safe(data.noiseLevel)}`,
    `Luz: ${safe(data.lightLevel)}`,
    `Mantenimiento: ${safe(data.maintenanceStatus)}`,
    `Opinión piso: ${safe(data.propertyOpinion)}`,
    '',
    '— Comunidad —',
    `Vecindario: ${join(data.neighborTypes)}`,
    `Apart. turísticos: ${safe(data.touristApartments)}`,
    `Limpieza: ${safe(data.buildingCleanliness)}`,
    `Entorno: ${join(data.communityEnvironment)}`,
    `Seguridad: ${safe(data.communitySecurity)}`,
    `Opinión comunidad: ${safe(data.communityOpinion)}`,
    '',
    '— Propietario —',
    `Tipo: ${safe(data.ownerType)}`,
    // Prefer hashed identifiers if present
    `Nombre (hash): ${safe(data.ownerNameHash)}`,
    `Teléfono (hash): ${safe(data.ownerPhoneHash)}`,
    `Email (hash): ${safe(data.ownerEmailHash)}`,
    `Opinión: ${safe(data.ownerOpinion)}`,
  ];

  // Optional contact info (commented out to avoid sending PII by default)
  // lines.push('', '— Contacto —', `Nombre: ${safe(data.contactName)}`, `Email: ${safe(data.contactEmail)}`);

  return lines.join('\n');
}

async function sendViaWebhook(payload: unknown) {
  if (!WEBHOOK_URL) return false;
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // Helps the browser keep sending the request during navigation
      // (payload must remain small for keepalive to work reliably)
      keepalive: true as any,
    });
    return res.ok;
  } catch (err) {
    console.warn('Webhook notify failed', err);
    return false;
  }
}

export async function notifyReviewCompleted(sessionId: string, userId: string, data: FormDataType) {
  const text = buildReviewSummary(sessionId, userId, data);

  // Call our webhook/serverless function only (no direct Telegram from client)
  const sent = await sendViaWebhook({
    type: 'review_completed',
    sessionId,
    userId,
    summary: text,
    formData: data,
    ts: new Date().toISOString(),
  });
  return sent;
}
