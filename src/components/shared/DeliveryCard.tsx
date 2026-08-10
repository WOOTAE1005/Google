import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Relationship, OccasionCategory, MessageFormat, PromptKeyword } from '../../types';
import {
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  Heart,
  Flower2,
  ExternalLink,
  Smartphone,
} from 'lucide-react';

interface DeliveryCardProps {
  relationship: Relationship;
  category: OccasionCategory;
  primaryKeyword: PromptKeyword;
  format: MessageFormat;
  messageContent: string;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  relationship,
  category,
  primaryKeyword,
  format,
  messageContent,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedShareText, setCopiedShareText] = useState(false);
  const [activeTab, setActiveTab] = useState<'card' | 'kakaotalk'>('card');

  const handleCopyContent = () => {
    navigator.clipboard.writeText(messageContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedShareText = `[${category} 멘트] ${relationship.name}님께 전하는 마음\n-------------------\n${messageContent}\n-------------------\n- 경조사 멘트 AI 도우미에서 생성됨`;

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(formattedShareText);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2500);
  };

  const handleSimulateKakaoShare = () => {
    handleCopyShareText();
    alert('카카오톡 공유 문구가 클립보드에 복사되었습니다. 원하시는 대화방에 붙여넣어 전송하세요!');
  };

  const isCelebration = category === '경사';

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-600" />
            전달용 카드 & 카카오톡 미니 미리보기
          </h3>
          <p className="text-xs text-stone-500">
            {relationship.name}님께 전달될 아름다운 연출 카드를 확인하세요.
          </p>
        </div>

        {/* View Switch Tabs */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'card'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            격식 서체 카드
          </button>
          <button
            onClick={() => setActiveTab('kakaotalk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kakaotalk'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            카톡 메시지 창
          </button>
        </div>
      </div>

      {/* Card Preview Area */}
      {activeTab === 'card' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-lg mx-auto"
        >
          {/* Card Surface - Traditional Hanji / Elegant Ivory Paper Texture */}
          <div
            className={`relative p-6 sm:p-8 rounded-3xl shadow-md border transition-all ${
              isCelebration
                ? 'bg-[#FCF9F2] border-amber-300 text-stone-900'
                : 'bg-[#F6F7F8] border-slate-300 text-stone-900'
            }`}
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600/40" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600/40" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600/40" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600/40" />

            {/* Badge Banner */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 shadow-xs">
                {category} • {primaryKeyword.keywordLabel}
              </span>
              <span className="text-xs text-stone-500 font-serif italic">
                To. {relationship.name}님
              </span>
            </div>

            {/* Message Card Text Content */}
            <div className="my-6 py-4 px-2 text-center">
              <p className="text-sm sm:text-base leading-relaxed tracking-wide font-serif text-stone-800 whitespace-pre-wrap">
                {messageContent}
              </p>
            </div>

            {/* Footer Signature */}
            <div className="pt-4 border-t border-stone-300/60 flex justify-between items-center text-xs text-stone-500">
              <span className="flex items-center gap-1 font-serif">
                {isCelebration ? (
                  <Flower2 className="w-3.5 h-3.5 text-amber-700" />
                ) : (
                  <Heart className="w-3.5 h-3.5 text-slate-700" />
                )}
                마음을 담아 올림
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                {new Date().toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        /* KakaoTalk Mock Chat Screen */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto bg-[#b2c7da] rounded-2xl p-4 shadow-inner border border-slate-300 text-slate-900"
        >
          {/* Mock Chat Header */}
          <div className="text-center text-xs font-bold text-slate-700 mb-3 bg-white/50 py-1 rounded-full max-w-[200px] mx-auto shadow-xs">
            {relationship.name}님과의 대화창
          </div>

          {/* Received/Sent Message Bubble */}
          <div className="flex items-start gap-2.5 my-2">
            <div className="w-9 h-9 rounded-full bg-stone-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              나
            </div>
            <div className="space-y-1 max-w-[85%]">
              <div className="text-[10px] text-slate-700 font-medium">
                {relationship.name}
              </div>
              <div className="bg-[#fee500] text-slate-950 p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {messageContent}
              </div>
              <div className="text-[9px] text-slate-600 text-right pr-1">
                오전 10:15 • 읽음 1
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons Bar */}
      <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleCopyContent}
          className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          {copied ? '문구 복사됨' : '본문 텍스트 복사'}
        </button>

        <button
          type="button"
          onClick={handleSimulateKakaoShare}
          className="px-5 py-2.5 rounded-xl bg-[#fee500] hover:bg-[#ebd300] text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          카카오톡 전송용 포맷 공유
        </button>
      </div>
    </div>
  );
};
