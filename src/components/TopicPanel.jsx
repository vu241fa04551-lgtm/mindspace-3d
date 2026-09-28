import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Network,
  BookOpen,
} from 'lucide-react';
import { getNodeById } from '../data/knowledgeData.js';

export default function TopicPanel({
  node,
  isExplored,
  onClose,
  onExploreConcept,
  onToggleExplored,
  onSelectNode,
}) {
  const [justExplored, setJustExplored] = useState(false);

  // Reset feedback state when node changes
  useEffect(() => {
    setJustExplored(false);
  }, [node?.id]);

  if (!node) return null;

  // Resolve related concepts to actual node objects
  const relatedNodes = (node.relatedIds || [])
    .map((id) => getNodeById(id))
    .filter(Boolean);

  const difficultyColors = {
    Beginner: 'text-emerald-400',
    Intermediate: 'text-amber-400',
    Advanced: 'text-rose-400',
  };

  const handleExploreClick = () => {
    onExploreConcept(node.id);
    setJustExplored(true);
    setTimeout(() => {
      setJustExplored(false);
    }, 2400);
  };

  return (
    <aside
      className="w-full md:w-96 max-h-[calc(100vh-6rem)] overflow-y-auto glass-panel rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3.5 text-slate-200 border border-slate-700/60 z-30 transition-all duration-300"
      aria-label="Concept Details Panel"
    >
      {/* Top Header: Unboxed metadata + Close Button */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          {/* Zero-Pill Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>{node.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className={difficultyColors[node.difficulty] || 'text-cyan-400'}>
              {node.difficulty}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Network className="w-3 h-3 text-cyan-400" />
              <span className="font-mono tabular-nums">{relatedNodes.length}</span> connected
            </span>
          </div>

          <h2 className="text-xl font-display font-bold text-white mt-1 tracking-tight flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm"
              style={{
                backgroundColor: node.color || '#06b6d4',
                boxShadow: `0 0 8px ${node.color || '#06b6d4'}`,
              }}
            />
            {node.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors shrink-0"
          title="Close panel (Press Escape)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Short Summary Description */}
      <p className="text-sm text-slate-300 leading-relaxed font-normal">
        {node.shortDesc}
      </p>

      {/* Extended Conceptual Overview */}
      <div className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
        <span className="text-slate-300 font-semibold block mb-1">Conceptual Deep Dive</span>
        {node.description}
      </div>

      {/* Key Takeaways */}
      {node.keyTakeaways && node.keyTakeaways.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Key Takeaways
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {node.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span className="leading-snug">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Real-World Application */}
      {node.realWorldUse && (
        <div className="text-xs bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50">
          <span className="font-semibold text-slate-300 block mb-0.5">Real-World Application</span>
          <span className="text-slate-400">{node.realWorldUse}</span>
        </div>
      )}

      {/* Related Concepts (Clickable buttons) */}
      <div className="space-y-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Connected Concepts ({relatedNodes.length})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Click to navigate</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
          {relatedNodes.map((relNode) => (
            <button
              key={relNode.id}
              onClick={() => onSelectNode(relNode.id)}
              className="flex items-center justify-between px-3 py-2 text-xs rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/40 text-slate-200 hover:text-white transition-all text-left group"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: relNode.color || '#06b6d4' }}
                />
                <span className="truncate">{relNode.name}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons: Explore Concept & Mastery Toggle */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80 mt-auto">
        <button
          onClick={handleExploreClick}
          className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
            justExplored
              ? 'bg-emerald-600 text-white shadow-emerald-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40'
          }`}
        >
          {justExplored ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Explored & Trajectory Updated ✓</span>
            </>
          ) : isExplored ? (
            <>
              <Compass className="w-4 h-4" />
              <span>Center & Re-Explore Concept</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              <span>Explore Concept in 3D</span>
            </>
          )}
        </button>

        <button
          onClick={() => onToggleExplored(node.id)}
          className={`w-full py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-2 transition-all ${
            isExplored
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          {isExplored ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mastered & Explored</span>
            </>
          ) : (
            <>
              <Circle className="w-3.5 h-3.5 text-slate-500" />
              <span>Mark as Explored</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
