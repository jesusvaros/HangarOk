function normalizeInput(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD') // separa letras de sus tildes
    .replace(/[\u0300-\u036f]/g, '') // elimina tildes
    .replace(/\s+/g, ''); // elimina todos los espacios
}

export async function hashValue(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(normalizeInput(value));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  return [...new Uint8Array(hashBuffer)].map(b => b.toString(16).padStart(2, '0')).join('');
}
