import React from 'react';
import { HeartHandshake, History, Sparkles, UserCheck } from 'lucide-react';
import { Relationship } from '../../types';

interface HeaderProps {
  currentRelationship: Relationship | null;
  onOpenRelationshipPicker: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRelationship,
  onOpenRelationshipPicker,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-stone-200/80 text-stone-800 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Service Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-amber-50 font-bold shadow-md shadow-amber-600/15">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-stone-900">
                경조사 멘트 AI
              </h1>
              <span className="text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                MVP
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              마음을 전하는 따스하고 격식있는 경조사 맞춤 문구 도우미
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Target Relationship Badge */}
          <button
            onClick={onOpenRelationshipPicker}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs text-stone-700 shadow-xs transition-all cursor-pointer"
            title="수신자/관계 설정 변경"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
            <div className="text-left">
              <div className="text-[10px] text-stone-400 leading-none">수신 대상</div>
              <div className="font-semibold text-stone-800 max-w-[100px] sm:max-w-[140px] truncate">
                {currentRelationship ? currentRelationship.name : '대상 선택 안됨'}
              </div>
            </div>
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs text-stone-700 shadow-xs transition-all cursor-pointer"
            title="생성 기록 보기"
          >
            <History className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">기록</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-600 text-white font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
