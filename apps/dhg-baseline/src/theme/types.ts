import { colors } from './colors';

export type ThemeColor = keyof typeof colors;
export type LoginThemeColor = keyof typeof colors.login;

export interface ThemeProps {
  color?: ThemeColor;
  variant?: 'primary' | 'secondary';
} 