/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AILogo, BotState } from './components/AILogo';
import { Moon, Sun, MessageSquare, BrainCircuit, Mic, Ear } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [botState, setBotState] = useState<BotState>('idle');

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full transition-colors ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
              : 'bg-white hover:bg-slate-100 text-slate-600 shadow-sm'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="flex flex-col items-center space-y-12">
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          {/* Subtle background glow */}
          <div
            className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-500 ${
              isDark ? 'bg-blue-500' : 'bg-blue-300'
            }`}
          />
          
          {/* The Animated Logo */}
          <AILogo className="relative w-full h-full drop-shadow-2xl" botState={botState} />
        </div>

        <div className="text-center space-y-4 max-w-md px-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Neural <span className="text-blue-500">Core</span>
          </h1>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            A fully animated, scalable vector representation of the AI neural network logo.
          </p>
        </div>

        {/* State Controls */}
        <div className={`flex flex-col items-center gap-4 p-6 rounded-2xl border backdrop-blur-sm ${
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200 shadow-sm'
        }`}>
          <p className={`text-sm font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Test Chatbot States
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setBotState('idle')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                botState === 'idle' 
                  ? 'bg-blue-500/20 text-blue-500 border border-blue-500/50' 
                  : isDark ? 'bg-slate-800 text-slate-300 border border-transparent hover:bg-slate-700' : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
              }`}
            >
              <MessageSquare size={18} />
              Idle
            </button>

            <button
              onClick={() => setBotState('listening')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                botState === 'listening' 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' 
                  : isDark ? 'bg-slate-800 text-slate-300 border border-transparent hover:bg-slate-700' : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
              }`}
            >
              <Ear size={18} />
              Listening
            </button>
            
            <button
              onClick={() => setBotState('thinking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                botState === 'thinking' 
                  ? 'bg-purple-500/20 text-purple-500 border border-purple-500/50' 
                  : isDark ? 'bg-slate-800 text-slate-300 border border-transparent hover:bg-slate-700' : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
              }`}
            >
              <BrainCircuit size={18} />
              Thinking
            </button>
            
            <button
              onClick={() => setBotState('speaking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                botState === 'speaking' 
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50' 
                  : isDark ? 'bg-slate-800 text-slate-300 border border-transparent hover:bg-slate-700' : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
              }`}
            >
              <Mic size={18} />
              Speaking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
