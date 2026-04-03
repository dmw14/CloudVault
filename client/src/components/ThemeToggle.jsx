import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cn_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cn_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cn_theme', 'light');
    }
  }, [isDark]);


  return (
    <button
      id="theme-toggle"
      onClick={() => setIsDark(!isDark)}
      className="relative p-2 rounded-xl transition-colors duration-200 cursor-pointer
        hover:bg-surface-200 dark:hover:bg-surface-800"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: [1, 0.8, 1] }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon size={20} className="text-surface-400" />
        ) : (
          <Sun size={20} className="text-surface-600" />
        )}
      </motion.div>
    </button>
  );
}
