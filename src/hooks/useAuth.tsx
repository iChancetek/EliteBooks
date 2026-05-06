'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface AuthContext {
  user: User | null;
  loading: boolean;
  isSuperAdmin: boolean;
  signOut: () => Promise<void>;
}

const SUPER_ADMINS = ['chancellor@ichancetek.com', 'chanceminus@gmail.com'];

const AuthCtx = createContext<AuthContext>({
  user: null,
  loading: true,
  isSuperAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsSuperAdmin(!!u?.email && SUPER_ADMINS.includes(u.email));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSignOut = useCallback(async () => {
    await firebaseSignOut(auth);
    router.push('/');
  }, [router]);

  return (
    <AuthCtx.Provider value={{ user, loading, isSuperAdmin, signOut: handleSignOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
