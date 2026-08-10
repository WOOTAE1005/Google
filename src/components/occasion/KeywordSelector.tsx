import React from 'react';
import { OccasionCategory, PromptKeyword } from '../../types';
import { getPrimaryKeywords, getSubKeywords } from '../../lib/keywords';
import { PartyPopper, Flame, Check, Sparkles } from 'lucide-react';

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
    <div className="space-y-6 bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* 1. Category Selector */}
      <div>
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          STEP 1. 경조사 대분류 선택
        </div>

        <div className="grid grid-cols-2 gap-3">
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
                ? 'bg-amber-50/80 border-amber-400 text-amber-950 shadow-xs ring-1 ring-amber-400/30'
                : 'bg-stone-50/60 border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  category === '경사'
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                🎉
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-stone-900">
                  경사 (축하)
                </div>
                <div className="text-xs text-stone-500">
                  결혼 · 출산 · 승진 · 개업 · 수연
                </div>
              </div>
            </div>
            {category === '경사' && (
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center">
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
                ? 'bg-slate-100/90 border-slate-400 text-slate-900 shadow-xs ring-1 ring-slate-400/30'
                : 'bg-stone-50/60 border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  category === '조사'
                    ? 'bg-slate-800 text-white'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                🌿
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-stone-900">
                  조사 (애도/위로)
                </div>
                <div className="text-xs text-stone-500">
                  부고(상가) · 입원/문병 · 쾌유 기원
                </div>
              </div>
            </div>
            {category === '조사' && (
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 2. Primary Keyword Selector */}
      <div>
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          STEP 2. 주요 경조사 항목 선택
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
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
                      ? 'bg-amber-600 border-amber-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800 border-slate-800 text-white font-bold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-amber-50/50 hover:border-amber-300'
                }`}
              >
                <span className="text-sm">{pk.keywordLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sub Keywords Selector */}
      {subList.length > 0 && (
        <div>
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              STEP 3. 세부 구체적 상황 태그 (복수 선택 가능)
            </div>
            <span className="text-[11px] text-stone-400 font-normal">
              선택됨: {selectedSubKeywords.length}개
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {subList.map((sk) => {
              const isSelected = selectedSubKeywords.some((s) => s.id === sk.id);
              return (
                <button
                  type="button"
                  key={sk.id}
                  onClick={() => onToggleSubKeyword(sk)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? category === '경사'
                        ? 'bg-amber-700 text-white border-amber-700 font-bold shadow-xs'
                        : 'bg-slate-800 text-white border-slate-800 font-bold shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
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
