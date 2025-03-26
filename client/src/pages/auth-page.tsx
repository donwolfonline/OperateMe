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
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { t } = useTranslation();
  const { user, loginMutation } = useAuth();

  // Check if we're on the admin login page by checking the full URL path
  const isAdmin = window.location.pathname.includes('/admin');

  const loginForm = useForm({
    resolver: zodResolver(
      insertUserSchema.pick({ 
        username: true, 
        password: true 
      })
    ),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onLogin = async (data: any) => {
    try {
      await loginMutation.mutateAsync({
        ...data,
        role: isAdmin ? "admin" : "driver"
      });
    } catch (error) {
      // Error handling is done in useAuth hook
      console.error('Login error:', error);
    }
  };

  // If already authenticated, redirect to appropriate dashboard
  if (user) {
    return <Redirect to={user.role === "admin" ? "/admin/dashboard" : "/driver"} />;
  }

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
              {isAdmin ? t('auth.adminLogin') : t('auth.driverLogin')}
            </h2>

            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
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
                  control={loginForm.control}
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
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t('auth.loggingIn')}
                    </>
                  ) : (
                    t('auth.login')
                  )}
                </Button>

                {/* Only show register button for driver login */}
                {!isAdmin && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="link" 
                      asChild
                    >
                      <a href="/register">
                        {t('auth.registerAsDriver')}
                      </a>
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}