// '미지정' = 경조사 모드에서 대분류(경사/조사)를 둘 다 선택 해제한 상태.
// 사용자가 추가 요청사항 자유 텍스트만으로 생성하고 싶을 때를 위한 값.
export type OccasionCategory = '경사' | '조사' | '미지정';

// Widened category used by prompt keywords/generation once 일반 편지 (non-occasion
// letters) reuses the same keyword-tree + promptBuilder infrastructure.
export type LetterCategory = OccasionCategory | '편지';

export type AppMode = '경조사' | '일반편지';

// 2026-08-26 — 가족/지인/직장을 대분류로 묶고 그 안에서 구체적인 유형을 고르는
// 2단 선택 UI(RelationshipPicker)로 개편하면서, 실제로 저장되는 값은 항상
// "말단(leaf)" 유형이 되도록 정리함. 대분류-세부유형 매핑은 UI 쪽
// (RelationshipPicker.tsx의 RELATION_GROUPS)에서만 관리하고, 이 타입 자체는
// 그룹 구조를 모른다 — promptBuilder에는 이 값 그대로 문자열로 들어감.
export type RelationType =
  | '어머니'
  | '아버지'
  | '형제'
  | '자매'
  | '연인'
  | '친구'
  | '선생님'
  | '교수님'
  | '선배'
  | '후배'
  | '직장상사'
  | '직장동료'
  | '직장후배'
  | '친척'
  | '기타';

// '격식체' was dropped 2026-08-25 — closeness (1~2점 = "격식있는 원거리") already
// covers that end of the spectrum, so keeping a separate formal-tone option
// duplicated it and could contradict a high closeness score.
export type TonePreference = '다정한 (따뜻하고 진심어린)' | '유머러스 (재치있고 밝은)' | '깊은 위로 (진중하고 담백한)';

export type MessageFormat = '봉투문구' | '문자' | '카톡메시지' | '편지';

export interface Relationship {
  id: string;
  name: string; // e.g. "김철수 팀장님", "민지", "박영희 이모"
  relationType: RelationType;
  closeness: number; // 1 to 5
  tonePreference: TonePreference;
  memoryNotes: string[]; // Memory context tags / notes
  createdAt: string;
}

export interface PromptKeyword {
  id: string;
  category: LetterCategory;
  keywordType: 'primary' | 'sub';
  keywordLabel: string; // e.g., "결혼", "첫 아이", "부모상", "하객 참석 못함"
  promptFragment: string;
  parentKeywordId?: string;
  cautionNote?: string;
}

export interface BuildPromptInput {
  // 2026-08-26 — 수신자 등록을 완전한 선택사항으로 바꾸면서 nullable화.
  // 없으면 promptBuilder가 관계 정보 없이 무난한 톤으로 작성하도록 안내한다.
  relationship: Relationship | null;
  category: LetterCategory;
  // Optional in 일반편지 mode — a letter can be generated from customInstruction
  // alone, with no topic chip selected.
  primaryKeyword: PromptKeyword | null;
  subKeywords: PromptKeyword[];
  format: MessageFormat;
  customInstruction?: string;
  // 일반편지 전용 — 대분류/중분류로 고른 "이 편지가 그려야 할 대상 성격".
  // 실제 등록된 relationship.relationType과 다를 수 있다 (수신자를 등록하지
  // 않았거나, 등록된 관계와 다른 맥락으로 편지를 쓰고 싶을 때를 위한 값).
  letterAudienceType?: RelationType | null;
}

export interface MessageCandidate {
  id: string;
  variantIndex: number;
  title: string; // e.g., "정중한 격식형", "마음을 전하는 감성형", "간결한 대표 문구"
  content: string; // The generated message
  toneTag: string; // e.g., "정중격식", "다정감성", "단정한 위로"
  etiquetteTip?: string; // Etiquette tip for this message
  charCount: number;
}

export interface GeneratedMessageRecord {
  id: string;
  relationshipName: string | null;
  relationType: RelationType | null;
  category: LetterCategory;
  primaryKeywordLabel: string;
  subKeywordLabels: string[];
  format: MessageFormat;
  selectedText: string;
  candidates: MessageCandidate[];
  createdAt: string;
  letterAudienceType?: RelationType | null;
}

export type CardLayoutStyleId = 'traditional_frame' | 'envelope_slit' | 'minimal_editorial' | 'curved_arch' | 'seal_pendant';

export type CardColorPaletteId =
  | 'hanji_cream'
  | 'autumn_burgundy'
  | 'terracotta_olive'
  | 'linen_sage'
  | 'ochre_persimmon'
  | 'forest_oat'
  | 'dusty_lavender'
  | 'soft_clay'
  | 'deep_steel_amber'
  | 'warm_camel'
  | 'royal_indigo_gold'
  | 'bordeaux_apricot'
  | 'sober_slate'
  | 'rosewood_ink';

export interface CardLayoutStyleConfig {
  id: CardLayoutStyleId;
  name: string;
  subtitle: string;
  icon: string;
}

export interface CardColorPaletteConfig {
  id: CardColorPaletteId;
  name: string;
  icon: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  accentClass: string;
  badgeClass: string;
  swatchBg: string;
  outerBgClass?: string;
  primaryBtnClass?: string;
  secondaryBtnClass?: string;
}


