export function chatBubbleSVG({
  fill = '#22C55E', // green-500
  stroke = 'none',
  size = 34,
  includeCheck = true,
  checkStroke = '#FFFFFF',
}: {
  fill?: string;
  stroke?: string;
  size?: number;
  includeCheck?: boolean;
  checkStroke?: string;
} = {}) {
  const w = size;
  const h = size; // square viewBox 24 -> scale to size
  const check = includeCheck
    ? `<path d="M7.5 12.5l3.5 3.5 5.5-5.5" fill="none" stroke="${checkStroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`
    : '';
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}">
  <path fill-rule="evenodd" d="M2.25 12c0-4.97 4.694-9 10.5-9s10.5 4.03 10.5 9c0 2.485-1.23 4.735-3.25 6.388V21a.75.75 0 0 1-1.064.625L15 20.25a12.9 12.9 0 0 1-2.25.195c-5.806 0-10.5-4.03-10.5-9Z" clip-rule="evenodd"/>
  ${check}
</svg>`;
}

export function faceBubbleSVG({
  fill = '#22C55E',
  stroke = 'none',
  size = 34,
  face = 'happy',
}: {
  fill?: string;
  stroke?: string;
  size?: number;
  face?: 'sad' | 'neutral' | 'happy';
} = {}) {
  const w = size;
  const h = size;
  let mouth: string;
  if (face === 'sad') {
    mouth = '<path d="M8 14c1.5-1.5 4.5-1.5 6 0" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />';
  } else if (face === 'neutral') {
    mouth = '<line x1="8" y1="13.5" x2="14" y2="13.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />';
  } else {
    mouth = '<path d="M8 13c1.5 1.5 4.5 1.5 6 0" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />';
  }
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}">
  <path fill-rule="evenodd" d="M2.25 12c0-4.97 4.694-9 10.5-9s10.5 4.03 10.5 9c0 2.485-1.23 4.735-3.25 6.388V21a.75.75 0 0 1-1.064.625L15 20.25a12.9 12.9 0 0 1-2.25.195c-5.806 0-10.5-4.03-10.5-9Z" clip-rule="evenodd"/>
  <circle cx="9.25" cy="9.75" r="1" fill="#FFFFFF" />
  <circle cx="14.75" cy="9.75" r="1" fill="#FFFFFF" />
  ${mouth}
</svg>`;
}
