import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { CallStatus } from '../types';

interface HeaderProps {
  status: CallStatus['status'];
  latency: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ status, latency, isDarkMode, onToggleTheme }) => {
  const isOnline = status === 'active';

  return (
    <header className="flex justify-between items-center px-8 py-6 border-b border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm fixed w-full z-10 top-0 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-widest text-sm text-gray-500 dark:text-gray-400 uppercase transition-colors">
          Voice Assistant
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Latency Meter */}
        {isOnline && (
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 dark:text-gray-500 transition-colors">
            <span className={`w-2 h-2 rounded-full ${latency < 200 ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            {latency}ms
          </div>
        )}

        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          isOnline 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={onToggleTheme}
          className="text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};