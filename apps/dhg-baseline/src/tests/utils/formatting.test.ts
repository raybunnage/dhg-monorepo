import { formatDate, formatCurrency, truncateText } from '../../utils/formatting';

describe('Formatting Utilities', () => {
  describe('formatDate', () => {
    it('should format dates correctly', () => {
      // Create a date string that explicitly specifies UTC
      const date = new Date('2024-01-01T00:00:00Z');
      expect(formatDate(date)).toBe('Jan 1, 2024');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency values', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs truncating';
      expect(truncateText(text, 20)).toBe('This is a very long...');
    });
  });
}); 