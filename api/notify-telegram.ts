// Minimal serverless function to send a Telegram message without exposing the bot token in the client.
// Configure on Vercel as environment variables:
// - TELEGRAM_BOT_TOKEN
// - TELEGRAM_CHAT_ID
// Optionally restrict origins with ALLOWED_ORIGIN (comma-separated list)

export default async function handler(req, res) {
  // CORS handling (basic). Adjust ALLOWED_ORIGIN if needed.
  const allowList = (process.env.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.origin || '';
  const allowOrigin = allowList.length === 0 ? '*' : (allowList.includes(origin) ? origin : allowList[0]);

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Missing Telegram credentials' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { sessionId, userId, formData, summary } = body;

  if (!sessionId || !userId) {
    return res.status(400).json({ ok: false, error: 'Missing sessionId or userId' });
  }

  const safe = (val?: string | number | boolean | null) =>
    val === undefined || val === null || val === '' ? '-' : String(val);
  const join = (arr?: (string | undefined)[]) =>
    Array.isArray(arr) && arr.length ? arr.filter(Boolean).join(', ') : '-';

  // Prefer server-side summary; fallback to client-provided summary only if no formData.
  let text: string | undefined = typeof summary === 'string' ? summary : undefined;

  if (!text && formData && typeof formData === 'object') {
    const addr = formData.addressDetails || {};
    const addressLine = addr.fullAddress
      || [addr.street, addr.number, addr.floor, addr.door, addr.city]
        .filter(Boolean)
        .join(' ');

    const lines = [
      `✅ Nueva reseña finalizada`,
      `Session: ${sessionId}`,
      `User: ${userId}`,
      '',
      `Dirección: ${safe(addressLine)}`,
      '',
      '- Estancia -',
      `Años: ${safe(formData.startYear)} - ${safe(formData.endYear ?? 'Presente')}`,
      `Precio: ${safe(formData.price)}`,
      `Servicios incluidos: ${join(formData.includedServices)}`,
      `Recomendaría: ${safe(formData.wouldRecommend)}`,
      `Fianza devuelta: ${safe(formData.depositReturned)}`,
      '',
      '- Piso -',
      `Verano: ${safe(formData.summerTemperature)}`,
      `Invierno: ${safe(formData.winterTemperature)}`,
      `Ruido: ${safe(formData.noiseLevel)}`,
      `Luz: ${safe(formData.lightLevel)}`,
      `Mantenimiento: ${safe(formData.maintenanceStatus)}`,
      `Opinión piso: ${safe(formData.propertyOpinion)}`,
      '',
      '- Comunidad -',
      `Vecindario: ${join(formData.neighborTypes)}`,
      `Apart. turísticos: ${safe(formData.touristApartments)}`,
      `Limpieza: ${safe(formData.buildingCleanliness)}`,
      `Entorno: ${join(formData.communityEnvironment)}`,
      `Seguridad: ${safe(formData.communitySecurity)}`,
      `Opinión comunidad: ${safe(formData.communityOpinion)}`,
      '',
      '- Propietario -',
      `Tipo: ${safe(formData.ownerType)}`,
      `Nombre (hash): ${safe(formData.ownerNameHash)}`,
      `Teléfono (hash): ${safe(formData.ownerPhoneHash)}`,
      `Email (hash): ${safe(formData.ownerEmailHash)}`,
      `Opinión: ${safe(formData.ownerOpinion)}`,
    ];
    text = lines.join('\n');
  }

  if (!text) {
    return res.status(400).json({ ok: false, error: 'Missing summary/formData' });
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
    const data = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok) {
      return res.status(502).json({ ok: false, error: 'Telegram request failed', details: data });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Unexpected error', details: String(err?.message || err) });
  }
}

