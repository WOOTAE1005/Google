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
  BookmarkCheck,
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
    <div className="space-y-9">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            AI 추천 멘트 후보 (3가지 안)
          </h3>
          <p className="text-xs text-stone-500">
            상황에 맞게 가장 마음에 드는 문구를 선택하거나 직접 수정하세요.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-[11px] text-brand-900 font-semibold self-start sm:self-auto shadow-2xs">
          <BookmarkCheck className="w-3.5 h-3.5 text-brand-700" />
          <span>생성된 문구 자동 보관 중</span>
        </div>
      </div>

      {/* Candidate Cards Grid — 안 1/2/3 모두 같은 색으로 시작하고, 선택했을 때만
          강조색이 들어간다 (이전엔 안 1이 항상 어두운 카드로 고정돼 있어서
          아직 아무것도 선택 안 한 상태에서도 이미 뭔가 골라진 것처럼 보였음). */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidates.map((cand) => {
          const isSelected = selectedCandidateId === cand.id;
          const isEditing = editingId === cand.id;
          const isCopied = copiedId === cand.id;
          const isRecommended = cand.variantIndex === 1;

          return (
            <div
              key={cand.id}
              onClick={() => onSelectCandidate(cand)}
              className={`relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-100/60 border border-[#3D2B31] shadow-sm ring-2 ring-[#3D2B31]/20'
                  : 'bg-white border border-[#3D2B31]/15 hover:bg-[#FFFAFA] hover:border-[#3D2B31]/30 hover:-translate-y-0.5 hover:shadow-sm'
              }`}
            >
              {/* Top Meta Bar */}
              <div>
                <div className="flex items-center justify-between mb-3 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3D2B31] text-[#FFFAFA]">
                      안 {cand.variantIndex}
                    </span>
                    {isRecommended && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                        추천
                      </span>
                    )}
                    <span className="text-xs font-bold font-display text-[#3D2B31]">
                      {cand.title}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-xs font-bold text-brand-800">
                      <CheckCircle2 className="w-4 h-4 text-brand-700" />
                      선택됨
                    </div>
                  )}
                </div>

                {/* Tone tag */}
                <div className="inline-block text-[10px] font-sans px-2 py-0.5 rounded-md font-medium mb-3 border bg-[#FFFAFA] text-[#3D2B31]/80 border-[#3D2B31]/10">
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
                      className="w-full p-3 rounded-xl text-xs sm:text-sm leading-relaxed focus:outline-none shadow-xs font-display bg-white border border-[#3D2B31] text-[#3D2B31]"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="w-full py-1.5 rounded-xl text-xs font-sans font-medium cursor-pointer bg-[#3D2B31] hover:bg-[#2a1d22] text-[#FFFAFA]"
                    >
                      수정 완료
                    </button>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm leading-relaxed font-display whitespace-pre-wrap mb-4 p-3.5 rounded-xl border min-h-[110px] bg-[#FFFAFA]/80 border-[#3D2B31]/10 text-[#3D2B31]">
                    "{cand.content}"
                  </p>
                )}

                {/* Etiquette Tip */}
                {cand.etiquetteTip && (
                  <div className="flex items-start gap-1.5 text-[11px] font-sans p-2.5 rounded-xl border mb-4 bg-brand-100/50 border-brand-300/60 text-[#3D2B31]/80">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-800" />
                    <span>{cand.etiquetteTip}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t flex items-center justify-between gap-2 font-sans border-[#3D2B31]/10">
                <div className="text-[10px] font-mono text-[#3D2B31]/50">
                  {cand.content.length}자
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(isEditing ? null : cand.id);
                    }}
                    className="p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer border bg-[#FFFAFA] hover:bg-stone-200 text-[#3D2B31] border-[#3D2B31]/10"
                    title="직접 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCopy(cand, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#3D2B31] hover:bg-[#2a1d22] text-[#FFFAFA] shadow-xs'
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
      <div className="bg-white rounded-2xl px-4 sm:px-5 py-7 sm:py-9 font-sans">
        <div className="text-xs font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-brand-700" />
          멘트 조율 & 다시 생성
        </div>

        {/* Quick Tweak Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickTweaks.map((tweak, idx) => (
            <button
              key={idx}
              disabled={isGenerating}
              onClick={() => onRegenerateWithInstruction(tweak)}
              className="px-3 py-1.5 rounded-xl bg-[#FFFAFA] hover:bg-brand-100/60 border border-[#3D2B31]/10 hover:border-[#3D2B31]/30 text-xs text-[#3D2B31] font-serif transition-colors disabled:opacity-50 cursor-pointer"
            >
              {tweak}
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
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FFFAFA] border border-[#3D2B31]/15 text-[#3D2B31] text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#3D2B31] font-serif placeholder:font-sans placeholder:text-[#3D2B31]/40"
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
            className="px-4 py-2.5 rounded-xl bg-[#3D2B31] hover:bg-[#2a1d22] text-brand-300 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            다시 생성
          </button>
        </div>
      </div>
    </div>
  );
};
