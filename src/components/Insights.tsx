import React, { useState, useMemo } from 'react';
import { UserStats, User, FocusSession, TimeRange } from '../types';
import { getChartData } from '../services/storageService';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { AdBanner } from './AdBanner';

export const Insights: React.FC<{ stats: UserStats; sessions: FocusSession[]; user: User }> = ({ stats, sessions, user }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('WEEK');
  const chartData = useMemo(() => getChartData(sessions, timeRange), [sessions, timeRange]);

  return (
    <div className="h-full overflow-y-auto px-6 pt-6 pb-24 space-y-6">
      <header className="mb-4"><h2 className="text-2xl font-light text-forest-800">Insights</h2></header>
      <AdBanner user={user} />
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100"><div className="flex items-center gap-2 text-emerald-600 mb-1"><Clock size={16} /><span className="text-xs font-semibold uppercase">Total Focus</span></div><p className="text-3xl font-light text-forest-900">{Math.floor(stats.totalMinutes / 60)}<span className="text-sm text-wood-500 font-normal">h</span> {stats.totalMinutes % 60}<span className="text-sm text-wood-500 font-normal">m</span></p></div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100"><div className="flex items-center gap-2 text-emerald-600 mb-1"><TrendingUp size={16} /><span className="text-xs font-semibold uppercase">Trees Grown</span></div><p className="text-3xl font-light text-forest-900">{stats.treesGrown}</p></div>
      </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-wood-100 min-h-[320px]">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase text-wood-400">Activity</h3>
            <div className="flex bg-wood-50 p-1 rounded-lg">{(['WEEK', 'MONTH', 'LIFETIME'] as TimeRange[]).map((range) => (<button key={range} onClick={() => setTimeRange(range)} className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${timeRange === range ? 'bg-white text-forest-700 shadow-sm' : 'text-wood-400'}`}>{range}</button>))}</div>
         </div>
         <div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af' }} /><Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px' }} /><Bar dataKey="value" radius={[4, 4, 0, 0]}>{chartData.map((e, i) => (<Cell key={i} fill={e.value > 0 ? '#34af75' : '#e5e7eb'} />))}</Bar></BarChart></ResponsiveContainer></div>
      </div>
    </div>
  );
};

