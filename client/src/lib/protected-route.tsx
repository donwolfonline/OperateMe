import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";

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

  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === "admin" ? "/admin-dashboard" : "/driver";
    return (
      <AuthWrapper>
        <Redirect to={redirectPath} />
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <Component />
    </AuthWrapper>
  );
}