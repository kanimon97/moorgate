import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Orb, AgentState } from './components/Orb';
import { ControlPanel } from './components/ControlPanel';
import { useVapi } from './hooks/useVapi';
import { DEFAULT_VOICE_ID } from './constants';

function App() {
  const { volumeLevel, callStatus, conversationState, toggleCall } = useVapi();
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICE_ID);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggle = () => {
    toggleCall(selectedVoice);
  };

  // Map our hook's conversation state to the Orb's expected AgentState
  // 'inactive' from hook maps to null for Orb
  const agentState: AgentState = conversationState === 'inactive' ? null : conversationState;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 text-slate-900 dark:text-slate-100 overflow-hidden flex flex-col font-sans selection:bg-gray-200 dark:selection:bg-zinc-800 transition-colors duration-300">
      
      <Header 
        status={callStatus} 
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-grow flex flex-col items-center justify-center relative -mt-20">
        <div className="w-full h-[600px] relative z-0 flex items-center justify-center">
          <Orb 
            agentState={agentState} 
            volumeMode="manual" 
            manualInput={conversationState === 'listening' ? volumeLevel : 0}
            manualOutput={conversationState === 'talking' ? volumeLevel : 0}
          />
        </div>

        {/* Status Text */}
        <div className="absolute top-[75%] text-center text-sm text-gray-400 dark:text-gray-500 font-light tracking-wide h-6 transition-colors duration-300">
           {callStatus === 'active' && (
             <span className="animate-pulse">
               {conversationState === 'listening' ? 'Listening...' : 
                conversationState === 'talking' ? 'Speaking...' : 
                conversationState === 'thinking' ? 'Thinking...' : ''}
             </span>
           )}
           {callStatus === 'loading' && <span>Connecting...</span>}
        </div>
      </main>

      <ControlPanel 
        status={callStatus}
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
        onToggleCall={handleToggle}
      />
      
    </div>
  );
}

export default App;