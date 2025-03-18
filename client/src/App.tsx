import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AdminLoginPage from "@/pages/admin-login";
import DriverLoginPage from "@/pages/driver-login";
import RegisterPage from "@/pages/register-page";
import DriverDashboard from "@/pages/driver-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={DriverLoginPage} />
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/driver" component={() => (
        <ProtectedRoute component={DriverDashboard} requiredRole="driver" />
      )} />
      <Route path="/admin" component={() => ( //Corrected route here
        <ProtectedRoute component={AdminDashboard} requiredRole="admin" />
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;