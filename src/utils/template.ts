import { themeData } from 'src/data/theme';

export const getThemeData = (
  template: string,
  component: string,
  style: string
) => {
  if (
    (themeData as any)[template] &&
    (themeData as any)[template][component] &&
    (themeData as any)[template][component][style]
  ) {
    return (themeData as any)[template][component][style];
  }
  return (themeData as any)['default'][component][style];
};
