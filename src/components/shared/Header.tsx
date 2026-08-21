import React from 'react';
import { History, UserCheck, BookOpen } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-[#FFFAFA]/95 backdrop-blur-md border-b border-[#3D2B31]/10 text-[#3D2B31] shadow-2xs font-serif">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Logo & Service Name */}
        <div className="flex items-center gap-3 min-w-0 shrink">
          <div className="w-9 h-9 rounded-xl bg-[#FFFAFA] border border-[#3D2B31]/10 overflow-hidden shrink-0">
            <img
              src="/logo.png"
              alt="마음담음 로고"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg tracking-widest text-[#3D2B31] truncate">
              마음담음
            </h1>
            <p className="text-[11px] text-[#3D2B31]/60 font-sans hidden sm:block truncate">
              AI 경조사 메시지 카피라이터
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 font-sans shrink-0">
          {/* Target Relationship Badge */}
          <button
            onClick={onOpenRelationshipPicker}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-[#FBE4E8] border border-[#3D2B31]/15 text-xs text-[#3D2B31] shadow-2xs transition-all cursor-pointer min-w-0"
            title="수신자/관계 설정 변경"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-700 shrink-0" />
            <div className="text-left min-w-0">
              <div className="text-[10px] text-[#3D2B31]/50 leading-none hidden sm:block">To. 수신 대상</div>
              <div className="font-semibold text-[#3D2B31] max-w-[104px] sm:max-w-[140px] truncate">
                {currentRelationship ? currentRelationship.name : '대상을 선택해주세요'}
              </div>
            </div>
          </button>

          {/* Etiquette Guide Trigger */}
          {onOpenEtiquette && (
            <button
              onClick={onOpenEtiquette}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-100/70 hover:bg-brand-100 border border-brand-300/80 text-xs text-brand-950 font-bold shadow-2xs transition-all cursor-pointer"
              title="경조사 봉투 한자 & 예법 가이드"
            >
              <BookOpen className="w-4 h-4 text-brand-800" />
              <span className="hidden sm:inline">예법 가이드</span>
            </button>
          )}

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FBE4E8] border border-[#3D2B31]/15 text-xs text-[#3D2B31] shadow-2xs transition-all cursor-pointer"
            title="생성 기록 보기"
          >
            <History className="w-4 h-4 text-[#3D2B31]/60" />
            <span className="hidden sm:inline">기록</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#3D2B31] text-[#FFFAFA] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

