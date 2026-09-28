import React, { useState, useEffect } from 'react';
import {
  Layers,
  Compass,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react';
import { UNIVERSES, getUniverseById, getNodesByUniverse } from '../data/knowledgeData.js';

export default function Sidebar({
  activeUniverseId,
  setActiveUniverseId,
  selectedCategory,
  setSelectedCategory,
  categories,
  onRecenterRoot,
  onToggleProgressModal,
}) {
  // Default collapsed on mobile viewports for clean 3D focus
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const currentUniverse = getUniverseById(activeUniverseId);
  const universeNodes = getNodesByUniverse(activeUniverseId);

  return (
    <aside
      className={`fixed top-20 left-3 sm:left-4 z-30 transition-all duration-300 ${
        collapsed ? 'w-12' : 'w-72 sm:w-80'
      }`}
      aria-label="Universe Navigation Sidebar"
    >
      <div className="glass-panel rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden p-3 flex flex-col gap-3">
        {/* Toggle Collapse Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          {!collapsed && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Constellation Nav</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors mx-auto"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {!collapsed && (
          <>
            {/* Universe Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Knowledge Domain
              </label>
              <div className="space-y-1">
                {UNIVERSES.map((universe) => {
                  const isActive = universe.id === activeUniverseId;
                  return (
                    <button
                      key={universe.id}
                      onClick={() => setActiveUniverseId(universe.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                        isActive
                          ? 'bg-slate-800/90 text-white border border-slate-700 shadow-sm font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: universe.accentColor }}
                        />
                        <span className="truncate">{universe.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        {universe.nodeCount} nodes
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                  Category Focus
                </span>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-cyan-400 hover:underline text-[10px] font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({universeNodes.length})
                </button>
                {categories.map((cat) => {
                  const count = universeNodes.filter((n) => n.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition-colors whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <button
                onClick={onRecenterRoot}
                className="w-full py-2 px-3 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-1.5 transition-colors font-medium"
              >
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Center on {currentUniverse.name}</span>
              </button>

              <button
                onClick={onToggleProgressModal}
                className="w-full py-2 px-3 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-1.5 transition-colors font-medium"
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Learning Metrics</span>
              </button>
            </div>

            {/* Navigation Guide helper */}
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Orbit:</span> Left-Click + Drag
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Zoom:</span> Scroll Wheel / Pinch
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Pan:</span> Right-Click + Drag
              </div>
            </div>

            {/* Author Credit inside Sidebar */}
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <div className="text-[10px] text-slate-500 font-medium">Developed by</div>
              <div className="font-semibold text-slate-300">M. Jaswanth Sharma</div>
              <div className="text-[10px] text-slate-500 font-mono">Reg. No. 241FA04551</div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
