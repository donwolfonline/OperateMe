import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PDFViewer } from '@/components/ui/pdf-viewer';
import { format } from 'date-fns';

export function OrderList() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/driver/orders'],
  });

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <Card key={order.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">
                {order.fromCity} → {order.toCity}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(order.departureTime), 'PPP p')}
              </p>
              <p className="text-sm">Trip Number: {order.tripNumber}</p>
            </div>
            
            {order.pdfUrl && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Contract
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Transport Contract</DialogTitle>
                  </DialogHeader>
                  <PDFViewer url={order.pdfUrl} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
