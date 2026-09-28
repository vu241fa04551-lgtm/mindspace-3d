import React from 'react';
import {
  CheckCircle2,
  Trophy,
  RotateCcw,
  Sparkles,
  Layers,
  Compass,
  X,
  Zap,
} from 'lucide-react';
import { getUniverseById, getNodeById, KNOWLEDGE_NODES } from '../data/knowledgeData.js';

export default function ProgressPanel({
  universeId,
  universeNodes,
  exploredNodeIds,
  onClose,
  onResetProgress,
  onSelectNode,
}) {
  const universe = getUniverseById(universeId);
  const totalInUniverse = universeNodes.length;
  const exploredInUniverse = universeNodes.filter((n) =>
    exploredNodeIds.includes(n.id)
  );
  const percentage =
    totalInUniverse > 0
      ? Math.round((exploredInUniverse.length / totalInUniverse) * 100)
      : 0;

  // Global totals
  const totalGlobal = KNOWLEDGE_NODES.length;
  const exploredGlobal = KNOWLEDGE_NODES.filter((n) =>
    exploredNodeIds.includes(n.id)
  ).length;
  const globalPercentage = Math.round((exploredGlobal / totalGlobal) * 100);

  // Difficulty breakdown in current universe
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const difficultyStats = difficulties.map((diff) => {
    const totalDiff = universeNodes.filter((n) => n.difficulty === diff);
    const exploredDiff = totalDiff.filter((n) => exploredNodeIds.includes(n.id));
    return {
      name: diff,
      total: totalDiff.length,
      explored: exploredDiff.length,
      percent: totalDiff.length > 0 ? Math.round((exploredDiff.length / totalDiff.length) * 100) : 0,
    };
  });

  // Category breakdown in current universe
  const categories = [...new Set(universeNodes.map((n) => n.category))];

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 border border-slate-800/80 shadow-2xl space-y-5 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Learning Metrics & Mastery
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Real-time exploration analytics for {universe?.name || 'Universe'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">
            {universe?.name || 'Universe'} Mastery
          </span>
          <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
            {exploredInUniverse.length} / {totalInUniverse}
            <span className="text-xs text-slate-400 font-normal ml-1.5">
              ({percentage}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">
            All Universes Combined
          </span>
          <div className="text-xl font-bold font-mono text-indigo-300 tabular-nums">
            {exploredGlobal} / {totalGlobal}
            <span className="text-xs text-slate-400 font-normal ml-1.5">
              ({globalPercentage}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${globalPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Difficult Concepts Explored */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Mastery by Difficulty Tier</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {difficultyStats.map((tier) => (
            <div
              key={tier.name}
              className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 text-center space-y-1"
            >
              <span className="text-[11px] text-slate-400 block font-medium">
                {tier.name}
              </span>
              <div className="font-mono text-xs font-bold text-white tabular-nums">
                {tier.explored}/{tier.total}
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                {tier.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Domain Category Breakdown
        </span>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const catNodes = universeNodes.filter((n) => n.category === cat);
            const catExplored = catNodes.filter((n) =>
              exploredNodeIds.includes(n.id)
            ).length;
            const catPercent = Math.round((catExplored / catNodes.length) * 100);

            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="truncate">{cat}</span>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {catExplored}/{catNodes.length} ({catPercent}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${catPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recently Explored in this Universe */}
      {exploredInUniverse.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Mastered Concepts in {universe.name} ({exploredInUniverse.length})
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {exploredInUniverse.map((node) => (
              <button
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[130px]">{node.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset Progress Action */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Persisted locally in browser storage
        </span>
        <button
          onClick={onResetProgress}
          className="text-xs text-rose-400/80 hover:text-rose-300 flex items-center gap-1.5 transition-colors font-medium px-2 py-1 rounded hover:bg-rose-500/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>
    </div>
  );
}
