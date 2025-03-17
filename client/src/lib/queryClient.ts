import { QueryClient } from "@tanstack/react-query";

function getBaseUrl() {
  return ''; // Empty string for relative URLs
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown,
): Promise<any> {
  const url = `${getBaseUrl()}/${endpoint}`;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }
      throw new Error(response.statusText);
    }

    return contentType?.includes('application/json') ? response.json() : null;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
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