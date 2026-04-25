export type Skin = 'mapa' | 'lilith';
export type VacuumKind = 'classic' | 'robot' | 'upright';
export type Direction = 'none' | 'up' | 'down' | 'left' | 'right';

export const DIR_VECTORS: Record<Direction, [number, number]> = {
  none: [0, 0],
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

export const OPPOSITE: Record<Direction, Direction> = {
  none: 'none',
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};
