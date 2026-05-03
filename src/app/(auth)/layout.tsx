import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      <div className="auth-bg-mesh" />
      <div className="auth-container">
        {children}
      </div>
      <style>{`
        .auth-layout {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: var(--space-6);
        }
        .auth-bg-mesh {
          position: fixed;
          inset: 0;
          background: var(--gradient-mesh);
          pointer-events: none;
        }
        .auth-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
        }
      `}</style>
    </div>
  );
}
