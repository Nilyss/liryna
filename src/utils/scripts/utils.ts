export const isOnProduction = (): boolean => {
  const hostname: string = window.location.hostname;
  return hostname !== "localhost";
};

export const getApiBaseUrl = (): string => {
  if (isOnProduction()) {
    // En production (Vercel), utiliser DuckDNS
    return "http://ndecrolympe.duckdns.org:8800/api";
  } else {
    // En développement local, utiliser IP locale
    return "http://192.168.1.56:8800/api";
  }
};
