import React from 'react';
import { OccasionCategory, PromptKeyword } from '../../types';
import { getPrimaryKeywords, getSubKeywords } from '../../lib/keywords';
import { Check } from 'lucide-react';

interface KeywordSelectorProps {
  category: OccasionCategory;
  onSelectCategory: (cat: OccasionCategory) => void;
  primaryKeyword: PromptKeyword;
  onSelectPrimaryKeyword: (pk: PromptKeyword) => void;
  selectedSubKeywords: PromptKeyword[];
  onToggleSubKeyword: (sk: PromptKeyword) => void;
}

export const KeywordSelector: React.FC<KeywordSelectorProps> = ({
  category,
  onSelectCategory,
  primaryKeyword,
  onSelectPrimaryKeyword,
  selectedSubKeywords,
  onToggleSubKeyword,
}) => {
  const primaryList = getPrimaryKeywords(category);
  const subList = getSubKeywords(primaryKeyword.id);

  return (
    <div className="space-y-9">
      {/* 1. Category Selector */}
      <div>
        <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-700"></span>
          경조사 대분류
        </div>

        <div className="grid grid-cols-2 gap-3 font-sans">
          {/* 경사 */}
          <button
            type="button"
            onClick={() => {
              if (category !== '경사') {
                onSelectCategory('경사');
                const firstPrimary = getPrimaryKeywords('경사')[0];
                if (firstPrimary) onSelectPrimaryKeyword(firstPrimary);
              }
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              category === '경사'
                ? 'bg-brand-100/60 border-brand-600 text-[#3D2B31] shadow-xs ring-2 ring-brand-600/20'
                : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-stone-600 hover:bg-[#FBE4E8] hover:text-[#3D2B31]'
            }`}
          >
            <div>
              <div className="font-bold text-sm sm:text-base text-[#3D2B31]">
                경사 (축하)
              </div>
              <div className="text-xs text-[#3D2B31]/60">
                결혼 · 출산 · 승진 · 개업 · 수연
              </div>
            </div>
            {category === '경사' && (
              <div className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>

          {/* 조사 */}
          <button
            type="button"
            onClick={() => {
              if (category !== '조사') {
                onSelectCategory('조사');
                const firstPrimary = getPrimaryKeywords('조사')[0];
                if (firstPrimary) onSelectPrimaryKeyword(firstPrimary);
              }
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              category === '조사'
                ? 'bg-[#3D2B31] border-[#3D2B31] text-[#FFFAFA] shadow-xs ring-2 ring-[#3D2B31]/20'
                : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-stone-600 hover:bg-[#FBE4E8] hover:text-[#3D2B31]'
            }`}
          >
            <div>
              <div className={`font-bold text-sm sm:text-base ${category === '조사' ? 'text-[#FFFAFA]' : 'text-[#3D2B31]'}`}>
                조사 (애도/위로)
              </div>
              <div className={`text-xs ${category === '조사' ? 'text-brand-100/80' : 'text-[#3D2B31]/60'}`}>
                부고(상가) · 입원/문병 · 쾌유 기원
              </div>
            </div>
            {category === '조사' && (
              <div className="w-6 h-6 rounded-full bg-stone-700 text-[#FFFAFA] flex items-center justify-center border border-stone-600">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 2. Primary Keyword Selector */}
      <div>
        <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-700"></span>
          주요 항목
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 font-sans">
          {primaryList.map((pk) => {
            const isSelected = primaryKeyword.id === pk.id;
            return (
              <button
                type="button"
                key={pk.id}
                onClick={() => onSelectPrimaryKeyword(pk)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? category === '경사'
                      ? 'bg-[#3D2B31] border-[#3D2B31] text-[#FFFAFA] font-bold shadow-2xs'
                      : 'bg-stone-800 border-stone-800 text-white font-bold shadow-2xs'
                    : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-[#3D2B31] hover:bg-[#FBE4E8] hover:border-[#3D2B31]/20'
                }`}
              >
                <span className="text-sm font-serif">{pk.keywordLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sub Keywords Selector */}
      {subList.length > 0 && (
        <div>
          <div className="text-xs font-sans font-bold text-[#3D2B31]/60 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-700"></span>
              세부 상황 태그 (복수 선택 가능)
            </div>
            <span className="text-[11px] text-[#3D2B31]/50 font-normal">
              선택됨: {selectedSubKeywords.length}개
            </span>
          </div>

          <div className="flex flex-wrap gap-2 font-sans">
            {subList.map((sk) => {
              const isSelected = selectedSubKeywords.some((s) => s.id === sk.id);
              return (
                <button
                  type="button"
                  key={sk.id}
                  onClick={() => onToggleSubKeyword(sk)}
                  className={`px-3.5 py-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? category === '경사'
                        ? 'bg-[#3D2B31] text-[#FFFAFA] border-[#3D2B31] font-bold shadow-2xs'
                        : 'bg-stone-800 text-white border-stone-800 font-bold shadow-2xs'
                      : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-[#3D2B31] hover:bg-[#FBE4E8]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  {sk.keywordLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
