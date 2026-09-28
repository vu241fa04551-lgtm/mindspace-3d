import React from 'react';
import { Compass } from 'lucide-react';

export default function LoadingScreen({ message = 'Loading knowledge universe...' }) {
  return (
    <div className="absolute inset-0 z-50 bg-[#050811] flex flex-col items-center justify-center p-4 text-center select-none animate-in fade-in duration-300">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 animate-pulse">
          <Compass className="w-8 h-8 text-white animate-spin-slow" />
        </div>
        <div className="absolute -inset-2 bg-cyan-500/20 rounded-3xl blur-xl -z-10 animate-pulse" />
      </div>

      <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight mb-1">
        MindSpace 3D
      </h1>
      <p className="text-xs text-slate-400 mb-6 font-medium">
        Interactive Knowledge Universe
      </p>

      {/* Progress spinner bar */}
      <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-3">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full animate-indeterminate" />
      </div>

      <p className="text-xs text-slate-500 font-mono tracking-wide">
        {message}
      </p>
    </div>
  );
}
