import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import DriverProfile from "@/components/DriverProfile";
import VehicleForm from "@/components/VehicleForm";
import OperationOrder from "@/components/OperationOrder";
import LanguageToggle from "@/components/LanguageToggle";
import HomeButton from "@/components/HomeButton";
import DashboardWidget from "@/components/DashboardWidget";
import DashboardSettings from "@/components/DashboardSettings";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Redirect } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Calendar, MapPin, Users } from "lucide-react";
import { OperationOrder as OperationOrderType } from "@shared/schema";
import { Badge } from "@/components/ui/badge";


function DriverDashboardContent() {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [widgets, setWidgets] = useState(user?.dashboardPreferences?.widgets || []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("widgetId", id);
  };

  const handleDragEnd = () => {
    // Optional: Add any cleanup after drag
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("widgetId");

    const newWidgets = [...widgets];
    const sourceWidget = newWidgets.find(w => w.id === sourceId);
    const targetWidget = newWidgets.find(w => w.id === targetId);

    if (sourceWidget && targetWidget) {
      const sourcePos = sourceWidget.position;
      sourceWidget.position = targetWidget.position;
      targetWidget.position = sourcePos;

      setWidgets(newWidgets.sort((a, b) => a.position - b.position));
    }
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, visible: false } : widget
    ));
  };

  const { data: driverOrders } = useQuery<(OperationOrderType & { passengers: any[]; pdfUrl?: string })[]>({
    queryKey: ["/api/driver/orders"],
    enabled: !!user && user.role === "driver",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <HomeButton />
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <LanguageToggle />
            <button
              onClick={() => logoutMutation.mutate()}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className={`grid gap-4 mb-8 ${
          user?.dashboardPreferences?.layout === 'list' 
            ? 'grid-cols-1' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {widgets
            .filter(widget => widget.visible)
            .sort((a, b) => a.position - b.position)
            .map(widget => (
              <DashboardWidget
                key={widget.id}
                widget={widget}
                onRemove={handleRemoveWidget}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
              />
            ))}
        </div>

        {/* Tabs for other sections */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">{t('driver.profile')}</TabsTrigger>
            <TabsTrigger value="vehicles">{t('driver.vehicles')}</TabsTrigger>
            <TabsTrigger value="orders">{t('driver.orders')}</TabsTrigger>
            <TabsTrigger value="history">{t('driver.history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <DriverProfile />
          </TabsContent>

          <TabsContent value="vehicles">
            <VehicleForm />
          </TabsContent>

          <TabsContent value="orders">
            <OperationOrder />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">{t('driver.operationHistory')}</h2>
                {!driverOrders?.length ? (
                  <p className="text-muted-foreground text-center py-4">{t('driver.noOrders')}</p>
                ) : (
                  <div className="grid gap-6">
                    {driverOrders.map((order) => (
                      <Card key={order.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                  {t('order.tripNumber')}: {order.tripNumber}
                                </h3>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>
                                <p className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {order.fromCity} → {order.toCity}
                                </p>
                                <p className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  {t('order.passengerCount')}: {order.passengers?.length || 0}
                                </p>
                              </div>

                              {/* Trip Details */}
                              <div className="mt-4">
                                <Badge variant="outline" className="mb-2">
                                  {order.visaType}
                                </Badge>
                              </div>

                              {/* Passengers Section */}
                              <div className="mt-4 space-y-2">
                                <h4 className="font-medium">{t('order.passengers')}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {order.passengers?.map((passenger, index) => (
                                    <div key={index} className="text-sm bg-muted p-2 rounded-md">
                                      <p className="font-medium">{passenger.name}</p>
                                      <p className="text-muted-foreground text-xs">
                                        {t('order.idNumber')}: {passenger.idNumber}
                                      </p>
                                      <p className="text-muted-foreground text-xs">
                                        {t('order.nationality')}: {passenger.nationality}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Document Actions */}
                            {order.pdfUrl && (
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={`/uploads/${order.pdfUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                  >
                                    <FileText className="h-4 w-4" />
                                    {t('order.viewDocument')}
                                  </a>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`/uploads/${order.pdfUrl}`, '_blank')}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  {t('order.download')}
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dashboard Settings Modal */}
        {showSettings && (
          <DashboardSettings onClose={() => setShowSettings(false)} />
        )}
      </div>
    </div>
  );
}

export default function DriverDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== "driver") {
    return <Redirect to="/auth" />;
  }

  return <DriverDashboardContent />;
}