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
    <div className="bg-white rounded-2xl px-4 sm:px-5 py-7 sm:py-9 space-y-4">
      <div className="flex items-center justify-between border-b border-[#111827]/10 pb-3">
        <div className="text-xs font-sans font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-700"></span>
          작성 형태
        </div>
        <span className="text-[11px] font-sans text-[#111827]/60 font-medium">
          현재 선택: <b className="text-[#111827] font-bold font-serif">{format}</b>
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
                  ? 'bg-amber-100/60 border-[#111827] text-[#111827] shadow-xs ring-2 ring-[#111827]/20'
                  : 'bg-[#F9FAFB] border-[#111827]/10 text-stone-600 hover:bg-[#E5E7EB] hover:text-[#111827]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected
                        ? 'bg-[#111827] text-[#F9FAFB]'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {fmt.icon}
                  </div>
                  <span className="text-sm font-bold font-serif text-[#111827]">
                    {fmt.label}
                  </span>
                </div>
                {isSelected && (
                  <span className="p-1 rounded-full bg-[#111827] text-[#F9FAFB]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <p className="text-[11.5px] text-[#111827]/70 leading-snug">
                {fmt.description}
              </p>

              <div className="px-2.5 py-1.5 rounded-lg bg-white border border-[#111827]/10 text-[10px] text-[#111827]/60 font-serif italic truncate">
                {fmt.exampleText}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

