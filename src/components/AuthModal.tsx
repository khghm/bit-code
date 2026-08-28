import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'otp'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp, signInWithOtp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        await signUp(email, password, fullName);
        setSuccess('ثبت‌نام موفق! ایمیل تایید برای شما ارسال شد.');
      } else if (mode === 'otp') {
        await signInWithOtp(email);
        setSuccess('لینک ورود به ایمیل شما ارسال شد.');
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setSuccess(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-night-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border border-linec bg-night-900 rounded-lg p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-mist">
            {mode === 'signup' ? 'ثبت‌نام' : mode === 'otp' ? 'ورود با لینک' : 'ورود'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center text-faint hover:text-mist transition-colors"
            aria-label="بستن"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-coral/10 border border-coral/30 text-coral text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-md bg-teal/10 border border-teal/30 text-teal text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" className="block text-sm text-dim mb-1.5">
                نام و نام خانوادگی
              </label>
              <input
                id="auth-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-night-950 border border-linec rounded-md px-4 py-2.5 text-mist placeholder:text-faint outline-none focus:border-amber/60 transition-colors"
                placeholder="نام کامل"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-sm text-dim mb-1.5">
              ایمیل
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="w-full bg-night-950 border border-linec rounded-md px-4 py-2.5 text-mist placeholder:text-faint outline-none focus:border-amber/60 transition-colors text-left"
              placeholder="email@example.com"
            />
          </div>

          {mode !== 'otp' && (
            <div>
              <label htmlFor="auth-password" className="block text-sm text-dim mb-1.5">
                رمز عبور
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                dir="ltr"
                className="w-full bg-night-950 border border-linec rounded-md px-4 py-2.5 text-mist placeholder:text-faint outline-none focus:border-amber/60 transition-colors text-left"
                placeholder="حداقل ۶ کاراکتر"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber text-night-900 font-bold rounded-md py-3 transition-all duration-300 hover:bg-[#ffc775] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال پردازش...' : mode === 'signup' ? 'ثبت‌نام' : mode === 'otp' ? 'ارسال لینک ورود' : 'ورود'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-linec space-y-2">
          {mode !== 'signup' && (
            <button
              onClick={() => {
                setMode('signup');
                resetForm();
              }}
              className="w-full text-sm text-dim hover:text-amber transition-colors"
            >
              حساب ندارید؟ ثبت‌نام کنید
            </button>
          )}
          {mode !== 'signin' && (
            <button
              onClick={() => {
                setMode('signin');
                resetForm();
              }}
              className="w-full text-sm text-dim hover:text-amber transition-colors"
            >
              ورود با رمز عبور
            </button>
          )}
          {mode !== 'otp' && (
            <button
              onClick={() => {
                setMode('otp');
                resetForm();
              }}
              className="w-full text-sm text-dim hover:text-teal transition-colors"
            >
              ورود بدون رمز (لینک ایمیلی)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
