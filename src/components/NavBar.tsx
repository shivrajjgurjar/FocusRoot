import React from 'react';
import { ViewState } from '../types';
import { Timer, Trees, BarChart2 } from 'lucide-react';

interface NavBarProps { currentView: ViewState; onChange: (v: ViewState) => void; disabled: boolean; }

export const NavBar: React.FC<NavBarProps> = ({ currentView, onChange, disabled }) => {
  if (disabled) return null;
  const items = [{ id: 'TIMER', icon: Timer, label: 'Focus' }, { id: 'FOREST', icon: Trees, label: 'Forest' }, { id: 'INSIGHTS', icon: BarChart2, label: 'Insights' }];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-wood-100 px-6 py-3 pb-6 flex justify-around items-center z-40">
      {items.map((item) => {
        const Icon = item.icon; const isActive = currentView === item.id;
        return (
          <button key={item.id} onClick={() => onChange(item.id as ViewState)} className={`flex flex-col items-center gap-1 ${isActive ? 'text-forest-600' : 'text-wood-400'}`}>
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} /><span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

