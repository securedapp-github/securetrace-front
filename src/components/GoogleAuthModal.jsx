import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock
} from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  // Handle Google Token Response
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('securetrace_token', data.token);
        localStorage.setItem('securetrace_user', JSON.stringify(data.user));
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to backend server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Quick One-Click Google Profile Simulation (handles dev environments without active GCP client secrets)
  const handleQuickGoogleSignIn = async (presetEmail, presetName) => {
    setLoading(true);
    setError(null);
    const email = presetEmail || customEmail || 'analyst@securedapp.io';
    const name = presetName || customName || 'SecuredApp Security Analyst';

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            google_id: `google_${Date.now()}`,
            email: email,
            name: name,
            picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
            locale: 'en',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('securetrace_token', data.token);
        localStorage.setItem('securetrace_user', JSON.stringify(data.user));
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Failed to authenticate');
      }
    } catch (err) {
      // Local fallback if backend isn't up
      const fallbackUser = {
        id: 1,
        email: email,
        name: name,
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        provider: 'google',
      };
      localStorage.setItem('securetrace_user', JSON.stringify(fallbackUser));
      onAuthSuccess(fallbackUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/10">
            <img src="/securetrace.png" alt="SecureTrace Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Google Sign In</h3>
            <p className="text-xs text-slate-400">SecureTrace by SecuredApp</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Access real-time crypto investigation, portfolio analytics, and credit scores.
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Official Google OAuth Button Container */}
        <div className="flex flex-col items-center justify-center py-2 bg-slate-950/60 rounded-xl border border-slate-800 mb-5 p-4">
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In failed or was cancelled')}
              theme="filled_blue"
              shape="pill"
              text="continue_with"
              width="320"
            />
          </div>
        </div>


      </div>
    </div>
  );
}
