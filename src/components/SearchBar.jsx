import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Compass, ArrowRight } from 'lucide-react';
import { searchNodes, UNIVERSES } from '../data/knowledgeData.js';

export default function SearchBar({
  isOpen,
  onClose,
  onSelectNode,
  currentUniverseId,
}) {
  const [query, setQuery] = useState('');
  const [filterUniverse, setFilterUniverse] = useState(currentUniverseId || 'all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Sync universe filter when prop changes
  useEffect(() => {
    if (currentUniverseId) {
      setFilterUniverse(currentUniverseId);
    }
  }, [currentUniverseId]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const targetUniverse = filterUniverse === 'all' ? null : filterUniverse;
  const results = searchNodes(query, targetUniverse);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, filterUniverse]);

  // Keyboard shortcut listener (ESC to close, Arrow keys to navigate, Enter to select)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        const selected = results[selectedIndex] || results[0];
        if (selected) {
          onSelectNode(selected.id, selected.universeId);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex, onSelectNode]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts across knowledge cosmos (e.g. Decision Tree, OSI, Hooks, K-Means)..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Universe Scope Filter Buttons */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 text-xs overflow-x-auto">
          <span className="text-slate-500 mr-1 shrink-0">Scope:</span>
          <button
            onClick={() => setFilterUniverse('all')}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
              filterUniverse === 'all'
                ? 'bg-slate-800 text-white font-medium border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Universes
          </button>
          {UNIVERSES.map((u) => (
            <button
              key={u.id}
              onClick={() => setFilterUniverse(u.id)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterUniverse === u.id
                  ? 'bg-slate-800 text-white font-medium border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: u.accentColor }}
              />
              {u.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-1">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-500 text-xs space-y-1">
              <Compass className="w-8 h-8 text-slate-700 mx-auto mb-2 animate-subtle-pulse" />
              <p className="font-medium text-slate-400">Type a concept name, category, or keyword</p>
              <p className="text-[11px] text-slate-600">Use ↑ ↓ arrows to navigate and Enter to select</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No concepts matching &quot;{query}&quot; found in this scope.
            </div>
          ) : (
            results.map((node, index) => {
              const universe = UNIVERSES.find((u) => u.id === node.universeId);
              const isHighlightedItem = index === selectedIndex;

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node.id, node.universeId);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                    isHighlightedItem
                      ? 'bg-slate-800/90 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: node.color || '#06b6d4' }}
                      />
                      <span
                        className={`font-semibold transition-colors ${
                          isHighlightedItem ? 'text-cyan-300' : 'text-white'
                        }`}
                      >
                        {node.name}
                      </span>
                      <span className="text-slate-600 font-medium">·</span>
                      <span className="text-slate-400">{node.category}</span>
                      <span className="text-slate-600 font-medium">·</span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {universe?.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {node.shortDesc}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-xs shrink-0 transition-colors ${
                      isHighlightedItem ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'
                    }`}
                  >
                    <span className="hidden sm:inline text-[11px]">Focus node</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
