/**
 * Calculates SHA-256 hash of a string
 * @param text Text to hash
 * @returns Hex string of the hash
 */
export async function calculateHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Generates random coordinates near a base location
 * @returns Object with lat and lng properties
 */
export function generateRandomCoordinates() {
  // Madrid as default center
  const centerLat = 40.416775;
  const centerLng = -3.70379;

  // Random offset within ~2km
  const latOffset = (Math.random() - 0.5) * 0.03;
  const lngOffset = (Math.random() - 0.5) * 0.03;

  return {
    lat: centerLat + latOffset,
    lng: centerLng + lngOffset,
  };
}
