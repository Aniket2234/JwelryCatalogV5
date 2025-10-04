import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const startTime = performance.now();
  
  console.log(`🚀 API ${method} ${url}`, data ? { body: data } : "");
  
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    const duration = performance.now() - startTime;
    
    if (res.ok) {
      console.log(`✅ API ${method} ${url} - ${res.status} (${duration.toFixed(0)}ms)`);
    } else {
      console.error(`❌ API ${method} ${url} - ${res.status} (${duration.toFixed(0)}ms)`);
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`❌ API ${method} ${url} - Failed (${duration.toFixed(0)}ms)`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    const startTime = performance.now();
    
    console.log(`🔍 API GET ${url}`);
    
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      const duration = performance.now() - startTime;

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.warn(`⚠️ API GET ${url} - 401 Unauthorized (${duration.toFixed(0)}ms)`);
        return null;
      }

      if (res.ok) {
        console.log(`✅ API GET ${url} - ${res.status} (${duration.toFixed(0)}ms)`);
      } else {
        console.error(`❌ API GET ${url} - ${res.status} (${duration.toFixed(0)}ms)`);
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`❌ API GET ${url} - Failed (${duration.toFixed(0)}ms)`, error);
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
