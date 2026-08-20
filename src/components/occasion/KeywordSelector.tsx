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
    <div className="space-y-9 bg-white rounded-2xl px-4 sm:px-6 py-7 sm:py-10">
      {/* 1. Category Selector */}
      <div>
        <div className="text-xs font-sans font-bold text-[#111827]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-700"></span>
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
                ? 'bg-amber-100/60 border-amber-600 text-[#111827] shadow-xs ring-2 ring-amber-600/20'
                : 'bg-[#F9FAFB] border-[#111827]/10 text-stone-600 hover:bg-[#E5E7EB] hover:text-[#111827]'
            }`}
          >
            <div>
              <div className="font-bold text-sm sm:text-base text-[#111827]">
                경사 (축하)
              </div>
              <div className="text-xs text-[#111827]/60">
                결혼 · 출산 · 승진 · 개업 · 수연
              </div>
            </div>
            {category === '경사' && (
              <div className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center">
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
                ? 'bg-[#111827] border-[#111827] text-[#F9FAFB] shadow-xs ring-2 ring-[#111827]/20'
                : 'bg-[#F9FAFB] border-[#111827]/10 text-stone-600 hover:bg-[#E5E7EB] hover:text-[#111827]'
            }`}
          >
            <div>
              <div className={`font-bold text-sm sm:text-base ${category === '조사' ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                조사 (애도/위로)
              </div>
              <div className={`text-xs ${category === '조사' ? 'text-amber-100/80' : 'text-[#111827]/60'}`}>
                부고(상가) · 입원/문병 · 쾌유 기원
              </div>
            </div>
            {category === '조사' && (
              <div className="w-6 h-6 rounded-full bg-stone-700 text-[#F9FAFB] flex items-center justify-center border border-stone-600">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 2. Primary Keyword Selector */}
      <div>
        <div className="text-xs font-sans font-bold text-[#111827]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-700"></span>
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
                      ? 'bg-[#111827] border-[#111827] text-[#F9FAFB] font-bold shadow-2xs'
                      : 'bg-stone-800 border-stone-800 text-white font-bold shadow-2xs'
                    : 'bg-[#F9FAFB] border-[#111827]/10 text-[#111827] hover:bg-[#E5E7EB] hover:border-[#111827]/20'
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
          <div className="text-xs font-sans font-bold text-[#111827]/60 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-700"></span>
              세부 상황 태그 (복수 선택 가능)
            </div>
            <span className="text-[11px] text-[#111827]/50 font-normal">
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
                        ? 'bg-[#111827] text-[#F9FAFB] border-[#111827] font-bold shadow-2xs'
                        : 'bg-stone-800 text-white border-stone-800 font-bold shadow-2xs'
                      : 'bg-[#F9FAFB] border-[#111827]/10 text-[#111827] hover:bg-[#E5E7EB]'
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
