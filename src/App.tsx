import React, { useState, useEffect } from 'react';
import {
  Relationship,
  OccasionCategory,
  LetterCategory,
  AppMode,
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
import { trackGeneration } from './lib/analytics';
import { Header } from './components/shared/Header';
import { RelationshipPicker } from './components/shared/RelationshipPicker';
import { KeywordSelector } from './components/occasion/KeywordSelector';
import { LetterTopicSelector } from './components/letter/LetterTopicSelector';
import { FormatSelector } from './components/occasion/FormatSelector';
import { CautionBanner } from './components/occasion/CautionBanner';
import { CustomPromptInput } from './components/occasion/CustomPromptInput';
import { MessageCandidates } from './components/occasion/MessageCandidates';
import { DeliveryCard } from './components/shared/DeliveryCard';
import { HistoryDrawer } from './components/occasion/HistoryDrawer';
import { EtiquetteModal } from './components/shared/EtiquetteModal';
import { Sparkles, ArrowRight, RefreshCw, Check } from 'lucide-react';

export default function App() {
  const { user, isLoading: authLoading, isCloudSyncEnabled, signInWithMagicLink, signOut } = useAuth();

  // 1. Relationships state
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [isRelationshipPickerOpen, setIsRelationshipPickerOpen] = useState(false);

  // 2. Mode: 경조사 (occasion) vs 일반편지 (general letter, not tied to an occasion)
  const [mode, setMode] = useState<AppMode>('경조사');

  // 3. Keyword & Format Selection State (경조사 mode)
  const [category, setCategory] = useState<OccasionCategory>('경사');
  const [primaryKeyword, setPrimaryKeyword] = useState<PromptKeyword>(
    () => getPrimaryKeywords('경사')[0]
  );
  const [selectedSubKeywords, setSelectedSubKeywords] = useState<PromptKeyword[]>([]);
  const [format, setFormat] = useState<MessageFormat>('카톡메시지');
  const [customInstruction, setCustomInstruction] = useState<string>('');

  // 4. Letter topic state (일반편지 mode)
  const [letterTopic, setLetterTopic] = useState<PromptKeyword>(
    () => getPrimaryKeywords('편지')[0]
  );

  // 5. Generation & Candidates state
  const [isGenerating, setIsGenerating] = useState(false);
  const [candidates, setCandidates] = useState<MessageCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<MessageCandidate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 6. History state
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

  // Mode Change — reset in-progress results so a stale 경조사/편지 mix isn't shown
  const handleSelectMode = (nextMode: AppMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setCandidates([]);
    setSelectedCandidate(null);
    setErrorMessage(null);
  };

  // Active selection derived from the current mode — 경조사 fields vs the
  // standalone letter topic — so generation/history/DeliveryCard share one source.
  const activeCategory: LetterCategory = mode === '경조사' ? category : '편지';
  const activePrimaryKeyword: PromptKeyword = mode === '경조사' ? primaryKeyword : letterTopic;
  const activeSubKeywords: PromptKeyword[] = mode === '경조사' ? selectedSubKeywords : [];
  const activeFormat: MessageFormat = mode === '경조사' ? format : '편지';

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
          category: activeCategory,
          primaryKeyword: activePrimaryKeyword,
          subKeywords: activeSubKeywords,
          format: activeFormat,
          customInstruction: activeInstruction,
        }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        setCandidates(data.candidates);
        setSelectedCandidate(data.candidates[0]);

        trackGeneration({
          category: activeCategory,
          primaryKeywordLabel: activePrimaryKeyword.keywordLabel,
          format: activeFormat,
          customInstruction: activeInstruction,
        });

        // Save to History
        const newRecord: GeneratedMessageRecord = {
          id: `hist-${Date.now()}`,
          relationshipName: selectedRelationship.name,
          relationType: selectedRelationship.relationType,
          category: activeCategory,
          primaryKeywordLabel: activePrimaryKeyword.keywordLabel,
          subKeywordLabels: activeSubKeywords.map((s) => s.keywordLabel),
          format: activeFormat,
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
    <div className="min-h-screen bg-[#FFFAFA] text-[#3D2B31] font-serif antialiased selection:bg-brand-200 selection:text-brand-950">
      {/* Top Header Navigation */}
      <Header
        currentRelationship={selectedRelationship}
        onOpenRelationshipPicker={() => setIsRelationshipPickerOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenEtiquette={() => setIsEtiquetteOpen(true)}
        historyCount={historyRecords.length}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-14 space-y-14">
        {/* Hero banner */}
        <section className="text-left space-y-3 py-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#3D2B31]/15 text-xs text-[#3D2B31] font-sans font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-700" />
            <span>AI 경조사 메시지 카피라이터</span>
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-display font-bold tracking-wide text-[#3D2B31] leading-snug">
            {mode === '경조사' ? '관계와 상황에 맞는 경조사 문구를 짓습니다' : '관계와 마음에 맞는 편지를 대신 써드립니다'}
          </h2>
          <p className="text-xs sm:text-sm text-[#3D2B31]/70 font-sans max-w-xl leading-relaxed">
            {mode === '경조사'
              ? '관계, 상황, 톤을 고르면 봉투 문구·문자·카톡 메시지 세 가지 안을 만들어 드립니다.'
              : '관계와 편지 주제, 톤을 고르면 사연이 담긴 편지 세 가지 안을 만들어 드립니다.'}
          </p>
        </section>

        {/* Mode toggle: 경조사 vs 일반편지 */}
        <div className="inline-flex rounded-2xl border border-[#3D2B31]/15 bg-white p-1 gap-1 font-sans text-sm font-bold">
          {(['경조사', '일반편지'] as AppMode[]).map((m) => {
            const isSelected = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => handleSelectMode(m)}
                className={`px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#3D2B31] text-[#FFFAFA] shadow-xs'
                    : 'text-stone-600 hover:text-[#3D2B31]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                {m === '경조사' ? '경조사' : '일반 편지'}
              </button>
            );
          })}
        </div>

        {/* 1. Keyword selection */}
        {mode === '경조사' ? (
          <KeywordSelector
            category={category}
            onSelectCategory={handleSelectCategory}
            primaryKeyword={primaryKeyword}
            onSelectPrimaryKeyword={handleSelectPrimaryKeyword}
            selectedSubKeywords={selectedSubKeywords}
            onToggleSubKeyword={handleToggleSubKeyword}
          />
        ) : (
          <LetterTopicSelector topic={letterTopic} onSelectTopic={setLetterTopic} />
        )}

        {/* 2. Custom prompt input */}
        <CustomPromptInput
          customInstruction={customInstruction}
          onChangeCustomInstruction={setCustomInstruction}
        />

        {/* 3. Format selector — only for 경조사 (일반편지 always writes a full 편지) */}
        {mode === '경조사' && <FormatSelector format={format} onSelectFormat={setFormat} />}

        {/* 4. Caution / etiquette banner */}
        {mode === '경조사' && (
          <CautionBanner
            primaryKeyword={primaryKeyword}
            selectedSubKeywords={selectedSubKeywords}
          />
        )}

        {/* 5. Generate CTA button */}
        <div className="pt-2 font-sans">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerateMessage()}
            className="w-full py-4.5 rounded-2xl bg-[#3D2B31] hover:bg-[#2a1d22] text-[#FFFDFB] font-bold text-base sm:text-lg shadow-xl shadow-[#3D2B31]/15 hover:shadow-2xl hover:shadow-[#3D2B31]/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-brand-300" />
                <span>생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-brand-300 stroke-[2.5]" />
                <span className="font-serif font-bold tracking-wide">편지 짓기</span>
                <ArrowRight className="w-5 h-5 text-brand-300 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}

        {/* 6. Message candidates display */}
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

        {/* 7. Delivery card & KakaoTalk preview */}
        {selectedCandidate && (
          <DeliveryCard
            relationship={selectedRelationship!}
            category={activeCategory}
            primaryKeyword={activePrimaryKeyword}
            format={activeFormat}
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
