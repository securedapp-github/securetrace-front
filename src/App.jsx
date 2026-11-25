import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import GoogleAuthModal from './components/GoogleAuthModal.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check stored user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('securetrace_user');
    const token = localStorage.getItem('securetrace_token');

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('securetrace_user');
        localStorage.removeItem('securetrace_token');
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('securetrace_user');
    localStorage.removeItem('securetrace_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading SecureTrace...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LandingPage 
          onLoginClick={() => setAuthModalOpen(true)}
          onDemoLogin={() => setAuthModalOpen(true)}
        />
      )}

      {/* Google SSO Login Modal */}
      <GoogleAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
