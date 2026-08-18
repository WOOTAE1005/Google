import { Relationship, GeneratedMessageRecord } from '../types';
import { supabase } from './supabase';
import { getStoredRelationships, saveRelationships as saveLocalRelationships } from './relationships';

const LOCAL_HISTORY_KEY = 'gyeongjosa_history_v1';

function getLocalHistory(): GeneratedMessageRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load history from local storage', e);
    return [];
  }
}

function saveLocalHistory(records: GeneratedMessageRecord[]): void {
  try {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save history to local storage', e);
  }
}

// ---------- Relationships ----------

function rowToRelationship(row: any): Relationship {
  return {
    id: row.client_id,
    name: row.name,
    relationType: row.relation_type,
    closeness: row.closeness,
    tonePreference: row.tone_preference,
    memoryNotes: row.memory_notes ?? [],
    createdAt: row.created_at,
  };
}

function relationshipToRow(userId: string, rel: Relationship) {
  return {
    user_id: userId,
    client_id: rel.id,
    name: rel.name,
    relation_type: rel.relationType,
    closeness: rel.closeness,
    tone_preference: rel.tonePreference,
    memory_notes: rel.memoryNotes,
    created_at: rel.createdAt,
  };
}

export async function loadRelationships(userId: string | null): Promise<Relationship[]> {
  if (userId && supabase) {
    const { data, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (!error && data) return data.map(rowToRelationship);
    console.error('Failed to load relationships from cloud, falling back to local', error);
  }
  return getStoredRelationships();
}

export async function persistRelationships(userId: string | null, list: Relationship[]): Promise<void> {
  saveLocalRelationships(list);
  if (!userId || !supabase) return;

  const { error: deleteError } = await supabase.from('relationships').delete().eq('user_id', userId);
  if (deleteError) {
    console.error('Failed to sync relationships to cloud (clear step)', deleteError);
    return;
  }
  if (list.length === 0) return;

  const { error: insertError } = await supabase
    .from('relationships')
    .insert(list.map((rel) => relationshipToRow(userId, rel)));
  if (insertError) {
    console.error('Failed to sync relationships to cloud (insert step)', insertError);
  }
}

// ---------- Message history ----------

function rowToHistoryRecord(row: any): GeneratedMessageRecord {
  return {
    id: row.client_id,
    relationshipName: row.relationship_name,
    relationType: row.relation_type,
    category: row.category,
    primaryKeywordLabel: row.primary_keyword_label,
    subKeywordLabels: row.sub_keyword_labels ?? [],
    format: row.format,
    selectedText: row.selected_text,
    candidates: row.candidates ?? [],
    createdAt: row.created_at,
  };
}

function historyRecordToRow(userId: string, record: GeneratedMessageRecord) {
  return {
    user_id: userId,
    client_id: record.id,
    relationship_name: record.relationshipName,
    relation_type: record.relationType,
    category: record.category,
    primary_keyword_label: record.primaryKeywordLabel,
    sub_keyword_labels: record.subKeywordLabels,
    format: record.format,
    selected_text: record.selectedText,
    candidates: record.candidates,
    created_at: record.createdAt,
  };
}

export async function loadHistory(userId: string | null): Promise<GeneratedMessageRecord[]> {
  if (userId && supabase) {
    const { data, error } = await supabase
      .from('message_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (!error && data) return data.map(rowToHistoryRecord);
    console.error('Failed to load history from cloud, falling back to local', error);
  }
  return getLocalHistory();
}

export async function persistHistory(userId: string | null, records: GeneratedMessageRecord[]): Promise<void> {
  saveLocalHistory(records);
  if (!userId || !supabase) return;

  const { error: deleteError } = await supabase.from('message_history').delete().eq('user_id', userId);
  if (deleteError) {
    console.error('Failed to sync history to cloud (clear step)', deleteError);
    return;
  }
  if (records.length === 0) return;

  const { error: insertError } = await supabase
    .from('message_history')
    .insert(records.map((r) => historyRecordToRow(userId, r)));
  if (insertError) {
    console.error('Failed to sync history to cloud (insert step)', insertError);
  }
}

// ---------- One-time migration on first login ----------

export async function migrateLocalDataToCloudIfEmpty(userId: string): Promise<void> {
  if (!supabase) return;

  const { count: relCount, error: relCountError } = await supabase
    .from('relationships')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (!relCountError && !relCount) {
    const localRels = getStoredRelationships();
    if (localRels.length > 0) await persistRelationships(userId, localRels);
  }

  const { count: histCount, error: histCountError } = await supabase
    .from('message_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (!histCountError && !histCount) {
    const localHist = getLocalHistory();
    if (localHist.length > 0) await persistHistory(userId, localHist);
  }
}
