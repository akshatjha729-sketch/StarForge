import React from 'react';
import { ShieldCheck, Ban, ArrowRight, UserCheck } from 'lucide-react';

export const NoCommandPathBanner: React.FC = () => {
  return (
    <div className="rounded-xl border border-sky-300 bg-white p-4 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Explanation */}
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-800">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            <span>RESPONSIBLE AI SAFETY ARCHITECTURE · HUMAN-IN-THE-LOOP ONLY</span>
          </div>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-2xl">
            This copilot generates <strong>evidence-grounded investigation guidance</strong>. It cannot transmit autonomous commands to spacecraft buses. All flight commanding requires verified human operator authorization.
          </p>
        </div>

        {/* Visual Workflow Comparison */}
        <div className="flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
          {/* Permitted Path */}
          <div className="flex items-center gap-2 rounded-lg bg-sky-50 border border-sky-300 px-3 py-2 text-sky-900 shadow-xs">
            <span className="font-semibold">AI INVESTIGATION</span>
            <ArrowRight className="h-3.5 w-3.5 text-sky-500" />
            <div className="flex items-center gap-1 text-sky-800 font-bold">
              <UserCheck className="h-3.5 w-3.5" />
              <span>HUMAN OPERATOR</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-sky-500" />
            <span className="rounded bg-sky-600 px-1.5 py-0.5 text-white font-bold text-[11px]">
              DECISION
            </span>
          </div>

          {/* Blocked Autonomous Path */}
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-rose-900 shadow-xs">
            <span className="text-slate-600 line-through">AI COPILOT</span>
            <div className="flex items-center gap-1 rounded bg-rose-200 px-1.5 py-0.5 text-rose-800 font-bold text-[10px]">
              <Ban className="h-3 w-3" />
              <span>BLOCKED</span>
            </div>
            <span className="text-rose-700 font-bold text-[11px]">
              NO AUTONOMOUS SPACECRAFT EXECUTION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
