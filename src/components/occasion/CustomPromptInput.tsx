import React from 'react';
import { MessageSquarePlus, Sparkles, HelpCircle } from 'lucide-react';

interface CustomPromptInputProps {
  customInstruction: string;
  onChangeCustomInstruction: (value: string) => void;
}

export const CustomPromptInput: React.FC<CustomPromptInputProps> = ({
  customInstruction,
  onChangeCustomInstruction,
}) => {
  const samplePrompts = [
    '축의금/조의금은 마음과 함께 따로 송금했다고 언급해줘',
    '조만간 직접 찾아뵙고 인사드리겠다는 내용 포함해줘',
    '너무 격식 차리지 말고 진심 어리고 따스한 말투로 써줘',
    '건강 꼭 잘 챙기시고 조속한 회복을 바란다는 점 강조해줘',
  ];

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          STEP 4. 추가 맞춤 프롬프트 / 특이사항 요청 (선택)
        </div>
        <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          <Sparkles className="w-3 h-3 text-amber-600" /> AI 맞춤 적용
        </span>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={customInstruction}
          onChange={(e) => onChangeCustomInstruction(e.target.value)}
          placeholder="AI에게 추가로 요청할 세부 조건이나 문맥을 자유롭게 입력하세요.&#10;예: '축의금 10만원을 카카오페이로 송금했다고 다정하게 써줘', '다음주 출근해서 인사하겠다고 전해줘'"
          className="w-full p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 text-stone-800 text-xs sm:text-sm leading-relaxed focus:outline-none focus:bg-white focus:border-amber-500/80 transition-colors resize-none placeholder:text-stone-400"
        />
        {customInstruction && (
          <button
            type="button"
            onClick={() => onChangeCustomInstruction('')}
            className="absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded-lg bg-stone-200 text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            초기화
          </button>
        )}
      </div>

      {/* Recommended Quick Sample Chips */}
      <div>
        <div className="text-[11px] text-stone-500 mb-1.5 font-medium flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-stone-400" /> 자주 쓰는 프롬프트 예시 (클릭하여 입력)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((sample, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                if (customInstruction.includes(sample)) return;
                onChangeCustomInstruction(
                  customInstruction
                    ? `${customInstruction}\n${sample}`
                    : sample
                );
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-[11px] text-stone-700 hover:text-amber-900 transition-colors text-left cursor-pointer"
            >
              + {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
