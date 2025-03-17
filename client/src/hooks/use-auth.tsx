import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User as SelectUser } from "@shared/schema";

interface LoginData {
  username: string;
  password: string;
}

interface AuthContextType {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useLoginMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: LoginData) => 
      apiRequest('POST', 'api/login', credentials),
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(['api/user'], user);
      const path = user.role === 'admin' ? 'admin-dashboard' : 'driver';
      window.location.href = `/${path}`;
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useLogoutMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => apiRequest('POST', 'api/logout'),
    onSuccess: () => {
      queryClient.setQueryData(['api/user'], null);
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null>({
    queryKey: ['api/user'],
    queryFn: () => apiRequest('GET', 'api/user'),
    retry: false,
    onError: (error: Error) => {
      // Don't show toast for 401 errors as they're expected when not logged in
      if (!error.message.includes('401')) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return null;
    },
  });

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error: error ?? null,
        loginMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}