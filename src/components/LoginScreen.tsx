import * as React from 'react';
import {
  auth, googleProvider, appleProvider,
} from '../firebase';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut,
} from 'firebase/auth';

type Mode = 'signin' | 'signup';
type Provider = 'google' | 'apple';

export default function LoginScreen({ embedded = false }: { embedded?: boolean } = {}) {
  const [mode, setMode] = React.useState<Mode>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const clearError = () => setError(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
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
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleProvider = async (provider: Provider) => {
    clearError();
    setLoading(true);
    try {
      if (provider === 'google') {
        await signInWithPopup(auth, googleProvider);
      } else {
        await signInWithPopup(auth, appleProvider);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : `${provider} sign-in failed.`;
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className={embedded ? 'login-screen login-screen-embedded' : 'login-screen'}>
      <div className="login-card">
        {embedded && (
          <div className="login-header">
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to track goals, earn badges, and build habits with your community.</p>
          </div>
        )}
        {!embedded && (
          <div className="login-header">
            <h1 className="login-title">Thrive JoCo 13</h1>
            <p className="login-subtitle">Sign in to track goals, earn badges, and build habits with your community.</p>
          </div>
        )}

        <div className="login-providers">
          <button
            className="login-provider-btn"
            onClick={() => handleProvider('google')}
            disabled={loading}
          >
            <span className="login-provider-icon">G</span>
            <span>Continue with Google</span>
          </button>
          <button
            className="login-provider-btn login-provider-apple"
            onClick={() => handleProvider('apple')}
            disabled={loading}
          >
            <span className="login-provider-icon"></span>
            <span>Continue with Apple</span>
          </button>
        </div>

        <div className="login-divider">
          <span>or</span>
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
