import { Relationship } from '../types';

// 2026-08-26 — 관계 등록이 완전한 선택사항이 되면서, 예시로 미리 채워두던
// 관계 4개를 제거함. 실제 데이터가 아닌 예시가 자동으로 선택 가능한 상태로
// 보이는 게 오히려 혼란을 줄 수 있어, 빈 목록에서 시작하고 필요하면 직접
// 등록하도록 함.
export const INITIAL_RELATIONSHIPS: Relationship[] = [];

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
