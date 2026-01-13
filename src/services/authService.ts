import { User, SubscriptionTier } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY_USER = 'focus_forest_user';

export const getUser = (): User | null => {
  const raw = localStorage.getItem(STORAGE_KEY_USER);
  return raw ? JSON.parse(raw) : null;
};

export const loginWithGoogle = async (): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) throw error;
  // This return is a placeholder; auth happens on redirect
  return { id: 'pending', name: 'Connecting...', email: '', tier: SubscriptionTier.FREE };
};

export const loginAsGuest = async (): Promise<User> => {
  const guest: User = {
    id: `guest_${Date.now()}`,
    name: 'Forest Walker',
    email: 'Local Storage',
    avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Guest',
    tier: SubscriptionTier.FREE
  };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(guest));
  return guest;
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  localStorage.removeItem(STORAGE_KEY_USER);
};

export const upgradeToPremium = async (): Promise<User> => {
  // Replace this URL with your generic Stripe Payment Link
  window.open('https://buy.stripe.com/test_REPLACE_THIS_WITH_YOUR_LINK', '_blank');
  return new Promise((resolve) => {
    setTimeout(() => {
        // Simulate upgrade for instant gratification in testing
        const user = getUser();
        if(user) {
            const updated = { ...user, tier: SubscriptionTier.PREMIUM };
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
            resolve(updated);
        }
    }, 2000);
  });
};

