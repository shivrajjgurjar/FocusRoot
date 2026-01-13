import React, { useState } from 'react';
import { loginWithGoogle, loginAsGuest } from '../services/authService';
import { User } from '../types';
import { Trees, User as UserIcon } from 'lucide-react';

interface LoginScreenProps { onLoginSuccess: (user: User) => void; }

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => { setLoading(true); try { await loginWithGoogle(); } catch(e) { setLoading(false); } };
  const handleGuestLogin = async () => { const user = await loginAsGuest(); onLoginSuccess(user); };

  return (
    <div className="h-full flex flex-col items-center justify-between p-8 bg-[#fbf7f3] relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[50%] bg-[#c3eed2]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm z-10">
        <div className="w-20 h-20 bg-[#e1f8e8] rounded-3xl flex items-center justify-center mb-8 shadow-sm rotate-3">
          <Trees size={40} className="text-[#268e5e]" />
        </div>
        <h1 className="text-4xl font-serif text-[#1a4a35] mb-3 text-center">Focus Forest</h1>
        <p className="text-[#b66645] text-center mb-12 leading-relaxed">Plant trees by staying focused.<br/>Build a habit. Grow your forest.</p>
        <div className="w-full space-y-4">
          <button onClick={handleLogin} disabled={loading} className="w-full bg-white border border-[#ebdecfe] hover:border-[#dec2a8] text-[#974f38] font-medium py-3.5 px-6 rounded-xl shadow-sm flex items-center justify-center gap-3 transition-all active:scale-95">
            {loading ? <span>Connecting...</span> : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
          <button onClick={handleGuestLogin} disabled={loading} className="w-full bg-transparent hover:bg-[#f5efe8]/50 text-[#c38059] font-medium py-3 px-6 rounded-xl border border-transparent hover:border-[#ebdecfe] flex items-center justify-center gap-2 transition-all active:scale-95">
             <UserIcon size={18} /><span>Continue as Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
};

