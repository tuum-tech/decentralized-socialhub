export const themeColors = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'light',
  'medium',
  'dark'
] as const;
export type ThemeColor = typeof themeColors[number];

export const themeGradients = [
  'primary-gradient',
  'secondary-gradient',
  'main-green-gradient',
  'main-logo-gradient',
  'main-dark-gradient',
  'light-gradient'
];
export type ThemeGradient = typeof themeGradients[number];
