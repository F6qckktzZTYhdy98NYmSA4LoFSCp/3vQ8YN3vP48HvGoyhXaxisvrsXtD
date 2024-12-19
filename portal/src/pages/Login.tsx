import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Turnstile from 'react-turnstile';
import { workerPostClientLog } from '../api/workerPostClientLog';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { session, signInWithGitHub, signInWithLinkedIn, sendOTP, verifyOTP } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const redirectTo = searchParams.get('redirectTo') || '/';

  useEffect(() => {
    if (session) {
      navigate(redirectTo, { replace: true });
    }
  }, [session, navigate, redirectTo]);

  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'login_page_load',
      event_data: {
        timestamp: new Date().toISOString()
      }
    }).catch(console.error);
  }, []);

  const handleGitHubSignIn = async () => {
    setIsSigningIn(true);
    setError(null);

    try {
      // ('Starting GitHub sign in process...');
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get('redirectTo');
      await signInWithGitHub(redirectTo || '/overview');
      // The redirect will be handled by the GitHub OAuth flow
    } catch (error) {
      console.error('Error during sign in:', error);
      setError('Failed to sign in with GitHub. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setIsSigningIn(true);
    setError(null);

    try {
      await signInWithLinkedIn(redirectTo);
    } catch (error) {
      console.error('Error signing in with LinkedIn:', error);
      setError('Failed to sign in with LinkedIn. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setShowTurnstile(true);
      return;
    }
    if (!email) return;

    setIsSigningIn(true);
    setError(null);

    try {
      await sendOTP(email, turnstileToken);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send code. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return;

    setIsSigningIn(true);
    setError(null);

    try {
      await verifyOTP(email, otp);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid code. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="text-center">
          <img src="/train.svg" alt="Zybertrain Logo" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Zybertrain</h2>
          <p className="text-gray-600 mb-8">
            {isSigningIn ? 'Setting up your secure session...' :
             error ? error :
             otpSent ? 'Enter the code sent to your email' :
             'Sign in to continue'}
          </p>
          
          {!isSigningIn && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Button
                  onClick={handleGitHubSignIn}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#24292F] text-white rounded-lg font-medium"
                  disabled={isSigningIn}
                >
                  <Github className="w-5 h-5" />
                  Sign in with GitHub
                </Button>
                <Button
                  onClick={handleLinkedInSignIn}
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0077B5] text-white rounded-lg font-medium"
                  variant="outline"
                >
                  <Linkedin className="w-5 h-5" />
                  Sign in with LinkedIn
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value) {
                          setShowTurnstile(true);
                        }
                      }}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#038127] text-white"
                    disabled={isSigningIn || !email || !turnstileToken}
                  >
                    <Mail className="w-5 h-5" />
                    Email me a code
                  </Button>
                  
                  {showTurnstile && (
                    <div className="flex justify-center">
                      <Turnstile
                        sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                        onVerify={handleTurnstileVerify}
                      />
                    </div>
                  )}
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full bg-[#038127] text-white"
                      disabled={isSigningIn || !otp || otp.length !== 6}
                    >
                      Verify code
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setError(null);
                      }}
                    >
                      Try different method
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {isSigningIn && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && !isSigningIn && (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-red-600">{error}</p>
              <Button
                onClick={() => {
                  setError(null);
                  window.history.replaceState({}, '', '/login');
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
