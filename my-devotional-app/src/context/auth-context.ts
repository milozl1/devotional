import { createContext, useContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { AdminProfile } from '../types';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  adminProfile: AdminProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
