import { createCanvas, registerFont } from 'canvas';

// Initialize canvas with proper RTL settings
function createRTLCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Set up canvas for RTL text
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.direction = 'rtl';

  return { canvas, ctx };
}

export function renderArabicSection(title: string, items: string[]): Buffer {
  // Calculate dimensions
  const fontSize = 14;
  const titleSize = fontSize + 6;
  const lineHeight = fontSize * 2;
  const padding = 20;
  const width = 600;
  const height = titleSize + (items.length * lineHeight) + (padding * 3);

  const { canvas, ctx } = createRTLCanvas(width, height);

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw title
  ctx.font = `bold ${titleSize}px Arial`;
  ctx.fillStyle = '#1e40af';
  ctx.fillText(title, width - padding, padding + titleSize/2);

  // Draw items
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = '#000000';

  items.forEach((item, index) => {
    const y = (padding * 2) + titleSize + (index * lineHeight);
    ctx.fillText(item, width - padding, y);
  });

  return canvas.toBuffer('image/png');
}