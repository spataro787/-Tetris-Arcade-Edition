import type { TetrominoDefinition, TetrominoType } from '../types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOES: Record<TetrominoType, TetrominoDefinition> = {
  I: {
    type: 'I',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.8)',
    shadow: 'rgba(0, 240, 255, 0.25)',
  },
  O: {
    type: 'O',
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#ffd700',
    glow: 'rgba(255, 215, 0, 0.8)',
    shadow: 'rgba(255, 215, 0, 0.25)',
  },
  T: {
    type: 'T',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#b026ff',
    glow: 'rgba(176, 38, 255, 0.8)',
    shadow: 'rgba(176, 38, 255, 0.25)',
  },
  S: {
    type: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.8)',
    shadow: 'rgba(34, 197, 94, 0.25)',
  },
  Z: {
    type: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#ff073a',
    glow: 'rgba(255, 7, 58, 0.8)',
    shadow: 'rgba(255, 7, 58, 0.25)',
  },
  J: {
    type: 'J',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0070f3',
    glow: 'rgba(0, 112, 243, 0.8)',
    shadow: 'rgba(0, 112, 243, 0.25)',
  },
  L: {
    type: 'L',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#ff8500',
    glow: 'rgba(255, 133, 0, 0.8)',
    shadow: 'rgba(255, 133, 0, 0.25)',
  },
};

export const TETROMINO_KEYS: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export const LINE_POINTS: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800, // Tetris!
};

export const SOFT_DROP_POINTS = 1;
export const HARD_DROP_POINTS = 2;
export const LINES_PER_LEVEL = 10;

/**
 * Calculates drop interval in ms according to the current level.
 */
export const getSpeedForLevel = (level: number): number => {
  const base = 850;
  const factor = Math.min(level - 1, 15);
  return Math.max(90, Math.floor(base * Math.pow(0.85, factor)));
};

/**
 * Standard wall kick offsets to test during rotation
 */
export const WALL_KICKS = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -2, y: 0 },
  { x: 2, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
];
