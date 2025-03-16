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

// Vehicle types with bilingual names
const vehicleTypes = [
  { value: "Sedan", label: "سيدان / Sedan" },
  { value: "SUV", label: "دفع رباعي / SUV" },
  { value: "Van", label: "فان / Van" },
  { value: "Bus", label: "حافلة / Bus" },
  { value: "Truck", label: "شاحنة / Truck" }
];

export default function VehicleForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const form = useForm({
    resolver: zodResolver(insertVehicleSchema),
    defaultValues: {
      type: '',
      model: '',
      year: '',
      plateNumber: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      // Validate required fields
      if (!data.type || !data.model || !data.year || !data.plateNumber) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Validate photos
      if (!selectedFiles || selectedFiles.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one photo",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      const formData = new FormData();

      // Add basic fields to FormData
      formData.append('type', data.type);
      formData.append('model', data.model);
      formData.append('year', data.year);
      formData.append('plateNumber', data.plateNumber);

      // Handle multiple files
      Array.from(selectedFiles).forEach((file) => {
        formData.append('photos', file);
      });

      const response = await apiRequest("POST", "/api/vehicles", formData);
      const vehicle = await response.json();

      toast({
        title: "Success",
        description: "Vehicle information saved successfully",
      });

      // Reset form and preview
      form.reset();
      setPhotoPreview([]);
      setSelectedFiles(null);

      // Invalidate and refetch vehicles query
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles/driver"] });
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
    if (files && files.length > 0) {
      setSelectedFiles(files);
      // Create preview URLs
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
                  <FormLabel>نوع المركبة / Vehicle Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المركبة / Select Vehicle Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
                  <FormLabel>موديل المركبة / Vehicle Model</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="موديل المركبة / Vehicle Model" />
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
                  <FormLabel>سنة التصنيع / Year</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="2020" type="number" min="1900" max="2025" />
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
                  <FormLabel>رقم اللوحة / Plate Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="رقم اللوحة / Plate Number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>صور المركبة / Vehicle Photos</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e.target.files)}
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

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'جاري الحفظ... / Saving...' : 'حفظ المركبة / Save Vehicle'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}