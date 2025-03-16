import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
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

  const form = useForm({
    resolver: zodResolver(insertOperationOrderSchema),
    defaultValues: {
      passengerName: '',
      passengerPhone: '',
      fromCity: '',
      toCity: '',
      departureTime: new Date().toISOString().slice(0, 16) // Format for datetime-local input
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // The date will be automatically transformed by the schema validation
      await apiRequest("POST", "/api/operation-orders", data);

      toast({
        title: "Success",
        description: t('order.createSuccess'),
      });

      // Invalidate and refetch orders query
      queryClient.invalidateQueries({ queryKey: ["/api/operation-orders/driver"] });

      // Reset form after successful submission
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || t('order.createError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="passengerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('order.passengerName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passengerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('order.passengerPhone')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>{t('order.departureTime')}</FormLabel>
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
  );
}