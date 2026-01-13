export enum SessionStatus { IDLE = 'IDLE', RUNNING = 'RUNNING', COMPLETED = 'COMPLETED', FAILED = 'FAILED', PAUSED = 'PAUSED' }
export enum TreeType { OAK = 'Oak', PINE = 'Pine', WILLOW = 'Willow', BONSAI = 'Bonsai' }
export enum SubscriptionTier { FREE = 'FREE', PREMIUM = 'PREMIUM' }
export interface User { id: string; name: string; email: string; avatarUrl?: string; tier: SubscriptionTier; }
export interface FocusSession { id: string; startTime: number; durationMinutes: number; status: SessionStatus; treeType: TreeType; endTime?: number; }
export interface UserStats { totalMinutes: number; sessionsCompleted: number; sessionsFailed: number; treesGrown: number; }
export type ViewState = 'TIMER' | 'FOREST' | 'INSIGHTS' | 'SETTINGS';
export type TimeRange = 'WEEK' | 'MONTH' | 'LIFETIME';
export interface ChartDataPoint { label: string; value: number; fullDate: string; }

