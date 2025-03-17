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

  // Always render something to maintain consistent hook order
  let content = <Component />;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  } else if (!user) {
    content = <Redirect to="/auth" />;
  } else if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === "admin" ? "/admin-dashboard" : "/driver";
    content = <Redirect to={redirectPath} />;
  }

  return content;
}