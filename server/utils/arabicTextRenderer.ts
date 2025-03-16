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
  // Calculate dimensions with more space for text
  const fontSize = 14;
  const titleSize = fontSize + 6;
  const lineHeight = fontSize * 1.8; // Increased line height for better readability
  const padding = 20;
  const width = 600;

  // Calculate required height based on text content
  let totalLines = items.reduce((acc, item) => {
    // Estimate number of lines needed for each item based on text length and width
    const estimatedLines = Math.ceil((item.length * fontSize * 0.6) / (width - (padding * 3)));
    return acc + (estimatedLines + (item === '' ? 1 : 0)); // Add extra space for empty lines
  }, 0);

  const height = titleSize + (totalLines * lineHeight) + (padding * 4);

  const { canvas, ctx } = createRTLCanvas(width, height);

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw title
  ctx.font = `bold ${titleSize}px Arial`;
  ctx.fillStyle = '#1e40af';
  ctx.fillText(title, width - padding, padding + titleSize/2);

  // Draw items with text wrapping
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = '#000000';

  let currentY = (padding * 2) + titleSize;
  items.forEach(item => {
    if (item === '') {
      // Add extra space for empty lines
      currentY += lineHeight * 0.8;
      return;
    }

    // Word wrapping for Arabic text
    const words = item.split(' ');
    let line = '';
    let firstLine = true;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? ' ' : '') + words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > width - (padding * 3) && i > 0) {
        // Add indentation for wrapped lines
        const xPosition = width - padding - (firstLine ? 0 : 20);
        ctx.fillText(line, xPosition, currentY);
        line = words[i];
        currentY += lineHeight;
        firstLine = false;
      } else {
        line = testLine;
      }
    }
    // Draw remaining text
    const xPosition = width - padding - (firstLine ? 0 : 20);
    ctx.fillText(line, xPosition, currentY);
    currentY += lineHeight * 1.2; // Add extra space between items
  });

  return canvas.toBuffer('image/png');
}