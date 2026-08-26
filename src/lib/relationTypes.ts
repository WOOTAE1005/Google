import { RelationType } from '../types';

// 관계 유형 대분류 → 세부 유형(leaf) 매핑. RelationshipPicker(수신자 등록)와
// LetterTopicSelector(일반편지 대분류/중분류) 양쪽에서 재사용한다 — 두 곳 모두
// "가족/연인/지인/직장/기타"라는 같은 대분류 감각을 쓰기 때문에 한 곳에서만
// 관리한다. 연인처럼 세부 유형이 하나뿐인 그룹은 대분류를 고르는 순간 바로
// 확정된다(하위 버튼이 따로 뜨지 않음).
export const RELATION_GROUPS: { label: string; types: RelationType[] }[] = [
  { label: '가족', types: ['어머니', '아버지', '형제', '자매'] },
  { label: '연인', types: ['연인'] },
  { label: '지인', types: ['친구', '선생님', '교수님', '선배', '후배'] },
  { label: '직장', types: ['직장상사', '직장동료', '직장후배'] },
  { label: '기타', types: ['친척', '기타'] },
];

export function findRelationGroup(type: RelationType | null) {
  if (!type) return undefined;
  return RELATION_GROUPS.find((g) => g.types.includes(type));
}
