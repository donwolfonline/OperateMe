import { useTranslation } from "react-i18next";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOperationOrderSchema } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";

// Saudi cities list
const saudiCities = [
  "Riyadh",
  "Jeddah",
  "Mecca",
  "Medina",
  "Dammam",
  "Khobar",
  "Dhahran",
  "Tabuk",
  "Abha",
  "Taif"
];

export default function OperationOrder() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Get user's vehicles
  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles/driver"],
  });

  const form = useForm({
    resolver: zodResolver(insertOperationOrderSchema),
    defaultValues: {
      fromCity: '',
      toCity: '',
      departureTime: new Date().toISOString().slice(0, 16),
      vehicleId: '',
      passengers: [{
        name: '',
        idNumber: '',
        nationality: '',
        phone: ''
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passengers"
  });

  const onSubmit = async (data: any) => {
    try {
      if (!data.vehicleId) {
        toast({
          title: "Error",
          description: "Please select a vehicle",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      setPdfUrl(null);

      const formattedData = {
        ...data,
        vehicleId: parseInt(data.vehicleId),
        departureTime: new Date(data.departureTime).toISOString()
      };

      const response = await apiRequest("POST", "/api/operation-orders", formattedData);
      const order = await response.json();

      if (order.pdfUrl) {
        setPdfUrl(order.pdfUrl);
      }

      toast({
        title: "Success",
        description: "Order created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/operation-orders/driver"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error creating order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Trip Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vehicle Selection */}
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">المركبة / Vehicle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المركبة / Select Vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicles?.map((vehicle: any) => (
                            <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                              {vehicle.model} - {vehicle.plateNumber}
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
                  name="fromCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">مدينة الانطلاق / From City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة / Select City" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {saudiCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
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
                  name="toCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">مدينة الوصول / To City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة / Select City" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {saudiCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
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
                  name="departureTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">وقت المغادرة / Departure Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          min={new Date().toISOString().slice(0, 16)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Passengers Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">الركاب / Passengers</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', idNumber: '', nationality: '', phone: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة راكب / Add Passenger
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`passengers.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-right">اسم الراكب / Passenger Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`passengers.${index}.idNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-right">رقم الهوية / ID Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`passengers.${index}.nationality`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-right">الجنسية / Nationality</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`passengers.${index}.phone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-right">رقم هاتف الراكب / Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="mt-4"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          حذف الراكب / Remove Passenger
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'جاري الإنشاء... / Saving...' : 'إنشاء الطلب / Create Order'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {pdfUrl && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">المستند جاهز / Document Ready</h3>
              <div className="aspect-[16/9] w-full bg-muted rounded-lg overflow-hidden">
                <iframe
                  src={`/uploads/${pdfUrl}`}
                  className="w-full h-full"
                  title="Order PDF Preview"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => window.open(`/uploads/${pdfUrl}`, '_blank')}
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  تحميل PDF / Download PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}