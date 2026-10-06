import React, { useState } from 'react';
import { Search, Database, Layers, Sparkles, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { RAGRetrievalData } from '../types/intelligence';
import { executeRAGRetrieval } from '../services/intelligenceEngine';

interface EvidenceRetrievalRAGProps {
  initialQuery?: string;
  onSelectDocument?: (docId: string) => void;
}

export const EvidenceRetrievalRAG: React.FC<EvidenceRetrievalRAGProps> = ({
  initialQuery = 'Why did the battery voltage decrease?',
  onSelectDocument,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<RAGRetrievalData>(() => executeRAGRetrieval(initialQuery));

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setData(executeRAGRetrieval(newQuery));
  };

  return (
    <div id="sec-rag-retrieval" className="rounded-xl border border-sky-300 bg-white p-5 shadow-sm shadow-sky-100/60">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-sky-700">
            <Search className="h-4 w-4" />
            <span>STAGE 03 · HYBRID RETRIEVAL-AUGMENTED GENERATION (RAG)</span>
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 tracking-wide mt-0.5">
            EVIDENCE RETRIEVAL
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Combines lexical BM25 keyword matching and dense vector embeddings into Reciprocal Rank Fusion (RRF).
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-sky-50 border border-sky-200 px-3 py-1 font-mono text-xs text-sky-800 font-bold">
          <Database className="h-3.5 w-3.5" />
          <span>REAL HYBRID RETRIEVAL ENGINE</span>
        </div>
      </div>

      {/* Query Bar */}
      <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/40 p-3.5 shadow-xs">
        <div className="text-[11px] font-mono text-slate-500 font-bold mb-1.5">
          ACTIVE RETRIEVAL QUERY:
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search flight procedures or historical incidents..."
              className="w-full rounded-lg border border-sky-300 bg-white pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
            <button
              onClick={() => handleSearch('Why did the battery voltage decrease?')}
              className="rounded-md border border-sky-200 bg-white px-2.5 py-1.5 text-sky-800 hover:bg-sky-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Battery Sag Query
            </button>
            <button
              onClick={() => handleSearch('Did the solar array physically break?')}
              className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-amber-800 hover:bg-amber-100 transition-colors whitespace-nowrap cursor-pointer font-bold"
            >
              Solar Break Query
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Retrieval Comparison: BM25 vs Semantic vs Final Hybrid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {/* Column 1: BM25 Search */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-800">BM25 SEARCH</span>
            <span className="text-[10px] text-slate-500">Lexical Token Match</span>
          </div>

          <div className="mt-3 space-y-2">
            {data.bm25.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectDocument && onSelectDocument(item.id)}
                className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs hover:border-sky-300 cursor-pointer"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-sky-800">{item.id}</span>
                  <span className="rounded bg-sky-100 px-1.5 py-0.5 text-sky-700 text-[10px]">
                    {item.score}%
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-800 font-sans font-medium line-clamp-1">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Semantic Search */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-800">SEMANTIC SEARCH</span>
            <span className="text-[10px] text-slate-500">Dense Embedding Vector</span>
          </div>

          <div className="mt-3 space-y-2">
            {data.semantic.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectDocument && onSelectDocument(item.id)}
                className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs hover:border-sky-300 cursor-pointer"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-indigo-800">{item.id}</span>
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-700 text-[10px]">
                    {item.score}%
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-800 font-sans font-medium line-clamp-1">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Final Ranking (Hybrid RRF) */}
        <div className="rounded-xl border border-sky-300 bg-sky-50/60 p-3.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-sky-200 pb-2">
            <span className="font-bold text-sky-900">FINAL RANKING (RRF)</span>
            <span className="rounded bg-sky-200 px-1.5 py-0.5 text-[10px] text-sky-900 font-bold">
              HYBRID MERGE
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {data.hybrid.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onSelectDocument && onSelectDocument(item.id)}
                className="rounded-lg border border-sky-300 bg-white p-2.5 shadow-xs hover:border-sky-500 cursor-pointer ring-1 ring-sky-200"
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-sky-600">#{idx + 1}</span>
                    <span className="text-slate-900 font-bold">{item.id}</span>
                  </div>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800 text-[10px] font-bold">
                    {item.score}%
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-800 font-sans font-medium line-clamp-1">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Retrieved Justification Banner */}
      <div className="mt-4 rounded-xl border border-sky-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-start gap-2 text-xs">
          <Sparkles className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-mono font-bold text-slate-900">WHY RETRIEVED: </span>
            <span className="text-slate-700 leading-relaxed font-sans">
              "{data.whyRetrieved}"
            </span>
            <div className="mt-1 font-mono text-[11px] text-slate-500">
              Corpus grounded in flight operation manuals and historical spacecraft failure registries — not hallucinations from unconstrained generative memory.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
