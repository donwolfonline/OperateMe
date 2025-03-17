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
    mutationFn: async (credentials: LoginData) => {
      return await apiRequest('POST', 'api/login', credentials);
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(['api/user'], user);
      const path = user.role === 'admin' ? '/admin-dashboard' : '/driver';
      window.location.href = path;
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
    mutationFn: async () => {
      await apiRequest('POST', 'api/logout');
      queryClient.clear();
    },
    onSuccess: () => {
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
    queryFn: async () => {
      try {
        return await apiRequest('GET', 'api/user');
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    onError: (error: Error) => {
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