import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { toPng, toBlob } from 'html-to-image';
import {
  Relationship,
  LetterCategory,
  MessageFormat,
  PromptKeyword,
  CardLayoutStyleId,
  CardLayoutStyleConfig,
  CardColorPaletteId,
  CardColorPaletteConfig,
} from '../../types';
import { withHonorific } from '../../lib/format';
import { trackCardPreference } from '../../lib/analytics';
import { ensureKakaoReady, shareCardFeed, shareCardText } from '../../lib/kakaoShare';
import { uploadCardImage } from '../../lib/cardUpload';
import {
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  Heart,
  Flower2,
  ChevronDown,
  ChevronUp,
  Smartphone,
  MessageSquare,
  Palette,
  Layout,
  Mail,
  Award,
  Download,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

interface DeliveryCardProps {
  relationship: Relationship;
  category: LetterCategory;
  primaryKeyword: PromptKeyword | null;
  format: MessageFormat;
  messageContent: string;
}

const LAYOUT_STYLES: CardLayoutStyleConfig[] = [
  {
    id: 'traditional_frame',
    name: '전통 고풍 액자',
    subtitle: '네 귀퉁이 고풍 문양 & 정통 액자 라인',
    icon: '📜',
  },
  {
    id: 'envelope_slit',
    name: '격식 봉투 편지지',
    subtitle: '봉투 헤더 상단 플랩 & 속지 삽입 디테일',
    icon: '✉️',
  },
  {
    id: 'minimal_editorial',
    name: '모던 에디토리얼',
    subtitle: '단정한 버티컬 라인 & 현대적 에디토리얼',
    icon: '✨',
  },
  {
    id: 'curved_arch',
    name: '우아한 아치 프레임',
    subtitle: '상단 돔 아치 곡선 & 로맨틱 감성',
    icon: '🏛️',
  },
  {
    id: 'seal_pendant',
    name: '프리미엄 엠블럼',
    subtitle: '상단 엠블럼 오너먼트 & 더블 프레임',
    icon: '👑',
  },
];

const COLOR_PALETTES: CardColorPaletteConfig[] = [
  {
    id: 'hanji_cream',
    name: '단아한 한지 크림',
    icon: '🍶',
    bgClass: 'bg-[#FAF4E8] shadow-amber-950/10',
    borderClass: 'border-[#b8860b]/60',
    textClass: 'text-[#2b1f17]',
    accentClass: 'border-[#b8860b]/60 text-[#8b5a2b]',
    badgeClass: 'bg-[#f4e8d3] border border-[#d4af37]/60 text-[#4a3525]',
    swatchBg: 'bg-[#FAF4E8] border-[#b8860b]',
    outerBgClass: 'bg-[#F7F0E3]',
    primaryBtnClass: 'bg-[#8b5a2b] hover:bg-[#724820] text-white',
    secondaryBtnClass: 'bg-[#2b1f17] hover:bg-[#1a120c] text-amber-100',
  },
  {
    id: 'autumn_burgundy',
    name: '버건디 머스타드',
    icon: '🍇',
    bgClass: 'bg-[#fbf6f8] shadow-purple-950/10',
    borderClass: 'border-[#5d0e3e]',
    textClass: 'text-[#380625]',
    accentClass: 'border-[#5d0e3e] text-[#5d0e3e]',
    badgeClass: 'bg-[#5d0e3e] border border-[#d5b546] text-[#f2e2a8]',
    swatchBg: 'bg-[#5d0e3e] border-[#d5b546]',
    outerBgClass: 'bg-[#f4e6ec]',
    primaryBtnClass: 'bg-[#5d0e3e] hover:bg-[#470a2f] text-[#f2e2a8]',
    secondaryBtnClass: 'bg-[#380625] hover:bg-[#210315] text-white',
  },
  {
    id: 'terracotta_olive',
    name: '테라코타 앰버 & 올리브',
    icon: '🍁',
    bgClass: 'bg-[#fdf8f3] shadow-orange-950/10',
    borderClass: 'border-[#8c5123]',
    textClass: 'text-[#4a2810]',
    accentClass: 'border-[#8c5123] text-[#8c5123]',
    badgeClass: 'bg-[#f2913d] border border-[#8c5123] text-white',
    swatchBg: 'bg-[#f2913d] border-[#6f7332]',
    outerBgClass: 'bg-[#fbeee0]',
    primaryBtnClass: 'bg-[#f2913d] hover:bg-[#db7a28] text-white',
    secondaryBtnClass: 'bg-[#6f7332] hover:bg-[#565926] text-white',
  },
  {
    id: 'linen_sage',
    name: '리넨 세이지 & 슬레이트',
    icon: '🌿',
    bgClass: 'bg-[#f0e7e2] shadow-stone-900/10',
    borderClass: 'border-[#5b6759]',
    textClass: 'text-[#2c352a]',
    accentClass: 'border-[#5b6759] text-[#5b6759]',
    badgeClass: 'bg-[#efc476] border border-[#5b6759] text-[#3d2f10]',
    swatchBg: 'bg-[#f0e7e2] border-[#5b6759]',
    outerBgClass: 'bg-[#e5ded8]',
    primaryBtnClass: 'bg-[#5b6759] hover:bg-[#465144] text-white',
    secondaryBtnClass: 'bg-[#3d2f10] hover:bg-[#291f0a] text-[#efc476]',
  },
  {
    id: 'ochre_persimmon',
    name: '오커 감귤 & 에스프레소',
    icon: '🍊',
    bgClass: 'bg-[#fdf6f0] shadow-orange-950/10',
    borderClass: 'border-[#ef6a30]',
    textClass: 'text-[#3a0800]',
    accentClass: 'border-[#4b0a00] text-[#4b0a00]',
    badgeClass: 'bg-[#ef6a30] border border-[#4b0a00] text-white',
    swatchBg: 'bg-[#ef6a30] border-[#4b0a00]',
    outerBgClass: 'bg-[#fae8de]',
    primaryBtnClass: 'bg-[#ef6a30] hover:bg-[#d55219] text-white',
    secondaryBtnClass: 'bg-[#4b0a00] hover:bg-[#320600] text-amber-100',
  },
  {
    id: 'forest_oat',
    name: '포레스트 숲 & 오트',
    icon: '🍃',
    bgClass: 'bg-[#eae6d9] shadow-emerald-950/10',
    borderClass: 'border-[#588d67]',
    textClass: 'text-[#1f3625]',
    accentClass: 'border-[#588d67] text-[#588d67]',
    badgeClass: 'bg-[#588d67] border border-[#c6b587] text-white',
    swatchBg: 'bg-[#eae6d9] border-[#588d67]',
    outerBgClass: 'bg-[#dedacb]',
    primaryBtnClass: 'bg-[#588d67] hover:bg-[#436e4f] text-white',
    secondaryBtnClass: 'bg-[#1f3625] hover:bg-[#112116] text-[#eae6d9]',
  },
  {
    id: 'dusty_lavender',
    name: '더스티 라벤더 & 바이올렛',
    icon: '🪻',
    bgClass: 'bg-[#f3edf2] shadow-purple-950/10',
    borderClass: 'border-[#b895af]',
    textClass: 'text-[#2f2342]',
    accentClass: 'border-[#6f5e8e] text-[#6f5e8e]',
    badgeClass: 'bg-[#b895af] border border-[#6f5e8e] text-white',
    swatchBg: 'bg-[#b895af] border-[#6f5e8e]',
    outerBgClass: 'bg-[#e8dfe7]',
    primaryBtnClass: 'bg-[#6f5e8e] hover:bg-[#564870] text-white',
    secondaryBtnClass: 'bg-[#2f2342] hover:bg-[#1e162b] text-[#f3edf2]',
  },
  {
    id: 'soft_clay',
    name: '소프트 클레이 & 웜스톤',
    icon: '🏺',
    bgClass: 'bg-[#e3dddd] shadow-stone-900/10',
    borderClass: 'border-[#d87d46]',
    textClass: 'text-[#3d2618]',
    accentClass: 'border-[#d87d46] text-[#d87d46]',
    badgeClass: 'bg-[#d87d46] border border-[#bab09b] text-white',
    swatchBg: 'bg-[#e3dddd] border-[#d87d46]',
    outerBgClass: 'bg-[#dad2d2]',
    primaryBtnClass: 'bg-[#d87d46] hover:bg-[#bf6832] text-white',
    secondaryBtnClass: 'bg-[#3d2618] hover:bg-[#28180e] text-[#e3dddd]',
  },
  {
    id: 'deep_steel_amber',
    name: '딥스틸 & 앰버 썬셋',
    icon: '🌅',
    bgClass: 'bg-[#f0f4f6] shadow-cyan-950/10',
    borderClass: 'border-[#446672]',
    textClass: 'text-[#1a2b32]',
    accentClass: 'border-[#446672] text-[#446672]',
    badgeClass: 'bg-[#f78200] border border-[#446672] text-white',
    swatchBg: 'bg-[#446672] border-[#f78200]',
    outerBgClass: 'bg-[#dbe4e8]',
    primaryBtnClass: 'bg-[#f78200] hover:bg-[#d67100] text-slate-950 font-black',
    secondaryBtnClass: 'bg-[#446672] hover:bg-[#324c56] text-white',
  },
  {
    id: 'warm_camel',
    name: '웜 카멜 & 샌드',
    icon: '🌾',
    bgClass: 'bg-[#eae5da] shadow-amber-950/10',
    borderClass: 'border-[#be977c]',
    textClass: 'text-[#402d20]',
    accentClass: 'border-[#be977c] text-[#be977c]',
    badgeClass: 'bg-[#f4ab1a] border border-[#be977c] text-[#332000]',
    swatchBg: 'bg-[#eae5da] border-[#be977c]',
    outerBgClass: 'bg-[#ded7c8]',
    primaryBtnClass: 'bg-[#f4ab1a] hover:bg-[#d69211] text-[#3a0800]',
    secondaryBtnClass: 'bg-[#402d20] hover:bg-[#2b1d14] text-[#eae5da]',
  },
  {
    id: 'royal_indigo_gold',
    name: '로얄 인디고 & 미스트 골드',
    icon: '🌌',
    bgClass: 'bg-[#1b2e44] shadow-slate-950/40',
    borderClass: 'border-[#dcb25e]',
    textClass: 'text-[#f1f5f9]',
    accentClass: 'border-[#8dadba] text-[#8dadba]',
    badgeClass: 'bg-[#dcb25e] border border-[#8dadba] text-[#1b2e44]',
    swatchBg: 'bg-[#233c5a] border-[#dcb25e]',
    outerBgClass: 'bg-[#0e1b2a]',
    primaryBtnClass: 'bg-[#dcb25e] hover:bg-[#c49a46] text-[#0e1b2a]',
    secondaryBtnClass: 'bg-[#233c5a] hover:bg-[#16273c] text-white border border-[#dcb25e]/40',
  },
  {
    id: 'bordeaux_apricot',
    name: '보르도 와인 & 살구 앰버',
    icon: '🍷',
    bgClass: 'bg-[#f0e5e3] shadow-rose-950/10',
    borderClass: 'border-[#752e4c]',
    textClass: 'text-[#3b1123]',
    accentClass: 'border-[#752e4c] text-[#752e4c]',
    badgeClass: 'bg-[#752e4c] border border-[#eba672] text-[#fce8de]',
    swatchBg: 'bg-[#f0e5e3] border-[#752e4c]',
    outerBgClass: 'bg-[#e8dada]',
    primaryBtnClass: 'bg-[#752e4c] hover:bg-[#5a223a] text-[#fce8de]',
    secondaryBtnClass: 'bg-[#eba672] hover:bg-[#d8915b] text-[#3b1123]',
  },
  {
    id: 'sober_slate',
    name: '경건한 단청 슬레이트',
    icon: '🕯️',
    bgClass: 'bg-gradient-to-br from-[#EAECEE] via-[#E2E5E8] to-[#D5D8DC] shadow-slate-900/15',
    borderClass: 'border-slate-500/80',
    textClass: 'text-slate-950',
    accentClass: 'border-slate-600 text-slate-800',
    badgeClass: 'bg-slate-800 border border-slate-700 text-slate-100',
    swatchBg: 'bg-slate-200 border-slate-600',
    outerBgClass: 'bg-[#c9ced4]',
    primaryBtnClass: 'bg-slate-800 hover:bg-slate-900 text-slate-100',
    secondaryBtnClass: 'bg-slate-600 hover:bg-slate-700 text-white',
  },
  {
    // 60(눈꽃 배경) : 30(종이 카드) : 10(잉크 포인트) 비율 — 경사/조사 모두에 어울리는 톤
    id: 'rosewood_ink',
    name: '장미빛 잉크',
    icon: '🌹',
    bgClass: 'bg-[#FFFDFB] shadow-rose-950/10',
    borderClass: 'border-[#9B4E59]',
    textClass: 'text-[#3D2B31]',
    accentClass: 'border-[#9B4E59] text-[#9B4E59]',
    badgeClass: 'bg-[#9B4E59] border border-[#9B4E59]/60 text-[#FFFDFB]',
    swatchBg: 'bg-[#FFFDFB] border-[#9B4E59]',
    outerBgClass: 'bg-[#FFFAFA]',
    primaryBtnClass: 'bg-[#9B4E59] hover:bg-[#7d3d47] text-white',
    secondaryBtnClass: 'bg-[#3D2B31] hover:bg-[#2a1d22] text-[#FFFDFB]',
  },
];

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  relationship,
  category,
  primaryKeyword,
  format,
  messageContent,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [copiedShareText, setCopiedShareText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [downloadedSuccess, setDownloadedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'card' | 'kakaotalk'>('card');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Layout and Palette State
  const [selectedLayoutId, setSelectedLayoutId] = useState<CardLayoutStyleId>('traditional_frame');

  const defaultPaletteId: CardColorPaletteId = category === '조사' ? 'sober_slate' : 'hanji_cream';
  const [selectedPaletteId, setSelectedPaletteId] = useState<CardColorPaletteId>(defaultPaletteId);

  const currentLayout = LAYOUT_STYLES.find((l) => l.id === selectedLayoutId) || LAYOUT_STYLES[0];
  const currentPalette = COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || COLOR_PALETTES[0];

  const handleCopyContent = () => {
    navigator.clipboard.writeText(messageContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedShareText = `[${category} 멘트] ${withHonorific(relationship.name)}께 전하는 마음\n-------------------\n${messageContent}\n-------------------\n- 경조사 멘트 AI 도우미에서 생성됨`;

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(formattedShareText);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2500);
  };

  // Image Export Handlers
  const handleDownloadCardImage = async () => {
    if (!cardRef.current) return;
    trackCardPreference(selectedLayoutId, selectedPaletteId);
    setIsGeneratingImage(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `${withHonorific(relationship.name)}_${category}_감성_카드.png`;
      link.href = dataUrl;
      link.click();
      setDownloadedSuccess(true);
      setTimeout(() => setDownloadedSuccess(false), 3000);
    } catch (err) {
      console.error('Card image download error:', err);
      alert('카드 이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopyCardImage = async () => {
    if (!cardRef.current) return;
    trackCardPreference(selectedLayoutId, selectedPaletteId);
    setIsGeneratingImage(true);
    try {
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      if (!blob) throw new Error('Blob creation failed');

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setImageCopied(true);
        setTimeout(() => setImageCopied(false), 3000);
      } else {
        await handleDownloadCardImage();
      }
    } catch (err) {
      console.error('Copy card image error:', err);
      await handleDownloadCardImage();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // OS-level share sheet (mobile) / clipboard copy (desktop) fallback — used
  // directly when Kakao isn't configured, and as the last resort if the real
  // Kakao share call itself fails.
  const handleShareCardImage = async () => {
    if (!cardRef.current) return;
    trackCardPreference(selectedLayoutId, selectedPaletteId);
    setIsGeneratingImage(true);
    try {
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      if (!blob) throw new Error('Blob creation failed');

      const file = new File([blob], `${withHonorific(relationship.name)}_${category}_카드.png`, {
        type: 'image/png',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `To. ${withHonorific(relationship.name)}께 전하는 ${category} 카드`,
          text: messageContent,
          files: [file],
        });
      } else {
        await handleCopyCardImage();
        alert('카드 이미지가 클립보드에 복사되었습니다! 카카오톡 대화창에 붙여넣기(Paste)하세요.');
      }
    } catch (err) {
      console.error('Share card image error:', err);
      await handleDownloadCardImage();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Real KakaoTalk share (src/lib/kakaoShare.ts). Uploads the card image to
  // Firebase Storage first so Kakao's feed template has a fetchable imageUrl;
  // falls back to a text-only Kakao share if Storage isn't configured, and to
  // the OS share sheet / clipboard if the Kakao JS key itself isn't set.
  const handleKakaoShare = async () => {
    if (!cardRef.current) return;
    trackCardPreference(selectedLayoutId, selectedPaletteId);
    setIsGeneratingImage(true);
    try {
      const kakaoReady = await ensureKakaoReady();
      if (!kakaoReady) {
        await handleShareCardImage();
        return;
      }

      const blob = await toBlob(cardRef.current, { pixelRatio: 2, cacheBust: true });
      if (!blob) throw new Error('Blob creation failed');

      const linkUrl = window.location.href;
      const imageUrl = await uploadCardImage(blob);

      if (imageUrl) {
        shareCardFeed({
          title: `To. ${withHonorific(relationship.name)}께 전하는 ${category} 카드`,
          description: messageContent.length > 60 ? `${messageContent.slice(0, 60)}…` : messageContent,
          imageUrl,
          link: { mobileWebUrl: linkUrl, webUrl: linkUrl },
        });
      } else {
        // Firebase Storage not configured — share the text instead of failing silently.
        shareCardText(formattedShareText, linkUrl);
      }
    } catch (err) {
      console.error('Kakao share error:', err);
      await handleShareCardImage();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSmsShare = () => {
    const encoded = encodeURIComponent(messageContent);
    window.location.href = `sms:?body=${encoded}`;
  };

  const isCelebration = category === '경사';

  return (
    <div
      className={`border rounded-3xl px-4 sm:px-6 py-7 sm:py-10 space-y-5 transition-colors duration-300 ${
        currentPalette.outerBgClass || 'bg-[#FAF7F0]'
      } border-stone-200/70`}
    >
      {/* Header & View Switch Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-900/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-700" />
              감성 카드리폼 & 전송 미리보기
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-brand-700 text-white text-[10px] font-bold">
              {format}
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            배경지, 카드 원지, 버튼 포인트가 한눈에 어우러지는 감성 카드 디자인입니다.
          </p>
        </div>

        {/* View Switch Tabs */}
        <div className="flex bg-stone-900/10 p-1 rounded-xl border border-stone-900/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'card'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-200" />
            격식 디자인 카드
          </button>
          <button
            onClick={() => setActiveTab('kakaotalk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kakaotalk'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-brand-200" />
            카톡 메시지 창
          </button>
        </div>
      </div>

      {/* Card Customizer Toolbar (Visible in 'card' view) */}
      {activeTab === 'card' && (
        <div className="space-y-2">
          {/* Collapsed summary — expands into the full layout/palette pickers */}
          <button
            type="button"
            onClick={() => setIsCustomizerOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 p-3 rounded-xl bg-white/80 border border-stone-300/80 text-xs cursor-pointer"
          >
            <span className="flex items-center gap-2 min-w-0 text-stone-800">
              <Layout className="w-4 h-4 text-brand-700 shrink-0" />
              <span className="truncate">
                <b className="font-bold text-stone-900">{currentLayout.name}</b>
                <span className="text-stone-400 mx-1.5">·</span>
                <b className="font-bold text-stone-900">{currentPalette.name}</b>
              </span>
            </span>
            <span className="flex items-center gap-1 font-bold text-brand-800 shrink-0">
              디자인 변경
              {isCustomizerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          {isCustomizerOpen && (
            <div className="space-y-3 bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-stone-300/80">
              {/* Structural layout theme selector */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-stone-800 font-bold">
                  <Layout className="w-4 h-4 text-brand-700" />
                  카드 구조
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {LAYOUT_STYLES.map((layout) => {
                    const isSelected = selectedLayoutId === layout.id;
                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => setSelectedLayoutId(layout.id)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-brand-50 border-brand-700 shadow-xs ring-2 ring-brand-600/20'
                            : 'bg-white/80 border-stone-200 hover:border-brand-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{layout.icon}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-700 font-bold" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 truncate">{layout.name}</div>
                          <div className="text-[10px] text-stone-500 truncate">{layout.subtitle.split('&')[0]}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color palette selector */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200/70">
                <div className="flex items-center gap-1.5 text-xs text-stone-800 font-bold">
                  <Palette className="w-4 h-4 text-brand-700" />
                  색상 팔레트
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
                  {COLOR_PALETTES.map((palette) => {
                    const isSelected = selectedPaletteId === palette.id;
                    const mainBtnBg = palette.primaryBtnClass?.split(' ')[0] || 'bg-brand-700';
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setSelectedPaletteId(palette.id)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-50 border-brand-700 shadow-xs ring-2 ring-brand-600/20'
                            : 'bg-white/80 border-stone-200 hover:border-brand-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {/* 3-tone swatch: outer wallpaper / inner card / button accent */}
                          <div className="flex items-center gap-[1px] rounded-full p-[1px] border shrink-0 shadow-2xs border-stone-300/80 bg-white overflow-hidden">
                            <div className={`w-1.5 h-3.5 rounded-l-full ${palette.outerBgClass || 'bg-stone-200'}`} />
                            <div className={`w-1.5 h-3.5 ${palette.swatchBg}`} />
                            <div className={`w-1.5 h-3.5 rounded-r-full ${mainBtnBg}`} />
                          </div>
                          <span className="text-[11px] font-bold text-stone-800 truncate">{palette.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-700 font-bold shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Preview Area */}
      {activeTab === 'card' ? (
        <motion.div
          ref={cardRef}
          key={`${selectedLayoutId}-${selectedPaletteId}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`relative max-w-lg mx-auto my-3 p-5 sm:p-7 rounded-3xl transition-colors duration-300 ${
            currentPalette.outerBgClass || 'bg-[#FAF7F0]'
          }`}
        >
          {/* LAYOUT TYPE 1: Traditional Frame */}
          {selectedLayoutId === 'traditional_frame' && (
            <div
              className={`relative p-6 sm:p-9 rounded-3xl shadow-md border-2 transition-all ${currentPalette.bgClass} ${currentPalette.borderClass}`}
            >
              {/* Corner Ornaments */}
              <div className={`absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 ${currentPalette.borderClass}`} />
              <div className={`absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 ${currentPalette.borderClass}`} />
              <div className={`absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 ${currentPalette.borderClass}`} />
              <div className={`absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 ${currentPalette.borderClass}`} />

              <div className="flex items-center justify-end mb-6">
                <span className={`text-xs font-display italic font-medium ${currentPalette.accentClass}`}>
                  To. {withHonorific(relationship.name)}께
                </span>
              </div>

              <div className="my-6 py-4 px-2 text-center">
                <p className={`text-sm sm:text-base leading-relaxed tracking-wide font-display whitespace-pre-wrap ${currentPalette.textClass}`}>
                  {messageContent}
                </p>
              </div>

              <div className={`pt-4 border-t flex justify-between items-center text-xs ${currentPalette.borderClass}`}>
                <span className={`flex items-center gap-1 font-display font-bold ${currentPalette.accentClass}`}>
                  {category === '경사' ? <Flower2 className="w-4 h-4 text-brand-700" /> : <Heart className="w-4 h-4 text-slate-700" />}
                  진심을 담아 올림
                </span>
                <span className="text-[10px] font-mono opacity-80">
                  {new Date().toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          )}

          {/* LAYOUT TYPE 2: Envelope Slit */}
          {selectedLayoutId === 'envelope_slit' && (
            <div className={`relative rounded-3xl shadow-md border-2 overflow-hidden transition-all ${currentPalette.bgClass} ${currentPalette.borderClass}`}>
              {/* Top Envelope Flap */}
              <div className={`p-4 border-b-2 flex items-center justify-between bg-black/5 ${currentPalette.borderClass}`}>
                <div className="flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${currentPalette.accentClass}`} />
                  <span className={`text-xs font-bold font-display ${currentPalette.textClass}`}>
                    {category} 전달 서신
                  </span>
                </div>
                <span className={`text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-md ${currentPalette.badgeClass}`}>
                  {withHonorific(relationship.name)} 귀하
                </span>
              </div>

              {/* Inset Card Body */}
              <div className="p-6 sm:p-8 space-y-5">
                <div className={`p-5 sm:p-7 rounded-2xl border bg-white/40 backdrop-blur-xs space-y-4 ${currentPalette.borderClass}`}>
                  <div className={`text-xs font-display font-semibold border-b pb-2 ${currentPalette.borderClass} ${currentPalette.accentClass}`}>
                    To. {withHonorific(relationship.name)}께 보내는 정성어린 멘트
                  </div>
                  <p className={`text-sm sm:text-base leading-relaxed tracking-wide font-display whitespace-pre-wrap ${currentPalette.textClass}`}>
                    {messageContent}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className={`font-display font-bold text-xs ${currentPalette.accentClass}`}>
                    - 마음을 담아 보냅니다 -
                  </span>
                  <span className="text-[10px] font-mono opacity-70">
                    {new Date().toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT TYPE 3: Minimal Editorial */}
          {selectedLayoutId === 'minimal_editorial' && (
            <div className={`relative p-6 sm:p-8 rounded-3xl shadow-md border transition-all ${currentPalette.bgClass} ${currentPalette.borderClass}`}>
              <div className="flex items-start gap-4">
                {/* Vertical Accent Bar */}
                <div className={`w-1.5 self-stretch rounded-full bg-current opacity-70 ${currentPalette.textClass}`} />
                
                <div className="flex-1 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-xs font-display font-bold ${currentPalette.accentClass}`}>
                        To. {withHonorific(relationship.name)}
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${currentPalette.borderClass}`}>
                      CARD-NO.01
                    </span>
                  </div>

                  <p className={`text-sm sm:text-base leading-relaxed font-sans font-medium whitespace-pre-wrap ${currentPalette.textClass}`}>
                    {messageContent}
                  </p>

                  <div className={`pt-3 border-t flex justify-between items-center text-xs ${currentPalette.borderClass}`}>
                    <span className={`font-medium ${currentPalette.textClass}`}>
                      드림
                    </span>
                    <span className="text-[10px] font-mono opacity-80">
                      {new Date().toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT TYPE 4: Curved Arch */}
          {selectedLayoutId === 'curved_arch' && (
            <div className={`relative p-6 sm:p-9 rounded-t-[70px] rounded-b-3xl shadow-md border-2 text-center transition-all ${currentPalette.bgClass} ${currentPalette.borderClass}`}>
              {/* Arch Top Emblem */}
              <div className="flex justify-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-2xs ${currentPalette.badgeClass}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className={`text-xs font-display font-bold mb-4 tracking-widest uppercase ${currentPalette.accentClass}`}>
                To. {withHonorific(relationship.name)}께 드리는 인사
              </div>

              <div className="my-4 py-2 px-3 border-y border-dashed border-current/30">
                <p className={`text-sm sm:text-base leading-relaxed font-display whitespace-pre-wrap ${currentPalette.textClass}`}>
                  {messageContent}
                </p>
              </div>

              <div className="mt-6 flex justify-between items-center text-xs opacity-90">
                <span className={`font-display font-bold ${currentPalette.accentClass}`}>
                  {category === '경사' ? '🌸 축하하는 마음을 담아' : '🌿 정성을 담아 올림'}
                </span>
                <span className="text-[10px] font-mono">
                  {new Date().toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          )}

          {/* LAYOUT TYPE 5: Seal Pendant */}
          {selectedLayoutId === 'seal_pendant' && (
            <div className={`relative p-7 sm:p-9 rounded-3xl shadow-md border-2 transition-all ${currentPalette.bgClass} ${currentPalette.borderClass}`}>
              {/* Inner Double Line Accent */}
              <div className={`p-5 sm:p-7 rounded-2xl border ${currentPalette.borderClass} space-y-4 text-center`}>
                <div className="flex items-center justify-center gap-2">
                  <div className={`h-[1px] w-8 bg-current opacity-40 ${currentPalette.textClass}`} />
                  <Award className={`w-5 h-5 ${currentPalette.accentClass}`} />
                  <div className={`h-[1px] w-8 bg-current opacity-40 ${currentPalette.textClass}`} />
                </div>

                <div className={`text-xs font-display font-extrabold tracking-widest ${currentPalette.accentClass}`}>
                  To. {withHonorific(relationship.name)} 귀하
                </div>

                <p className={`text-sm sm:text-base leading-relaxed font-display whitespace-pre-wrap ${currentPalette.textClass}`}>
                  {messageContent}
                </p>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className={`text-[11px] font-display font-bold border-b-2 pb-0.5 ${currentPalette.borderClass} ${currentPalette.accentClass}`}>
                    마음을 담아 올림
                  </span>
                </div>
              </div>

              <div className="mt-3 text-right text-[10px] font-mono opacity-70">
                {new Date().toLocaleDateString('ko-KR')}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        /* KakaoTalk Mock Chat Screen */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto bg-[#b2c7da] rounded-2xl p-4 shadow-inner border border-slate-300 text-slate-900 space-y-3"
        >
          {/* Mock Chat Header */}
          <div className="text-center text-xs font-bold text-slate-700 bg-white/60 py-1 px-3 rounded-full max-w-[220px] mx-auto shadow-xs">
            {withHonorific(relationship.name)}과의 카카오톡 대화방
          </div>

          {/* KakaoTalk Card Image Message Preview */}
          <div className="flex items-start gap-2.5 my-2">
            <div className="w-9 h-9 rounded-full bg-stone-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              나
            </div>
            <div className="space-y-1.5 max-w-[85%]">
              <div className="text-[10px] text-slate-700 font-medium">
                {relationship.name}
              </div>

              {/* KakaoTalk Visual Card Message Container */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <div className="p-3 bg-brand-50/60 border-b border-brand-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-brand-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    {category} 감성 서신
                  </span>
                  <span className="text-[10px] text-brand-800 font-mono">To. {relationship.name}</span>
                </div>

                {/* Card Interior Preview */}
                <div className={`p-4 text-center font-display text-xs ${currentPalette.bgClass} ${currentPalette.textClass}`}>
                  <p className="line-clamp-4 leading-relaxed font-display whitespace-pre-wrap">
                    {messageContent}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                  <span>정성스런 이미지가 전달되었습니다</span>
                  <button
                    type="button"
                    onClick={handleKakaoShare}
                    className="text-brand-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    이미지 공유하기 <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Text Message Bubble */}
              <div className="bg-[#fee500] text-slate-950 p-3 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {messageContent}
              </div>

              <div className="text-[9px] text-slate-600 text-right pr-1">
                오전 10:15 • 읽음 1
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="pt-4 border-t border-stone-200 space-y-3">
        <div className="text-center text-xs text-stone-700 font-bold flex items-center justify-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-brand-700" />
          <span>카드 이미지 전송 & 공유 옵션 (카톡 / 문자 / 공유)</span>
        </div>

        {/* Primary Row: Card Image Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={isGeneratingImage}
            onClick={handleDownloadCardImage}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50 ${
              currentPalette.primaryBtnClass || 'bg-brand-700 hover:bg-brand-800 text-white'
            }`}
          >
            {isGeneratingImage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : downloadedSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {downloadedSuccess ? '카드 이미지 저장 완료!' : '📸 카드 이미지 저장 (PNG)'}
          </button>

          <button
            type="button"
            disabled={isGeneratingImage}
            onClick={handleCopyCardImage}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50 ${
              currentPalette.secondaryBtnClass || 'bg-stone-900 hover:bg-black text-white'
            }`}
          >
            {isGeneratingImage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : imageCopied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-brand-300" />
            )}
            {imageCopied ? '카드 이미지 복사 완료!' : '📋 카드 이미지 복사 (카톡 붙여넣기)'}
          </button>

          <button
            type="button"
            disabled={isGeneratingImage}
            onClick={handleKakaoShare}
            className="px-4 py-2.5 rounded-xl bg-[#fee500] hover:bg-[#ebd300] text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isGeneratingImage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-slate-900" />
            )}
            📲 카카오톡으로 공유하기
          </button>
        </div>

        {/* Secondary Row: Text Share Fallbacks */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-stone-200/60 text-stone-600">
          <button
            type="button"
            onClick={handleCopyContent}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? '문구 복사 완료' : '텍스트 본문 복사'}
          </button>

          <button
            type="button"
            onClick={handleCopyShareText}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copiedShareText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Send className="w-3.5 h-3.5" />}
            {copiedShareText ? '카톡 문구 복사됨' : '카톡 전체 포맷 복사'}
          </button>

          <button
            type="button"
            onClick={handleSmsShare}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            문자(SMS) 앱 연결
          </button>
        </div>
      </div>
    </div>
  );
};

