import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FocusSession, SessionStatus, TreeType, User, SubscriptionTier } from '../types';
import { FOCUS_DURATIONS, TREE_SPECIES, MESSAGES } from '../constants';
import { TreeIcon } from './TreeIcon';
import { LiveTree } from './LiveTree';
import { Play, Square, Volume2, VolumeX, Lock, Home, AlertCircle, Sparkles } from 'lucide-react';
import { ProfileModal } from './ProfileModal';

interface FocusTimerProps { user: User; onSessionComplete: (s: FocusSession) => void; onSessionFail: (s: FocusSession) => void; onUpdateUser: (u: User | null) => void; }
const NATURE_SOUND_URL = "https://actions.google.com/sounds/v1/nature/rain_and_thunder_on_pavement.ogg"; 

export const FocusTimer: React.FC<FocusTimerProps> = ({ user, onSessionComplete, onSessionFail, onUpdateUser }) => {
  const [duration, setDuration] = useState(25);
  const [selectedTree, setSelectedTree] = useState(TreeType.OAK);
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.IDLE);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playWoodClick = useCallback(() => {
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContextRef.current!;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }, []);

  useEffect(() => { audioRef.current = new Audio(NATURE_SOUND_URL); audioRef.current.loop = true; audioRef.current.volume = 0.2; return () => { audioRef.current?.pause(); }; }, []);
  useEffect(() => { if (!audioRef.current) return; if (status === SessionStatus.RUNNING && soundEnabled) audioRef.current.play().catch(()=>{}); else audioRef.current.pause(); }, [status, soundEnabled]);
  useEffect(() => { const h = () => { if (document.hidden && status === SessionStatus.RUNNING) failSession(); }; document.addEventListener("visibilitychange", h); return () => document.removeEventListener("visibilitychange", h); }, [status]);

  const updateDuration = (n: number) => { setDuration(n); setTimeLeft(n * 60); };
  const startSession = () => {
    playWoodClick();
    if (selectedTree === TreeType.BONSAI && user.tier !== SubscriptionTier.PREMIUM) { setShowProfile(true); return; }
    setStatus(SessionStatus.RUNNING); setTimeLeft(duration * 60); setStartTime(Date.now()); setSoundEnabled(true);
    timerRef.current = setInterval(() => { setTimeLeft((prev) => { if (prev <= 1) { completeSession(); return 0; } return prev - 1; }); }, 1000);
  };
  const completeSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus(SessionStatus.COMPLETED); setSoundEnabled(false);
    onSessionComplete({ id: crypto.randomUUID(), startTime: startTime!, endTime: Date.now(), durationMinutes: duration, status: SessionStatus.COMPLETED, treeType: selectedTree });
  };
  const failSession = () => { if (timerRef.current) clearInterval(timerRef.current); setStatus(SessionStatus.FAILED); setSoundEnabled(false); };
  const finalizeFailure = () => { playWoodClick(); onSessionFail({ id: crypto.randomUUID(), startTime: startTime || Date.now(), endTime: Date.now(), durationMinutes: duration, status: SessionStatus.FAILED, treeType: selectedTree }); reset(); };
  const reset = () => { setStatus(SessionStatus.IDLE); updateDuration(25); setShowGiveUpModal(false); };

  if (status === SessionStatus.IDLE) {
    return (
      <>
        <div className="absolute top-6 right-6 z-50">
          <button onClick={() => setShowProfile(true)} className="relative hover:scale-105 active:scale-95 transition-all">
            <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
            {user.tier === SubscriptionTier.PREMIUM && <div className="absolute -bottom-1 -right-1 bg-amber-100 text-amber-600 rounded-full p-0.5"><Sparkles size={10} fill="currentColor" /></div>}
          </button>
        </div>
        {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onUpdateUser={onUpdateUser} />}
        <div className="flex flex-col justify-between h-full px-6 pt-16 pb-24 overflow-hidden">
          <header className="text-center"><h2 className="text-3xl font-light text-forest-800">Plant a Tree</h2><p className="text-forest-600/70 text-sm mt-1">Choose your focus companion.</p></header>
          <div className="grid grid-cols-2 gap-3 my-2">
            {TREE_SPECIES.map((tree) => {
               const isLocked = tree.premium && user.tier !== SubscriptionTier.PREMIUM;
               return (
                <button key={tree.id} onClick={() => { playWoodClick(); setSelectedTree(tree.id); }} className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all ${selectedTree === tree.id ? 'border-forest-500 bg-white shadow-lg' : 'border-transparent bg-white/40'} ${isLocked ? 'opacity-70' : ''}`}>
                    <div className={`p-2 rounded-full mb-2 ${selectedTree === tree.id ? 'bg-forest-50' : ''}`}><TreeIcon type={tree.id} status={SessionStatus.COMPLETED} size={28} /></div>
                    <span className="text-xs font-medium text-wood-600">{tree.name}</span>
                    {tree.premium && <div className="absolute top-2 right-2 text-amber-500">{isLocked ? <Lock size={12} /> : <Sparkles size={12} />}</div>}
                </button>
               );
            })}
          </div>
          <div className="flex flex-col gap-5">
              <div>
                   <div className="flex justify-between mb-2 px-1"><p className="text-[10px] font-bold text-wood-400 uppercase">Duration</p><span className="text-sm font-semibold text-forest-700 bg-forest-50 px-2 rounded">{duration}m</span></div>
                   <input type="range" min="5" max="120" value={duration} onChange={(e) => { playWoodClick(); updateDuration(parseInt(e.target.value)); }} className="premium-slider mb-4" />
                   <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                      {FOCUS_DURATIONS.map(d => (
                        <button key={d} onClick={() => { playWoodClick(); updateDuration(d); }} className={`flex-shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-all ${duration === d ? 'bg-forest-600 text-white scale-110' : 'bg-white text-wood-500'}`}>{d}</button>
                      ))}
                  </div>
              </div>
              <button onClick={startSession} className="w-full bg-forest-800 text-white rounded-2xl py-4 text-lg font-medium shadow-xl flex items-center justify-center gap-3 active:scale-95"><Play size={20} fill="currentColor" />Plant Now</button>
          </div>
        </div>
      </>
    );
  }

  const progress = 1 - (timeLeft / (duration * 60));
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-forest-900 via-forest-800 to-wood-900 text-white absolute inset-0 z-50">
      <div className="flex flex-col items-center justify-center w-full h-full relative z-10 p-6">
        {status === SessionStatus.RUNNING && <div className="absolute top-8 right-6"><button onClick={()=>{setSoundEnabled(!soundEnabled)}} className="p-3 rounded-full bg-white/10">{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button></div>}
        <div className="relative mb-8">
            <div className={`absolute w-72 h-72 ${status === SessionStatus.RUNNING ? 'opacity-100' : 'opacity-0'}`}>
                 <svg className="w-full h-full -rotate-90"><circle cx="144" cy="144" r="140" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" /><circle cx="144" cy="144" r="140" fill="none" stroke="#34af75" strokeWidth="3" strokeDasharray={2 * Math.PI * 140} strokeDashoffset={2 * Math.PI * 140 * (1 - progress)} strokeLinecap="round" /></svg>
            </div>
            <LiveTree type={selectedTree} status={status} progress={status === SessionStatus.COMPLETED ? 1 : progress} size={status === SessionStatus.COMPLETED ? 280 : 240} />
        </div>
        {status === SessionStatus.RUNNING && (
            <div className="text-center space-y-8">
                <span className="text-5xl font-light font-mono text-emerald-50">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span>
                <button onClick={()=>{playWoodClick(); setShowGiveUpModal(true);}} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/40 mx-auto"><Square size={14} fill="currentColor" />GIVE UP</button>
            </div>
        )}
        {status === SessionStatus.FAILED && (
            <div className="text-center space-y-6 max-w-xs">
                 <h2 className="text-3xl font-serif text-amber-200">Withered.</h2>
                 <button onClick={finalizeFailure} className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center gap-2 mx-auto"><Home size={16} />Return Home</button>
            </div>
        )}
        {status === SessionStatus.COMPLETED && (
             <div className="text-center space-y-6 max-w-xs">
                <h2 className="text-3xl font-serif text-emerald-100">Beautiful!</h2>
                <button onClick={() => { playWoodClick(); reset(); }} className="px-8 py-3 bg-emerald-600 text-white rounded-full mx-auto block">Continue</button>
             </div>
        )}
      </div>
      {showGiveUpModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#fbf7f3] rounded-3xl p-6 w-80 text-center border-2 border-forest-100">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600"><AlertCircle size={24} /></div>
                <h3 className="text-xl font-bold text-forest-900 mb-2">Are you sure?</h3>
                <p className="text-wood-600 text-sm mb-6">If you give up now, your tree will die.</p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => setShowGiveUpModal(false)} className="w-full py-3.5 rounded-xl bg-forest-600 text-white font-medium">Resume Focus</button>
                    <button onClick={() => {setShowGiveUpModal(false); failSession();}} className="w-full py-3.5 rounded-xl text-red-500 font-medium">Let it die</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

