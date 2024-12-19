import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { workerPostClientLog } from '@/api/workerPostClientLog';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGitHub: (redirectTo?: string) => Promise<void>;
  signInWithLinkedIn: (redirectTo?: string) => Promise<void>;
  sendOTP: (email: string, captchaToken?: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      // console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log('Auth state changed:', { event, session });
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      window.localStorage.removeItem('zybertrain-auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signInWithGitHub = async (redirectTo?: string) => {
    try {
      workerPostClientLog({ event_type: 'auth', event_name: 'sign_in_with_github', event_data: { redirectTo } });
      // ('Starting GitHub sign in with redirect:', redirectTo);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectTo ? 
            `${window.location.origin}${redirectTo}` : 
            `${window.location.origin}/overview`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) {
        console.error('Error initiating GitHub sign in:', error);
        throw error;
      }
      
      if (data) {
        // console.log('Sign in initiated:', data);
      }
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  };

  const signInWithLinkedIn = async (redirectTo?: string) => {
    try {
      workerPostClientLog({ event_type: 'auth', event_name: 'sign_in_with_linkedin', event_data: { redirectTo } });
      // ('Starting LinkedIn sign in with redirect:', redirectTo);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: redirectTo ? 
            `${window.location.origin}${redirectTo}` : 
            `${window.location.origin}/overview`,
        }
      });
      
      if (error) {
        console.error('Error initiating LinkedIn sign in:', error);
        throw error;
      }
      if (data) {
        // console.log('Sign in initiated:', data);
      }
    } catch (error) {
      console.error('Error signing in with LinkedIn:', error);
      throw error;
    }
  };

  const sendOTP = async (email: string, captchaToken?: string) => {
    try {
      workerPostClientLog({ event_type: 'auth', event_name: 'send_otp', event_data: { email, captchaToken } });
      // ('Sending OTP to:', email);
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          captchaToken,
          shouldCreateUser: true,
        }
      });
      
      if (error) {
        console.error('Error sending OTP:', error);
        throw error;
      }
      if (data) {
        // console.log('OTP sent:', data);
      }

    } catch (error) {
      console.error('Error with OTP flow:', error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    try {
      workerPostClientLog({ event_type: 'auth', event_name: 'verify_otp', event_data: { email, token } });
      // ('Verifying OTP for:', email);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });
      
      if (error) {
        console.error('Error verifying OTP:', error);
        throw error;
      }
      // ('OTP verified:', data);
      setSession(data.session);
      setUser(data.user);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    signInWithGitHub,
    signInWithLinkedIn,
    sendOTP,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
