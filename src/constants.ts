import { TreeType } from './types';
export const APP_NAME = "Focus Forest";
export const FOCUS_DURATIONS = [10, 25, 50, 90, 120];
export const TREE_SPECIES = [
  { id: TreeType.OAK, name: 'Mighty Oak', minMinutes: 25, premium: false },
  { id: TreeType.PINE, name: 'Tall Pine', minMinutes: 10, premium: false },
  { id: TreeType.WILLOW, name: 'Weeping Willow', minMinutes: 50, premium: false },
  { id: TreeType.BONSAI, name: 'Ancient Bonsai', minMinutes: 60, premium: true },
];
export const MESSAGES = {
  focusStart: "Planting your tree...",
  focusRunning: "Keep focused. Your tree is growing.",
  focusFail: "Focus interrupted. The tree withered.",
  focusSuccess: "Well done. A new tree in your forest.",
  leaveWarning: "Leaving the app will kill your tree!",
};
export const PREMIUM_PRICE = "₹99/mo";
export const PREMIUM_YEARLY_PRICE = "₹999/yr";

