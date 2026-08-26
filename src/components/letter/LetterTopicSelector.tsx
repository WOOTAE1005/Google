import React from 'react';
import { PromptKeyword, RelationType } from '../../types';
import { getPrimaryKeywords } from '../../lib/keywords';
import { RELATION_GROUPS } from '../../lib/relationTypes';
import { Check } from 'lucide-react';

interface LetterTopicSelectorProps {
  audienceGroup: string | null;
  onSelectAudienceGroup: (label: string | null) => void;
  audienceType: RelationType | null;
  onSelectAudienceType: (type: RelationType | null) => void;
  selectedTopics: PromptKeyword[];
  onToggleTopic: (topic: PromptKeyword) => void;
}

// 대분류 카드 아래 짧은 설명 — 경조사 대분류(경사/조사)의 서브타이틀과 같은
// 역할. 연인은 세부 유형이 하나뿐이라 목록 대신 짧은 문구로 대신한다.
const GROUP_SUBTITLES: Record<string, string> = {
  가족: '어머니 · 아버지 · 형제 · 자매',
  연인: '설레는 마음을 전하고 싶을 때',
  지인: '친구 · 선생님 · 교수님 · 선배 · 후배',
  직장: '직장상사 · 직장동료 · 직장후배',
  기타: '친척 등 그 밖의 관계',
};

export const LetterTopicSelector: React.FC<LetterTopicSelectorProps> = ({
  audienceGroup,
  onSelectAudienceGroup,
  audienceType,
  onSelectAudienceType,
  selectedTopics,
  onToggleTopic,
}) => {
  const topics = getPrimaryKeywords('편지');
  const activeGroupDef = RELATION_GROUPS.find((g) => g.label === audienceGroup);

  return (
    <div className="space-y-9">
      {/* 1. 대상 대분류 — 경조사 대분류(경사/조사)와 동일한 카드 레이아웃
          (좌측 정렬 제목+설명, 우측 체크 원). 실제 등록된 수신자 관계와는
          별개로, "이 편지가 그려야 할 대상 성격"만 가볍게 지정하는 용도라
          완전히 선택 안 해도 무방하다. */}
      <div>
        <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-700"></span>
          어떤 대상을 위한 편지인가요 (선택)
        </div>
        <p className="text-[11px] text-[#3D2B31]/50 -mt-1 mb-2.5">
          고르지 않아도 괜찮아요 — 등록된 수신자 관계를 그대로 참고해서 써드려요. 대상을 고르면 그에 맞는 편지 주제를 이어서 고를 수 있어요.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans">
          {RELATION_GROUPS.map((group) => {
            const isActiveGroup = audienceGroup === group.label;
            return (
              <button
                type="button"
                key={group.label}
                onClick={() => onSelectAudienceGroup(isActiveGroup ? null : group.label)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isActiveGroup
                    ? 'bg-brand-100/60 border-brand-600 text-[#3D2B31] shadow-xs ring-2 ring-brand-600/20'
                    : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-stone-600 hover:bg-[#FBE4E8] hover:text-[#3D2B31]'
                }`}
              >
                <div>
                  <div className="font-bold text-sm sm:text-base text-[#3D2B31]">{group.label}</div>
                  <div className="text-xs text-[#3D2B31]/60">{GROUP_SUBTITLES[group.label]}</div>
                </div>
                {isActiveGroup && (
                  <div className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 ml-2">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 세부 대상 (중분류) — 경조사의 "주요 항목"과 같은 자리/크기. 대분류
          안에 세부 유형이 여럿일 때만(연인처럼 하나뿐이면 생략) 나타난다.
          여기서 하나를 해제해도 위 대분류 선택은 그대로 남는다 — 경조사에서
          primaryKeyword를 해제해도 category가 남는 것과 동일한 패턴. */}
      {activeGroupDef && activeGroupDef.types.length > 1 && (
        <div>
          <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-700"></span>
            세부 대상 (선택)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 font-sans">
            {activeGroupDef.types.map((type) => (
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
        </div>
      )}

      {/* 3. 편지 주제 (소분류) — 경조사의 세부 상황 태그와 동일한 알약형 태그.
          세부 대상(중분류)까지 골라야만 나타나는 진짜 하위 단계 — 경조사에서
          primaryKeyword가 있어야 세부 상황 태그가 뜨는 것과 동일. 대상을 안
          고르면 이 단계 자체가 안 보이지만, 추가 요청사항 자유 텍스트만으로
          생성하는 경로는 그대로 남아있다. */}
      {audienceType && (
        <div>
          <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-700"></span>
              어떤 편지인가요 (선택, 복수 선택 가능)
            </div>
            <span className="text-[11px] text-[#3D2B31]/50 font-normal">
              선택됨: {selectedTopics.length}개
            </span>
          </div>

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
