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
    relationType: '기타',
    closeness: 2,
    tonePreference: '다정한 (따뜻하고 진심어린)',
    memoryNotes: ['비즈니스 파트너', '예우와 격식 중시'],
    createdAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'gyeongjosa_relationships_v1';

// 2026-08-26 — localStorage 대신 sessionStorage 사용. 로그인 없이 쓰는 경우
// 이 캐시가 영구 보존되면 같은 기기를 다음에 쓰는 사람(공용 PC 등)에게 이전
// 사람의 수신자 정보가 그대로 노출됨 — 탭/브라우저를 닫으면 자동으로 사라지는
// sessionStorage로 바꿔 그 문제를 해결. 로그인 사용자는 어차피 Firestore가
// 진짜 저장소라 영향 없음.
export function getStoredRelationships(): Relationship[] {
  if (typeof window === 'undefined') return INITIAL_RELATIONSHIPS;
  try {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_RELATIONSHIPS));
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
    sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(relationships));
  } catch (e) {
    console.error('Failed to save relationships to local storage', e);
  }
}

// 로그아웃 직후 호출 — 방금 로그아웃한 사용자의 캐시가 같은 탭에서 다음
// 게스트 사용에 그대로 이어지지 않도록 명시적으로 비운다.
export function clearStoredRelationships(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear relationships from local storage', e);
  }
}
