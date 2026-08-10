import React from 'react';
import { MessageFormat } from '../../types';
import { Mail, MessageSquare, Send } from 'lucide-react';

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
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: '봉투문구',
      label: '봉투 문구',
      desc: '10~25자 내외 격식 표제어',
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: '문자',
      label: '문자 (SMS/LMS)',
      desc: '3~5문장 정중한 단락 글',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: '카톡메시지',
      label: '카톡 메시지',
      desc: '가독성 좋고 따뜻한 톡',
      icon: <Send className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
        STEP 5. 작성 형태 (Format) 선택
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {formats.map((fmt) => {
          const isSelected = format === fmt.id;
          return (
            <button
              type="button"
              key={fmt.id}
              onClick={() => onSelectFormat(fmt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/80 border-amber-400 text-stone-900 shadow-xs ring-1 ring-amber-400/30'
                  : 'bg-stone-50/60 border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {fmt.icon}
              </div>
              <div>
                <div
                  className={`text-sm font-bold ${
                    isSelected ? 'text-amber-950' : 'text-stone-800'
                  }`}
                >
                  {fmt.label}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">{fmt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
