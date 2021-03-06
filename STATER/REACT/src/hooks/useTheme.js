import { useState, useEffect } from 'react';

export default function useTheme(
  defaultTheme = { mode: 'light', textZoom: 'normal' },
) {
  const [theme, setTheme] = useState(getInitialTheme);
  function getInitialTheme() {
    const localTheme = window.localStorage.getItem('theme');
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches &&
      !localTheme
    ) {
      return { mode: 'dark', textZoom: 'normal' };
    } else {
      return localTheme ? JSON.parse(localTheme) : defaultTheme;
    }
  }

  useEffect(() => {
    window.localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(
      theme.mode === 'dark'
        ? { ...theme, mode: 'light' }
        : { ...theme, mode: 'dark' },
    );
  };
  const toggleSizeMode = () => {
    setTheme(
      theme.textZoom === 'normal'
        ? { ...theme, textZoom: 'magnify' }
        : { ...theme, textZoom: 'normal' },
    );
  };

  return { ...theme, toggleDarkMode, toggleSizeMode };
}

// ex: https://codesandbox.io/s/ecstatic-ptolemy-bez7q
