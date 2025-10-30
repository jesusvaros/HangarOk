import type { FormDataType } from '../store/formTypes';

// Prefer calling our serverless function. If VITE_TELEGRAM_WEBHOOK_URL is set,
// we will call that instead (useful for staging or custom backends).
const WEBHOOK_URL = (import.meta.env.VITE_TELEGRAM_WEBHOOK_URL as string | undefined) || '/api/notify-telegram';

const safe = (val?: string | number | boolean | null) =>
  val === undefined || val === null || val === '' ? '-' : String(val);

const join = (arr?: (string | undefined)[]) =>
  Array.isArray(arr) && arr.length ? arr.filter(Boolean).join(', ') : '-';

export function buildReviewSummary(sessionId: string, userId: string, data: FormDataType) {
  const addr = data.hangarLocation;
  const addressLine = addr?.fullAddress
    || [addr?.street, addr?.number, addr?.city]
      .filter(Boolean)
      .join(' ');

  const lines = [
    `🚲 Nueva reseña de hangar finalizada` ,
    `Session: ${sessionId}`,
    `User: ${userId}`,
    '',
    `📍 Ubicación del hangar: ${safe(addressLine)}`,
    `Usa el hangar: ${data.usesHangar ? 'Sí' : 'No'}`,
    `Tipo de vivienda: ${safe(data.homeType)}`,
    `Conexión: ${safe(data.connectionType)}`,
    '',
    '— Percepción Comunitaria —',
    `Pertenencia (1-5): ${safe(data.belongsRating)}`,
    `Uso justo del espacio (1-5): ${safe(data.fairUseRating)}`,
    `Apariencia (1-5): ${safe(data.appearanceRating)}`,
    `Tags: ${join(data.perceptionTags)}`,
    `Feedback: ${safe(data.communityFeedback)}`,
    '',
    '— Seguridad —',
    `Seguridad diurna (1-5): ${safe(data.daytimeSafetyRating)}`,
    `Seguridad nocturna (1-5): ${safe(data.nighttimeSafetyRating)}`,
    `Bici manipulada: ${data.bikeMessedWith ? 'Sí' : 'No'}`,
    `Almacenamiento actual: ${safe(data.currentBikeStorage)}`,
    `Preocupación por robo (1-5): ${safe(data.theftWorryRating)}`,
    `Tags seguridad: ${join(data.safetyTags)}`,
    '',
    '— Usabilidad e Impacto —',
    `Facilidad de cierre (1-5): ${safe(data.lockEaseRating)}`,
    `Espacio (1-5): ${safe(data.spaceRating)}`,
    `Iluminación (1-5): ${safe(data.lightingRating)}`,
    `Mantenimiento (1-5): ${safe(data.maintenanceRating)}`,
    `Tags usabilidad: ${join(data.usabilityTags)}`,
    `Sugerencias: ${safe(data.improvementSuggestion)}`,
    `Impide usar bici: ${safe(data.stopsCycling)}`,
    `Tags impacto: ${join(data.impactTags)}`,
    '',
    '— Mantenimiento y Soporte —',
    `Facilidad reporte (1-5): ${safe(data.reportEaseRating)}`,
    `Velocidad reparación (1-5): ${safe(data.fixSpeedRating)}`,
    `Comunicación (1-5): ${safe(data.communicationRating)}`,
    `Tags mantenimiento: ${join(data.maintenanceTags)}`,
    `Justicia lista espera (1-5): ${safe(data.waitlistFairnessRating)}`,
    `Tags lista espera: ${join(data.waitlistTags)}`,
    `Feedback mejoras: ${safe(data.improvementFeedback)}`,
  ];

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
      keepalive: true,
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
