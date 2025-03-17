import { QueryClient } from "@tanstack/react-query";

function normalizeUrl(endpoint: string): string {
  const baseUrl = window.location.origin;
  // Remove any leading slashes from endpoint and combine with baseUrl
  const normalizedEndpoint = endpoint.replace(/^\/+/, '');
  return `${baseUrl}/${normalizedEndpoint}`;
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown,
): Promise<any> {
  const url = normalizeUrl(endpoint);

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
        throw new Error(errorData.error || errorData.message || response.statusText);
      }
      throw new Error(response.statusText);
    }

    if (!contentType?.includes('application/json')) {
      return null;
    }

    return response.json();
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