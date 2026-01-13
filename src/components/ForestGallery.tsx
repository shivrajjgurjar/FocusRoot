import React from 'react';
import { FocusSession, SessionStatus, User } from '../types';
import { TreeIcon } from './TreeIcon';
import { Calendar } from 'lucide-react';
import { AdBanner } from './AdBanner';

export const ForestGallery: React.FC<{ sessions: FocusSession[]; user: User }> = ({ sessions, user }) => {
  const successfulSessions = sessions.filter(s => s.status === SessionStatus.COMPLETED);
  const witheredSessions = sessions.filter(s => s.status === SessionStatus.FAILED);
  const groupedSessions = successfulSessions.reduce((acc, session) => {
    if (!session.endTime) return acc;
    const date = new Date(session.endTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    if (!acc[date]) acc[date] = []; acc[date].push(session); return acc;
  }, {} as Record<string, FocusSession[]>);

  if (sessions.length === 0) return <div className="flex flex-col items-center justify-center h-full text-wood-400 p-8 text-center"><Calendar size={48} className="mb-4 opacity-50" /><p>Your forest is empty.</p></div>;

  return (
    <div className="h-full overflow-y-auto pb-20 px-4 pt-6">
      <header className="mb-8 pl-2"><h2 className="text-2xl font-light text-forest-800">My Forest</h2><p className="text-wood-500 text-sm">{successfulSessions.length} healthy trees, {witheredSessions.length} withered</p></header>
      <AdBanner user={user} />
      <div className="space-y-8 mt-4">
        {Object.entries(groupedSessions).map(([date, daySessions]) => (
          <div key={date} className="bg-white/50 rounded-2xl p-5 shadow-sm border border-wood-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-wood-400 mb-4 sticky top-0 bg-transparent backdrop-blur-sm py-1">{date}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
               {daySessions.map((session) => (<div key={session.id} className="flex flex-col items-center group"><div className="transform transition-transform group-hover:-translate-y-1"><TreeIcon type={session.treeType} status={SessionStatus.COMPLETED} size={40} /></div><span className="text-[10px] text-wood-400 mt-1">{session.durationMinutes}m</span></div>))}
            </div>
          </div>
        ))}
        {witheredSessions.length > 0 && (
           <div className="bg-stone-100 rounded-2xl p-5"><h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Withered</h3><div className="grid grid-cols-6 gap-2">{witheredSessions.map((s) => (<div key={s.id} className="opacity-50 grayscale"><TreeIcon type={s.treeType} status={SessionStatus.FAILED} size={24} /></div>))}</div></div>
        )}
      </div>
    </div>
  );
};

