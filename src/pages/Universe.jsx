import React, { useState, useEffect } from 'react';
import {
  Compass,
  RotateCcw,
  Target,
  BarChart3,
  X,
} from 'lucide-react';
import KnowledgeScene from '../components/KnowledgeScene.jsx';
import TopicPanel from '../components/TopicPanel.jsx';
import Sidebar from '../components/Sidebar.jsx';
import JourneyTrail from '../components/JourneyTrail.jsx';
import ProgressPanel from '../components/ProgressPanel.jsx';
import AuthorCredit from '../components/AuthorCredit.jsx';
import {
  getUniverseById,
  getNodesByUniverse,
  getEdgesByUniverse,
  getNodeById,
} from '../data/knowledgeData.js';

export default function Universe({
  activeUniverseId,
  setActiveUniverseId,
  selectedNodeId,
  setSelectedNodeId,
  focusedNodeId,
  setFocusedNodeId,
  exploredNodeIds,
  onExploreConcept,
  onToggleExplored,
  journeyTrail,
  onResetTrail,
  onResetProgress,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [cameraResetTrigger, setCameraResetTrigger] = useState(0);

  // Subtle first-time user guide (Requirement 8)
  const [showHint, setShowHint] = useState(() => {
    try {
      return !sessionStorage.getItem('mindspace_hint_dismissed');
    } catch {
      return true;
    }
  });

  const universe = getUniverseById(activeUniverseId);
  const allUniverseNodes = getNodesByUniverse(activeUniverseId);
  const allUniverseEdges = getEdgesByUniverse(activeUniverseId);

  // Compute unique categories in this universe
  const categories = [...new Set(allUniverseNodes.map((n) => n.category))];

  // Currently selected node object
  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : null;

  // Auto-dismiss first-time hint after 8 seconds
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => {
        dismissHint();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  const dismissHint = () => {
    setShowHint(false);
    try {
      sessionStorage.setItem('mindspace_hint_dismissed', 'true');
    } catch {}
  };

  // Reset category filter if universe changes
  useEffect(() => {
    setSelectedCategory('all');
  }, [activeUniverseId]);

  const handleSelectNode = (id) => {
    dismissHint();
    setSelectedNodeId(id);
    setFocusedNodeId(id);
  };

  const handleRecenterRoot = () => {
    dismissHint();
    if (universe && universe.rootId) {
      setFocusedNodeId(universe.rootId);
      setSelectedNodeId(universe.rootId);
      setCameraResetTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050811]">
      {/* 3D Knowledge Universe Viewport */}
      <div className="absolute inset-0 pt-16">
        <KnowledgeScene
          nodes={allUniverseNodes}
          edges={allUniverseEdges}
          selectedNodeId={selectedNodeId}
          focusedNodeId={focusedNodeId}
          exploredNodeIds={exploredNodeIds}
          selectedCategory={selectedCategory}
          onSelectNode={handleSelectNode}
          onBackgroundClick={() => setSelectedNodeId(null)}
          cameraResetTrigger={cameraResetTrigger}
        />
      </div>

      {/* Subtle First-Time User Experience Hint Banner (Requirement 8) */}
      {showHint && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel-subtle border border-cyan-500/30 text-xs text-cyan-200 shadow-xl shadow-cyan-950/40 animate-in fade-in slide-in-from-top-2 duration-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Drag to explore 3D · Scroll to zoom · Click any concept to inspect</span>
            <button
              onClick={dismissHint}
              className="p-0.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors ml-1"
              aria-label="Dismiss guide"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating HUD: Universe Nav Sidebar (Left) */}
      <Sidebar
        activeUniverseId={activeUniverseId}
        setActiveUniverseId={(id) => {
          setActiveUniverseId(id);
          setSelectedCategory('all');
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onRecenterRoot={handleRecenterRoot}
        onToggleProgressModal={() => setShowProgressModal(!showProgressModal)}
      />

      {/* Floating HUD: Concept Inspector Panel (Right on Desktop, Bottom Sheet on Mobile) */}
      {selectedNode && (
        <div className="fixed bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:top-20 md:right-4 z-30 max-h-[75vh] md:max-h-[calc(100vh-6rem)] max-w-full md:max-w-md animate-in slide-in-from-bottom-6 md:slide-in-from-right-8 duration-200">
          <TopicPanel
            node={selectedNode}
            isExplored={exploredNodeIds.includes(selectedNode.id)}
            onClose={() => setSelectedNodeId(null)}
            onExploreConcept={onExploreConcept}
            onToggleExplored={onToggleExplored}
            onSelectNode={handleSelectNode}
          />
        </div>
      )}

      {/* Floating HUD: Bottom Trajectory Breadcrumbs */}
      <div className="fixed bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[92vw]">
        <JourneyTrail
          trailIds={journeyTrail}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          onResetTrail={onResetTrail}
        />
      </div>

      {/* Floating Bottom-Right Camera Helper Controls */}
      <div className="fixed bottom-3 right-3 md:bottom-4 md:right-4 z-20 flex items-center gap-2">
        <button
          onClick={handleRecenterRoot}
          className="p-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 backdrop-blur-md shadow-lg transition-all"
          title={`Center on ${universe?.name || 'Universe'}`}
        >
          <Target className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          onClick={() => setCameraResetTrigger((prev) => prev + 1)}
          className="p-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 backdrop-blur-md shadow-lg transition-all"
          title="Reset Camera View (Press R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress & Metrics Modal */}
      {showProgressModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowProgressModal(false)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ProgressPanel
              universeId={activeUniverseId}
              universeNodes={allUniverseNodes}
              exploredNodeIds={exploredNodeIds}
              onClose={() => setShowProgressModal(false)}
              onResetProgress={onResetProgress}
              onSelectNode={(id) => {
                handleSelectNode(id);
                setShowProgressModal(false);
              }}
            />
          </div>
        </div>
      )}
      {/* Compact Bottom-Left Author Credit */}
      <AuthorCredit variant="universe" />
    </div>
  );
}
