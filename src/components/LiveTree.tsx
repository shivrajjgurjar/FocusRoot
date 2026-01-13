import React, { useMemo } from 'react';
import { TreeType, SessionStatus } from '../types';

export const LiveTree: React.FC<{ type: TreeType; status: SessionStatus; progress: number; size?: number }> = ({ type, status, progress, size = 200 }) => {
  const isDead = status === SessionStatus.FAILED;
  const sproutOpacity = progress < 0.2 ? 1 : Math.max(0, 1 - (progress - 0.2) * 10);
  const sproutScale = Math.min(1, progress / 0.1);
  const isMature = progress > 0.4;
  const matureScale = isMature ? Math.min(1, (progress - 0.4) / 0.6) : 0;
  const color = isDead ? '#78350f' : '#15803d';

  return (
    <div style={{ width: size, height: size }} className="relative flex items-end justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" style={{ transform: isDead ? 'rotate(85deg) translateY(20px)' : 'none', transition: 'transform 2s' }}>
        <g style={{ opacity: sproutOpacity, transform: `scale(${sproutScale})`, transformOrigin: 'bottom center' }}>
            <path d="M100 190 Q 100 160 110 150" stroke="#4ade80" strokeWidth="3" fill="none" /><ellipse cx="110" cy="150" rx="6" ry="10" fill="#4ade80" transform="rotate(30 110 150)" />
        </g>
        <g style={{ opacity: isMature || isDead ? 1 : 0, transform: `scale(${matureScale})`, transformOrigin: 'bottom center', transition: 'transform 1s' }}>
            <ellipse cx="100" cy="195" rx="40" ry="5" fill="#3f3f46" opacity="0.1" />
            <path d="M100 195 Q 90 150 90 100 L 110 100 Q 110 150 100 195 Z" fill={isDead ? '#451a03' : '#78350f'} />
            <circle cx="100" cy="90" r="45" fill={color} />
            <circle cx="70" cy="110" r="35" fill={color} /><circle cx="130" cy="110" r="35" fill={color} /><circle cx="100" cy="60" r="30" fill={color} />
        </g>
      </svg>
    </div>
  );
};

