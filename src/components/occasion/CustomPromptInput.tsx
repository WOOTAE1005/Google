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

  const seasonalChips = [
    { label: '🌸 화사한 봄날', text: '화사한 봄날을 맞아 활기찬 축하와 인사 문구를 더해줘' },
    { label: '☀️ 무더위/장마철 안부', text: '무더위 속에서도 건강 유의하시라는 계절 안구를 더해줘' },
    { label: '🍁 풍성한 가을/결실', text: '풍성한 가을 결실의 계절처럼 축복과 기쁨이 가득하길 비는 멘트를 더해줘' },
    { label: '❄️ 추운 겨울/연말연시', text: '추운 날씨에 감기 조심하시고 따뜻하고 평안한 날들 되시라는 멘트를 더해줘' },
    { label: '🧧 새해/명절 덕담', text: '새해 복 많이 받으시고 가정에 평안이 가득하길 기원하는 덕담을 더해줘' },
  ];

  return (
    <div className="bg-white border border-[#2C2621]/15 rounded-2xl p-4 sm:p-5 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-[#2C2621]/60 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-700"></span>
          추가 요청사항 (선택)
        </div>
        <span className="text-[11px] text-[#2C2621] font-semibold flex items-center gap-1 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-300/60">
          <Sparkles className="w-3 h-3 text-amber-700" /> AI 맞춤 적용
        </span>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={customInstruction}
          onChange={(e) => onChangeCustomInstruction(e.target.value)}
          placeholder="AI에게 추가로 요청할 세부 조건이나 문맥을 자유롭게 입력하세요.&#10;예: '축의금 10만원을 카카오페이로 송금했다고 다정하게 써줘', '다음주 출근해서 인사하겠다고 전해줘'"
          className="w-full p-3.5 rounded-xl bg-[#FAF6F0] border border-[#2C2621]/15 text-[#2C2621] text-xs sm:text-sm leading-relaxed focus:outline-none focus:bg-white focus:border-[#2C2621] transition-colors resize-none placeholder:text-[#2C2621]/40 font-serif"
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

      {/* Seasonal & Mood Chips */}
      <div>
        <div className="text-[11px] text-[#2C2621]/60 mb-1.5 font-medium flex items-center gap-1">
          <span>🌿 계절/절기 안부 태그 (원클릭 추가)</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {seasonalChips.map((chip, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                if (customInstruction.includes(chip.text)) return;
                onChangeCustomInstruction(
                  customInstruction
                    ? `${customInstruction}\n${chip.text}`
                    : chip.text
                );
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-100/60 hover:bg-amber-100 border border-amber-300/60 text-[11px] text-[#2C2621] font-medium transition-colors text-left cursor-pointer shadow-2xs font-serif"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Quick Sample Chips */}
      <div>
        <div className="text-[11px] text-[#2C2621]/60 mb-1.5 font-medium flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#2C2621]/40" /> 자주 쓰는 프롬프트 예시 (클릭하여 입력)
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
              className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] hover:bg-amber-100/50 border border-[#2C2621]/15 hover:border-[#2C2621]/30 text-[11px] text-[#2C2621] transition-colors text-left cursor-pointer font-serif"
            >
              + {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
