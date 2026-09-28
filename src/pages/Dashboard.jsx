import React from 'react';
import {
  Compass,
  Trophy,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  BookOpen,
  Network,
  RotateCcw,
  Target,
  Zap,
} from 'lucide-react';
import { UNIVERSES, getNodeById, KNOWLEDGE_NODES, getUniverseById } from '../data/knowledgeData.js';
import AuthorCredit from '../components/AuthorCredit.jsx';

export default function Dashboard({
  activeUniverseId,
  onExploreUniverse,
  exploredNodeIds,
  recentNodeIds,
  selectedNodeId,
  onSelectNodeAndUniverse,
  onResetProgress,
}) {
  const currentUniverse = getUniverseById(activeUniverseId);
  const totalConcepts = KNOWLEDGE_NODES.length;
  const exploredCount = exploredNodeIds.length;
  const overallPercentage = Math.round((exploredCount / totalConcepts) * 100);

  // Last selected concept object
  const lastSelectedNode = selectedNodeId ? getNodeById(selectedNodeId) : null;

  // Curated learning pathways
  const featuredPathways = [
    {
      title: 'From Data to Decision Trees',
      universeId: 'ml',
      targetNodeId: 'ml-decision-tree',
      description: 'Journey through empirical data, classification boundaries, entropy, and recursive tree splits.',
      badgeColor: '#10b981',
      steps: ['Supervised Learning', 'Classification', 'Decision Tree', 'Entropy', 'Information Gain'],
    },
    {
      title: 'The Modern Packet Odyssey',
      universeId: 'networks',
      targetNodeId: 'net-tcp',
      description: 'Trace how data travels across the global internet through TCP sockets and DNS lookup trees.',
      badgeColor: '#6366f1',
      steps: ['OSI Model', 'TCP/IP', 'Transport Layer', 'TCP', 'IP Addressing'],
    },
    {
      title: 'Reactivity & Component State',
      universeId: 'react',
      targetNodeId: 'react-usestate',
      description: 'Explore how components track memory across renders using useState, hooks, and fiber reconciliation.',
      badgeColor: '#06b6d4',
      steps: ['Components', 'State', 'useState', 'useEffect', 'Reconciliation'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Active Knowledge Galaxy · {currentUniverse?.name || 'Universe'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            MindSpace 3D
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            An interactive three-dimensional knowledge exploration engine. Navigate
            interconnected nodes, inspect conceptual relationships, and track learning
            mastery across computer science domains.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onExploreUniverse(activeUniverseId)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center gap-2.5 transition-all active:scale-[0.99]"
            >
              <Compass className="w-4 h-4" />
              <span>Explore {currentUniverse?.name || 'Universe'} in 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span className="font-mono tabular-nums text-white font-semibold">
                {exploredCount}
              </span>
              <span className="text-slate-500">/</span>
              <span className="font-mono tabular-nums text-slate-400">
                {totalConcepts}
              </span>
              <span className="text-slate-400">concepts mastered ({overallPercentage}%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real Application State Metrics Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Universe */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${currentUniverse.accentColor}15`,
              borderColor: `${currentUniverse.accentColor}30`,
              color: currentUniverse.accentColor,
            }}
          >
            <Compass className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {currentUniverse?.name || 'Universe'}
            </div>
            <div className="text-xs text-slate-400 font-medium">Current Active Subject</div>
          </div>
        </div>

        {/* Metric 2: Total Knowledge Nodes */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-white font-mono tabular-nums">
              {totalConcepts}
            </div>
            <div className="text-xs text-slate-400 font-medium">Interconnected Concepts</div>
          </div>
        </div>

        {/* Metric 3: Explored Concepts */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-white font-mono tabular-nums">
              {exploredCount}
            </div>
            <div className="text-xs text-slate-400 font-medium">Mastered in Local Storage</div>
          </div>
        </div>

        {/* Metric 4: Last Selected Concept */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            {lastSelectedNode ? (
              <button
                onClick={() =>
                  onSelectNodeAndUniverse(lastSelectedNode.id, lastSelectedNode.universeId)
                }
                className="text-left group"
              >
                <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {lastSelectedNode.name}
                </div>
                <div className="text-xs text-cyan-400 font-medium flex items-center gap-1">
                  <span>Resume focus</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ) : (
              <div>
                <div className="text-sm font-semibold text-white">None</div>
                <div className="text-xs text-slate-400 font-medium">Select a node in 3D</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subject-Wise Progress Cards (Requirement 1 & 11) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              Subject-Wise Exploration Progress
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live completion status and graph density for all three knowledge domains.
            </p>
          </div>

          <button
            onClick={onResetProgress}
            className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors font-medium p-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
            title="Reset All Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Progress</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {UNIVERSES.map((universe) => {
            const nodes = KNOWLEDGE_NODES.filter((n) => n.universeId === universe.id);
            const explored = nodes.filter((n) => exploredNodeIds.includes(n.id)).length;
            const pct = Math.round((explored / nodes.length) * 100);
            const isCurrent = universe.id === activeUniverseId;

            return (
              <div
                key={universe.id}
                className={`glass-panel rounded-2xl p-6 border transition-all group duration-200 flex flex-col justify-between ${
                  isCurrent
                    ? 'border-cyan-500/50 shadow-cyan-950/30 ring-1 ring-cyan-500/20'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: universe.accentColor,
                          boxShadow: `0 0 10px ${universe.accentColor}`,
                        }}
                      />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        {isCurrent ? 'Active Universe' : 'Available'}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {explored}/{nodes.length} mastered ({pct}%)
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {universe.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[3rem]">
                    {universe.tagline}
                  </p>

                  {/* Progress bar inside card */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: universe.accentColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Categories preview */}
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                    {universe.categoryBreakdown.map((cat) => (
                      <span
                        key={cat}
                        className="bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800/60"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    {nodes.length} nodes
                  </span>
                  <button
                    onClick={() => onExploreUniverse(universe.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-cyan-500/50 flex items-center gap-1.5 transition-all group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-transparent"
                  >
                    <span>Launch 3D Universe</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Deep Dive Pathways */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Curated Constellation Trajectories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Follow conceptual sequences designed to build deep foundational intuition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPathways.map((path, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider block"
                  style={{ color: path.badgeColor }}
                >
                  Learning Trajectory
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  {path.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {path.description}
                </p>

                {/* Steps chain */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                  {path.steps.map((step, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <span className="bg-slate-900 px-2 py-0.5 rounded text-[11px] border border-slate-800 text-slate-300">
                        {step}
                      </span>
                      {sIdx < path.steps.length - 1 && (
                        <span className="text-slate-600 text-xs">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  onSelectNodeAndUniverse(path.targetNodeId, path.universeId)
                }
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Jump into Trajectory in 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Explored Concepts */}
      {recentNodeIds && recentNodeIds.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Recently Visited Concepts</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {recentNodeIds.map((id) => {
              const node = getNodeById(id);
              if (!node) return null;
              const isExp = exploredNodeIds.includes(node.id);
              return (
                <button
                  key={id}
                  onClick={() => onSelectNodeAndUniverse(node.id, node.universeId)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white flex items-center gap-2 transition-all"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: node.color || '#06b6d4' }}
                  />
                  <span>{node.name}</span>
                  {isExp && (
                    <span className="text-emerald-400 text-[10px] font-mono">✓</span>
                  )}
                  <span className="text-slate-600 text-[10px]">·</span>
                  <span className="text-slate-500 text-[10px]">{node.category}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Professional Developer Signature */}
      <AuthorCredit variant="dashboard" />
    </div>
  );
}
