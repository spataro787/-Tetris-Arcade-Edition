export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface TetrominoDefinition {
  type: TetrominoType;
  shape: number[][];
  color: string;
  glow: string;
  shadow: string;
}

export interface ActivePiece {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
  color: string;
  glow: string;
}

export type CellValue = string | null;

export type BoardMatrix = CellValue[][];

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface GameStats {
  score: number;
  highScore: number;
  lines: number;
  level: number;
}

export interface LineClearAnimation {
  rows: number[];
  progress: number; // 0 to 1
  isTetris: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}
