import React, { useState, useEffect } from 'react';
import {
  Relationship,
  OccasionCategory,
  PromptKeyword,
  MessageFormat,
  MessageCandidate,
  GeneratedMessageRecord,
} from './types';
import { useAuth } from './lib/auth';
import {
  loadRelationships,
  persistRelationships,
  loadHistory,
  persistHistory,
  migrateLocalDataToCloudIfEmpty,
} from './lib/cloudSync';
import { getPrimaryKeywords, getSubKeywords } from './lib/keywords';
import { Header } from './components/shared/Header';
import { RelationshipPicker } from './components/shared/RelationshipPicker';
import { KeywordSelector } from './components/occasion/KeywordSelector';
import { FormatSelector } from './components/occasion/FormatSelector';
import { CautionBanner } from './components/occasion/CautionBanner';
import { CustomPromptInput } from './components/occasion/CustomPromptInput';
import { MessageCandidates } from './components/occasion/MessageCandidates';
import { DeliveryCard } from './components/shared/DeliveryCard';
import { HistoryDrawer } from './components/occasion/HistoryDrawer';
import { EtiquetteModal } from './components/shared/EtiquetteModal';
import { Sparkles, ArrowRight, UserCheck, Check, RefreshCw } from 'lucide-react';

export default function App() {
  const { user, isLoading: authLoading, isCloudSyncEnabled, signInWithMagicLink, signOut } = useAuth();

  // 1. Relationships state
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [isRelationshipPickerOpen, setIsRelationshipPickerOpen] = useState(false);

  // 2. Keyword & Format Selection State
  const [category, setCategory] = useState<OccasionCategory>('경사');
  const [primaryKeyword, setPrimaryKeyword] = useState<PromptKeyword>(
    () => getPrimaryKeywords('경사')[0]
  );
  const [selectedSubKeywords, setSelectedSubKeywords] = useState<PromptKeyword[]>([]);
  const [format, setFormat] = useState<MessageFormat>('카톡메시지');
  const [customInstruction, setCustomInstruction] = useState<string>('');

  // 3. Generation & Candidates state
  const [isGenerating, setIsGenerating] = useState(false);
  const [candidates, setCandidates] = useState<MessageCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<MessageCandidate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 4. History state
  const [historyRecords, setHistoryRecords] = useState<GeneratedMessageRecord[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEtiquetteOpen, setIsEtiquetteOpen] = useState(false);

  // Load relationships & history — from Supabase when signed in, else localStorage.
  // Re-runs whenever auth state settles or changes (sign-in / sign-out).
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    (async () => {
      if (user) {
        await migrateLocalDataToCloudIfEmpty(user.uid);
      }
      const [loadedRels, loadedHistory] = await Promise.all([
        loadRelationships(user?.uid ?? null),
        loadHistory(user?.uid ?? null),
      ]);
      if (cancelled) return;
      setRelationships(loadedRels);
      setSelectedRelationship(loadedRels[0] ?? null);
      setHistoryRecords(loadedHistory);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  // Save relationships when modified
  const handleSaveRelationship = (newRel: Relationship) => {
    const updated = [newRel, ...relationships];
    setRelationships(updated);
    persistRelationships(user?.uid ?? null, updated);
  };

  const handleDeleteRelationship = (id: string) => {
    const updated = relationships.filter((r) => r.id !== id);
    setRelationships(updated);
    persistRelationships(user?.uid ?? null, updated);
    if (selectedRelationship?.id === id) {
      setSelectedRelationship(updated[0] || null);
    }
  };

  // Toggle Sub Keyword
  const handleToggleSubKeyword = (sk: PromptKeyword) => {
    if (selectedSubKeywords.some((s) => s.id === sk.id)) {
      setSelectedSubKeywords(selectedSubKeywords.filter((s) => s.id !== sk.id));
    } else {
      setSelectedSubKeywords([...selectedSubKeywords, sk]);
    }
  };

  // Primary Keyword Change
  const handleSelectPrimaryKeyword = (pk: PromptKeyword) => {
    setPrimaryKeyword(pk);
    setSelectedSubKeywords([]);
  };

  // Category Change
  const handleSelectCategory = (cat: OccasionCategory) => {
    setCategory(cat);
    const firstPk = getPrimaryKeywords(cat)[0];
    if (firstPk) {
      setPrimaryKeyword(firstPk);
      setSelectedSubKeywords([]);
    }
  };

  // Generate Message API Call
  const handleGenerateMessage = async (overrideInstruction?: string) => {
    if (!selectedRelationship) {
      setIsRelationshipPickerOpen(true);
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    const activeInstruction = overrideInstruction ?? customInstruction;

    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationship: selectedRelationship,
          category,
          primaryKeyword,
          subKeywords: selectedSubKeywords,
          format,
          customInstruction: activeInstruction,
        }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오답');
      }

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        setCandidates(data.candidates);
        setSelectedCandidate(data.candidates[0]);

        // Save to History
        const newRecord: GeneratedMessageRecord = {
          id: `hist-${Date.now()}`,
          relationshipName: selectedRelationship.name,
          relationType: selectedRelationship.relationType,
          category,
          primaryKeywordLabel: primaryKeyword.keywordLabel,
          subKeywordLabels: selectedSubKeywords.map((s) => s.keywordLabel),
          format,
          selectedText: data.candidates[0].content,
          candidates: data.candidates,
          createdAt: new Date().toISOString(),
        };

        const updatedHistory = [newRecord, ...historyRecords];
        setHistoryRecords(updatedHistory);
        persistHistory(user?.uid ?? null, updatedHistory);
      } else {
        throw new Error('생성 결과가 없습니다.');
      }
    } catch (err: any) {
      console.error('Failed to generate message:', err);
      setErrorMessage('메시지 생성 중 문제가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Update candidate content
  const handleUpdateCandidateContent = (id: string, newContent: string) => {
    const updated = candidates.map((c) =>
      c.id === id ? { ...c, content: newContent, charCount: newContent.length } : c
    );
    setCandidates(updated);
    if (selectedCandidate?.id === id) {
      setSelectedCandidate({ ...selectedCandidate, content: newContent, charCount: newContent.length });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C2621] font-serif antialiased selection:bg-amber-200 selection:text-amber-950">
      {/* Top Header Navigation */}
      <Header
        currentRelationship={selectedRelationship}
        onOpenRelationshipPicker={() => setIsRelationshipPickerOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenEtiquette={() => setIsEtiquetteOpen(true)}
        historyCount={historyRecords.length}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Banner Section - Proposal 1 Poetic Banner */}
        <section className="text-center space-y-3 py-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#2C2621]/15 text-xs text-[#2C2621] font-sans font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>시적 감성의 미니멀 엽서 • AI 경조사 메시지 카피라이터</span>
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-serif font-bold tracking-wide text-[#2C2621] leading-snug">
            마치 한 장의 엽서를 써 내려가듯,<br className="hidden sm:inline" /> 온기와 격식을 전하세요
          </h2>
          <p className="text-xs sm:text-sm text-[#2C2621]/70 font-sans max-w-xl mx-auto leading-relaxed">
            소중한 분과의 관계, 마음 깊은 전달 목적, 경조사 상황을 담아 세상에 단 하나뿐인 정성 어린 메시지를 짓습니다.
          </p>
        </section>

        {/* Selected Relationship Quick Bar - Warm Postcard Header Feel */}
        <section className="bg-white border border-[#2C2621]/15 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-md shadow-[#2C2621]/5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FAF6F0] text-[#2C2621] border border-[#2C2621]/15 flex items-center justify-center font-bold font-serif text-lg">
              ✉️
            </div>
            <div>
              <div className="text-[11px] text-[#2C2621]/50 font-sans uppercase tracking-widest font-bold">To. 수신인 프로필</div>
              <div className="text-sm sm:text-base font-bold text-[#2C2621] flex flex-wrap items-center gap-2 mt-0.5">
                <span className="font-serif text-base font-bold">{selectedRelationship ? selectedRelationship.name : '대상을 선택해주세요'}</span>
                {selectedRelationship && (
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-md bg-[#FAF6F0] text-[#2C2621] border border-[#2C2621]/15 font-medium">
                    {selectedRelationship.relationType} • 친밀도 {selectedRelationship.closeness}점
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsRelationshipPickerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2C2621] hover:bg-[#403933] text-[#FAF6F0] text-xs font-sans font-bold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
          >
            수신인 변경
          </button>
        </section>

        {/* 1. Keyword Selection (Category, Primary, Sub Keywords) */}
        <KeywordSelector
          category={category}
          onSelectCategory={handleSelectCategory}
          primaryKeyword={primaryKeyword}
          onSelectPrimaryKeyword={handleSelectPrimaryKeyword}
          selectedSubKeywords={selectedSubKeywords}
          onToggleSubKeyword={handleToggleSubKeyword}
        />

        {/* 2. Custom Prompt Input (STEP 4) */}
        <CustomPromptInput
          customInstruction={customInstruction}
          onChangeCustomInstruction={setCustomInstruction}
        />

        {/* 3. Format Selector (STEP 5) */}
        <FormatSelector format={format} onSelectFormat={setFormat} />

        {/* 4. Caution / Etiquette Banner */}
        <CautionBanner
          primaryKeyword={primaryKeyword}
          selectedSubKeywords={selectedSubKeywords}
        />

        {/* 4. Generate CTA Button - Proposal 1 Style */}
        <div className="pt-2 font-sans">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerateMessage()}
            className="w-full py-4.5 rounded-2xl bg-[#2C2621] hover:bg-[#403933] text-[#FAF6F0] font-bold text-base sm:text-lg shadow-xl shadow-[#2C2621]/15 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                <span>정성 어린 문장을 가다듬는 중입니다...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 stroke-[2.5]" />
                <span className="font-serif font-bold tracking-wide">✨ 편지 짓기 (AI 맞춤 멘트 생성)</span>
                <ArrowRight className="w-5 h-5 text-amber-300 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}

        {/* 5. Message Candidates Display */}
        {candidates.length > 0 && (
          <MessageCandidates
            candidates={candidates}
            selectedCandidateId={selectedCandidate?.id || null}
            onSelectCandidate={setSelectedCandidate}
            onUpdateCandidateContent={handleUpdateCandidateContent}
            onRegenerateWithInstruction={(instruction) => handleGenerateMessage(instruction)}
            isGenerating={isGenerating}
          />
        )}

        {/* 6. Delivery Card & KakaoTalk Preview */}
        {selectedCandidate && (
          <DeliveryCard
            relationship={selectedRelationship!}
            category={category}
            primaryKeyword={primaryKeyword}
            format={format}
            messageContent={selectedCandidate.content}
          />
        )}
      </main>

      {/* Relationship Picker Modal */}
      <RelationshipPicker
        isOpen={isRelationshipPickerOpen}
        onClose={() => setIsRelationshipPickerOpen(false)}
        relationships={relationships}
        selectedRelationship={selectedRelationship}
        onSelectRelationship={setSelectedRelationship}
        onSaveRelationship={handleSaveRelationship}
        onDeleteRelationship={handleDeleteRelationship}
        isCloudSyncEnabled={isCloudSyncEnabled}
        authUser={user}
        onSignInWithMagicLink={signInWithMagicLink}
        onSignOut={signOut}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyRecords={historyRecords}
        onClearHistory={() => {
          setHistoryRecords([]);
          persistHistory(user?.uid ?? null, []);
        }}
        onSelectRecord={(rec) => {
          if (rec.candidates && rec.candidates.length > 0) {
            setCandidates(rec.candidates);
            setSelectedCandidate(rec.candidates[0]);
          }
        }}
      />

      {/* Etiquette Guide Modal */}
      <EtiquetteModal
        isOpen={isEtiquetteOpen}
        onClose={() => setIsEtiquetteOpen(false)}
      />
    </div>
  );
}
