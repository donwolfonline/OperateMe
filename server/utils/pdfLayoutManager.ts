import { PDFDocument } from 'pdfkit';

interface ContentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutSection {
  id: string;
  content: string;
  position: ContentPosition;
}

export class PDFLayoutManager {
  private sections: LayoutSection[] = [];
  private doc: PDFDocument;
  private currentY: number;

  constructor(doc: PDFDocument) {
    this.doc = doc;
    this.currentY = doc.y;
  }

  hasContent(id: string): boolean {
    return this.sections.some(section => section.id === id);
  }

  addSection(id: string, content: string): void {
    if (this.hasContent(id)) {
      console.log(`Section ${id} already exists, skipping...`);
      return;
    }

    const position = {
      x: this.doc.x,
      y: this.currentY,
      width: this.doc.page.width - (this.doc.page.margins.left + this.doc.page.margins.right),
      height: 0 // Will be calculated after content is added
    };

    this.sections.push({ id, content, position });
  }

  getCurrentY(): number {
    return this.currentY;
  }

  updateCurrentY(y: number): void {
    this.currentY = y;
  }

  reset(): void {
    this.sections = [];
    this.currentY = this.doc.y;
  }
}
