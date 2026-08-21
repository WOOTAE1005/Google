import React from 'react';
import { PromptKeyword } from '../../types';
import { ShieldAlert, Info } from 'lucide-react';

interface CautionBannerProps {
  primaryKeyword: PromptKeyword;
  selectedSubKeywords: PromptKeyword[];
}

export const CautionBanner: React.FC<CautionBannerProps> = ({
  primaryKeyword,
  selectedSubKeywords,
}) => {
  const cautionNotes = [
    primaryKeyword.cautionNote,
    ...selectedSubKeywords.map((k) => k.cautionNote),
  ].filter(Boolean) as string[];

  if (cautionNotes.length === 0) return null;

  return (
    <div className="bg-brand-50/80 border border-brand-300/80 rounded-2xl p-4 text-stone-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
      <div className="p-2 rounded-xl bg-brand-100 text-brand-800 shrink-0 mt-0.5">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div className="space-y-1.5 flex-1">
        <div className="font-bold text-brand-950 flex items-center gap-1.5 text-xs sm:text-sm">
          <span>💡 전통 경조사 예법 & 표현 금기 주의사항</span>
        </div>
        <ul className="space-y-1 text-stone-700 text-xs leading-relaxed">
          {cautionNotes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-brand-700 font-bold">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
