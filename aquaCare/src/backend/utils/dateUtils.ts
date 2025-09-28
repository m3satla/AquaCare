/**
 * Date utility functions to handle timezone issues consistently
 */

/**
 * Get today's date in local timezone as YYYY-MM-DD string
 * Avoids UTC conversion issues that cause "yesterday" dates
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get date string from Date object in local timezone
 * @param date - Date object to format
 * @returns YYYY-MM-DD string in local timezone
 */
export const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get start of day (00:00:00.000) for a given date
 * @param date - Date object (optional, defaults to today)
 * @returns Date object set to start of day
 */
export const getStartOfDay = (date: Date = new Date()): Date => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * Get end of day (23:59:59.999) for a given date
 * @param date - Date object (optional, defaults to today)
 * @returns Date object set to end of day
 */
export const getEndOfDay = (date: Date = new Date()): Date => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

/**
 * Get date range for today (start and end of day)
 * @returns Object with startOfDay and endOfDay Date objects
 */
export const getTodayRange = () => {
  const today = new Date();
  return {
    startOfDay: getStartOfDay(today),
    endOfDay: getEndOfDay(today)
  };
};

/**
 * Compare two dates ignoring time (only date part)
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return getDateString(date1) === getDateString(date2);
};

/**
 * Parse date string in local timezone (avoids UTC issues)
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in local timezone
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Debug function to show timezone information
 * @param date - Date to debug (optional, defaults to now)
 */
export const debugTimezone = (date: Date = new Date()) => {
  console.log('🕐 Timezone Debug:');
  console.log('  Local date string:', getDateString(date));
  console.log('  UTC date string:', date.toISOString().split('T')[0]);
  console.log('  Timezone offset (minutes):', date.getTimezoneOffset());
  console.log('  Local time:', date.toLocaleString());
  console.log('  UTC time:', date.toISOString());
}; 