import React from 'react';
import { Sparkles } from 'lucide-react';

interface CustomPromptInputProps {
  customInstruction: string;
  onChangeCustomInstruction: (value: string) => void;
}

export const CustomPromptInput: React.FC<CustomPromptInputProps> = ({
  customInstruction,
  onChangeCustomInstruction,
}) => {
  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-[#3D2B31]/60 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-700"></span>
          추가 요청사항 (선택)
        </div>
        <span className="text-[11px] text-[#3D2B31]/50 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#3D2B31]/40" /> 적으면 AI가 자동 반영해요
        </span>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={customInstruction}
          onChange={(e) => onChangeCustomInstruction(e.target.value)}
          placeholder="AI에게 추가로 요청할 세부 조건이나 문맥을 자유롭게 입력하세요.&#10;예: '축의금 10만원을 카카오페이로 송금했다고 다정하게 써줘', '다음주 출근해서 인사하겠다고 전해줘'"
          className="w-full p-3.5 rounded-xl bg-[#FFFAFA] border border-[#3D2B31]/15 text-[#3D2B31] text-xs sm:text-sm leading-relaxed focus:outline-none focus:bg-white focus:border-[#3D2B31] transition-colors resize-none placeholder:text-[#3D2B31]/40 font-serif"
        />
        {customInstruction && (
          <button
            type="button"
            onClick={() => onChangeCustomInstruction('')}
            className="absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded-lg bg-stone-200 text-stone-700 hover:text-stone-900 cursor-pointer font-sans"
          >
            초기화
          </button>
        )}
      </div>
    </div>
  );
};
