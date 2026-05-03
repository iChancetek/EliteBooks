'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User, Building2, ArrowRight, Globe } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      router.push('/dashboard');
    } catch {
      setError('Could not create account. The email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch {
      setError('Google sign-up failed. Please try again.');
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
        <h1>Create your account</h1>
        <p>Get started with EliteBooks in under 2 minutes</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSignup} className="auth-form">
        <div className="auth-field">
          <label htmlFor="signup-name">Full Name</label>
          <div className="auth-input-wrap">
            <User size={16} className="auth-input-icon" />
            <input id="signup-name" type="text" className="input" placeholder="John Doe"
              value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name"
              style={{ paddingLeft: '42px' }} />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-company">Company Name</label>
          <div className="auth-input-wrap">
            <Building2 size={16} className="auth-input-icon" />
            <input id="signup-company" type="text" className="input" placeholder="Acme Inc."
              value={company} onChange={(e) => setCompany(e.target.value)}
              style={{ paddingLeft: '42px' }} />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <div className="auth-input-wrap">
            <Mail size={16} className="auth-input-icon" />
            <input id="signup-email" type="email" className="input" placeholder="you@company.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
              style={{ paddingLeft: '42px' }} />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <div className="auth-input-wrap">
            <Lock size={16} className="auth-input-icon" />
            <input id="signup-password" type="password" className="input" placeholder="Min. 8 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
              autoComplete="new-password" style={{ paddingLeft: '42px' }} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg auth-submit" id="signup-submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="auth-divider"><span>or continue with</span></div>

      <button onClick={handleGoogleSignup} className="btn btn-secondary btn-lg auth-social" id="google-signup" disabled={loading}>
        <Globe size={18} />
        Google
      </button>

      <p className="auth-footer-text">
        Already have an account?{' '}
        <Link href="/login" className="auth-link">Sign in</Link>
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
        .auth-header { text-align: center; margin-bottom: var(--space-8); }
        .auth-logo {
          width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
          background: var(--gradient-brand); border-radius: var(--radius-lg); color: white;
          margin: 0 auto var(--space-5);
        }
        .auth-header h1 { font-size: var(--text-2xl); margin-bottom: var(--space-2); }
        .auth-header p { font-size: var(--text-sm); color: var(--color-text-tertiary); }
        .auth-error {
          background: var(--color-negative-bg); border: 1px solid rgba(244,63,94,0.2);
          color: var(--color-negative); padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md); font-size: var(--text-sm); margin-bottom: var(--space-5); text-align: center;
        }
        .auth-form { display: flex; flex-direction: column; gap: var(--space-5); }
        .auth-field label {
          display: block; font-size: var(--text-sm); font-weight: var(--weight-medium);
          color: var(--color-text-secondary); margin-bottom: var(--space-2);
        }
        .auth-input-wrap { position: relative; }
        .auth-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--color-text-muted); pointer-events: none;
        }
        .auth-submit { width: 100%; margin-top: var(--space-2); }
        .auth-divider { text-align: center; margin: var(--space-6) 0; position: relative; }
        .auth-divider::before {
          content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px;
          background: var(--color-border-secondary);
        }
        .auth-divider span {
          background: var(--color-bg-secondary); padding: 0 var(--space-4);
          position: relative; font-size: var(--text-xs); color: var(--color-text-muted);
        }
        .auth-social { width: 100%; }
        .auth-footer-text {
          text-align: center; margin-top: var(--space-6); font-size: var(--text-sm);
          color: var(--color-text-tertiary);
        }
        .auth-link { color: var(--color-accent-primary); font-weight: var(--weight-medium); }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
