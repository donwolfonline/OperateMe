import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function DriverProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const uploadDocument = async (file: File, type: 'id' | 'license') => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);

    await apiRequest("POST", "/api/documents/upload", formData);
  };

  if (!user) return null;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label>{t('auth.fullName')}</Label>
          <Input value={user.fullName} disabled />
        </div>

        <div className="space-y-2">
          <Label>{t('auth.idNumber')}</Label>
          <Input value={user.idNumber} disabled />
          <div className="mt-2">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadDocument(file, 'id');
              }}
              className="hidden"
              id="idDocument"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('idDocument')?.click()}
            >
              {t('driver.uploadId')}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('auth.licenseNumber')}</Label>
          <Input value={user.licenseNumber} disabled />
          <div className="mt-2">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadDocument(file, 'license');
              }}
              className="hidden"
              id="licenseDocument"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('licenseDocument')?.click()}
            >
              {t('driver.uploadLicense')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
