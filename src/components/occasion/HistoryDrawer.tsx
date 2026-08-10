import React, { useState } from 'react';
import { GeneratedMessageRecord } from '../../types';
import { History, X, Copy, Check, Trash2, Calendar } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyRecords: GeneratedMessageRecord[];
  onClearHistory: () => void;
  onSelectRecord: (record: GeneratedMessageRecord) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyRecords,
  onClearHistory,
  onSelectRecord,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 text-slate-100 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base sm:text-lg">생성 기록 히스토리</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {historyRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">
              저장된 메시지 생성 기록이 없습니다.
            </div>
          ) : (
            historyRecords.map((rec) => {
              const isCopied = copiedId === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => {
                    onSelectRecord(rec);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-200">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          rec.category === '경사' ? 'bg-amber-400' : 'bg-indigo-400'
                        }`}
                      />
                      <span>To. {rec.relationshipName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                        {rec.primaryKeywordLabel}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(rec.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-sans">
                    {rec.selectedText}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <span>형태: {rec.format}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(rec.id, rec.selectedText, e)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                        isCopied
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" /> 복사됨
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> 복사
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {historyRecords.length > 0 && (
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={onClearHistory}
              className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              모든 기록 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
