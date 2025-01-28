/**
 * Formats a date into a readable string
 * @param date The date to format
 * @returns Formatted date string (e.g., "Jan 1, 2024")
 */
export const formatDate = (date: Date): string => {
  // Create a new date that accounts for timezone offset
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  
  return utcDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'  // Explicitly use UTC
  });
};

/**
 * Formats a number as USD currency
 * @param amount The amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}; 