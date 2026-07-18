import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { useUIStore } from '@/app/store';

const THEME_ATTRIBUTE = 'data-theme';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  }, [theme]);

  return children;
};
