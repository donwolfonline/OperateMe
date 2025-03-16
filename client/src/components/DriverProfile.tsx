import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DriverProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [idPreview, setIdPreview] = useState<string | null>(user?.idDocumentUrl || null);
  const [licensePreview, setLicensePreview] = useState<string | null>(user?.licenseDocumentUrl || null);

  const isImageFile = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '');
  };

  const uploadDocument = async (file: File, type: 'id' | 'license') => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', type);

      const response = await apiRequest("POST", "/api/documents/upload", formData);
      const updatedUser = await response.json();

      // Update preview based on document type
      if (type === 'id') {
        setIdPreview(updatedUser.idDocumentUrl);
      } else {
        setLicensePreview(updatedUser.licenseDocumentUrl);
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const renderPreview = (url: string | null, type: string) => {
    if (!url) return null;

    if (isImageFile(url)) {
      return (
        <div className="mt-2">
          <img 
            src={`/${url}`} 
            alt={`${type} preview`} 
            className="max-w-sm rounded-lg shadow-lg"
          />
        </div>
      );
    } else {
      return (
        <div className="mt-2">
          <a 
            href={`/${url}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View uploaded document
          </a>
        </div>
      );
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label>{t('auth.fullName')}</Label>
          <Input value={user.fullName || ''} disabled />
        </div>

        <div className="space-y-2">
          <Label>{t('auth.idNumber')}</Label>
          <Input value={user.idNumber || ''} disabled />
          <div className="mt-2">
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf"
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
            {renderPreview(idPreview, 'ID')}
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('auth.licenseNumber')}</Label>
          <Input value={user.licenseNumber || ''} disabled />
          <div className="mt-2">
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf"
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
            {renderPreview(licensePreview, 'License')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}