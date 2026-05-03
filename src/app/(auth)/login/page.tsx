'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo">
          <Sparkles size={22} />
        </div>
        <h1>Welcome back</h1>
        <p>Sign in to your EliteBooks account</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleEmailLogin} className="auth-form">
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <div className="auth-input-wrap">
            <Mail size={16} className="auth-input-icon" />
            <input
              id="login-email"
              type="email"
              className="input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <Lock size={16} className="auth-input-icon" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-toggle-pw"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg auth-submit" id="login-submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <button onClick={handleGoogleLogin} className="btn btn-secondary btn-lg auth-social" id="google-login" disabled={loading}>
        <Globe size={18} />
        Google
      </button>

      <p className="auth-footer-text">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="auth-link">Create one free</Link>
      </p>

      <style>{`
        .auth-card {
          background: var(--color-glass-bg);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--color-glass-border);
          border-radius: var(--radius-xl);
          padding: var(--space-10);
          animation: fadeInUp 0.6s var(--ease-out-expo) both;
        }
        .auth-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }
        .auth-logo {
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          background: var(--gradient-brand);
          border-radius: var(--radius-lg);
          color: white;
          margin: 0 auto var(--space-5);
        }
        .auth-header h1 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-2);
        }
        .auth-header p {
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
        }
        .auth-error {
          background: var(--color-negative-bg);
          border: 1px solid rgba(244,63,94,0.2);
          color: var(--color-negative);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          margin-bottom: var(--space-5);
          text-align: center;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .auth-field label {
          display: block;
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          color: var(--color-text-secondary);
          margin-bottom: var(--space-2);
        }
        .auth-input-wrap {
          position: relative;
        }
        .auth-input-wrap .input {
          padding-left: 42px;
          padding-right: 42px;
        }
        .auth-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          pointer-events: none;
        }
        .auth-toggle-pw {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--color-text-muted);
          padding: 4px;
          cursor: pointer;
        }
        .auth-toggle-pw:hover { color: var(--color-text-secondary); }
        .auth-submit {
          width: 100%;
          margin-top: var(--space-2);
        }
        .auth-divider {
          text-align: center;
          margin: var(--space-6) 0;
          position: relative;
        }
        .auth-divider::before {
          content: '';
          position: absolute;
          left: 0; right: 0;
          top: 50%;
          height: 1px;
          background: var(--color-border-secondary);
        }
        .auth-divider span {
          background: var(--color-bg-secondary);
          padding: 0 var(--space-4);
          position: relative;
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        .auth-social {
          width: 100%;
        }
        .auth-footer-text {
          text-align: center;
          margin-top: var(--space-6);
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
        }
        .auth-link {
          color: var(--color-accent-primary);
          font-weight: var(--weight-medium);
        }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
