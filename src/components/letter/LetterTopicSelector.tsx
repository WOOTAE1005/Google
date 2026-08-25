import React from 'react';
import { PromptKeyword } from '../../types';
import { getPrimaryKeywords } from '../../lib/keywords';

interface LetterTopicSelectorProps {
  topic: PromptKeyword | null;
  onSelectTopic: (topic: PromptKeyword | null) => void;
}

export const LetterTopicSelector: React.FC<LetterTopicSelectorProps> = ({
  topic,
  onSelectTopic,
}) => {
  const topics = getPrimaryKeywords('편지');

  return (
    <div className="space-y-2.5">
      <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-brand-700"></span>
        어떤 편지인가요 (선택)
      </div>
      <p className="text-[11px] text-[#3D2B31]/50 -mt-1.5">
        고르지 않아도 괜찮아요 — 아래 추가 요청사항만으로도 편지를 지을 수 있어요.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 font-sans">
        {topics.map((t) => {
          const isSelected = topic?.id === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => onSelectTopic(isSelected ? null : t)}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-[#3D2B31] border-[#3D2B31] text-[#FFFAFA] font-bold shadow-2xs'
                  : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-[#3D2B31] hover:bg-[#FBE4E8] hover:border-[#3D2B31]/20'
              }`}
            >
              <span className="text-sm font-serif">{t.keywordLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
