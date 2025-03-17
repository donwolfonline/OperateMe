import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, X, Settings } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface WidgetProps {
  widget: {
    id: string;
    type: 'orders' | 'stats' | 'chart' | 'notifications';
    position: number;
    visible: boolean;
    settings?: Record<string, any>;
  };
  onRemove: (id: string) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

const chartData = [
  { date: '2025-03-10', orders: 4 },
  { date: '2025-03-11', orders: 6 },
  { date: '2025-03-12', orders: 8 },
  { date: '2025-03-13', orders: 5 },
  { date: '2025-03-14', orders: 7 },
  { date: '2025-03-15', orders: 9 },
  { date: '2025-03-16', orders: 11 },
];

export default function DashboardWidget({ widget, onRemove, onDragStart, onDragEnd, onDrop }: WidgetProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/driver/orders"],
    enabled: widget.type === 'orders',
  });

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    if (onDragStart) onDragStart(e, widget.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    if (onDragEnd) onDragEnd(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) onDrop(e, widget.id);
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'orders':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('dashboard.recentOrders')} ({orders.length})
            </p>
            <div className="space-y-2">
              {orders.slice(0, 3).map((order: any) => (
                <div key={order.id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{order.fromCity} → {order.toCity}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.departureTime).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>{order.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.totalOrders')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {orders.filter((o: any) => o.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">{t('dashboard.activeOrders')}</p>
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className="h-[200px]">
            <ChartContainer>
              <AreaChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  strokeWidth={2}
                  fill="var(--primary)"
                  fillOpacity={0.1}
                  stroke="var(--primary)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t('dashboard.noNewNotifications')}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      className={`transition-shadow ${isDragging ? 'shadow-lg' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <GripVertical className="h-4 w-4 cursor-move text-muted-foreground" />
          {t(`dashboard.widgets.${widget.type}`)}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onRemove(widget.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
}