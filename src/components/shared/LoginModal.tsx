import React, { useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { Mail, LogOut, CloudUpload, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser?: FirebaseUser | null;
  onSignInWithMagicLink?: (email: string) => Promise<void>;
  onSignOut?: () => Promise<void>;
}

// 수신 대상 선택과 완전히 분리된, 로그인 전용 모달. 이전에는 로그인 폼이
// RelationshipPicker 안에 관계 목록과 뒤섞여 있어서 "로그인" 버튼을 눌러도
// 관계 선택 화면이 뜨는 것처럼 보였다 — 헤더의 로그인 버튼은 이제 이 모달을 연다.
export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  authUser,
  onSignInWithMagicLink,
  onSignOut,
}) => {
  const [authEmail, setAuthEmail] = useState('');
  const [authStatus, setAuthStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !onSignInWithMagicLink) return;
    setAuthStatus('sending');
    try {
      await onSignInWithMagicLink(authEmail.trim());
      setAuthStatus('sent');
    } catch (err) {
      console.error('Failed to send magic link', err);
      setAuthStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 text-stone-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-700" />
            <h2 className="font-bold text-base sm:text-lg text-stone-900">로그인 (선택)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {authUser ? (
            <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <CloudUpload className="w-4 h-4 text-brand-700 shrink-0" />
                <span className="truncate">
                  <b className="text-stone-900">{authUser.email}</b>로 안전하게 보관 중
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSignOut?.()}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                로그아웃
              </button>
            </div>
          ) : authStatus === 'sent' ? (
            <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/80 text-xs text-stone-700">
              <b className="text-brand-800">{authEmail}</b>로 로그인 링크를 보냈어요. 메일함을 확인해주세요.
            </div>
          ) : (
            <form onSubmit={handleSendMagicLink} className="space-y-2">
              <p className="text-xs text-stone-500">
                로그인하면 기기가 바뀌어도 관계·생성 기록이 안전하게 보관돼요. 로그인 없이도 모든 기능은 그대로 사용할 수 있어요.
              </p>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="이메일 주소"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:bg-white focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={authStatus === 'sending'}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold cursor-pointer disabled:opacity-50 transition-colors"
              >
                {authStatus === 'sending' ? '전송 중...' : '로그인 링크 받기'}
              </button>
              {authStatus === 'error' && (
                <div className="text-[11px] text-red-600">전송에 실패했어요. 다시 시도해주세요.</div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
