const resolveRealtimeBaseUrl = () => {
  const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!configuredApiBaseUrl) {
    return window.location.origin;
  }

  return configuredApiBaseUrl;
};

const buildRealtimeStreamUrl = (token: string) => {
  const realtimeUrl = new URL("/api/realtime/stream", resolveRealtimeBaseUrl());
  realtimeUrl.searchParams.set("token", token);
  return realtimeUrl.toString();
};

const createRealtimeSource = (token: string) => {
  return new EventSource(buildRealtimeStreamUrl(token));
};

export { buildRealtimeStreamUrl, createRealtimeSource };
