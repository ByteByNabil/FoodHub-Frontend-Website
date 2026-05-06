function normalizeUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  const configuredUrl = 
    process.env.NEXT_PUBLIC_BACKEND_URL || 
    process.env.NEXT_PUBLIC_API_URL || 
    "https://food-hub-backend-server.vercel.app";

  if (configuredUrl) {
    return normalizeUrl(configuredUrl);
  }

  return "";
}

export const API_BASE_URL = getApiBaseUrl();
