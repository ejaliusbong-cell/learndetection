import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signInWithGoogle, signOutUser } from '../services/supabase';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.getCurrentUser();
      if (res?.user) {
        setUser(res.user);
      }
    } catch {
      // If error occurs, check if demo session stored in local storage
      const demo = localStorage.getItem('facescan_demo_session');
      if (demo) {
        try {
          const parsed = JSON.parse(demo);
          setUser(parsed.user);
        } catch {}
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile();
      } else {
        const demo = localStorage.getItem('facescan_demo_session');
        if (demo) {
          try {
            setUser(JSON.parse(demo).user);
          } catch {}
        }
        setLoading(false);
      }
    });

    // Supabase Auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile();
      } else {
        const demo = localStorage.getItem('facescan_demo_session');
        if (!demo) {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    await signInWithGoogle();
  };

  const loginDemo = () => {
    const demoUser: UserProfile = {
      id: '11111111-1111-1111-1111-111111111111',
      supabaseUserId: 'demo-google-user-01',
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      'facescan_demo_session',
      JSON.stringify({
        token: 'demo-jwt-token-face-analysis',
        user: demoUser,
      })
    );
    setUser(demoUser);
    setLoading(false);
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginDemo,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
