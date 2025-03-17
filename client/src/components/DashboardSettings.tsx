import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { useState } from "react";

type WidgetType = 'orders' | 'stats' | 'chart' | 'notifications';

interface DashboardSettingsProps {
  onClose: () => void;
}

export default function DashboardSettings({ onClose }: DashboardSettingsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();

  const [preferences, setPreferences] = useState(user?.dashboardPreferences ?? {
    layout: 'grid',
    theme: 'light',
    widgets: [
      { id: 'recent-orders', type: 'orders', position: 0, visible: true },
      { id: 'stats', type: 'stats', position: 1, visible: true },
      { id: 'activity-chart', type: 'chart', position: 2, visible: true },
      { id: 'notifications', type: 'notifications', position: 3, visible: true }
    ]
  });

  const updatePreferences = async () => {
    try {
      const response = await apiRequest<User>("PATCH", "/api/user/preferences", {
        dashboardPreferences: preferences
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        queryClient.setQueryData(["/api/user"], updatedUser);
        toast({
          title: t('notifications.success'),
          description: t('notifications.changesSaved'),
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: t('notifications.error'),
        description: t('common.error'),
        variant: "destructive",
      });
    }
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setPreferences(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget => 
        widget.id === widgetId 
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    }));
  };

  const updateLayout = (layout: 'grid' | 'list') => {
    setPreferences(prev => ({
      ...prev,
      layout
    }));
  };

  const updateTheme = (theme: 'light' | 'dark') => {
    setPreferences(prev => ({
      ...prev,
      theme
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('dashboard.customize.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Layout Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('dashboard.customize.layout')}</h3>
          <RadioGroup
            value={preferences.layout}
            onValueChange={(value: 'grid' | 'list') => updateLayout(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grid" id="grid" />
              <Label htmlFor="grid">{t('dashboard.customize.grid')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="list" id="list" />
              <Label htmlFor="list">{t('dashboard.customize.list')}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Theme Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('dashboard.customize.theme')}</h3>
          <RadioGroup
            value={preferences.theme}
            onValueChange={(value: 'light' | 'dark') => updateTheme(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">{t('dashboard.customize.light')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">{t('dashboard.customize.dark')}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Widget Visibility */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('dashboard.customize.dragToReorder')}</h3>
          <div className="space-y-4">
            {preferences.widgets.map(widget => (
              <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor={widget.id}>
                  {t(`dashboard.widgets.${widget.type}`)}
                </Label>
                <Switch
                  id={widget.id}
                  checked={widget.visible}
                  onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={updatePreferences}>
            {t('dashboard.customize.saveChanges')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
