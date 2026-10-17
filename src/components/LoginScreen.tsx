import * as React from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
} from 'firebase/auth';

type Mode = 'signin' | 'signup';

export default function LoginScreen({ embedded = false }: { embedded?: boolean } = {}) {
  const [mode, setMode] = React.useState<Mode>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const clearError = () => setError(null);

  const firebaseErrorMsg = (err: unknown): string => {
    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: string }).code;
      const map: Record<string, string> = {
        'auth/email-already-in-use': 'An account already exists with this email. Try signing in instead.',
        'auth/invalid-email': 'That email address looks invalid. Please check it and try again.',
        'auth/weak-password': 'Password must be at least 6 characters long.',
        'auth/operation-not-allowed': 'Email/password sign-up is not enabled for this app yet. The app owner needs to turn it on in the Firebase console (Authentication → Sign-in method → Email/Password).',
        'auth/too-many-requests': 'Too many attempts. Please wait a minute and try again.',
        'auth/user-not-found': 'No account found with this email. Try creating a new account.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Email or password is incorrect. Please try again.',
        'auth/network-request-failed': 'Network error — check your internet connection and try again.',
        'auth/unauthorized-domain': 'This domain is not authorized in the Firebase console. The app owner needs to add it under Authentication → Settings → Authorized domains.',
      };
      return map[code] ?? `Sign-in failed (${code}).`;
    }
    return err instanceof Error ? err.message : 'Authentication failed.';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      setError(firebaseErrorMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={embedded ? 'login-screen login-screen-embedded' : 'login-screen'}>
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">{embedded ? 'Welcome back' : 'Thrive JoCo 13'}</h1>
          <p className="login-subtitle">Sign in to track goals, earn badges, and build habits with your community.</p>
        </div>

        <form className="login-form" onSubmit={handleEmailAuth}>
          <input
            className="login-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => { setEmail(e.target.value); clearError(); }}
            disabled={loading}
            autoComplete="email"
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); clearError(); }}
            disabled={loading}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
          <button className="login-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <div className="login-mode-switch">
          {mode === 'signin' && (
            <button className="login-link" onClick={() => { setMode('signup'); clearError(); }} disabled={loading}>
              Create an account
            </button>
          )}
          {mode === 'signup' && (
            <button className="login-link" onClick={() => { setMode('signin'); clearError(); }} disabled={loading}>
              Already have an account?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
