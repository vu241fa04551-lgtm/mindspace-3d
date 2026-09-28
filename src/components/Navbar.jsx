import React from 'react';
import { Compass, Search, RotateCcw, CheckCircle2, RefreshCw } from 'lucide-react';
import { UNIVERSES } from '../data/knowledgeData.js';

export default function Navbar({
  activeView,
  setActiveView,
  activeUniverseId,
  setActiveUniverseId,
  exploredCount,
  totalNodes,
  onOpenSearch,
  onResetCamera,
  onResetProgress,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between">
      {/* Zone 1: Single text element wordmark with glowing icon */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <Compass className="w-4 h-4 text-white animate-spin-slow" />
          </div>
          <div>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              MindSpace 3D
            </span>
          </div>
        </button>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveView('universe')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-colors ${
              activeView === 'universe'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Universe
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-colors ${
              activeView === 'dashboard'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Zone 2: Subject Switcher Buttons (Requirement 1: Real subject switching) */}
      <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-lg border border-slate-800/80">
        {UNIVERSES.map((universe) => {
          const isActive = universe.id === activeUniverseId;
          return (
            <button
              key={universe.id}
              onClick={() => {
                setActiveUniverseId(universe.id);
                if (activeView !== 'universe') setActiveView('universe');
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: universe.accentColor }}
              />
              <span>{universe.name}</span>
            </button>
          );
        })}
      </div>

      {/* Zone 3: Actions & Progress Counter */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-slate-300 bg-slate-900/90 hover:bg-slate-800/90 rounded-lg border border-slate-800 transition-colors"
          title="Search knowledge universe (Press /)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            /
          </kbd>
        </button>

        {/* Explored Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 rounded-lg border border-slate-800/70 text-xs text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono tabular-nums text-slate-100 font-semibold">
            {exploredCount}
          </span>
          <span className="text-slate-500">/</span>
          <span className="font-mono tabular-nums text-slate-400">
            {totalNodes}
          </span>
          <span className="text-slate-500 ml-0.5 hidden xl:inline">explored</span>
        </div>

        {/* Reset Camera button (only in 3D universe view) */}
        {activeView === 'universe' && onResetCamera && (
          <button
            onClick={onResetCamera}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
            title="Reset Camera (Press R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Reset Progress Button (Requirement 13: Confirmation then clear) */}
        <button
          onClick={onResetProgress}
          className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
          title="Reset All Progress & History"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
