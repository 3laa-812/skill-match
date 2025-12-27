import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getToken, removeToken } from "./auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Export for manual usage in apiRequest calls if needed
export function normalizeData(data: any): any {
  if (Array.isArray(data)) {
    return data.map(normalizeData);
  }
  if (data && typeof data === 'object') {
    const newData = { ...data };
    if (newData._id) {
      newData.id = newData._id;
    }
    // Fix for Job skills being strings instead of objects
    if (newData.skills && Array.isArray(newData.skills) && typeof newData.skills[0] === 'string') {
      newData.skills = newData.skills.map((s: string, idx: number) => ({
        id: `skill-${idx}-${s}`,
        name: s
      }));
    }

    for (const key in newData) {
      if (typeof newData[key] === 'object' && newData[key] !== null) {
        newData[key] = normalizeData(newData[key]);
      }
    }
    return newData;
  }
  return data;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const token = getToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(queryKey.join("/") as string, {
        credentials: "include",
        headers,
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      return normalizeData(data);
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60000,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export function clearAllQueries() {
  queryClient.clear();
}
