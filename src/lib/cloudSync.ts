import {
  collection,
  doc,
  getDocs,
  writeBatch,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { Relationship, GeneratedMessageRecord } from '../types';
import { db } from './firebase';
import {
  getStoredRelationships,
  saveRelationships as saveLocalRelationships,
  clearStoredRelationships,
} from './relationships';

const LOCAL_HISTORY_KEY = 'gyeongjosa_history_v1';

// relationships.ts와 동일한 이유로 sessionStorage 사용 — 공용 기기에서 다음
// 사람에게 이전 사람의 생성 기록이 새지 않도록 탭을 닫으면 사라지게 함.
function getLocalHistory(): GeneratedMessageRecord[] {
  try {
    const raw = sessionStorage.getItem(LOCAL_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load history from local storage', e);
    return [];
  }
}

function saveLocalHistory(records: GeneratedMessageRecord[]): void {
  try {
    sessionStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save history to local storage', e);
  }
}

// 로그아웃 직후 호출 — sessionStorage는 탭을 닫아야 지워지므로, 같은 탭에서
// 곧바로 게스트로 이어서 쓰는 경우까지 대비해 로그아웃 시점에 명시적으로 비운다.
export function clearLocalCache(): void {
  clearStoredRelationships();
  try {
    sessionStorage.removeItem(LOCAL_HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history from local storage', e);
  }
}

// Firestore doc data helpers. The client-generated string id (e.g. "rel-123")
// is used directly as the Firestore document id, so writes are natural upserts.

function relationshipToDocData(rel: Relationship) {
  return {
    name: rel.name,
    relationType: rel.relationType,
    closeness: rel.closeness,
    tonePreference: rel.tonePreference,
    memoryNotes: rel.memoryNotes,
    createdAt: rel.createdAt,
  };
}

function docToRelationship(id: string, data: any): Relationship {
  return {
    id,
    name: data.name,
    relationType: data.relationType,
    closeness: data.closeness,
    tonePreference: data.tonePreference,
    memoryNotes: data.memoryNotes ?? [],
    createdAt: data.createdAt,
  };
}

function historyRecordToDocData(record: GeneratedMessageRecord) {
  return {
    relationshipName: record.relationshipName,
    relationType: record.relationType,
    category: record.category,
    primaryKeywordLabel: record.primaryKeywordLabel,
    subKeywordLabels: record.subKeywordLabels,
    format: record.format,
    selectedText: record.selectedText,
    candidates: record.candidates,
    createdAt: record.createdAt,
  };
}

function docToHistoryRecord(id: string, data: any): GeneratedMessageRecord {
  return {
    id,
    relationshipName: data.relationshipName,
    relationType: data.relationType,
    category: data.category,
    primaryKeywordLabel: data.primaryKeywordLabel,
    subKeywordLabels: data.subKeywordLabels ?? [],
    format: data.format,
    selectedText: data.selectedText,
    candidates: data.candidates ?? [],
    createdAt: data.createdAt,
  };
}

// Replace the whole subcollection with `items` in one batch (small personal
// data sets, so a full delete-then-write is simpler and safer than diffing).
async function replaceSubcollection(
  userId: string,
  subcollection: string,
  items: { id: string; data: Record<string, unknown> }[]
): Promise<void> {
  if (!db) return;
  const colRef = collection(db, 'users', userId, subcollection);
  const existing = await getDocs(colRef);
  const batch = writeBatch(db);
  existing.docs.forEach((d) => batch.delete(d.ref));
  items.forEach((item) => batch.set(doc(colRef, item.id), item.data));
  await batch.commit();
}

// ---------- Relationships ----------

export async function loadRelationships(userId: string | null): Promise<Relationship[]> {
  if (userId && db) {
    try {
      const colRef = collection(db, 'users', userId, 'relationships');
      const snapshot = await getDocs(query(colRef, orderBy('createdAt', 'desc')));
      return snapshot.docs.map((d) => docToRelationship(d.id, d.data()));
    } catch (err) {
      console.error('Failed to load relationships from cloud, falling back to local', err);
    }
  }
  return getStoredRelationships();
}

export async function persistRelationships(userId: string | null, list: Relationship[]): Promise<void> {
  saveLocalRelationships(list);
  if (!userId || !db) return;
  try {
    await replaceSubcollection(
      userId,
      'relationships',
      list.map((rel) => ({ id: rel.id, data: relationshipToDocData(rel) }))
    );
  } catch (err) {
    console.error('Failed to sync relationships to cloud', err);
  }
}

// ---------- Message history ----------

export async function loadHistory(userId: string | null): Promise<GeneratedMessageRecord[]> {
  if (userId && db) {
    try {
      const colRef = collection(db, 'users', userId, 'history');
      const snapshot = await getDocs(query(colRef, orderBy('createdAt', 'desc')));
      return snapshot.docs.map((d) => docToHistoryRecord(d.id, d.data()));
    } catch (err) {
      console.error('Failed to load history from cloud, falling back to local', err);
    }
  }
  return getLocalHistory();
}

export async function persistHistory(userId: string | null, records: GeneratedMessageRecord[]): Promise<void> {
  saveLocalHistory(records);
  if (!userId || !db) return;
  try {
    await replaceSubcollection(
      userId,
      'history',
      records.map((r) => ({ id: r.id, data: historyRecordToDocData(r) }))
    );
  } catch (err) {
    console.error('Failed to sync history to cloud', err);
  }
}

// ---------- One-time migration on first login ----------

export async function migrateLocalDataToCloudIfEmpty(userId: string): Promise<void> {
  if (!db) return;

  const relSnapshot = await getDocs(query(collection(db, 'users', userId, 'relationships'), limit(1)));
  if (relSnapshot.empty) {
    const localRels = getStoredRelationships();
    if (localRels.length > 0) await persistRelationships(userId, localRels);
  }

  const histSnapshot = await getDocs(query(collection(db, 'users', userId, 'history'), limit(1)));
  if (histSnapshot.empty) {
    const localHist = getLocalHistory();
    if (localHist.length > 0) await persistHistory(userId, localHist);
  }
}
