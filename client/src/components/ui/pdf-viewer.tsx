import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from './button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  className?: string;
}

export function PDFViewer({ url, className = '' }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    console.log('PDF loaded successfully with', numPages, 'pages');
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  // Generate a unique URL to prevent caching
  const pdfUrl = `/uploads/${url}?t=${new Date().getTime()}`;
  console.log('Loading PDF from:', pdfUrl);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-full max-w-2xl border rounded-lg overflow-hidden bg-white">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error('Error loading PDF:', error);
            setError('Failed to load PDF');
            setLoading(false);
          }}
          loading={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          {error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <Page 
              pageNumber={pageNumber} 
              width={600}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadError={(error) => {
                console.error('Error loading page:', error);
                setError('Failed to load PDF page');
              }}
            />
          )}
        </Document>
      </div>

      {numPages > 1 && !error && (
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm">
            Page {pageNumber} of {numPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}