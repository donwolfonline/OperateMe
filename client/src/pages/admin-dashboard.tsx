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

  // Driver management functions
  const approveDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/drivers/${driverId}/status`, { status: 'active' });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
  };

  const suspendDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/drivers/${driverId}/status`, { status: 'suspended' });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-drivers"] });
  };

  const activateDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/drivers/${driverId}/status`, { status: 'active' });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
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
        </Tabs>
      </div>
    </div>
  );
}