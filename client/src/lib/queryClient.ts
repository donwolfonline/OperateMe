import { QueryClient } from "@tanstack/react-query";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<any> {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined
  };

  const response = await fetch(url, config);
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return null;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity
    },
    mutations: {
      retry: false
    }
  }
});