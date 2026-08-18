import React from 'react';
import { History, UserCheck, BookOpen, Mail } from 'lucide-react';
import { Relationship } from '../../types';

interface HeaderProps {
  currentRelationship: Relationship | null;
  onOpenRelationshipPicker: () => void;
  onOpenHistory: () => void;
  onOpenEtiquette?: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRelationship,
  onOpenRelationshipPicker,
  onOpenHistory,
  onOpenEtiquette,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#2C2621]/10 text-[#2C2621] shadow-2xs font-serif">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Logo & Service Name */}
        <div className="flex items-center gap-3 min-w-0 shrink">
          <div className="w-9 h-9 rounded-xl bg-[#2C2621] flex items-center justify-center text-[#FAF6F0] font-bold shadow-md shadow-[#2C2621]/10 font-serif shrink-0">
            <Mail className="w-4 h-4 text-amber-300" />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-lg tracking-widest text-[#2C2621] truncate">
              마음담음
            </h1>
            <p className="text-[11px] text-[#2C2621]/60 font-sans hidden sm:block truncate">
              한 장의 엽서를 써내려가듯 따스한 마음과 격식을 담아내는 AI 레터 스튜디오
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 font-sans shrink-0">
          {/* Target Relationship Badge */}
          <button
            onClick={onOpenRelationshipPicker}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5EFE6] border border-[#2C2621]/15 text-xs text-[#2C2621] shadow-2xs transition-all cursor-pointer min-w-0"
            title="수신자/관계 설정 변경"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <div className="text-left min-w-0">
              <div className="text-[10px] text-[#2C2621]/50 leading-none hidden sm:block">To. 수신 대상</div>
              <div className="font-semibold text-[#2C2621] max-w-[64px] sm:max-w-[140px] truncate">
                {currentRelationship ? currentRelationship.name : '대상을 선택해주세요'}
              </div>
            </div>
          </button>

          {/* Etiquette Guide Trigger */}
          {onOpenEtiquette && (
            <button
              onClick={onOpenEtiquette}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-100 border border-amber-300/80 text-xs text-amber-950 font-bold shadow-2xs transition-all cursor-pointer"
              title="경조사 봉투 한자 & 예법 가이드"
            >
              <BookOpen className="w-4 h-4 text-amber-800" />
              <span className="hidden sm:inline">예법 가이드</span>
            </button>
          )}

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5EFE6] border border-[#2C2621]/15 text-xs text-[#2C2621] shadow-2xs transition-all cursor-pointer"
            title="생성 기록 보기"
          >
            <History className="w-4 h-4 text-[#2C2621]/60" />
            <span className="hidden sm:inline">기록</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#2C2621] text-[#FAF6F0] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

