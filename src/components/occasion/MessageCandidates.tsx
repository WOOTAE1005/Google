import React, { useState } from 'react';
import { MessageCandidate } from '../../types';
import {
  Copy,
  Check,
  Edit3,
  RefreshCw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

interface MessageCandidatesProps {
  candidates: MessageCandidate[];
  selectedCandidateId: string | null;
  onSelectCandidate: (candidate: MessageCandidate) => void;
  onUpdateCandidateContent: (id: string, newContent: string) => void;
  onRegenerateWithInstruction: (customInstruction: string) => void;
  isGenerating: boolean;
}

export const MessageCandidates: React.FC<MessageCandidatesProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  onUpdateCandidateContent,
  onRegenerateWithInstruction,
  isGenerating,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');

  const handleCopy = (cand: MessageCandidate, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cand.content);
    setCopiedId(cand.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const quickTweaks = [
    '조금 더 정중하고 격식 있게',
    '길이를 짧고 명료하게 축소',
    '마음을 담아 마음의 표시(축의금/조의금) 언급 추가',
    '친근하고 자연스러운 문체로',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            AI 추천 멘트 후보 (3가지 안)
          </h3>
          <p className="text-xs text-stone-500">
            상황에 맞게 가장 마음에 드는 문구를 선택하거나 직접 수정하세요.
          </p>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidates.map((cand) => {
          const isSelected = selectedCandidateId === cand.id;
          const isEditing = editingId === cand.id;
          const isCopied = copiedId === cand.id;

          return (
            <div
              key={cand.id}
              onClick={() => onSelectCandidate(cand)}
              className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-500/30'
                  : 'bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-300'
              }`}
            >
              {/* Top Meta Bar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      안 {cand.variantIndex}
                    </span>
                    <span className="text-xs font-semibold text-stone-800">
                      {cand.title}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="text-amber-700 flex items-center gap-1 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      선택됨
                    </div>
                  )}
                </div>

                {/* Tone tag */}
                <div className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium mb-3">
                  어조: {cand.toneTag}
                </div>

                {/* Message Content Area */}
                {isEditing ? (
                  <div className="space-y-2 mb-3" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={cand.content}
                      onChange={(e) =>
                        onUpdateCandidateContent(cand.id, e.target.value)
                      }
                      rows={5}
                      className="w-full p-3 rounded-xl bg-white border border-amber-500 text-stone-800 text-xs sm:text-sm leading-relaxed focus:outline-none shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="w-full py-1.5 rounded-xl bg-stone-800 text-white text-xs font-medium hover:bg-stone-700 cursor-pointer"
                    >
                      수정 완료
                    </button>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans whitespace-pre-wrap mb-4 bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/60 min-h-[110px]">
                    {cand.content}
                  </p>
                )}

                {/* Etiquette Tip */}
                {cand.etiquetteTip && (
                  <div className="flex items-start gap-1.5 text-[11px] text-stone-600 bg-amber-100/50 p-2.5 rounded-xl border border-amber-200 mb-4">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{cand.etiquetteTip}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2">
                <div className="text-[10px] text-stone-400 font-mono">
                  {cand.content.length}자
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(isEditing ? null : cand.id);
                    }}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="직접 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCopy(cand, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        복사 완료!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        복사하기
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Refinement / Regeneration Section */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-amber-600" />
          멘트 조율 & 다시 생성
        </div>

        {/* Quick Tweak Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickTweaks.map((tweak, idx) => (
            <button
              key={idx}
              disabled={isGenerating}
              onClick={() => onRegenerateWithInstruction(tweak)}
              className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-xs text-stone-700 hover:text-amber-900 transition-colors disabled:opacity-50 cursor-pointer"
            >
              ✨ {tweak}
            </button>
          ))}
        </div>

        {/* Custom Instruction Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customText.trim()) {
                onRegenerateWithInstruction(customText.trim());
                setCustomText('');
              }
            }}
            placeholder="직접 변경 요청사항 입력 (예: 축의금 못 보낸 사과 어조 추가해줘)"
            className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-500"
          />
          <button
            type="button"
            disabled={isGenerating || !customText.trim()}
            onClick={() => {
              if (customText.trim()) {
                onRegenerateWithInstruction(customText.trim());
                setCustomText('');
              }
            }}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            다시 생성
          </button>
        </div>
      </div>
    </div>
  );
};
