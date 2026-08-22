// Real KakaoTalk share integration. Free tier — no business verification needed
// for the default "공유하기" feature, just a Kakao Developers app + JS key with
// this site's domain registered under Platform Settings -> Web.
//
// Setup: https://developers.kakao.com -> 앱 등록 -> JavaScript 키 발급 ->
// 플랫폼 설정에 도메인(로컬 테스트는 http://localhost:3000) 등록 -> .env의
// VITE_KAKAO_JS_KEY에 키 입력.

interface KakaoShareContent {
  title: string;
  description: string;
  imageUrl: string;
  link: { mobileWebUrl: string; webUrl: string };
}

interface KakaoSDK {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (options: Record<string, unknown>) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';

let sdkLoadPromise: Promise<void> | null = null;

function loadSdkScript(): Promise<void> {
  if (window.Kakao) return Promise.resolve();
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('kakao-sdk') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('카카오 SDK 로드 실패')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = SDK_URL;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('카카오 SDK 로드 실패'));
    document.head.appendChild(script);
  });
  return sdkLoadPromise;
}

/**
 * Loads + initializes the Kakao SDK if VITE_KAKAO_JS_KEY is configured.
 * Returns false (never throws) when the key is missing or loading fails,
 * so callers can fall back to the existing image-copy/download flow.
 */
export async function ensureKakaoReady(): Promise<boolean> {
  const jsKey = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined;
  if (!jsKey) return false;

  try {
    await loadSdkScript();
    if (!window.Kakao) return false;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(jsKey);
    }
    return true;
  } catch (err) {
    console.error('Kakao SDK init failed', err);
    return false;
  }
}

/** Share the card as an image feed — needs a publicly reachable imageUrl. */
export function shareCardFeed(content: KakaoShareContent) {
  window.Kakao!.Share.sendDefault({
    objectType: 'feed',
    content,
    buttons: [
      {
        title: '자세히 보기',
        link: content.link,
      },
    ],
  });
}

/** Text-only fallback — no image hosting required. */
export function shareCardText(text: string, linkUrl: string) {
  window.Kakao!.Share.sendDefault({
    objectType: 'text',
    text,
    link: { mobileWebUrl: linkUrl, webUrl: linkUrl },
  });
}
