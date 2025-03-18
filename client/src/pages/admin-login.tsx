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

function AdminLoginPage() {
  const { t } = useTranslation();
  const { user, loginMutation, isLoading } = useAuth();

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
    await loginMutation.mutateAsync({
      ...data,
      role: "admin"
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle authentication redirect
  if (user) {
    if (user.role === "admin") {
      return <Redirect to="/admin" />;
    } else {
      return <Redirect to="/driver" />;
    }
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
              {t('auth.adminLogin')}
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
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {t('auth.login')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminLoginPage;