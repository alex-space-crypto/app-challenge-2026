import * as React from 'react';
import { supabase } from '../supabaseClient';

type Mode = 'signin' | 'signup' | 'phone';
type Provider = 'google' | 'apple';

export default function LoginScreen() {
  const [mode, setMode] = React.useState<Mode>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);
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
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          const name = email.split('@')[0] || 'Neighbor';
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email.trim(),
            name,
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
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
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      const msg = err instanceof Error ? err.message : `${provider} sign-in failed.`;
      setError(msg);
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: phone.trim(),
      });
      if (otpError) throw otpError;
      setOtpSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not send code.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!otp.trim() || !phone.trim()) {
      setError('Please enter the code sent to your phone.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: phone.trim(),
        token: otp.trim(),
        type: 'sms',
      });
      if (verifyError) throw verifyError;
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          phone: phone.trim(),
          name: 'Neighbor',
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Thrive JoCo 13</h1>
          <p className="login-subtitle">Sign in to track goals, earn badges, and build habits with your community.</p>
        </div>

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
          <button
            className="login-provider-btn login-provider-phone"
            onClick={() => { setMode('phone'); clearError(); setOtpSent(false); }}
            disabled={loading}
          >
            <span className="login-provider-icon">📞</span>
            <span>Continue with phone number</span>
          </button>
        </div>

        <div className="login-divider">
          <span>or</span>
        </div>

        {mode !== 'phone' ? (
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
        ) : (
          <form className="login-form" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
            <input
              className="login-input"
              type="tel"
              placeholder="Phone number (+1 555 555 5555)"
              value={phone}
              onChange={e => { setPhone(e.target.value); clearError(); }}
              disabled={loading || otpSent}
              autoComplete="tel"
            />
            {otpSent && (
              <input
                className="login-input"
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={e => { setOtp(e.target.value); clearError(); }}
                disabled={loading}
                maxLength={6}
                inputMode="numeric"
              />
            )}
            <button className="login-submit-btn" type="submit" disabled={loading}>
              {loading ? 'Please wait…' : otpSent ? 'Verify code' : 'Send code'}
            </button>
          </form>
        )}

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
          {mode === 'phone' && (
            <>
              <button className="login-link" onClick={() => { setMode('signin'); clearError(); setOtpSent(false); }} disabled={loading}>
                Use email instead
              </button>
              <span className="login-mode-sep">·</span>
              <button className="login-link" onClick={() => { setMode('signup'); clearError(); setOtpSent(false); }} disabled={loading}>
                Create an account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
