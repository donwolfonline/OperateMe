import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import LanguageToggle from "@/components/LanguageToggle";
import HomeButton from "@/components/HomeButton";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { user, registerMutation } = useAuth();

  if (user) {
    window.location.href = "/driver";
    return null;
  }

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema)
  });

  const onRegister = async (data: any) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <HomeButton />
          <LanguageToggle />
        </div>

        <Card className="max-w-md mx-auto mt-10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              {t('auth.registerAsDriver')}
            </h2>

            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.username')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.password')}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.fullName')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.idNumber')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.licenseNumber')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {t('auth.register')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
