import React from 'react';
import {
  Compass,
  Leaf,
  Plane,
  ShoppingBag,
  Utensils,
  Zap,
  ShieldAlert,
} from 'lucide-react';

/**
 * Shared icon map matching string identifiers to Lucide React components.
 * Used across TwinClient and ProfileClient components to display custom archetype avatars.
 */
export const AVATAR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  compass: Compass,
  leaf: Leaf,
  plane: Plane,
  'shopping-bag': ShoppingBag,
  utensils: Utensils,
  zap: Zap,
  'shield-alert': ShieldAlert,
};
