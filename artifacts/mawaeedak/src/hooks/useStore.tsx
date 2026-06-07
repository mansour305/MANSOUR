import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { getUserProfile, getRoleWithFallback, type UserProfile } from "@/lib/profileService";

interface UserData {
  id: string;
  name: string;
  email: string;
  city: string;
  cityKey: string;
  timezone: string;
  role: string;
  onboardingComplete: boolean;
  interests: string[];
}

interface StoreContextType {
  user: UserData;
  setUser: (user: Partial<UserData>) => void;
  hideAds: boolean;
  setHideAds: (hide: boolean) => void;
  isAdmin: boolean;
  setAdmin: (isAdmin: boolean) => void;
  refreshProfile: () => Promise<void>;
  isLoading: boolean;
}

const defaultUser: UserData = {
  id: '',
  name: '',
  email: '',
  city: '',
  cityKey: '',
  timezone: 'Asia/Riyadh',
  role: 'user',
  onboardingComplete: false,
  interests: [],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserData>(() => {
    try {
      const stored = localStorage.getItem('app-user');
      return stored ? JSON.parse(stored) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  const [hideAds, setHideAds] = useState(() => localStorage.getItem('hide-ads') === 'true');
  const [isAdmin, setAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setUser = (updates: Partial<UserData>) => {
    setUserState(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('app-user', JSON.stringify(next));
      return next;
    });
  };

  const refreshProfile = async () => {
    if (!isSupabaseEnabled || !supabase) return;
    
    setIsLoading(true);
    try {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (sbUser) {
        const profile = await getUserProfile(sbUser.id);
        if (profile) {
          setUserState(prev => {
            const next = {
              ...prev,
              id: sbUser.id,
              name: profile.full_name || prev.name,
              email: sbUser.email || prev.email,
              city: profile.city_name_ar || prev.city,
              cityKey: profile.city_key || prev.cityKey,
              timezone: profile.timezone || prev.timezone,
              role: profile.role || prev.role,
              onboardingComplete: profile.onboarding_complete,
            };
            localStorage.setItem('app-user', JSON.stringify(next));
            return next;
          });
          
          // Update admin status based on role
          const isAdminRole = ['admin', 'super_admin', 'owner'].includes(profile.role);
          setAdmin(isAdminRole);
        }
      }
    } catch (err) {
      console.error('[Store] Error refreshing profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('hide-ads', hideAds ? 'true' : 'false');
  }, [hideAds]);

  // Listen for auth state changes
  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Load profile on sign in
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUserState(prev => {
            const next = {
              ...prev,
              id: session.user.id,
              name: profile.full_name || session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              city: profile.city_name_ar || prev.city,
              cityKey: profile.city_key || prev.cityKey,
              timezone: profile.timezone || prev.timezone,
              role: profile.role || 'user',
              onboardingComplete: profile.onboarding_complete,
            };
            localStorage.setItem('app-user', JSON.stringify(next));
            return next;
          });
          
          const isAdminRole = ['admin', 'super_admin', 'owner'].includes(profile.role);
          setAdmin(isAdminRole);
        } else {
          // No profile yet, use auth data
          setUserState(prev => {
            const next = {
              ...prev,
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              role: session.user.app_metadata?.role || 'user',
            };
            localStorage.setItem('app-user', JSON.stringify(next));
            return next;
          });
          
          const role = session.user.app_metadata?.role || 'user';
          const isAdminRole = ['admin', 'super_admin', 'owner'].includes(role);
          setAdmin(isAdminRole);
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear user data on sign out
        setUserState(defaultUser);
        localStorage.removeItem('app-user');
        setAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <StoreContext.Provider value={{ user, setUser, hideAds, setHideAds, isAdmin, setAdmin, refreshProfile, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
