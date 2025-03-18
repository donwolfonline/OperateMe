import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({
      message: res.statusText
    }));
    throw new Error(errorData.message || res.statusText);
  }
}

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

  await throwIfResNotOk(res);
  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        await throwIfResNotOk(res);
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