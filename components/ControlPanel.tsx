import React from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { VOICES } from '../constants';
import { CallStatus } from '../types';
import { VoicePicker } from './VoicePicker';

interface ControlPanelProps {
  status: CallStatus['status'];
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  onToggleCall: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  status,
  selectedVoice,
  onVoiceChange,
  onToggleCall,
}) => {
  const isLoading = status === 'loading';
  const isActive = status === 'active';

  return (
    <div className="fixed bottom-[20%] sm:bottom-[27%] left-0 w-full pb-2 pt-2 transition-colors duration-300 flex flex-col items-center justify-center gap-2 z-10">
      
      {/* Voice Selector - Only visible when not active to prevent switching during call */}
      <div className={`transition-all duration-300 w-full max-w-[280px] sm:max-w-xs px-4 ${isActive ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <VoicePicker 
          voices={VOICES}
          value={selectedVoice}
          onValueChange={onVoiceChange}
          disabled={isActive}
        />
      </div>

      {/* Main Action Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onToggleCall}
          disabled={isLoading}
          className={`
            relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
            ${isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200'}
            ${isLoading ? 'cursor-wait opacity-80' : ''}
          `}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : isActive ? (
            <Phone size={20} className="sm:w-6 sm:h-6 rotate-135" />
          ) : (
             <Phone size={20} className="sm:w-6 sm:h-6" />
          )}
        </button>

        <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-gray-400 dark:text-zinc-500 uppercase transition-colors duration-300 text-center px-2">
          {isLoading ? 'Connecting...' : isActive ? 'End Call' : 'Start Call'}
        </span>
      </div>
    </div>
  );
};