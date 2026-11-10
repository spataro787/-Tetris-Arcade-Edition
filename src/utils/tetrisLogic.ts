import { BOARD_HEIGHT, BOARD_WIDTH, TETROMINOES, TETROMINO_KEYS, WALL_KICKS } from '../constants/tetris';
import type { ActivePiece, BoardMatrix, TetrominoType } from '../types/tetris';

/**
 * Creates an empty 20x10 board filled with null values
 */
export const createEmptyBoard = (): BoardMatrix => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
};

/**
 * Rotates a square matrix 90 degrees clockwise
 */
export const rotateMatrix = (matrix: number[][]): number[][] => {
  const n = matrix.length;
  const result: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      result[c][n - 1 - r] = matrix[r][c];
    }
  }

  return result;
};

/**
 * Validates whether a piece in a given position/shape collides with walls or existing blocks
 */
export const checkCollision = (
  board: BoardMatrix,
  piece: ActivePiece,
  offsetX: number = 0,
  offsetY: number = 0,
  shapeToCheck?: number[][]
): boolean => {
  const shape = shapeToCheck || piece.shape;
  const targetX = piece.x + offsetX;
  const targetY = piece.y + offsetY;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] !== 0) {
        const x = targetX + c;
        const y = targetY + r;

        // Check horizontal bounds
        if (x < 0 || x >= BOARD_WIDTH) {
          return true;
        }

        // Check bottom floor
        if (y >= BOARD_HEIGHT) {
          return true;
        }

        // Check collision with already placed blocks
        if (y >= 0 && board[y] && board[y][x] !== null) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Calculates the ghost piece Y coordinate (where the current piece will land)
 */
export const calculateGhostY = (board: BoardMatrix, piece: ActivePiece): number => {
  let dropOffset = 0;
  while (!checkCollision(board, piece, 0, dropOffset + 1)) {
    dropOffset++;
  }
  return piece.y + dropOffset;
};

/**
 * Attempts to rotate a piece with standard wall-kick offsets to prevent getting stuck
 */
export const tryRotateWithWallKicks = (
  board: BoardMatrix,
  piece: ActivePiece
): { rotatedShape: number[][]; kickX: number; kickY: number } | null => {
  // O piece doesn't need rotation
  if (piece.type === 'O') {
    return { rotatedShape: piece.shape, kickX: 0, kickY: 0 };
  }

  const rotatedShape = rotateMatrix(piece.shape);

  for (const kick of WALL_KICKS) {
    if (!checkCollision(board, piece, kick.x, kick.y, rotatedShape)) {
      return { rotatedShape, kickX: kick.x, kickY: kick.y };
    }
  }

  return null;
};

/**
 * 7-Bag Randomizer generator to ensure fair, official distribution of pieces
 */
export class BagRandomizer {
  private bag: TetrominoType[] = [];

  private refillBag() {
    this.bag = [...TETROMINO_KEYS];
    // Fisher-Yates shuffle
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }

  public getNext(): TetrominoType {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return this.bag.pop()!;
  }
}

/**
 * Spawns a new active piece centered at the top of the board
 */
export const createActivePiece = (type: TetrominoType): ActivePiece => {
  const def = TETROMINOES[type];
  // Calculate initial centered X
  const shapeWidth = def.shape[0].length;
  const startX = Math.floor((BOARD_WIDTH - shapeWidth) / 2);
  const startY = type === 'I' ? -1 : 0;

  return {
    type,
    shape: def.shape.map((row) => [...row]),
    x: startX,
    y: startY,
    color: def.color,
    glow: def.glow,
  };
};

/**
 * Merges active piece into the board and returns the new board matrix
 */
export const mergePieceToBoard = (board: BoardMatrix, piece: ActivePiece): BoardMatrix => {
  const newBoard = board.map((row) => [...row]);

  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] !== 0) {
        const boardY = piece.y + r;
        const boardX = piece.x + c;

        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }

  return newBoard;
};

/**
 * Identifies indexes of all completely filled rows
 */
export const getFullRowIndices = (board: BoardMatrix): number[] => {
  const fullRows: number[] = [];
  for (let r = 0; r < BOARD_HEIGHT; r++) {
    if (board[r].every((cell) => cell !== null)) {
      fullRows.push(r);
    }
  }
  return fullRows;
};

/**
 * Clears rows from board and inserts empty rows at the top
 */
export const clearRowsFromBoard = (board: BoardMatrix, fullRows: number[]): BoardMatrix => {
  if (fullRows.length === 0) return board;

  const rowsToKeep = board.filter((_, idx) => !fullRows.includes(idx));
  const newEmptyRows = Array.from({ length: fullRows.length }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );

  return [...newEmptyRows, ...rowsToKeep];
};
