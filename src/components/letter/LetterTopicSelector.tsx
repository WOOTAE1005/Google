import React from 'react';
import { PromptKeyword } from '../../types';
import { getPrimaryKeywords } from '../../lib/keywords';

interface LetterTopicSelectorProps {
  topic: PromptKeyword;
  onSelectTopic: (topic: PromptKeyword) => void;
}

export const LetterTopicSelector: React.FC<LetterTopicSelectorProps> = ({
  topic,
  onSelectTopic,
}) => {
  const topics = getPrimaryKeywords('편지');

  return (
    <div className="space-y-2.5 bg-white rounded-2xl px-4 sm:px-6 py-7 sm:py-10">
      <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-brand-700"></span>
        어떤 편지인가요
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 font-sans">
        {topics.map((t) => {
          const isSelected = topic.id === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => onSelectTopic(t)}
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
