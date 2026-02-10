import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { playButtonSound } from '../lib/sounds';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    playButtonSound();
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="
        fixed top-5 right-5 z-50
        p-3 rounded-xl
        glass-card
        border border-white/10
        hover:border-primary/50
        hover:scale-110
        transition-all duration-300
        hover:shadow-neon
        group
      "
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-primary group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
