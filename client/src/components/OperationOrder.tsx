import { useTranslation } from "react-i18next";
import { useForm, useFieldArray } from "react-hook-form";
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

// Saudi cities list with bilingual names
const saudiCities = [
  { value: "Riyadh", label: "الرياض / Riyadh" },
  { value: "Jeddah", label: "جدة / Jeddah" },
  { value: "Mecca", label: "مكة المكرمة / Mecca" },
  { value: "Medina", label: "المدينة المنورة / Medina" },
  { value: "Dammam", label: "الدمام / Dammam" },
  { value: "Khobar", label: "الخبر / Khobar" },
  { value: "Dhahran", label: "الظهران / Dhahran" },
  { value: "Tabuk", label: "تبوك / Tabuk" },
  { value: "Abha", label: "أبها / Abha" },
  { value: "Taif", label: "الطائف / Taif" }
];

export default function OperationOrder() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(insertOperationOrderSchema),
    defaultValues: {
      fromCity: '',
      toCity: '',
      departureTime: new Date().toISOString().slice(0, 16),
      visaType: '',
      tripNumber: '',
      passengers: [{
        name: '',
        idNumber: '',
        nationality: '',
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passengers"
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setPdfUrl(null);

      const formattedData = {
        ...data,
        departureTime: new Date(data.departureTime).toISOString()
      };

      const response = await apiRequest("POST", "/api/operation-orders", formattedData);
      const order = await response.json();

      if (order.pdfUrl) {
        setPdfUrl(order.pdfUrl);
      }

      toast({
        title: t('order.success'),
        description: t('order.orderCreated'),
      });

      queryClient.invalidateQueries({ queryKey: ["/api/operation-orders/driver"] });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('order.errorCreating'),
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('order.fromCity')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('order.selectCity')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {saudiCities.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
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
                      <FormLabel>{t('order.toCity')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('order.selectCity')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {saudiCities.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
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
                      <FormLabel>{t('order.departureTime')}</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('order.visaType')}</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tripNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('order.tripNumber')}</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="text-lg font-semibold">{t('order.passengers')}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fields.length >= 12) {
                        toast({
                          title: t('order.maxPassengers'),
                          description: t('order.maxPassengersMessage'),
                          variant: "destructive",
                        });
                        return;
                      }
                      append({
                        name: '',
                        idNumber: '',
                        nationality: '',
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('order.addPassenger')}
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`passengers.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('order.passengerName')}</FormLabel>
                              <FormControl>
                                <Input {...field} className="w-full" />
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
                              <FormLabel>{t('order.passengerIdNumber')}</FormLabel>
                              <FormControl>
                                <Input {...field} className="w-full" />
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
                              <FormLabel>{t('order.nationality')}</FormLabel>
                              <FormControl>
                                <Input {...field} className="w-full" />
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
                          className="mt-4 w-full sm:w-auto"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('order.removePassenger')}
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
                {isSubmitting ? t('common.saving') : t('order.create')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {pdfUrl && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('order.documentReady')}</h3>
              <div className="aspect-[16/9] w-full bg-muted rounded-lg overflow-hidden">
                <iframe
                  src={`/uploads/${pdfUrl}`}
                  className="w-full h-full"
                  title="Order PDF Preview"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => window.open(`/uploads/${pdfUrl}`, '_blank')}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t('order.downloadPdf')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}