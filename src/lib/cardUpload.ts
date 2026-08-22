import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a generated card image to Firebase Storage and returns a public
 * download URL — required because Kakao's share "feed" template needs an
 * imageUrl it can fetch, not an uploaded file.
 * Returns null (never throws) when Storage isn't configured, so callers can
 * fall back to a text-only share.
 */
export async function uploadCardImage(blob: Blob): Promise<string | null> {
  if (!storage) return null;
  try {
    const fileName = `card-shares/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
    const fileRef = ref(storage, fileName);
    await uploadBytes(fileRef, blob, { contentType: 'image/png' });
    return await getDownloadURL(fileRef);
  } catch (err) {
    console.error('Card image upload failed', err);
    return null;
  }
}
