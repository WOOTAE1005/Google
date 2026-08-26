import React from 'react';
import { PromptKeyword, RelationType } from '../../types';
import { getPrimaryKeywords } from '../../lib/keywords';
import { RELATION_GROUPS, findRelationGroup } from '../../lib/relationTypes';
import { Check } from 'lucide-react';

interface LetterTopicSelectorProps {
  audienceType: RelationType | null;
  onSelectAudienceType: (type: RelationType | null) => void;
  selectedTopics: PromptKeyword[];
  onToggleTopic: (topic: PromptKeyword) => void;
}

export const LetterTopicSelector: React.FC<LetterTopicSelectorProps> = ({
  audienceType,
  onSelectAudienceType,
  selectedTopics,
  onToggleTopic,
}) => {
  const topics = getPrimaryKeywords('편지');
  const activeGroup = findRelationGroup(audienceType);

  return (
    <div>
      {/* 1. 대상 대분류/중분류 — 경조사 대분류/주요 항목과 동일한 2단 선택.
          실제 등록된 수신자 관계와는 별개로, "이 편지가 그려야 할 대상 성격"만
          가볍게 지정하는 용도라 완전히 선택 안 해도 무방하다. */}
      <div>
        <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-700"></span>
          어떤 대상을 위한 편지인가요 (선택)
        </div>
        <p className="text-[11px] text-[#3D2B31]/50 -mt-1 mb-2.5">
          고르지 않아도 괜찮아요 — 등록된 수신자 관계를 그대로 참고해서 써드려요. 대상을 고르면 그에 맞는 편지 주제를 이어서 고를 수 있어요.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 font-sans">
          {RELATION_GROUPS.map((group) => {
            const isActiveGroup = audienceType ? group.types.includes(audienceType) : false;
            return (
              <button
                type="button"
                key={group.label}
                onClick={() => onSelectAudienceType(isActiveGroup ? null : group.types[0])}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isActiveGroup
                    ? 'bg-[#3D2B31] border-[#3D2B31] text-[#FFFAFA] font-bold shadow-2xs'
                    : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-[#3D2B31] hover:bg-[#FBE4E8] hover:border-[#3D2B31]/20'
                }`}
              >
                <span className="text-sm font-serif">{group.label}</span>
              </button>
            );
          })}
        </div>

        {activeGroup && activeGroup.types.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 font-sans mt-2.5">
            {activeGroup.types.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => onSelectAudienceType(audienceType === type ? null : type)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  audienceType === type
                    ? 'bg-stone-800 border-stone-800 text-white font-bold shadow-2xs'
                    : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-[#3D2B31] hover:bg-[#FBE4E8] hover:border-[#3D2B31]/20'
                }`}
              >
                <span className="text-sm font-serif">{type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. 편지 주제 (소분류) — 경조사의 세부 상황 태그처럼, 대상(대분류/중분류)을
          골라야만 나타나는 진짜 하위 단계. 대상을 안 고르면 이 단계 자체가 안
          보이지만, 추가 요청사항 자유 텍스트만으로 생성하는 경로는 그대로 남아있다. */}
      {audienceType && (
        <div className="space-y-2.5 pl-3 border-l-2 border-brand-200/70 mt-4">
          <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-700"></span>
              어떤 편지인가요 (선택, 복수 선택 가능)
            </div>
            <span className="text-[11px] text-[#3D2B31]/50 font-normal">
              선택됨: {selectedTopics.length}개
            </span>
          </div>
          <p className="text-[11px] text-[#3D2B31]/50 -mt-1.5">
            고르지 않아도 괜찮아요 — 아래 추가 요청사항만으로도 편지를 지을 수 있어요.
          </p>

          <div className="flex flex-wrap gap-2 font-sans">
            {topics.map((t) => {
              const isSelected = selectedTopics.some((s) => s.id === t.id);
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => onToggleTopic(t)}
                  className={`px-3.5 py-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#3D2B31] text-[#FFFAFA] border-[#3D2B31] font-bold shadow-2xs'
                      : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-[#3D2B31] hover:bg-[#FBE4E8]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  {t.keywordLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
