import React, { useState, useEffect } from 'react';
import {
  Relationship,
  OccasionCategory,
  PromptKeyword,
  MessageFormat,
  MessageCandidate,
  GeneratedMessageRecord,
} from './types';
import {
  getStoredRelationships,
  saveRelationships,
  INITIAL_RELATIONSHIPS,
} from './lib/relationships';
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
import { Sparkles, ArrowRight, UserCheck, Check, RefreshCw } from 'lucide-react';

export default function App() {
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

  // Load initial data from localStorage
  useEffect(() => {
    const loadedRels = getStoredRelationships();
    setRelationships(loadedRels);
    if (loadedRels.length > 0) {
      setSelectedRelationship(loadedRels[0]);
    }

    try {
      const rawHistory = localStorage.getItem('gyeongjosa_history_v1');
      if (rawHistory) {
        setHistoryRecords(JSON.parse(rawHistory));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Save relationships when modified
  const handleSaveRelationship = (newRel: Relationship) => {
    const updated = [newRel, ...relationships];
    setRelationships(updated);
    saveRelationships(updated);
  };

  const handleDeleteRelationship = (id: string) => {
    const updated = relationships.filter((r) => r.id !== id);
    setRelationships(updated);
    saveRelationships(updated);
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
        localStorage.setItem('gyeongjosa_history_v1', JSON.stringify(updatedHistory));
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header Navigation */}
      <Header
        currentRelationship={selectedRelationship}
        onOpenRelationshipPicker={() => setIsRelationshipPickerOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyRecords.length}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Banner Section */}
        <section className="text-center space-y-3 py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>관계와 예법을 아우르는 AI 경조사 메시지 카피라이터</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            마음을 담은 한 문장, 격식 있게 전하세요
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            수신자와의 관계, 친밀도, 경조사 세부 상황 태그를 조합하여 손쉽게 완성하는 맞춤 멘트 생성 서비스입니다.
          </p>
        </section>

        {/* Selected Relationship Quick Bar */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">수신 대상 프로필</div>
              <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{selectedRelationship ? selectedRelationship.name : '대상을 선택해주세요'}</span>
                {selectedRelationship && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-normal">
                    {selectedRelationship.relationType} • 친밀도 {selectedRelationship.closeness}점
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsRelationshipPickerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors shrink-0"
          >
            변경 / 추가
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

        {/* 4. Generate CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerateMessage()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-base sm:text-lg shadow-xl shadow-amber-500/15 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>예법과 관계를 분석하여 맞춤 멘트 작성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
                <span>AI 맞춤 경조사 멘트 생성하기</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs sm:text-sm">
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
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyRecords={historyRecords}
        onClearHistory={() => {
          setHistoryRecords([]);
          localStorage.removeItem('gyeongjosa_history_v1');
        }}
        onSelectRecord={(rec) => {
          if (rec.candidates && rec.candidates.length > 0) {
            setCandidates(rec.candidates);
            setSelectedCandidate(rec.candidates[0]);
          }
        }}
      />
    </div>
  );
}
