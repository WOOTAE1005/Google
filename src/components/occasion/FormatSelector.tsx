import React from 'react';
import { MessageFormat } from '../../types';
import { Mail, MessageSquare, Send, Info, Check } from 'lucide-react';

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
    targetUse: string;
    lengthGuide: string;
    feature: string;
    exampleText: string;
    icon: React.ReactNode;
    badgeColor: string;
  }[] = [
    {
      id: '봉투문구',
      label: '봉투 문구 (초단문)',
      targetUse: '경조금 봉투, 화환 리본, 카드 표지',
      lengthGuide: '10~25자 내외 초단문',
      feature: '한자/표제어 중심 격식 단문',
      exampleText: '예: 祝結婚 • 삼가 고인의 명복을 빕니다',
      icon: <Mail className="w-4 h-4" />,
      badgeColor: 'bg-amber-800 text-amber-100',
    },
    {
      id: '문자',
      label: '문자 (SMS / LMS)',
      targetUse: '어르신, 직장 상사, 거래처 격식 서신',
      lengthGuide: '100~300자 정중한 단락',
      feature: '안부 + 본문 + 기원 표준 문단',
      exampleText: '예: 안녕하십니까, 기쁜 경사에 마음 깊이...',
      icon: <MessageSquare className="w-4 h-4" />,
      badgeColor: 'bg-emerald-800 text-emerald-100',
    },
    {
      id: '카톡메시지',
      label: '카톡 메시지 (모바일)',
      targetUse: '친구, 동료, 친근한 대상 카톡 대화방',
      lengthGuide: '50~150자 가독성 톡',
      feature: '줄바꿈 깔끔, 따뜻한 어조 & 감성 카드',
      exampleText: '예: OO님! 소중한 경사 너무 축하드려요 🎉',
      icon: <Send className="w-4 h-4" />,
      badgeColor: 'bg-amber-600 text-white',
    },
  ];

  return (
    <div className="bg-white border border-[#2C2621]/15 rounded-2xl p-4 sm:p-5 shadow-md shadow-[#2C2621]/5 space-y-4">
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
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-amber-100/60 border-[#2C2621] text-[#2C2621] shadow-xs ring-2 ring-[#2C2621]/20'
                  : 'bg-[#FAF6F0] border-[#2C2621]/10 text-stone-600 hover:bg-[#F2ECE1] hover:text-[#2C2621]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-[#2C2621] text-[#FAF6F0] font-bold'
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
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-bold text-[#2C2621] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0" />
                    용도: {fmt.targetUse}
                  </div>
                  <div className="text-[11px] text-[#2C2621]/70">
                    • 분량: <b>{fmt.lengthGuide}</b>
                  </div>
                  <div className="text-[11px] text-[#2C2621]/70">
                    • 특징: {fmt.feature}
                  </div>
                </div>
              </div>

              {/* Example Snippet Box */}
              <div className="p-2 rounded-lg bg-white border border-[#2C2621]/10 text-[10px] text-[#2C2621]/60 font-serif italic">
                {fmt.exampleText}
              </div>
            </button>
          );
        })}
      </div>

      {/* Format Comparison Helper */}
      <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#2C2621]/10 text-xs text-[#2C2621]/80 space-y-1.5 font-sans">
        <div className="font-bold text-[#2C2621] flex items-center gap-1.5 text-[11px]">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          작성 형태별 주요 차이점 안내
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] leading-relaxed text-[#2C2621]/80">
          <div className="bg-white p-2.5 rounded-lg border border-[#2C2621]/10">
            <b className="text-[#2C2621]">✉️ 봉투 문구:</b> 축의금/조의금 봉투 표지나 화환 리본용 단문 표제어 (한자/한글 1문장)
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-[#2C2621]/10">
            <b className="text-[#2C2621]">💬 문자 (SMS/LMS):</b> 어르신이나 격식 있는 분께 전하는 안부+본문+결언 서체
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-[#2C2621]/10">
            <b className="text-[#2C2621]">📱 카톡 메시지:</b> 메신저 줄바꿈 감성과 모바일 공유용 카드 제작에 최적화된 문구
          </div>
        </div>
      </div>
    </div>
  );
};

