import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import SearchBar from './components/SearchBar.jsx';
import ResetConfirmModal from './components/ResetConfirmModal.jsx';
import Universe from './pages/Universe.jsx';
import Dashboard from './pages/Dashboard.jsx';
import {
  UNIVERSES,
  KNOWLEDGE_NODES,
  getUniverseById,
  getNodeById,
} from './data/knowledgeData.js';

const STORAGE_KEY_EXPLORED = 'mindspace_explored_nodes_v2';
const STORAGE_KEY_RECENT = 'mindspace_recent_nodes_v2';
const STORAGE_KEY_UNIVERSE = 'mindspace_active_universe_v2';
const STORAGE_KEY_SELECTED = 'mindspace_selected_node_v2';
const STORAGE_KEY_TRAIL = 'mindspace_journey_trail_v2';

export default function App() {
  // Navigation View: 'universe' | 'dashboard'
  const [activeView, setActiveView] = useState('universe');

  // Active Subject Universe ID: 'ml' | 'networks' | 'react'
  const [activeUniverseId, setActiveUniverseId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_UNIVERSE) || 'ml';
    } catch {
      return 'ml';
    }
  });

  // Selected & Focused Concept IDs
  const [selectedNodeId, setSelectedNodeId] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SELECTED);
      if (stored && getNodeById(stored)) return stored;
    } catch {}
    return 'ml-root';
  });

  const [focusedNodeId, setFocusedNodeId] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SELECTED);
      if (stored && getNodeById(stored)) return stored;
    } catch {}
    return 'ml-root';
  });

  // Traversal Trail Breadcrumb
  const [journeyTrail, setJourneyTrail] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TRAIL);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['ml-root'];
  });

  // Explored & Recent Concepts Persistence
  const [exploredNodeIds, setExploredNodeIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXPLORED);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['ml-root'];
  });

  const [recentNodeIds, setRecentNodeIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECENT);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['ml-root', 'ml-supervised', 'ml-decision-tree'];
  });

  // Search Dialog State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // In-app Reset Confirmation Modal State (replaces iframe-blocked window.confirm)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Camera Reset Trigger Counter
  const [cameraResetCounter, setCameraResetCounter] = useState(0);

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_UNIVERSE, activeUniverseId);
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }, [activeUniverseId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED, selectedNodeId || '');
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }, [selectedNodeId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRAIL, JSON.stringify(journeyTrail));
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }, [journeyTrail]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPLORED, JSON.stringify(exploredNodeIds));
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }, [exploredNodeIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recentNodeIds));
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }, [recentNodeIds]);

  // Global keyboard shortcuts (Requirement 14: '/', 'Escape', 'R')
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

      // '/' to focus search
      if (e.key === '/' && !isSearchOpen && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      }

      // 'Escape' to close search or close open topic panel
      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        } else if (selectedNodeId) {
          setSelectedNodeId(null);
        }
      }

      // 'r' or 'R' to reset camera orientation
      if ((e.key === 'r' || e.key === 'R') && !isInput && activeView === 'universe') {
        e.preventDefault();
        setCameraResetCounter((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, selectedNodeId, activeView]);

  // Real Subject Switching (Requirement 1)
  const handleUniverseChange = (universeId) => {
    setActiveUniverseId(universeId);
    const universe = getUniverseById(universeId);
    if (universe && universe.rootId) {
      setSelectedNodeId(universe.rootId);
      setFocusedNodeId(universe.rootId);
      setJourneyTrail([universe.rootId]);
      setRecentNodeIds((prev) => [universe.rootId, ...prev.filter((id) => id !== universe.rootId)].slice(0, 10));
    }
  };

  // Select node from search, pathways, or cards
  const handleSelectNodeAndUniverse = (nodeId, universeId) => {
    if (universeId && universeId !== activeUniverseId) {
      setActiveUniverseId(universeId);
    }
    setSelectedNodeId(nodeId);
    setFocusedNodeId(nodeId);
    setActiveView('universe');

    // Add to recent list
    setRecentNodeIds((prev) => [nodeId, ...prev.filter((id) => id !== nodeId)].slice(0, 10));

    // Update trail
    setJourneyTrail((prev) => {
      if (prev[prev.length - 1] === nodeId) return prev;
      return [...prev, nodeId];
    });
  };

  // Real Explore Concept Action (Requirement 5)
  const handleExploreConcept = (nodeId) => {
    const node = getNodeById(nodeId);
    if (!node) return;

    // 1. Center camera on that concept
    setFocusedNodeId(nodeId);
    setSelectedNodeId(nodeId);

    // 2. Mark concept as explored & update progress
    setExploredNodeIds((prev) => {
      if (prev.includes(nodeId)) return prev;
      return [...prev, nodeId];
    });

    // 3. Add to journey trail
    setJourneyTrail((prev) => {
      if (prev[prev.length - 1] === nodeId) return prev;
      return [...prev, nodeId];
    });

    // 4. Add to recent
    setRecentNodeIds((prev) => [nodeId, ...prev.filter((id) => id !== nodeId)].slice(0, 10));
  };

  // Toggle explored status directly
  const handleToggleExplored = (nodeId) => {
    setExploredNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  // Reset journey trail
  const handleResetTrail = () => {
    const universe = getUniverseById(activeUniverseId);
    setJourneyTrail(universe && universe.rootId ? [universe.rootId] : []);
  };

  // Reset All Progress (Requirement 13: Zero window.confirm, 100% iframe-safe in-app modal)
  const handleOpenResetConfirm = () => {
    setIsResetConfirmOpen(true);
  };

  const handleExecuteResetProgress = () => {
    const defaultUniverse = getUniverseById('ml');
    const root = defaultUniverse.rootId;

    setActiveUniverseId('ml');
    setSelectedNodeId(root);
    setFocusedNodeId(root);
    setExploredNodeIds([root]);
    setRecentNodeIds([root]);
    setJourneyTrail([root]);

    try {
      localStorage.removeItem(STORAGE_KEY_EXPLORED);
      localStorage.removeItem(STORAGE_KEY_RECENT);
      localStorage.removeItem(STORAGE_KEY_UNIVERSE);
      localStorage.removeItem(STORAGE_KEY_SELECTED);
      localStorage.removeItem(STORAGE_KEY_TRAIL);
    } catch (e) {
      console.warn('localStorage clear failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans">
      {/* Universal Top Navigation Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        activeUniverseId={activeUniverseId}
        setActiveUniverseId={handleUniverseChange}
        exploredCount={exploredNodeIds.length}
        totalNodes={KNOWLEDGE_NODES.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onResetCamera={() => setCameraResetCounter((prev) => prev + 1)}
        onResetProgress={handleOpenResetConfirm}
      />

      {/* Main View: 3D Universe or Dashboard */}
      <main className="flex-1 w-full">
        {activeView === 'universe' ? (
          <Universe
            activeUniverseId={activeUniverseId}
            setActiveUniverseId={handleUniverseChange}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
            focusedNodeId={focusedNodeId}
            setFocusedNodeId={setFocusedNodeId}
            exploredNodeIds={exploredNodeIds}
            onExploreConcept={handleExploreConcept}
            onToggleExplored={handleToggleExplored}
            journeyTrail={journeyTrail}
            onResetTrail={handleResetTrail}
            onResetProgress={handleOpenResetConfirm}
          />
        ) : (
          <Dashboard
            activeUniverseId={activeUniverseId}
            onExploreUniverse={(uId) => {
              handleUniverseChange(uId);
              setActiveView('universe');
            }}
            exploredNodeIds={exploredNodeIds}
            recentNodeIds={recentNodeIds}
            selectedNodeId={selectedNodeId}
            onSelectNodeAndUniverse={handleSelectNodeAndUniverse}
            onResetProgress={handleOpenResetConfirm}
          />
        )}
      </main>

      {/* Global Instant Search Modal */}
      <SearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectNode={handleSelectNodeAndUniverse}
        currentUniverseId={activeUniverseId}
      />

      {/* In-app Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleExecuteResetProgress}
      />
    </div>
  );
}
