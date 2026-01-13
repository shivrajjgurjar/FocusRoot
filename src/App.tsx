import React, { useState, useEffect } from 'react';
import { ViewState, FocusSession, User } from './types';
import { FocusTimer } from './components/FocusTimer';
import { ForestGallery } from './components/ForestGallery';
import { Insights } from './components/Insights';
import { NavBar } from './components/NavBar';
import { LoginScreen } from './components/LoginScreen';
import { saveSession, getSessions, calculateStats } from './services/storageService';
import { getUser } from './services/authService';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('TIMER');
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Load Local
    const user = getUser();
    setCurrentUser(user);
    setSessions(getSessions());
    
    // 2. Check Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
        setIsLoading(false);
    });
  }, []);

  const handleSessionComplete = (session: FocusSession) => {
    saveSession(session);
    setSessions(getSessions()); 
    setIsSessionActive(false);
  };

  const handleSessionFail = (session: FocusSession) => {
    saveSession(session);
    setSessions(getSessions());
    setIsSessionActive(false);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('TIMER');
  };

  const handleUpdateUser = (user: User | null) => {
    setCurrentUser(user);
    if (!user) setIsSessionActive(false);
  };

  if (isLoading) {
    return <div className="h-screen bg-[#fbf7f3] flex items-center justify-center text-[#22714d]">Loading Forest...</div>;
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto h-screen bg-[#fbf7f3] relative overflow-hidden flex flex-col font-sans shadow-2xl">
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen bg-[#fbf7f3] relative overflow-hidden flex flex-col font-sans shadow-2xl">
      <main className="flex-1 relative overflow-hidden">
        {currentView === 'TIMER' && (
          <FocusTimer user={currentUser} onSessionComplete={handleSessionComplete} onSessionFail={handleSessionFail} onUpdateUser={handleUpdateUser} />
        )}
        {currentView === 'FOREST' && <ForestGallery sessions={sessions} user={currentUser} />}
        {currentView === 'INSIGHTS' && <Insights stats={calculateStats()} sessions={sessions} user={currentUser} />}
      </main>
      <NavBar currentView={currentView} onChange={setCurrentView} disabled={isSessionActive && currentView === 'TIMER'} />
    </div>
  );
}

