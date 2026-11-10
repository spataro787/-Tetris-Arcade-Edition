import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HARD_DROP_POINTS,
  LINE_POINTS,
  LINES_PER_LEVEL,
  SOFT_DROP_POINTS,
  getSpeedForLevel,
} from '../constants/tetris';
import type { ActivePiece, BoardMatrix, GameStatus, TetrominoType } from '../types/tetris';
import { soundManager } from '../utils/audio';
import {
  BagRandomizer,
  calculateGhostY,
  checkCollision,
  clearRowsFromBoard,
  createActivePiece,
  createEmptyBoard,
  getFullRowIndices,
  mergePieceToBoard,
  tryRotateWithWallKicks,
} from '../utils/tetrisLogic';

const HIGH_SCORE_STORAGE_KEY = 'tetris_arcade_highscore';

export function useTetris() {
  const [board, setBoard] = useState<BoardMatrix>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<ActivePiece | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrominoType>('T');
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [lines, setLines] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => soundManager.getSoundEnabled());
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // References to keep fresh state in loops and callbacks
  const bagRef = useRef<BagRandomizer>(new BagRandomizer());
  const boardRef = useRef<BoardMatrix>(board);
  const currentPieceRef = useRef<ActivePiece | null>(currentPiece);
  const nextPieceRef = useRef<TetrominoType>(nextPiece);
  const statusRef = useRef<GameStatus>(status);
  const clearingRowsRef = useRef<number[]>(clearingRows);
  const scoreRef = useRef<number>(score);
  const highScoreRef = useRef<number>(highScore);
  const linesRef = useRef<number>(lines);
  const levelRef = useRef<number>(level);

  // Sync refs
  boardRef.current = board;
  currentPieceRef.current = currentPiece;
  nextPieceRef.current = nextPiece;
  statusRef.current = status;
  clearingRowsRef.current = clearingRows;
  scoreRef.current = score;
  highScoreRef.current = highScore;
  linesRef.current = lines;
  levelRef.current = level;

  // Sound toggle
  const toggleSound = useCallback(() => {
    const nextState = !soundManager.getSoundEnabled();
    soundManager.setSoundEnabled(nextState);
    setIsSoundEnabled(nextState);
  }, []);

  // Update high score helper
  const updateScoreAndHighScore = useCallback((pointsToAdd: number) => {
    setScore((prevScore) => {
      const newScore = prevScore + pointsToAdd;
      if (newScore > highScoreRef.current) {
        highScoreRef.current = newScore;
        setHighScore(newScore);
        setIsNewHighScore(true);
        localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(newScore));
      }
      return newScore;
    });
  }, []);

  // Trigger game over
  const triggerGameOver = useCallback(() => {
    setStatus('GAME_OVER');
    setCurrentPiece(null);
    soundManager.playGameOver();
  }, []);

  // Lock current piece into board and evaluate line clears
  const lockPiece = useCallback((pieceToLock: ActivePiece) => {
    const newBoard = mergePieceToBoard(boardRef.current, pieceToLock);
    const fullRows = getFullRowIndices(newBoard);

    if (fullRows.length > 0) {
      // Highlight clearing rows with visual animation
      setClearingRows(fullRows);
      setBoard(newBoard);
      setCurrentPiece(null);

      const isTetris = fullRows.length === 4;
      if (isTetris) {
        soundManager.playTetris();
        setLastActionMessage('TETRIS! +800');
      } else {
        soundManager.playLineClear();
        setLastActionMessage(`${fullRows.length} ${fullRows.length === 1 ? 'LÍNEA' : 'LÍNEAS'}`);
      }

      // Add score points for cleared lines
      const lineScore = (LINE_POINTS[fullRows.length] || 100) * levelRef.current;
      updateScoreAndHighScore(lineScore);

      // Increase lines count
      const updatedLines = linesRef.current + fullRows.length;
      setLines(updatedLines);

      // Check level advancement
      const calculatedLevel = Math.floor(updatedLines / LINES_PER_LEVEL) + 1;
      if (calculatedLevel > levelRef.current) {
        setLevel(calculatedLevel);
        soundManager.playLevelUp();
        setLastActionMessage(`¡NIVEL ${calculatedLevel}!`);
      }

      // Allow flash animation to render before clearing board
      setTimeout(() => {
        const cleanedBoard = clearRowsFromBoard(newBoard, fullRows);
        setBoard(cleanedBoard);
        setClearingRows([]);
        setTimeout(() => setLastActionMessage(null), 1200);

        // Spawn next piece
        spawnNextPiece(cleanedBoard);
      }, 220);
    } else {
      // No rows cleared: update board immediately and spawn next piece
      setBoard(newBoard);
      spawnNextPiece(newBoard);
    }
  }, [updateScoreAndHighScore]);

  // Spawn next piece or trigger game over if blocked
  const spawnNextPiece = useCallback((currentBoard: BoardMatrix) => {
    const pieceType = nextPieceRef.current;
    const freshNext = bagRef.current.getNext();
    setNextPiece(freshNext);

    const newPiece = createActivePiece(pieceType);

    // Collision check right at spawn
    if (checkCollision(currentBoard, newPiece, 0, 0)) {
      triggerGameOver();
      return;
    }

    setCurrentPiece(newPiece);
  }, [triggerGameOver]);

  // Movement: Left
  const moveLeft = useCallback(() => {
    if (statusRef.current !== 'PLAYING' || !currentPieceRef.current || clearingRowsRef.current.length > 0) return;
    const piece = currentPieceRef.current;

    if (!checkCollision(boardRef.current, piece, -1, 0)) {
      setCurrentPiece({ ...piece, x: piece.x - 1 });
      soundManager.playMove();
    }
  }, []);

  // Movement: Right
  const moveRight = useCallback(() => {
    if (statusRef.current !== 'PLAYING' || !currentPieceRef.current || clearingRowsRef.current.length > 0) return;
    const piece = currentPieceRef.current;

    if (!checkCollision(boardRef.current, piece, 1, 0)) {
      setCurrentPiece({ ...piece, x: piece.x + 1 });
      soundManager.playMove();
    }
  }, []);

  // Rotation with wall-kicks
  const rotatePiece = useCallback(() => {
    if (statusRef.current !== 'PLAYING' || !currentPieceRef.current || clearingRowsRef.current.length > 0) return;
    const piece = currentPieceRef.current;

    const rotationResult = tryRotateWithWallKicks(boardRef.current, piece);
    if (rotationResult) {
      setCurrentPiece({
        ...piece,
        shape: rotationResult.rotatedShape,
        x: piece.x + rotationResult.kickX,
        y: piece.y + rotationResult.kickY,
      });
      soundManager.playRotate();
    }
  }, []);

  // Soft drop (down arrow)
  const softDrop = useCallback(() => {
    if (statusRef.current !== 'PLAYING' || !currentPieceRef.current || clearingRowsRef.current.length > 0) return;
    const piece = currentPieceRef.current;

    if (!checkCollision(boardRef.current, piece, 0, 1)) {
      setCurrentPiece({ ...piece, y: piece.y + 1 });
      updateScoreAndHighScore(SOFT_DROP_POINTS);
      soundManager.playMove();
    } else {
      // Reached bottom
      soundManager.playDrop();
      lockPiece(piece);
    }
  }, [lockPiece, updateScoreAndHighScore]);

  // Hard drop (space bar)
  const hardDrop = useCallback(() => {
    if (statusRef.current !== 'PLAYING' || !currentPieceRef.current || clearingRowsRef.current.length > 0) return;
    const piece = currentPieceRef.current;

    const ghostY = calculateGhostY(boardRef.current, piece);
    const dropDistance = ghostY - piece.y;

    if (dropDistance > 0) {
      updateScoreAndHighScore(dropDistance * HARD_DROP_POINTS);
    }

    soundManager.playDrop();
    const droppedPiece = { ...piece, y: ghostY };
    setCurrentPiece(droppedPiece);
    lockPiece(droppedPiece);
  }, [lockPiece, updateScoreAndHighScore]);

  // Start new game
  const startGame = useCallback(() => {
    bagRef.current = new BagRandomizer();
    const emptyBoard = createEmptyBoard();
    const firstPieceType = bagRef.current.getNext();
    const secondPieceType = bagRef.current.getNext();

    setBoard(emptyBoard);
    setScore(0);
    setLines(0);
    setLevel(1);
    setClearingRows([]);
    setIsNewHighScore(false);
    setLastActionMessage(null);

    const firstPiece = createActivePiece(firstPieceType);
    setCurrentPiece(firstPiece);
    setNextPiece(secondPieceType);
    setStatus('PLAYING');
    soundManager.playMove();
  }, []);

  // Pause / Resume
  const pauseGame = useCallback(() => {
    if (statusRef.current === 'PLAYING') {
      setStatus('PAUSED');
    }
  }, []);

  const resumeGame = useCallback(() => {
    if (statusRef.current === 'PAUSED') {
      setStatus('PLAYING');
    }
  }, []);

  const togglePause = useCallback(() => {
    if (statusRef.current === 'PLAYING') {
      setStatus('PAUSED');
    } else if (statusRef.current === 'PAUSED') {
      setStatus('PLAYING');
    }
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Drop step tick
  const stepDrop = useCallback(() => {
    if (statusRef.current !== 'PLAYING' || !currentPieceRef.current || clearingRowsRef.current.length > 0) {
      return;
    }

    const piece = currentPieceRef.current;
    if (!checkCollision(boardRef.current, piece, 0, 1)) {
      setCurrentPiece((prev) => (prev ? { ...prev, y: prev.y + 1 } : null));
    } else {
      soundManager.playDrop();
      lockPiece(piece);
    }
  }, [lockPiece]);

  // Automatic falling timer
  useEffect(() => {
    if (status !== 'PLAYING' || clearingRows.length > 0) return;

    const interval = getSpeedForLevel(level);
    const timerId = setInterval(stepDrop, interval);

    return () => clearInterval(timerId);
  }, [status, level, clearingRows.length, stepDrop]);

  // Keyboard navigation handler with preventDefault to prevent page scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignored if interacting with input fields
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Check handled keys
      const handledKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Space',
        ' ',
        'KeyX',
        'x',
        'X',
        'KeyP',
        'p',
        'P',
        'KeyR',
        'r',
        'R',
      ];

      if (handledKeys.includes(e.code) || handledKeys.includes(e.key)) {
        // Prevent scrolling on arrows/space
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', ' '].includes(e.key) || e.code === 'Space') {
          e.preventDefault();
        }
      }

      // P for pause/resume
      if (e.key === 'p' || e.key === 'P' || e.code === 'KeyP') {
        togglePause();
        return;
      }

      // R for restart
      if (e.key === 'r' || e.key === 'R' || e.code === 'KeyR') {
        restartGame();
        return;
      }

      // Game action controls only when PLAYING
      if (statusRef.current !== 'PLAYING') return;

      switch (e.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowUp':
        case 'x':
        case 'X':
          rotatePiece();
          break;
        case 'ArrowDown':
          softDrop();
          break;
        case ' ':
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, rotatePiece, softDrop, hardDrop, togglePause, restartGame]);

  // Calculate Ghost Piece for display
  const ghostY = currentPiece ? calculateGhostY(board, currentPiece) : null;

  return {
    board,
    currentPiece,
    ghostY,
    nextPiece,
    status,
    score,
    highScore,
    lines,
    level,
    clearingRows,
    isSoundEnabled,
    isNewHighScore,
    lastActionMessage,
    // Actions
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    restartGame,
    moveLeft,
    moveRight,
    rotatePiece,
    softDrop,
    hardDrop,
    toggleSound,
  };
}
