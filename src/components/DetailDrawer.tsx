import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'neutral' | 'success' | 'warning' | 'danger' | 'purple' | 'sky';
  };
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  width = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    md: 'max-w-md',
    lg: 'max-w-lg sm:max-w-xl',
    xl: 'max-w-2xl',
  }[width];

  const badgeColor = badge
    ? {
        neutral: 'bg-slate-100 text-slate-700 border-slate-200',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        danger: 'bg-rose-50 text-rose-700 border-rose-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        sky: 'bg-sky-50 text-sky-700 border-sky-200',
      }[badge.variant]
    : '';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className={`relative z-10 w-full ${widthClass} bg-white shadow-2xl flex flex-col h-full border-l border-sky-200 animate-in slide-in-from-right duration-200`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-sky-100 bg-sky-50/40">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {badge && (
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${badgeColor}`}>
                  {badge.text}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs font-mono text-slate-500 mt-1">{subtitle}</p>}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-700 text-sm">
          {children}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sky-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
