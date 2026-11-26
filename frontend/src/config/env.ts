const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

const env = {
  apiBaseUrl,
} as const;

export default env;
