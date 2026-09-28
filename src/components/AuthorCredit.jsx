import React from 'react';

export default function AuthorCredit({ variant = 'dashboard' }) {
  if (variant === 'universe') {
    return (
      <aside
        className="hidden sm:block fixed bottom-4 left-4 z-20 pointer-events-auto"
        aria-label="Author Credit"
      >
        <div className="glass-panel-subtle px-3 py-1.5 rounded-xl border border-white/10 shadow-lg backdrop-blur-md text-[11px] leading-tight select-none group hover:border-cyan-500/40 transition-all duration-300">
          <div className="text-[10px] text-slate-400 font-medium">
            Designed & Developed by
          </div>
          <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
            <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              M. Jaswanth Sharma
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Reg. No. 241FA04551
          </div>
        </div>
      </aside>
    );
  }

  // Dashboard variant: Elegant centered footer signature
  return (
    <footer
      className="pt-12 pb-6 border-t border-slate-800/80 text-center select-none"
      aria-label="Author Credit"
    >
      <div className="max-w-md mx-auto px-4 py-3 rounded-2xl glass-panel-subtle border border-white/10 shadow-xl space-y-1 group hover:border-cyan-500/30 transition-all duration-300">
        <div className="text-xs text-slate-400 font-medium tracking-wide">
          Designed & Developed by
        </div>
        <div className="text-sm font-bold tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-all">
            M. Jaswanth Sharma
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono tracking-wider">
          Reg. No. 241FA04551
        </div>
        <div className="text-[11px] text-slate-400 font-sans pt-1 border-t border-white/5 mt-2">
          MindSpace 3D · Interactive Knowledge Universe
        </div>
      </div>
    </footer>
  );
}
