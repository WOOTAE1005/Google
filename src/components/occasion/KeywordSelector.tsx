import React from 'react';
import { OccasionCategory, PromptKeyword } from '../../types';
import { getPrimaryKeywords, getSubKeywords } from '../../lib/keywords';
import { PartyPopper, Leaf, Check } from 'lucide-react';

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
    <div className="space-y-6 bg-white border border-[#2C2621]/15 rounded-2xl p-4 sm:p-6">
      {/* 1. Category Selector */}
      <div>
        <div className="text-xs font-sans font-bold text-[#2C2621]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
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
                ? 'bg-amber-100/60 border-amber-600 text-[#2C2621] shadow-xs ring-2 ring-amber-600/20'
                : 'bg-[#FAF6F0] border-[#2C2621]/10 text-stone-600 hover:bg-[#F2ECE1] hover:text-[#2C2621]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  category === '경사'
                    ? 'bg-[#2C2621] text-[#FAF6F0]'
                    : 'bg-stone-200/80 text-stone-600'
                }`}
              >
                <PartyPopper className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-[#2C2621]">
                  경사 (축하)
                </div>
                <div className="text-xs text-[#2C2621]/60">
                  결혼 · 출산 · 승진 · 개업 · 수연
                </div>
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
                ? 'bg-[#2C2621] border-[#2C2621] text-[#FAF6F0] shadow-xs ring-2 ring-[#2C2621]/20'
                : 'bg-[#FAF6F0] border-[#2C2621]/10 text-stone-600 hover:bg-[#F2ECE1] hover:text-[#2C2621]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  category === '조사'
                    ? 'bg-stone-800 text-[#FAF6F0] border border-stone-700'
                    : 'bg-stone-200/80 text-stone-600'
                }`}
              >
                <Leaf className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className={`font-bold text-sm sm:text-base ${category === '조사' ? 'text-[#FAF6F0]' : 'text-[#2C2621]'}`}>
                  조사 (애도/위로)
                </div>
                <div className={`text-xs ${category === '조사' ? 'text-amber-100/80' : 'text-[#2C2621]/60'}`}>
                  부고(상가) · 입원/문병 · 쾌유 기원
                </div>
              </div>
            </div>
            {category === '조사' && (
              <div className="w-6 h-6 rounded-full bg-stone-700 text-[#FAF6F0] flex items-center justify-center border border-stone-600">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 2. Primary Keyword Selector */}
      <div>
        <div className="text-xs font-sans font-bold text-[#2C2621]/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
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
                      ? 'bg-[#2C2621] border-[#2C2621] text-[#FAF6F0] font-bold shadow-2xs'
                      : 'bg-stone-800 border-stone-800 text-white font-bold shadow-2xs'
                    : 'bg-[#FAF6F0] border-[#2C2621]/10 text-[#2C2621] hover:bg-[#F2ECE1] hover:border-[#2C2621]/20'
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
          <div className="text-xs font-sans font-bold text-[#2C2621]/60 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-700"></span>
              세부 상황 태그 (복수 선택 가능)
            </div>
            <span className="text-[11px] text-[#2C2621]/50 font-normal">
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
                        ? 'bg-[#2C2621] text-[#FAF6F0] border-[#2C2621] font-bold shadow-2xs'
                        : 'bg-stone-800 text-white border-stone-800 font-bold shadow-2xs'
                      : 'bg-[#FAF6F0] border-[#2C2621]/10 text-[#2C2621] hover:bg-[#F2ECE1]'
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
