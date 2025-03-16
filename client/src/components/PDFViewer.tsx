import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
}

export function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(`/uploads/${pdfUrl}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfUrl;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('pdf.downloadError'),
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload
    const iframe = document.getElementById('pdf-viewer') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        
        <div className="relative aspect-[16/9] w-full bg-muted rounded-lg overflow-hidden">
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <p className="text-destructive">{t('pdf.loadError')}</p>
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('common.retry')}
              </Button>
            </div>
          ) : (
            <iframe
              id="pdf-viewer"
              src={`/uploads/${pdfUrl}`}
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
            />
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('pdf.download')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
