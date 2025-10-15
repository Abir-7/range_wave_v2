export const getRemainingMinutes = (expireTime: Date): number => {
  const now = new Date();
  const remainingMs = expireTime.getTime() - now.getTime();

  if (remainingMs <= 0) return 0; // expired

  // Convert milliseconds to minutes, round up
  return Math.ceil(remainingMs / 1000 / 60);
};
