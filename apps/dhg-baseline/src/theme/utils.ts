import { colors } from './colors';

export const theme = {
  bg: (color: keyof typeof colors.login) => `bg-login-${color}`,
  text: (color: keyof typeof colors.login) => `text-login-${color}`,
  border: (color: keyof typeof colors.login) => `border-login-${color}`,
} as const; 