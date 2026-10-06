import React from 'react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { TabKey } from '../App';

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
  prevTab?: TabKey;
  nextTab?: TabKey;
  onNavigate: (tab: TabKey) => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  prevTab,
  nextTab,
  onNavigate,
}) => {
  return (
    <div className="rounded-2xl border-2 border-sky-300 bg-gradient-to-r from-sky-50 via-white to-sky-50 p-5 shadow-sm shadow-sky-100/60 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-sky-700 transition-colors cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              <span>HOME</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="rounded-md bg-sky-100 px-2 py-0.5 text-sky-800 uppercase tracking-wider text-[10px]">
              {badge}
            </span>
          </div>

          <h1 className="mt-1.5 font-display text-2xl font-bold text-slate-900 tracking-wide">
            {title}
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Section Navigation Quick Switch */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0 self-start md:self-auto">
          {prevTab && (
            <button
              onClick={() => onNavigate(prevTab)}
              className="flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3 py-2 text-slate-700 hover:bg-sky-50 transition-all shadow-xs cursor-pointer font-semibold"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
              <span>PREVIOUS</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3.5 py-2 font-bold text-sky-800 hover:bg-sky-100 transition-all shadow-xs cursor-pointer"
          >
            <Home className="h-3.5 w-3.5 text-sky-600" />
            <span>HOME OVERVIEW</span>
          </button>

          {nextTab && (
            <button
              onClick={() => onNavigate(nextTab)}
              className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-3.5 py-2 font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <span>NEXT STEP</span>
              <ArrowRight className="h-3.5 w-3.5 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
