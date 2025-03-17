import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || res.statusText);
    } catch (e) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | FormData,
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  let body: string | FormData | undefined;

  if (data instanceof FormData) {
    delete headers['Content-Type']; // Let browser set the correct boundary for FormData
    body = data;
  } else if (data) {
    body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body,
      credentials: "include",
    });

    // Clone the response before checking status to avoid the "Body used already" error
    const responseClone = res.clone();
    await throwIfResNotOk(responseClone);
    return res;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
        headers: {
          'Accept': 'application/json'
        }
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      // Clone the response before checking status
      const responseClone = res.clone();
      await throwIfResNotOk(responseClone);

      return res.json();
    } catch (error) {
      console.error('Query Function Error:', error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});