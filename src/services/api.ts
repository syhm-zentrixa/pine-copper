const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
export async function api<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${base}/api/${path}`, { signal });
  const data = await response.json().catch(() => null);
  if (!response.ok || data === null)
    throw new Error(data?.error || 'Không tải được nội dung. Vui lòng thử lại.');
  return data as T;
}
export const mediaUrl = (url: string) => (url.startsWith('/api/') ? `${base}${url}` : url);
