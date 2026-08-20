import React from 'react';
import { MessageFormat } from '../../types';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';

interface FormatSelectorProps {
  format: MessageFormat;
  onSelectFormat: (fmt: MessageFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  format,
  onSelectFormat,
}) => {
  const formats: {
    id: MessageFormat;
    label: string;
    description: string;
    exampleText: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: '봉투문구',
      label: '봉투 문구',
      description: '봉투·리본에 쓰는 초단문 표제어',
      exampleText: '祝結婚 • 삼가 고인의 명복을 빕니다',
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: '문자',
      label: '문자 (SMS/LMS)',
      description: '어르신·상사께 보내는 정중한 문단',
      exampleText: '안녕하십니까, 기쁜 경사에 마음 깊이...',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: '카톡메시지',
      label: '카톡 메시지',
      description: '친근한 대상에게 보내는 감성 톡',
      exampleText: 'OO님! 소중한 경사 너무 축하드려요 🎉',
      icon: <Send className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-white border border-[#2C2621]/15 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#2C2621]/10 pb-3">
        <div className="text-xs font-sans font-bold text-[#2C2621] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-700"></span>
          STEP 5. 작성 형태 (Format) 선택
        </div>
        <span className="text-[11px] font-sans text-[#2C2621]/60 font-medium">
          현재 선택: <b className="text-[#2C2621] font-bold font-serif">{format}</b>
        </span>
      </div>

      {/* Format Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
        {formats.map((fmt) => {
          const isSelected = format === fmt.id;
          return (
            <button
              type="button"
              key={fmt.id}
              onClick={() => onSelectFormat(fmt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2.5 ${
                isSelected
                  ? 'bg-amber-100/60 border-[#2C2621] text-[#2C2621] shadow-xs ring-2 ring-[#2C2621]/20'
                  : 'bg-[#FAF6F0] border-[#2C2621]/10 text-stone-600 hover:bg-[#F2ECE1] hover:text-[#2C2621]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected
                        ? 'bg-[#2C2621] text-[#FAF6F0]'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {fmt.icon}
                  </div>
                  <span className="text-sm font-bold font-serif text-[#2C2621]">
                    {fmt.label}
                  </span>
                </div>
                {isSelected && (
                  <span className="p-1 rounded-full bg-[#2C2621] text-[#FAF6F0]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <p className="text-[11.5px] text-[#2C2621]/70 leading-snug">
                {fmt.description}
              </p>

              <div className="px-2.5 py-1.5 rounded-lg bg-white border border-[#2C2621]/10 text-[10px] text-[#2C2621]/60 font-serif italic truncate">
                {fmt.exampleText}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

