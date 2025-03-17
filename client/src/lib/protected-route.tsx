import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route, useLocation } from "wouter";

type ProtectedRouteProps = {
  component: () => React.JSX.Element;
  requiredRole?: "admin" | "driver";
};

export function ProtectedRoute({
  component: Component,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // First render the loading state if auth is still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Once loaded, check authentication
  if (!user) {
    // Use effect would cause the hooks error during state updates
    // Instead, render null and update location
    setLocation("/auth");
    return null;
  }

  // Check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === "admin" ? "/admin-dashboard" : "/driver";
    setLocation(redirectPath);
    return null;
  }

  // If authenticated and authorized, render the component
  return <Component />;
}