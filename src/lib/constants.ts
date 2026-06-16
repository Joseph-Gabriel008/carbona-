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
 * Shared icon map matching Carbon Twin archetype string identifiers to Lucide React component classes.
 * Used across TwinClient and ProfileClient components to display custom archetype avatars.
 * Unit: Lucide Icon Component Mapping
 */
export const AVATAR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  compass: Compass,
  leaf: Leaf,
  plane: Plane,
  'shopping-bag': ShoppingBag,
  utensils: Utensils,
  zap: Zap,
  'shield-alert': ShieldAlert,
} as const;
