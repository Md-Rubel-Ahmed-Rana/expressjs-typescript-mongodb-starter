/**
 * Converts minutes to milliseconds.
 * @param minutes - Number of minutes (default: 1)
 * @returns Equivalent milliseconds
 */
export const generateMSfromMinutes = (minutes: number = 1): number => {
  return minutes * 60 * 1000;
};
