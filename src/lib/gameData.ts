// Snake and Ladder positions
export const SNAKES: Record<number, number> = {
  99: 54,
  95: 75,
  92: 88,
  89: 68,
  74: 53,
  64: 60,
  62: 19,
  49: 11,
  46: 25,
  16: 6,
};

export const LADDERS: Record<number, number> = {
  2: 38,
  7: 14,
  8: 31,
  15: 26,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  78: 98,
  87: 94,
};

export const PLAYER_COLORS = [
  { name: 'Red', bg: 'bg-red-500', border: 'border-red-600', glow: 'shadow-red-500/50' },
  { name: 'Blue', bg: 'bg-blue-500', border: 'border-blue-600', glow: 'shadow-blue-500/50' },
  { name: 'Green', bg: 'bg-emerald-500', border: 'border-emerald-600', glow: 'shadow-emerald-500/50' },
  { name: 'Yellow', bg: 'bg-amber-400', border: 'border-amber-500', glow: 'shadow-amber-400/50' },
  { name: 'Purple', bg: 'bg-purple-500', border: 'border-purple-600', glow: 'shadow-purple-500/50' },
  { name: 'Teal', bg: 'bg-teal-500', border: 'border-teal-600', glow: 'shadow-teal-500/50' },
];

export interface Player {
  name: string;
  position: number;
  colorIndex: number;
}

export interface GameState {
  id?: string;
  players: Player[];
  currentTurn: number;
  winnerIndex: number | null;
  isActive: boolean;
}

export const getCellPosition = (cellNumber: number): { row: number; col: number } => {
  const row = Math.floor((cellNumber - 1) / 10);
  const col = row % 2 === 0 ? (cellNumber - 1) % 10 : 9 - ((cellNumber - 1) % 10);
  return { row: 9 - row, col };
};

export const getCellNumber = (row: number, col: number): number => {
  const actualRow = 9 - row;
  if (actualRow % 2 === 0) {
    return actualRow * 10 + col + 1;
  } else {
    return actualRow * 10 + (9 - col) + 1;
  }
};
