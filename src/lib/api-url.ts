function normalizeUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  // In production (Vercel), we MUST use the proxy (/api/...) 
  // to avoid cross-domain cookie blocking issues.
  if (process.env.NODE_ENV === "production") {
    return "";
  }

  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (configuredUrl) {
    return normalizeUrl(configuredUrl);
  }

  return "";
}

export const API_BASE_URL = getApiBaseUrl();
