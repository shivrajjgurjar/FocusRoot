import React, { useState } from 'react';
import { User, SubscriptionTier } from '../types';
import { upgradeToPremium, logout } from '../services/authService';
import { X, Crown, LogOut, Check, Sparkles } from 'lucide-react';
import { PREMIUM_PRICE, PREMIUM_YEARLY_PRICE } from '../constants';

export const ProfileModal: React.FC<{ user: User; onClose: () => void; onUpdateUser: (u: User | null) => void; }> = ({ user, onClose, onUpdateUser }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const handleUpgrade = async () => { setIsUpgrading(true); await upgradeToPremium(); setIsUpgrading(false); };
  const handleLogout = () => { logout(); onUpdateUser(null); onClose(); };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#fbf7f3] w-[90%] rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between mb-6">
            <div className="flex gap-4"><img src={user.avatarUrl} className="w-16 h-16 rounded-full" /><div><h2 className="text-xl font-bold text-forest-900">{user.name}</h2><p className="text-sm text-wood-500">{user.email}</p></div></div>
            <button onClick={onClose}><X size={20} className="text-wood-400" /></button>
        </div>
        {user.tier === SubscriptionTier.FREE ? (
            <div className="bg-forest-900 rounded-xl p-6 text-white mb-6">
                <h3 className="text-xl mb-2 flex items-center gap-2"><Sparkles className="text-amber-300" />Upgrade to Premium</h3>
                <ul className="text-sm space-y-2 mb-4 text-emerald-100"><li>Ad-free experience</li><li>Unlock Ancient Bonsai</li></ul>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleUpgrade} disabled={isUpgrading} className="bg-white/10 py-3 rounded-lg border border-white/20">{PREMIUM_PRICE}</button>
                    <button onClick={handleUpgrade} disabled={isUpgrading} className="bg-white text-forest-900 py-3 rounded-lg font-bold shadow-lg">{PREMIUM_YEARLY_PRICE}</button>
                </div>
            </div>
        ) : <div className="bg-emerald-50 p-6 rounded-xl text-center mb-6"><Crown className="mx-auto text-emerald-600 mb-2" size={32} /><h3 className="text-forest-800 font-bold">Premium Member</h3></div>}
        <button onClick={handleLogout} className="w-full py-4 text-red-500 font-medium flex justify-center gap-2 border-t border-wood-200"><LogOut size={18} />Sign Out</button>
      </div>
    </div>
  );
};

