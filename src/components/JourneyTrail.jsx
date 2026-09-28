import React, { useRef, useEffect } from 'react';
import { ChevronRight, Compass, RotateCcw } from 'lucide-react';
import { getNodeById } from '../data/knowledgeData.js';

export default function JourneyTrail({
  trailIds,
  selectedNodeId,
  onSelectNode,
  onResetTrail,
}) {
  const containerRef = useRef(null);

  // Auto scroll to end of trail when new concept is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [trailIds]);

  if (!trailIds || trailIds.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800/80 text-xs shadow-2xl max-w-full select-none">
      <div className="flex items-center gap-1.5 text-slate-400 font-medium pl-1.5 pr-2.5 border-r border-slate-800 shrink-0">
        <Compass className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline text-slate-300 font-semibold">Journey</span>
        <span className="text-[10px] font-mono text-slate-500">({trailIds.length - 1} hops)</span>
      </div>

      <div
        ref={containerRef}
        className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-1 max-w-[65vw] sm:max-w-[70vw]"
      >
        {trailIds.map((id, index) => {
          const node = getNodeById(id);
          if (!node) return null;
          const isCurrent = node.id === selectedNodeId;
          const isLast = index === trailIds.length - 1;

          return (
            <React.Fragment key={`${id}-${index}`}>
              <button
                onClick={() => onSelectNode(id)}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
                title={`Jump to ${node.name} in 3D`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: node.color || '#06b6d4' }}
                />
                <span className="truncate max-w-[120px] sm:max-w-none">{node.name}</span>
              </button>

              {!isLast && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <button
        onClick={onResetTrail}
        className="ml-auto p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
        title="Reset exploration trail"
        aria-label="Reset exploration trail"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
