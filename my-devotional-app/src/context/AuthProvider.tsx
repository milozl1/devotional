import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getAdminProfile } from '../lib/api/admin';
import type { AdminProfile } from '../types';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const syncAdminProfile = useCallback(async (userId?: string | null) => {
    if (!userId) {
      setAdminProfile(null);
      return null;
    }

    try {
      const profile = await getAdminProfile(userId);
      setAdminProfile(profile);
      return profile;
    } catch (error) {
      console.error('Failed to load admin profile:', error);
      setAdminProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!active) return;

        setSession(data.session);
        await syncAdminProfile(data.session?.user.id);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        if (active) {
          setSession(null);
          setAdminProfile(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void syncAdminProfile(nextSession?.user.id);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [syncAdminProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error('Authenticated user is missing.');

      const profile = await syncAdminProfile(user.id);
      if (!profile) {
        await supabase.auth.signOut();
        throw new Error('Contul este valid, dar nu are rol de administrator.');
      }
    },
    [syncAdminProfile]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setAdminProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        adminProfile,
        isAdmin: Boolean(adminProfile),
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
