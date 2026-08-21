export type OccasionCategory = '경사' | '조사';

export type RelationType = '가족' | '친척' | '친구' | '직장동료' | '직장상사' | '직장후배' | '지인' | '기타';

export type TonePreference = '격식체 (정중하고 정제된)' | '다정한 (따뜻하고 진심어린)' | '유머러스 (재치있고 밝은)' | '깊은 위로 (진중하고 담백한)';

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
  category: OccasionCategory;
  keywordType: 'primary' | 'sub';
  keywordLabel: string; // e.g., "결혼", "첫 아이", "부모상", "하객 참석 못함"
  promptFragment: string;
  parentKeywordId?: string;
  cautionNote?: string;
}

export interface BuildPromptInput {
  relationship: Relationship;
  category: OccasionCategory;
  primaryKeyword: PromptKeyword;
  subKeywords: PromptKeyword[];
  format: MessageFormat;
  customInstruction?: string;
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
  relationshipName: string;
  relationType: RelationType;
  category: OccasionCategory;
  primaryKeywordLabel: string;
  subKeywordLabels: string[];
  format: MessageFormat;
  selectedText: string;
  candidates: MessageCandidate[];
  createdAt: string;
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


