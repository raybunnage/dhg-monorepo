export const formatDate = (date: Date): string => {
  // Force specific timezone for consistent testing
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  // Find the last complete word that fits
  const words = text.slice(0, maxLength).split(' ');
  words.pop(); // Remove last (potentially partial) word
  const endIndex = words.join(' ').length;
  return text.slice(0, endIndex) + '...';
}; 