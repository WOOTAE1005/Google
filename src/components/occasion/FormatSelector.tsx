import React from 'react';
import { MessageFormat } from '../../types';
import { MessageSquare, Send, FileText, Check } from 'lucide-react';

interface FormatSelectorProps {
  format: MessageFormat;
  onSelectFormat: (fmt: MessageFormat) => void;
  // 일반편지 모드에서는 짧은 형식(문자/카톡)뿐 아니라 긴 "편지" 형식도
  // 선택지로 열어준다 — 경조사 모드는 기존 2종만 유지.
  allowLetterFormat?: boolean;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  format,
  onSelectFormat,
  allowLetterFormat = false,
}) => {
  const formats: {
    id: MessageFormat;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: '문자',
      label: '문자 (SMS/LMS)',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: '카톡메시지',
      label: '카톡 메시지',
      icon: <Send className="w-4 h-4" />,
    },
    ...(allowLetterFormat
      ? [
          {
            id: '편지' as MessageFormat,
            label: '편지 (긴 글)',
            icon: <FileText className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#3D2B31]/10 pb-3">
        <div className="text-xs font-sans font-bold text-[#3D2B31] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-700"></span>
          작성 형태
        </div>
        <span className="text-[11px] font-sans text-[#3D2B31]/60 font-medium">
          현재 선택: <b className="text-[#3D2B31] font-bold font-serif">{format}</b>
        </span>
      </div>

      {/* Format Selection Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${allowLetterFormat ? 'md:grid-cols-3' : ''} gap-3 font-sans`}>
        {formats.map((fmt) => {
          const isSelected = format === fmt.id;
          return (
            <button
              type="button"
              key={fmt.id}
              onClick={() => onSelectFormat(fmt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-brand-100/60 border-[#3D2B31] text-[#3D2B31] shadow-xs ring-2 ring-[#3D2B31]/20'
                  : 'bg-[#FFFAFA] border-[#3D2B31]/10 text-stone-600 hover:bg-[#FBE4E8] hover:text-[#3D2B31]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isSelected
                      ? 'bg-[#3D2B31] text-[#FFFAFA]'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {fmt.icon}
                </div>
                <span className="text-sm font-bold font-serif text-[#3D2B31]">
                  {fmt.label}
                </span>
              </div>
              {isSelected && (
                <span className="p-1 rounded-full bg-[#3D2B31] text-[#FFFAFA]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

