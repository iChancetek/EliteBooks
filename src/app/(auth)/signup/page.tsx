'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User, Building2, ArrowRight, Globe, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signInWithRedirect, GoogleAuthProvider, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Automatically redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      // Send verification email immediately
      await sendEmailVerification(cred.user);
      
      // Update profile with the chosen display name
      await updateProfile(cred.user, { 
        displayName: displayName || `${firstName} ${lastName}`.trim() 
      });

      // Redirect to a specific "Check your email" view or dashboard which will now be gated
      router.push('/dashboard'); 
    } catch (err: any) {
      console.error('Signup Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('The email is already in use by another account.');
      } else {
        setError(err.message || 'Could not create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      // Try popup first (works on desktop and most mobile browsers)
      try {
        await signInWithPopup(auth, provider);
        router.push('/dashboard');
      } catch (popupErr: any) {
        // If popup was blocked (common in PWA/mobile), fall back to redirect
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/popup-closed-by-user') {
          await signInWithRedirect(auth, provider);
        } else {
          throw popupErr;
        }
      }
    } catch (err: any) {
      console.error('Google Sign-up Error:', err);
      setError(`Google sign-up failed: ${err.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo" style={{ background: 'transparent' }}>
          <img src="/NewIcon.png" alt="EliteBooks" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1>Create your account</h1>
        <p>Get started with EliteBooks in under 2 minutes</p>
        <div className="verification-info">
          <Mail size={14} />
          <span>A verification link will be sent to your email. Check your junk/spam folder if it doesn&apos;t appear in your inbox. Access is gated until verified.</span>
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button onClick={handleGoogleSignup} className="auth-google-btn" id="google-signup" disabled={loading}>
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
        <span>Sign up with Google</span>
      </button>

      <div className="auth-divider">
        <span>or use email</span>
      </div>

      <form onSubmit={handleSignup} className="auth-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="auth-field">
            <label htmlFor="signup-firstname">First Name</label>
            <div className="auth-input-wrap">
              <User size={16} className="auth-input-icon" />
              <input id="signup-firstname" type="text" className="input" placeholder="John"
                value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="signup-lastname">Last Name</label>
            <div className="auth-input-wrap">
              <User size={16} className="auth-input-icon" />
              <input id="signup-lastname" type="text" className="input" placeholder="Doe"
                value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-displayname">Display Name (Public Name)</label>
          <div className="auth-input-wrap">
            <User size={16} className="auth-input-icon" />
            <input id="signup-displayname" type="text" className="input" placeholder="johndoe_elite"
              value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-company">Company Name</label>
          <div className="auth-input-wrap">
            <Building2 size={16} className="auth-input-icon" />
            <input id="signup-company" type="text" className="input" placeholder="Acme Inc."
              value={company} onChange={(e) => setCompany(e.target.value)} required />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <div className="auth-input-wrap">
            <Mail size={16} className="auth-input-icon" />
            <input id="signup-email" type="email" className="input" placeholder="you@company.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <div className="auth-input-wrap">
            <Lock size={16} className="auth-input-icon" />
            <input id="signup-password" type={showPassword ? 'text' : 'password'} className="input" placeholder="Min. 8 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
              autoComplete="new-password" />
            <button 
              type="button" 
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <div className="auth-input-wrap">
            <Lock size={16} className="auth-input-icon" />
            <input id="signup-confirm-password" type={showPassword ? 'text' : 'password'} className="input" placeholder="Repeat your password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8}
              autoComplete="new-password" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg auth-submit" id="signup-submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

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
        .auth-header p { font-size: var(--text-sm); color: var(--color-text-tertiary); margin-bottom: var(--space-4); }
        .verification-info {
          display: flex; align-items: center; justify-content: center; gap: var(--space-2);
          background: var(--color-accent-subtle); border: 1px solid rgba(59, 130, 246, 0.1);
          padding: var(--space-2) var(--space-3); border-radius: var(--radius-md);
          color: var(--color-accent-primary); font-size: 11px; font-weight: var(--weight-medium);
          margin-top: var(--space-2);
        }
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
        .auth-input-wrap .input { padding-left: 42px; }
        .auth-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--color-text-muted); pointer-events: none;
        }
        .auth-password-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--color-text-muted);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          padding: 4px; border-radius: 4px; transition: all var(--duration-fast);
        }
        .auth-password-toggle:hover { color: var(--color-text-primary); background: var(--color-bg-tertiary); }
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
        .auth-google-btn {
          width: 100%;
          height: 48px;
          background: #ffffff;
          border: 1px solid #dadce0;
          border-radius: var(--radius-md);
          color: #3c4043;
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          cursor: pointer;
          transition: all var(--duration-fast);
          margin-bottom: var(--space-4);
          font-family: var(--font-sans);
        }
        .auth-google-btn:hover {
          background-color: #f8f9fa;
          border-color: #d2d2d2;
          box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3);
        }
        .auth-google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .auth-link { color: var(--color-accent-primary); font-weight: var(--weight-medium); }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
