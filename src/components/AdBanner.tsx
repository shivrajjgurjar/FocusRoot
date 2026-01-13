import React from 'react';
import { User, SubscriptionTier } from '../types';

export const AdBanner: React.FC<{ user: User | null }> = ({ user }) => {
  if (user?.tier === SubscriptionTier.PREMIUM) return null;
  return (
    <div className="mx-4 my-4 p-4 bg-[#f5efe8] border border-[#ebdecfe] rounded-xl flex items-center justify-between shadow-sm">
      <div className="flex flex-col"><span className="text-[10px] font-bold text-[#ce9f7e] uppercase">Sponsored</span><p className="text-sm text-[#7d4132] font-medium">Master a new language.</p></div>
      <div className="h-10 w-10 bg-[#ebdecfe] rounded-lg flex items-center justify-center text-[10px] text-[#7d4132] font-bold">AD</div>
    </div>
  );
};

