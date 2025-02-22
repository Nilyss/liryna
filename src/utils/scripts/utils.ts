export const isOnProduction = (): boolean => {
  const hostname: string = window.location.hostname;
  return hostname !== "localhost";
};
