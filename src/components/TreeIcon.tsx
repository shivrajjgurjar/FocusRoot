import React from 'react';
import { TreeType, SessionStatus } from '../types';
import { Trees, Sprout, Leaf, Skull } from 'lucide-react';

export const TreeIcon: React.FC<{ type: TreeType; status: SessionStatus; progress?: number; size?: number }> = ({ status, progress = 1, size = 48 }) => {
  if (status === SessionStatus.FAILED) return <Skull size={size} className="text-stone-400" />;
  if (status === SessionStatus.RUNNING) {
    if (progress < 0.3) return <Sprout size={size * 0.6} className="text-forest-400 animate-pulse" />;
    return <Leaf size={size * 0.8} className="text-forest-500 animate-pulse" />;
  }
  return <Trees size={size} className="text-forest-600" />;
};

