import React from 'react';
import { HeartHandshake, History, Sparkles, UserCheck, BookOpen, Mail } from 'lucide-react';
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
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Service Name - Proposal 1 Poetic Aesthetic */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2C2621] flex items-center justify-center text-[#FAF6F0] font-bold shadow-md shadow-[#2C2621]/10 font-serif">
            <Mail className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-lg tracking-widest text-[#2C2621]">
                Dear. Letter
              </h1>
              <span className="text-[10px] font-sans font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60">
                시안 1: 미니멀 엽서
              </span>
            </div>
            <p className="text-[11px] text-[#2C2621]/60 font-sans hidden sm:block">
              한 장의 엽서를 써내려가듯 따스한 마음과 격식을 담아내는 AI 레터 스튜디오
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 font-sans">
          {/* Target Relationship Badge */}
          <button
            onClick={onOpenRelationshipPicker}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5EFE6] border border-[#2C2621]/15 text-xs text-[#2C2621] shadow-2xs transition-all cursor-pointer"
            title="수신자/관계 설정 변경"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
            <div className="text-left">
              <div className="text-[10px] text-[#2C2621]/50 leading-none">To. 수신 대상</div>
              <div className="font-semibold text-[#2C2621] max-w-[100px] sm:max-w-[140px] truncate">
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

