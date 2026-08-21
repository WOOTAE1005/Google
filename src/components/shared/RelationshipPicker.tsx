import React, { useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { Relationship, RelationType, TonePreference } from '../../types';
import { User, Plus, Check, Star, X, Tag, Trash2, Mail, LogOut, CloudUpload } from 'lucide-react';

interface RelationshipPickerProps {
  isOpen: boolean;
  onClose: () => void;
  relationships: Relationship[];
  selectedRelationship: Relationship | null;
  onSelectRelationship: (rel: Relationship) => void;
  onSaveRelationship: (rel: Relationship) => void;
  onDeleteRelationship: (id: string) => void;
  isCloudSyncEnabled?: boolean;
  authUser?: FirebaseUser | null;
  onSignInWithMagicLink?: (email: string) => Promise<void>;
  onSignOut?: () => Promise<void>;
}

const RELATION_TYPES: RelationType[] = [
  '가족',
  '친척',
  '친구',
  '직장상사',
  '직장동료',
  '직장후배',
  '지인',
  '기타',
];

const TONE_PREFERENCES: TonePreference[] = [
  '격식체 (정중하고 정제된)',
  '다정한 (따뜻하고 진심어린)',
  '유머러스 (재치있고 밝은)',
  '깊은 위로 (진중하고 담백한)',
];

export const RelationshipPicker: React.FC<RelationshipPickerProps> = ({
  isOpen,
  onClose,
  relationships,
  selectedRelationship,
  onSelectRelationship,
  onSaveRelationship,
  onDeleteRelationship,
  isCloudSyncEnabled,
  authUser,
  onSignInWithMagicLink,
  onSignOut,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<RelationType>('직장상사');
  const [newCloseness, setNewCloseness] = useState(3);
  const [newTone, setNewTone] = useState<TonePreference>('격식체 (정중하고 정제된)');
  const [newNoteInput, setNewNoteInput] = useState('');
  const [newNotes, setNewNotes] = useState<string[]>([]);

  const [authEmail, setAuthEmail] = useState('');
  const [authStatus, setAuthStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !onSignInWithMagicLink) return;
    setAuthStatus('sending');
    try {
      await onSignInWithMagicLink(authEmail.trim());
      setAuthStatus('sent');
    } catch (err) {
      console.error('Failed to send magic link', err);
      setAuthStatus('error');
    }
  };

  const handleAddNote = () => {
    if (!newNoteInput.trim()) return;
    if (!newNotes.includes(newNoteInput.trim())) {
      setNewNotes([...newNotes, newNoteInput.trim()]);
    }
    setNewNoteInput('');
  };

  const handleRemoveNote = (noteToRemove: string) => {
    setNewNotes(newNotes.filter((n) => n !== noteToRemove));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newRel: Relationship = {
      id: `rel-${Date.now()}`,
      name: newName.trim(),
      relationType: newType,
      closeness: newCloseness,
      tonePreference: newTone,
      memoryNotes: newNotes,
      createdAt: new Date().toISOString(),
    };

    onSaveRelationship(newRel);
    onSelectRelationship(newRel);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewType('직장상사');
    setNewCloseness(3);
    setNewTone('격식체 (정중하고 정제된)');
    setNewNotes([]);
    setNewNoteInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 text-stone-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-700" />
            <h2 className="font-bold text-base sm:text-lg text-stone-900">
              {isCreating ? '새 수신자(관계) 추가' : '수신 대상 선택'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {!isCreating ? (
            <>
              <div className="text-xs text-stone-500 mb-2">
                메시지를 전달할 상대방을 선택하거나 새로운 관계를 등록하세요.
              </div>

              {isCloudSyncEnabled && (
                <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/80 mb-3">
                  {authUser ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 text-xs text-stone-700">
                        <CloudUpload className="w-4 h-4 text-brand-700 shrink-0" />
                        <span className="truncate">
                          <b className="text-stone-900">{authUser.email}</b>로 안전하게 보관 중
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSignOut?.()}
                        className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-800 shrink-0 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        로그아웃
                      </button>
                    </div>
                  ) : authStatus === 'sent' ? (
                    <div className="text-xs text-stone-700">
                      <b className="text-brand-800">{authEmail}</b>로 로그인 링크를 보냈어요. 메일함을 확인해주세요.
                    </div>
                  ) : (
                    <form onSubmit={handleSendMagicLink} className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-brand-900 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        로그인하면 기기가 바뀌어도 기록이 안전하게 보관돼요 (선택)
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="이메일 주소"
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-brand-200 text-stone-900 text-xs focus:outline-none focus:border-brand-500"
                        />
                        <button
                          type="submit"
                          disabled={authStatus === 'sending'}
                          className="px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {authStatus === 'sending' ? '전송 중...' : '로그인 링크 받기'}
                        </button>
                      </div>
                      {authStatus === 'error' && (
                        <div className="text-[11px] text-red-600">전송에 실패했어요. 다시 시도해주세요.</div>
                      )}
                    </form>
                  )}
                </div>
              )}

              <div className="space-y-2.5">
                {relationships.map((rel) => {
                  const isSelected = selectedRelationship?.id === rel.id;
                  return (
                    <div
                      key={rel.id}
                      onClick={() => {
                        onSelectRelationship(rel);
                        onClose();
                      }}
                      className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-50/80 border-brand-400 text-stone-900 shadow-xs ring-1 ring-brand-400/30'
                          : 'bg-stone-50/60 border-stone-200 hover:bg-stone-100/80 text-stone-700 hover:-translate-y-0.5 hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-stone-900">
                            {rel.name}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-medium">
                            {rel.relationType}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          <div className="flex items-center gap-0.5">
                            <span className="text-[11px] mr-1">친밀도:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= rel.closeness
                                    ? 'text-brand-500 fill-brand-500'
                                    : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-stone-300">|</span>
                          <span className="text-stone-500 text-[11px]">
                            {rel.tonePreference.split(' ')[0]}
                          </span>
                        </div>

                        {rel.memoryNotes && rel.memoryNotes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {rel.memoryNotes.map((note, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200/80 text-stone-600 border border-stone-300/50"
                              >
                                #{note}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteRelationship(rel.id);
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsCreating(true)}
                className="w-full py-3 rounded-2xl border border-dashed border-brand-400 text-brand-800 hover:bg-brand-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors mt-4 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-brand-700" />
                새 수신자 / 관계 프로필 등록하기
              </button>
            </>
          ) : (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Name input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  수신자 이름 또는 호칭 <span className="text-brand-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="예: 김상우 차장님, 민지, 박영희 이모"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:bg-white focus:border-brand-500"
                />
              </div>

              {/* Relation Type */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  관계 유형
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {RELATION_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setNewType(type)}
                      className={`py-2 text-xs rounded-xl border font-medium transition-all cursor-pointer ${
                        newType === type
                          ? 'bg-brand-600 border-brand-600 text-white font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Closeness Rating */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    친밀도
                  </label>
                  <span className="text-xs font-bold text-brand-800">
                    {newCloseness} / 5 단계 (
                    {newCloseness <= 2
                      ? '격식/공적인 사이'
                      : newCloseness <= 4
                      ? '친근한 사이'
                      : '절친/매우 가까움'}
                    )
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setNewCloseness(val)}
                      className={`flex-1 py-2 rounded-xl border flex items-center justify-center gap-1 text-xs transition-all cursor-pointer ${
                        newCloseness >= val
                          ? 'bg-brand-50 border-brand-400 text-brand-900 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          newCloseness >= val ? 'fill-brand-500 text-brand-500' : ''
                        }`}
                      />
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Preference */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  선호 어조 (Tone)
                </label>
                <div className="space-y-1.5">
                  {TONE_PREFERENCES.map((tone) => (
                    <button
                      type="button"
                      key={tone}
                      onClick={() => setNewTone(tone)}
                      className={`w-full p-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                        newTone === tone
                          ? 'bg-brand-50 border-brand-400 text-brand-950 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Memory Notes / Context */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  특이 맥락 / 키워드 메모 (선택)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                    placeholder="예: 10년지기, 팀장님 멘토, 축의금 전달"
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-3 py-2 rounded-xl bg-stone-200 text-stone-800 hover:bg-stone-300 text-xs font-medium cursor-pointer"
                  >
                    추가
                  </button>
                </div>

                {newNotes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {newNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-brand-100 text-brand-900 border border-brand-200 text-xs"
                      >
                        #{note}
                        <button
                          type="button"
                          onClick={() => handleRemoveNote(note)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Form Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  프로필 저장 및 선택
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
