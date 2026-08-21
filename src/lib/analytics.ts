import { doc, increment, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Anonymous, aggregate-only usage stats — no per-user identity is stored here.
// Every write is a plain counter increment on a shared document/collection, so
// this works the same whether the caller is logged in or browsing as a guest.
// See firestore.rules: these paths are write-only from the client (no public read).

const ANALYTICS_DOC = 'analytics';
const WORDS_COLLECTION = 'analytics_words';

async function bumpField(docName: string, field: string) {
  if (!db || !field) return;
  try {
    await setDoc(doc(db, ANALYTICS_DOC, docName), { [field]: increment(1) }, { merge: true });
  } catch (err) {
    console.error(`Failed to record analytics (${docName}.${field})`, err);
  }
}

// Strips a word down to something worth counting, and screens out anything
// that looks like a name + honorific (e.g. "차장님", "선생님") rather than a
// real content word, since those are the one part of a custom prompt that can
// carry someone's identity.
function sanitizeWord(raw: string): string | null {
  const w = raw.replace(/[,.!?"'()\[\]{}~…·/\\]/g, '').trim();
  if (w.length < 2) return null;
  // "님" is (almost always) an honorific suffix on a name/title, optionally
  // followed by a single trailing particle (께/을/를/이/가/은/는/도/만/과/와) —
  // catches "차장님", "차장님께", "차장님을" etc. A bare name with no
  // honorific attached (e.g. "김상우" on its own) isn't detectable this way;
  // that's a known limitation without real name-entity recognition.
  if (/님[은는이가을를과와께도만]?$/.test(w)) return null;
  return w;
}

async function bumpWord(word: string) {
  if (!db) return;
  try {
    await setDoc(doc(db, WORDS_COLLECTION, word), { word, count: increment(1) }, { merge: true });
  } catch (err) {
    console.error(`Failed to record word analytics (${word})`, err);
  }
}

export function trackGeneration(params: {
  category: string;
  primaryKeywordLabel: string;
  format: string;
  customInstruction?: string;
}) {
  if (!db) return;

  void bumpField('categoryStats', params.category);
  void bumpField('formatStats', params.format);
  void bumpField('primaryKeywordStats', params.primaryKeywordLabel);

  if (params.customInstruction) {
    const words = params.customInstruction
      .split(/\s+/)
      .map(sanitizeWord)
      .filter((w): w is string => !!w);
    words.forEach((w) => void bumpWord(w));
  }
}

export function trackCardPreference(layoutId: string, paletteId: string) {
  if (!db) return;
  void bumpField('cardLayoutStats', layoutId);
  void bumpField('cardPaletteStats', paletteId);
}
