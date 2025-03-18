import { QueryClient } from "@tanstack/react-query";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | FormData,
): Promise<Response> {
  const headers: Record<string, string> = {};
  let body: string | FormData | undefined;

  if (data instanceof FormData) {
    body = data;
  } else if (data) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({
      message: res.statusText
    }));
    throw new Error(errorData.message || res.statusText);
  }

  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 500,
      refetchOnWindowFocus: false,
      staleTime: 30000, // Cache data for 30 seconds
      cacheTime: 3600000, // Keep unused data in cache for 1 hour
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            return null;
          }
          throw new Error(res.statusText);
        }

        return res.json();
      }
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});