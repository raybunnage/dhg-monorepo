export const colors = {
  login: {
    background: '#a8d1ff',    // Slightly different blue
    secondary: '#cce3ff',     // Slightly darker blue
    button: {
      background: '#e6e6e6',  // Light gray button
      hover: '#cccccc'        // Darker gray on hover
    }
  }
} as const;

// Type for our colors
export type ThemeColors = typeof colors; 