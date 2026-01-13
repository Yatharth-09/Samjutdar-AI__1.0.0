'use client';

import { useState, useEffect } from 'react';
import { getDarkMode, saveDarkMode } from '@/lib/storage';

/**
 * Custom hook for dark mode management
 * Persisted to localStorage
 */

export function useDarkMode(): [boolean, (isDark: boolean) => void] {
  const [isDark, setIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    const saved = getDarkMode();
    setIsDark(saved);

    // Update document class for Tailwind dark mode
    document.documentElement.classList.toggle('dark', saved);
    document.documentElement.classList.toggle('light', !saved);
  }, []);

  const toggleDarkMode = (isDarkMode: boolean) => {
    setIsDark(isDarkMode);
    saveDarkMode(isDarkMode);

    // Update document class
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.classList.toggle('light', !isDarkMode);
  };

  return [isDark, toggleDarkMode];
}
