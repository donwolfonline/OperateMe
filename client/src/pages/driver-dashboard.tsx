import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import DriverProfile from "@/components/DriverProfile";
import VehicleForm from "@/components/VehicleForm";
import OperationOrder from "@/components/OperationOrder";
import LanguageToggle from "@/components/LanguageToggle";

export default function DriverDashboard() {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t('driver.dashboard')}</h1>
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

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">{t('driver.profile')}</TabsTrigger>
            <TabsTrigger value="vehicles">{t('driver.vehicles')}</TabsTrigger>
            <TabsTrigger value="orders">{t('driver.orders')}</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
}
