import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVehicleSchema } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const vehicleTypes = [
  "Sedan",
  "SUV",
  "Van",
  "Bus",
  "Truck"
];

export default function VehicleForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(insertVehicleSchema),
    defaultValues: {
      type: '',
      model: '',
      year: '',
      plateNumber: '',
      photos: undefined
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Add basic fields to FormData
      formData.append('type', data.type);
      formData.append('model', data.model);
      formData.append('year', data.year);
      formData.append('plateNumber', data.plateNumber);

      // Handle multiple files
      if (data.photos) {
        Array.from(data.photos).forEach((file: File) => {
          formData.append('photos', file);
        });
      }

      await apiRequest("POST", "/api/vehicles", formData);

      toast({
        title: "Success",
        description: "Vehicle information saved successfully",
      });

      // Invalidate and refetch vehicles query
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles/driver"] });

      // Reset form and preview after successful submission
      form.reset();
      setPhotoPreview([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save vehicle information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotoPreview(previews);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vehicle.type')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('vehicle.selectType')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vehicle.model')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vehicle.year')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vehicle.plateNumber')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photos"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>{t('vehicle.photos')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleFileChange(e.target.files);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {photoPreview.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {photoPreview.map((url, index) => (
                        <img 
                          key={index}
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? t('common.saving') : t('vehicle.save')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}