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
  RelationType,
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
import { RELATION_GROUPS, findRelationGroup } from './lib/relationTypes';
import { trackGeneration } from './lib/analytics';
import { Header } from './components/shared/Header';
import { RelationshipPicker } from './components/shared/RelationshipPicker';
import { LoginModal } from './components/shared/LoginModal';
import { KeywordSelector } from './components/occasion/KeywordSelector';
import { LetterTopicSelector } from './components/letter/LetterTopicSelector';
import { FormatSelector } from './components/occasion/FormatSelector';
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 2. Mode: 경조사 (occasion) vs 일반편지 (general letter, not tied to an occasion)
  const [mode, setMode] = useState<AppMode>('경조사');

  // 3. Keyword & Format Selection State (경조사 mode)
  const [category, setCategory] = useState<OccasionCategory>('경사');
  const [primaryKeyword, setPrimaryKeyword] = useState<PromptKeyword | null>(
    () => getPrimaryKeywords('경사')[0] ?? null
  );
  const [selectedSubKeywords, setSelectedSubKeywords] = useState<PromptKeyword[]>([]);
  const [format, setFormat] = useState<MessageFormat>('카톡메시지');
  const [customInstruction, setCustomInstruction] = useState<string>('');

  // 4. Letter topic state (일반편지 mode) — 세부 상황 태그처럼 복수 선택/선택
  // 해제가 가능한 목록. 아무것도 고르지 않아도 customInstruction만으로 생성 가능.
  const [letterTopics, setLetterTopics] = useState<PromptKeyword[]>([]);
  // "이 편지가 그려야 할 대상 성격" — 실제 등록된 수신자 관계와는 별개의
  // 선택 사항. 수신자를 등록 안 했거나 다른 맥락으로 쓰고 싶을 때를 위함.
  // 경조사의 category/primaryKeyword와 동일하게 대분류(그룹)와 중분류(구체
  // 유형)를 별도 상태로 둔다 — 세부 유형만 해제해도 대분류 선택은 남도록.
  const [letterAudienceGroup, setLetterAudienceGroup] = useState<string | null>(null);
  const [letterAudienceType, setLetterAudienceType] = useState<RelationType | null>(null);

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
      // 2026-08-26 — 관계 등록이 완전한 선택사항이 되면서, 저장된 첫 번째
      // 관계(비로그인 시 예시 데이터 포함)를 자동으로 골라주지 않는다.
      // 수신자는 사용자가 직접 선택하거나, 아예 선택하지 않고 생성해도 된다.
      setSelectedRelationship(null);
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
      // 삭제된 관계 대신 다른 걸 임의로 골라주지 않는다 — 사용자가 다시
      // 명시적으로 선택하거나, 선택 없이 그대로 생성을 진행할 수 있다.
      setSelectedRelationship(null);
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
  // Clears a previously generated result so it can't be mistaken for output
  // of the selection the user is now looking at (same issue class as the
  // mode-switch fix below, just triggered by changing category/keyword/topic
  // instead of the 경조사/일반편지 toggle).
  const clearStaleResult = () => {
    setCandidates([]);
    setSelectedCandidate(null);
    setErrorMessage(null);
  };

  // 세부 상황 태그와 동일하게 선택/선택취소 둘 다 가능 — 이미 선택된 항목을 다시
  // 누르면 null로 해제.
  const handleSelectPrimaryKeyword = (pk: PromptKeyword | null) => {
    setPrimaryKeyword(pk);
    setSelectedSubKeywords([]);
    clearStaleResult();
  };

  // Category Change — 경사/조사 둘 다 선택 해제한 '미지정' 상태도 허용.
  // getPrimaryKeywords('미지정')는 항상 빈 배열이므로 주요 항목은 자동으로 비워짐.
  const handleSelectCategory = (cat: OccasionCategory) => {
    setCategory(cat);
    const firstPk = getPrimaryKeywords(cat)[0];
    setPrimaryKeyword(firstPk ?? null);
    setSelectedSubKeywords([]);
    clearStaleResult();
  };

  // 세부 상황 태그와 동일한 다중 토글 패턴 — 이미 선택된 주제를 다시 누르면 제거.
  const handleToggleLetterTopic = (topic: PromptKeyword) => {
    setLetterTopics((prev) =>
      prev.some((t) => t.id === topic.id)
        ? prev.filter((t) => t.id !== topic.id)
        : [...prev, topic]
    );
    clearStaleResult();
  };

  // 세부 대상(leaf)만 토글 — 대분류(letterAudienceGroup)는 건드리지 않는다.
  // 경조사에서 primaryKeyword를 해제해도 category가 남는 것과 동일한 패턴.
  const handleSelectLetterAudienceType = (type: RelationType | null) => {
    setLetterAudienceType(type);
    clearStaleResult();
  };

  // 대분류(그룹) 변경 — 이미 선택된 그룹을 다시 누르면 대분류/세부 대상 모두
  // 해제. 새 그룹을 고르면 그 그룹의 첫 세부 유형을 자동 선택.
  const handleSelectLetterAudienceGroup = (groupLabel: string | null) => {
    setLetterAudienceGroup(groupLabel);
    const group = groupLabel ? RELATION_GROUPS.find((g) => g.label === groupLabel) : undefined;
    setLetterAudienceType(group ? group.types[0] : null);
    clearStaleResult();
  };

  // Mode Change — reset in-progress results *and* the free-text instruction so
  // leftover text written for one mode can't silently get applied to the other
  // (previously customInstruction survived a mode switch and got reused under
  // the new mode's defaults, producing a mismatched result).
  const handleSelectMode = (nextMode: AppMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setFormat(nextMode === '일반편지' ? '편지' : '카톡메시지');
    setCustomInstruction('');
    setLetterAudienceGroup(null);
    setLetterAudienceType(null);
    clearStaleResult();
  };

  // Active selection derived from the current mode — 경조사 fields vs the
  // standalone letter topic — so generation/history/DeliveryCard share one source.
  // `format` itself is shared across both modes: FormatSelector is shown in both,
  // with 일반편지 additionally offering the long-form '편지' option.
  // 일반편지 모드는 복수 선택된 주제들 중 첫 번째를 primaryKeyword, 나머지를
  // subKeywords 자리에 실어 promptBuilder에 그대로 전달한다 (경조사의 주요
  // 항목/세부 태그 2단 구조와 달리 편지 주제는 단일 계층이라 자연스럽게 맞아떨어짐).
  const activeCategory: LetterCategory = mode === '경조사' ? category : '편지';
  const activePrimaryKeyword: PromptKeyword | null =
    mode === '경조사' ? primaryKeyword : letterTopics[0] ?? null;
  const activeSubKeywords: PromptKeyword[] =
    mode === '경조사' ? selectedSubKeywords : letterTopics.slice(1);
  const activeFormat: MessageFormat = format;
  // 두 모드 모두: 키워드/주제 칩을 골랐거나, 자유 요청사항을 적었거나 — 둘 중
  // 하나는 있어야 생성 가능 (경조사도 대분류/주요 항목을 전부 해제할 수 있게 되면서
  // 더 이상 "경조사 모드면 무조건 가능"이 성립하지 않음).
  const canGenerate =
    mode === '경조사'
      ? Boolean(primaryKeyword) || customInstruction.trim().length > 0
      : letterTopics.length > 0 || customInstruction.trim().length > 0;

  // Generate Message API Call — 수신자 등록은 선택사항이라 selectedRelationship이
  // 없어도 생성을 막지 않는다 (promptBuilder가 관계 정보 없이 처리).
  const handleGenerateMessage = async (overrideInstruction?: string) => {
    if (!canGenerate) return;

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
          letterAudienceType: mode === '일반편지' ? letterAudienceType : null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Surface the server's actual reason (validation message, Gemini error,
        // etc.) instead of a generic "something went wrong".
        throw new Error(data?.error || `서버 오류가 발생했습니다 (${response.status}). 잠시 후 다시 시도해주세요.`);
      }

      if (data?.candidates && data.candidates.length > 0) {
        setCandidates(data.candidates);
        setSelectedCandidate(data.candidates[0]);

        trackGeneration({
          category: activeCategory,
          primaryKeywordLabel: activePrimaryKeyword?.keywordLabel ?? '자유 주제',
          format: activeFormat,
          customInstruction: activeInstruction,
        });

        // Save to History
        const newRecord: GeneratedMessageRecord = {
          id: `hist-${Date.now()}`,
          relationshipName: selectedRelationship?.name ?? null,
          relationType: selectedRelationship?.relationType ?? null,
          category: activeCategory,
          primaryKeywordLabel: activePrimaryKeyword?.keywordLabel ?? '자유 주제',
          subKeywordLabels: activeSubKeywords.map((s) => s.keywordLabel),
          format: activeFormat,
          selectedText: data.candidates[0].content,
          candidates: data.candidates,
          createdAt: new Date().toISOString(),
          letterAudienceType: mode === '일반편지' ? letterAudienceType : null,
        };

        const updatedHistory = [newRecord, ...historyRecords];
        setHistoryRecords(updatedHistory);
        persistHistory(user?.uid ?? null, updatedHistory);
      } else {
        throw new Error('AI가 생성한 결과가 비어 있습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err: any) {
      console.error('Failed to generate message:', err);
      // TypeError here means fetch() itself never got a response (offline,
      // DNS/CORS failure, server not running) — distinguish that from a
      // response we did get back but that reported/contained an error.
      const message =
        err instanceof TypeError
          ? '서버에 연결할 수 없습니다. 인터넷 연결 상태를 확인하고 다시 시도해주세요.'
          : err?.message || '메시지 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Restore a past record's full context (mode/category/topic/relationship/format),
  // not just its candidates — otherwise the reloaded text stays tagged with
  // whatever mode/category happens to be currently selected on screen.
  const handleSelectHistoryRecord = (rec: GeneratedMessageRecord) => {
    if (!rec.candidates || rec.candidates.length === 0) return;

    // rec.relationshipName이 null(수신자 없이 생성)이거나, 그 이름의 관계가
    // 그새 삭제됐다면 명시적으로 비운다 — 화면에 남아있던 다른 관계가 이
    // 기록의 실제 맥락인 것처럼 잘못 표시되지 않도록.
    const matchedRelationship = rec.relationshipName
      ? relationships.find((r) => r.name === rec.relationshipName) ?? null
      : null;
    setSelectedRelationship(matchedRelationship);

    if (rec.category === '편지') {
      setMode('일반편지');
      const allTopics = getPrimaryKeywords('편지');
      const matchedPrimary = allTopics.find((k) => k.keywordLabel === rec.primaryKeywordLabel);
      const matchedRest = allTopics.filter((k) => rec.subKeywordLabels.includes(k.keywordLabel));
      setLetterTopics(matchedPrimary ? [matchedPrimary, ...matchedRest] : matchedRest);
      const restoredAudienceType = rec.letterAudienceType ?? null;
      setLetterAudienceType(restoredAudienceType);
      setLetterAudienceGroup(findRelationGroup(restoredAudienceType)?.label ?? null);
    } else {
      setMode('경조사');
      setCategory(rec.category);
      const matchedPrimary = getPrimaryKeywords(rec.category).find((k) => k.keywordLabel === rec.primaryKeywordLabel);
      if (matchedPrimary) {
        setPrimaryKeyword(matchedPrimary);
        const matchedSubs = getSubKeywords(matchedPrimary.id).filter((k) =>
          rec.subKeywordLabels.includes(k.keywordLabel)
        );
        setSelectedSubKeywords(matchedSubs);
      } else {
        // 저장 당시 주요 항목을 고르지 않았거나(자유 주제) 대분류가 미지정이었던
        // 기록 — 이전 화면에 남아있던 primaryKeyword를 그대로 두면 기록과 안 맞으므로 비운다.
        setPrimaryKeyword(null);
        setSelectedSubKeywords([]);
      }
    }

    setFormat(rec.format);
    setCandidates(rec.candidates);
    setSelectedCandidate(rec.candidates.find((c) => c.content === rec.selectedText) ?? rec.candidates[0]);
    setErrorMessage(null);
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
        onOpenLogin={() => setIsLoginModalOpen(true)}
        isCloudSyncEnabled={isCloudSyncEnabled}
        authUser={user}
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
              ? '관계, 상황, 톤을 고르면 문자·카톡 메시지·편지 형태로 세 가지 안을 만들어 드립니다.'
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

        {/* 1~3. Keyword/topic selection, custom prompt, format — one continuous
            card instead of three separate ones, since they're all part of the
            same build-up-a-request flow. Caution notes still flow into the
            prompt via promptBuilder (see keywords.ts cautionNote) even though
            the inline warning banner is no longer shown here — see 예법 가이드
            in the header for the reference version. */}
        <div className="bg-white rounded-2xl px-4 sm:px-6 py-7 sm:py-10 space-y-9">
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
            <LetterTopicSelector
              audienceGroup={letterAudienceGroup}
              onSelectAudienceGroup={handleSelectLetterAudienceGroup}
              audienceType={letterAudienceType}
              onSelectAudienceType={handleSelectLetterAudienceType}
              selectedTopics={letterTopics}
              onToggleTopic={handleToggleLetterTopic}
            />
          )}

          <div className="pt-9 border-t border-stone-200/70">
            <CustomPromptInput
              customInstruction={customInstruction}
              onChangeCustomInstruction={setCustomInstruction}
            />
          </div>

          <div className="pt-9 border-t border-stone-200/70">
            <FormatSelector format={format} onSelectFormat={setFormat} />
          </div>
        </div>

        {/* 4. Generate CTA button */}
        <div className="pt-2 font-sans">
          <button
            type="button"
            disabled={isGenerating || !canGenerate}
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
            relationship={selectedRelationship}
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
      />

      {/* Login Modal — 수신자 선택과 분리된 별도 화면 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
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
        onSelectRecord={handleSelectHistoryRecord}
      />

      {/* Etiquette Guide Modal */}
      <EtiquetteModal
        isOpen={isEtiquetteOpen}
        onClose={() => setIsEtiquetteOpen(false)}
      />
    </div>
  );
}
