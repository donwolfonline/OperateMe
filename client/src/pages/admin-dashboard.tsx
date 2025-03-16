import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import LanguageToggle from "@/components/LanguageToggle";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();

  const { data: pendingDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/pending-drivers"],
  });

  const approveDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/approve-driver/${driverId}`);
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t('admin.dashboard')}</h1>
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

        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('admin.pendingDrivers')}
              </h2>
              
              <div className="space-y-4">
                {pendingDrivers?.map((driver) => (
                  <div 
                    key={driver.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{driver.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('auth.idNumber')}: {driver.idNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('auth.licenseNumber')}: {driver.licenseNumber}
                      </p>
                    </div>
                    <Button onClick={() => approveDriver(driver.id)}>
                      {t('admin.approve')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
