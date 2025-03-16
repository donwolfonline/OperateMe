import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import LanguageToggle from "@/components/LanguageToggle";
import HomeButton from "@/components/HomeButton";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();

  // Query for different driver lists
  const { data: pendingDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/pending-drivers"],
  });

  const { data: activeDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/active-drivers"],
  });

  const { data: suspendedDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/suspended-drivers"],
  });

  const { data: tripRequests } = useQuery<any[]>({
    queryKey: ["/api/admin/trip-requests"],
  });

  // Driver management functions
  const approveDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/approve-driver/${driverId}`);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
  };

  const suspendDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/suspend-driver/${driverId}`);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-drivers"] });
  };

  const activateDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/activate-driver/${driverId}`);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
  };

  // Trip management functions
  const approveTripRequest = async (tripId: number) => {
    await apiRequest("POST", `/api/admin/approve-trip/${tripId}`);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/trip-requests"] });
  };

  const rejectTripRequest = async (tripId: number) => {
    await apiRequest("POST", `/api/admin/reject-trip/${tripId}`);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/trip-requests"] });
  };

  if (!user || user.role !== "admin") return null;

  const renderDriverCard = (driver: User, actions: React.ReactNode) => (
    <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="font-medium">{driver.fullName}</p>
        <p className="text-sm text-muted-foreground">
          {t('auth.idNumber')}: {driver.idNumber}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('auth.licenseNumber')}: {driver.licenseNumber}
        </p>
      </div>
      <div className="flex gap-2">
        {actions}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <HomeButton />
          <div className="flex gap-4">
            <LanguageToggle />
            <button 
              onClick={() => logoutMutation.mutate()} 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              {t('admin.pendingDrivers')}
              {pendingDrivers?.length ? (
                <Badge variant="destructive" className="ml-2">{pendingDrivers.length}</Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="active">{t('admin.activeDrivers')}</TabsTrigger>
            <TabsTrigger value="suspended">{t('admin.suspendedDrivers')}</TabsTrigger>
            <TabsTrigger value="trips">
              {t('admin.tripRequests')}
              {tripRequests?.length ? (
                <Badge variant="destructive" className="ml-2">{tripRequests.length}</Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.pendingDrivers')}</h2>
                {pendingDrivers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noDrivers')}</p>
                ) : (
                  <div className="space-y-4">
                    {pendingDrivers?.map((driver) => renderDriverCard(driver, (
                      <Button onClick={() => approveDriver(driver.id)}>{t('admin.approve')}</Button>
                    )))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.activeDrivers')}</h2>
                {activeDrivers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noActiveDrivers')}</p>
                ) : (
                  <div className="space-y-4">
                    {activeDrivers?.map((driver) => renderDriverCard(driver, (
                      <Button 
                        variant="destructive" 
                        onClick={() => suspendDriver(driver.id)}
                      >
                        {t('admin.suspend')}
                      </Button>
                    )))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suspended">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.suspendedDrivers')}</h2>
                {suspendedDrivers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noSuspendedDrivers')}</p>
                ) : (
                  <div className="space-y-4">
                    {suspendedDrivers?.map((driver) => renderDriverCard(driver, (
                      <Button 
                        variant="outline" 
                        onClick={() => activateDriver(driver.id)}
                      >
                        {t('admin.activate')}
                      </Button>
                    )))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trips">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.tripRequests')}</h2>
                {tripRequests?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noTripRequests')}</p>
                ) : (
                  <div className="space-y-4">
                    {tripRequests?.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{trip.driver.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('trips.from')}: {trip.origin}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t('trips.to')}: {trip.destination}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => approveTripRequest(trip.id)}>
                            {t('admin.approveTrip')}
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => rejectTripRequest(trip.id)}
                          >
                            {t('admin.rejectTrip')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}