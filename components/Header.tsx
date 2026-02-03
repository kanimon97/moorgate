import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { CallStatus } from '../types';

interface HeaderProps {
  status: CallStatus['status'];
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ status, isDarkMode, onToggleTheme }) => {
  const isOnline = status === 'active';

  return (
    <header className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm fixed w-full z-10 top-0 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-widest text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase transition-colors">
          Voice Assistant
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-colors ${
          isOnline 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400'
        }`}>
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={onToggleTheme}
          className="text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors p-1"
        >
          {isDarkMode ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </button>
      </div>
    </header>
  );
};