// src/components/theme/theme-switcher.tsx
'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label="テーマ切り替え"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      ) : (
        <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
}