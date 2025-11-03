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
    `🚲 New hangar review submitted`,
    `Session: ${sessionId}`,
    `User: ${userId}`,
    '',
    `📍 Hangar location: ${safe(addressLine)}`,
    `Uses hangar: ${data.usesHangar ? 'Yes' : 'No'}`,
    `Home type: ${safe(data.homeType)}`,
    `Connection: ${safe(data.connectionType)}`,
    '',
    '- Community perception -',
    `Belonging (1-5): ${safe(data.belongsRating)}`,
    `Fair use of space (1-5): ${safe(data.fairUseRating)}`,
    `Appearance (1-5): ${safe(data.appearanceRating)}`,
    `Tags: ${join(data.perceptionTags)}`,
    `Feedback: ${safe(data.communityFeedback)}`,
    '',
    '- Safety -',
    `Daytime safety (1-5): ${safe(data.daytimeSafetyRating)}`,
    `Night-time safety (1-5): ${safe(data.nighttimeSafetyRating)}`,
    `Bike tampered with: ${data.bikeMessedWith ? 'Yes' : 'No'}`,
    `Current storage: ${safe(data.currentBikeStorage)}`,
    `Theft concern (1-5): ${safe(data.theftWorryRating)}`,
    `Safety tags: ${join(data.safetyTags)}`,
    '',
    '- Usability & impact -',
    `Lock ease (1-5): ${safe(data.lockEaseRating)}`,
    `Space (1-5): ${safe(data.spaceRating)}`,
    `Lighting (1-5): ${safe(data.lightingRating)}`,
    `Maintenance (1-5): ${safe(data.maintenanceRating)}`,
    `Usability tags: ${join(data.usabilityTags)}`,
    `Suggestions: ${safe(data.improvementSuggestion)}`,
    `Stops cycling: ${safe(data.stopsCycling)}`,
    `Impact tags: ${join(data.impactTags)}`,
    '',
    '- Maintenance & support -',
    `Ease of reporting (1-5): ${safe(data.reportEaseRating)}`,
    `Repair speed (1-5): ${safe(data.fixSpeedRating)}`,
    `Communication (1-5): ${safe(data.communicationRating)}`,
    `Maintenance tags: ${join(data.maintenanceTags)}`,
    `Waitlist fairness (1-5): ${safe(data.waitlistFairnessRating)}`,
    `Waitlist tags: ${join(data.waitlistTags)}`,
    `Improvement feedback: ${safe(data.improvementFeedback)}`,
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
