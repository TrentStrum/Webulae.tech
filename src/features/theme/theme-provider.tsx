import { useUser } from '@clerk/nextjs';
import { createContext, useContext, useEffect } from 'react';

import { useUpdatePreferences } from '@/src/hooks/react-query/mutations/use-update-preferences';

type Theme = 'light' | 'dark' | 'system';

interface UserPreferences {
  theme: Theme;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { user } = useUser();
  const updatePreferences = useUpdatePreferences();
  const theme = (user?.publicMetadata.preferences as UserPreferences)?.theme || 'system';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = async (newTheme: Theme): Promise<void> => {
    await updatePreferences.mutateAsync({
      theme: newTheme,
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}; 