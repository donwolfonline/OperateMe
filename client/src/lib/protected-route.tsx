import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";

type ProtectedRouteProps = {
  component: () => React.JSX.Element;
  requiredRole?: "admin" | "driver";
};

export function ProtectedRoute({
  component: Component,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === "admin" ? "/admin-dashboard" : "/driver";
    return <Redirect to={redirectPath} />;
  }

  // Check if driver is suspended
  if (requiredRole === "driver" && user.status === "suspended") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Account Suspended
          </h2>
          <p className="mt-2 text-muted-foreground">
            Your account has been suspended. Please contact support for assistance.
          </p>
        </div>
      </div>
    );
  }

  return <Component />;
}