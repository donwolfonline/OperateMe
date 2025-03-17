import { QueryClient } from "@tanstack/react-query";

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown,
): Promise<any> {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/${endpoint}`;

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
      const errorData = contentType?.includes('application/json') 
        ? await response.json() 
        : { error: response.statusText };
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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