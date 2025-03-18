import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";
import { useTranslation } from "react-i18next";

type ProtectedRouteProps = {
  component: () => React.JSX.Element;
  requiredRole?: "admin" | "driver";
};

function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function ProtectedRoute({
  component: Component,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <AuthWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </AuthWrapper>
    );
  }

  if (!user) {
    return (
      <AuthWrapper>
        <Redirect to="/auth" />
      </AuthWrapper>
    );
  }

  // Check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === "admin" ? "/admin/dashboard" : "/auth";
    return (
      <AuthWrapper>
        <Redirect to={redirectPath} />
      </AuthWrapper>
    );
  }

  // Check if driver is suspended (only for driver role)
  if (requiredRole === "driver" && user.status === "suspended") {
    return (
      <AuthWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive">
              {t('notifications.accountSuspended')}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t('notifications.suspensionMessage')}
            </p>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <Component />
    </AuthWrapper>
  );
}