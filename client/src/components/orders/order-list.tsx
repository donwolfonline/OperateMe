import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PDFViewer } from '@/components/ui/pdf-viewer';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function OrderList() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/driver/orders'],
    refetchInterval: 5000, // Refetch every 5 seconds to check PDF status
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
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

              {/* Show PDF status */}
              {!order.pdfUrl && (
                <p className="text-sm text-yellow-600">
                  PDF is being generated...
                </p>
              )}
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

      {orders.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No orders found
        </div>
      )}
    </div>
  );
}