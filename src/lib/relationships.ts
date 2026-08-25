import { Relationship } from '../types';

export const INITIAL_RELATIONSHIPS: Relationship[] = [
  {
    id: 'rel-1',
    name: '김상우 차장님',
    relationType: '직장상사',
    closeness: 3,
    tonePreference: '다정한 (따뜻하고 진심어린)',
    memoryNotes: ['직장 내 존경하는 멘토', '업무적으로 긴밀함'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rel-2',
    name: '이민지',
    relationType: '친구',
    closeness: 5,
    tonePreference: '다정한 (따뜻하고 진심어린)',
    memoryNotes: ['10년지기 소중한 친구', '늘 서로 응원하는 사이'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rel-3',
    name: '박영희 이모',
    relationType: '친척',
    closeness: 4,
    tonePreference: '다정한 (따뜻하고 진심어린)',
    memoryNotes: ['어릴 적부터 각별히 아껴주심', '명절마다 챙겨주심'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rel-4',
    name: '최현우 파트너사 대표님',
    relationType: '지인',
    closeness: 2,
    tonePreference: '다정한 (따뜻하고 진심어린)',
    memoryNotes: ['비즈니스 파트너', '예우와 격식 중시'],
    createdAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'gyeongjosa_relationships_v1';

export function getStoredRelationships(): Relationship[] {
  if (typeof window === 'undefined') return INITIAL_RELATIONSHIPS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_RELATIONSHIPS));
      return INITIAL_RELATIONSHIPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RELATIONSHIPS;
  } catch (e) {
    console.error('Failed to load relationships from local storage', e);
    return INITIAL_RELATIONSHIPS;
  }
}

export function saveRelationships(relationships: Relationship[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(relationships));
  } catch (e) {
    console.error('Failed to save relationships to local storage', e);
  }
}
