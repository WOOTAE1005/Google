import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { auth, isCloudSyncEnabled, EMAIL_FOR_SIGN_IN_KEY } from './firebase';
import { clearLocalCache } from './cloudSync';

interface UseAuthResult {
  user: User | null;
  isLoading: boolean;
  isCloudSyncEnabled: boolean;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isCloudSyncEnabled);

  // Complete sign-in if the app was just opened from the emailed link.
  useEffect(() => {
    if (!auth) return;
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const storedEmail = window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY);
      const email = storedEmail || window.prompt('로그인을 완료할 이메일 주소를 다시 입력해주세요');
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
            // Clean the sign-in params out of the URL.
            window.history.replaceState({}, '', window.location.pathname);
          })
          .catch((err) => console.error('Failed to complete email link sign-in', err));
      }
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithMagicLink = async (email: string) => {
    if (!auth) throw new Error('클라우드 동기화가 설정되지 않았습니다.');
    await sendSignInLinkToEmail(auth, email, {
      url: window.location.href,
      handleCodeInApp: true,
    });
    window.localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, email);
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    // 방금 로그아웃한 사용자의 캐시가 같은 탭에서 이어지는 게스트 사용에
    // 그대로 노출되지 않도록 즉시 비운다 (sessionStorage는 탭을 닫아야
    // 자동으로 지워지므로, 로그아웃 시점엔 별도로 지워줘야 함).
    clearLocalCache();
  };

  return { user, isLoading, isCloudSyncEnabled, signInWithMagicLink, signOut };
}
