import { createCanvas, registerFont } from 'canvas';

// Initialize canvas with proper RTL settings
function createRTLCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Set up canvas for RTL text
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.direction = 'rtl';
  ctx.font = '14px Arial';

  return { canvas, ctx };
}

export function renderArabicSection(title: string, items: string[]): Buffer {
  // Calculate dimensions
  const fontSize = 14;
  const lineHeight = fontSize * 1.5;
  const padding = 20;
  const width = 600;

  // Calculate total height needed
  let totalLines = items.reduce((acc, item) => {
    const estimatedWidth = item.length * (fontSize * 0.6);
    const linesNeeded = Math.ceil(estimatedWidth / (width - (padding * 2)));
    return acc + linesNeeded;
  }, 0);

  const height = (totalLines * lineHeight) + (padding * 2);

  const { canvas, ctx } = createRTLCanvas(width, height);

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw text
  ctx.fillStyle = '#000000';
  let currentY = padding;

  items.forEach(item => {
    if (!item.trim()) {
      currentY += lineHeight * 0.5;
      return;
    }

    // Word wrapping
    const words = item.split(' ').reverse(); // Reverse for RTL
    let line = '';
    let testLine = '';

    for (let i = 0; i < words.length; i++) {
      testLine = words[i] + (line ? ' ' : '') + line;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > width - (padding * 2) && i > 0) {
        // Draw the line before it gets too long
        ctx.fillText(line, width - padding, currentY);
        line = words[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }

    // Draw remaining text
    ctx.fillText(line, width - padding, currentY);
    currentY += lineHeight;
  });

  return canvas.toBuffer('image/png');
}