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
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white border-l border-stone-200 text-stone-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-700" />
            <h2 className="font-bold text-base sm:text-lg text-stone-900">생성 기록 히스토리</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 bg-[#FAF7F2]/50">
          <div className="p-3 rounded-xl bg-brand-50/80 border border-brand-200/80 text-[11px] text-brand-900 leading-snug">
            💡 AI가 생성한 문구는 <b>자동으로 보관함(히스토리)에 저장</b>됩니다. 이전 작성 문구를 클릭하면 메인 화면으로 즉시 불러와 복사 및 전송할 수 있습니다.
          </div>

          {historyRecords.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs sm:text-sm">
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
                  className="p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-brand-300 hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          rec.category === '경사' ? 'bg-brand-500' : 'bg-slate-700'
                        }`}
                      />
                      <span>To. {rec.relationshipName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {rec.primaryKeywordLabel}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(rec.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-800 line-clamp-3 bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60 leading-relaxed font-sans">
                    {rec.selectedText}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-stone-500">
                    <span>형태: {rec.format}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(rec.id, rec.selectedText, e)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" /> 복사됨
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
          <div className="p-4 border-t border-stone-200 bg-[#FAF7F2]">
            <button
              onClick={onClearHistory}
              className="w-full py-2.5 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
