export const isOnProduction = (): boolean => {
  const hostname: string = window.location.hostname;
  return hostname !== "localhost";
};

export const getApiBaseUrl = (): string => {
  if (isOnProduction()) {
    // Production avec HTTPS via nginx reverse proxy
    return "https://ndecrolympe.duckdns.org/api";
  } else {
    // En développement local, utiliser IP locale
    return "http://192.168.1.56:8800/api";
  }
};
