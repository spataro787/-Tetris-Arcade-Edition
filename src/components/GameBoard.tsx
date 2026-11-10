import React, { useEffect, useRef } from 'react';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants/tetris';
import type { ActivePiece, BoardMatrix, GameStatus } from '../types/tetris';

interface GameBoardProps {
  board: BoardMatrix;
  currentPiece: ActivePiece | null;
  ghostY: number | null;
  clearingRows: number[];
  status: GameStatus;
  score: number;
  highScore: number;
  lines: number;
  level: number;
  isNewHighScore: boolean;
  lastActionMessage: string | null;
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPiece,
  ghostY,
  clearingRows,
  status,
  score,
  highScore,
  lines,
  level,
  isNewHighScore,
  lastActionMessage,
  onStart,
  onResume,
  onRestart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const BLOCK_SIZE = 30; // 30px * 10 = 300px width; 30px * 20 = 600px height
  const CANVAS_WIDTH = BOARD_WIDTH * BLOCK_SIZE;
  const CANVAS_HEIGHT = BOARD_HEIGHT * BLOCK_SIZE;

  // Add line explosion particles when rows are clearing
  useEffect(() => {
    if (clearingRows.length > 0) {
      const newParticles: Particle[] = [];
      clearingRows.forEach((row) => {
        for (let i = 0; i < 40; i++) {
          newParticles.push({
            x: Math.random() * CANVAS_WIDTH,
            y: row * BLOCK_SIZE + Math.random() * BLOCK_SIZE,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 6 - 1,
            color: Math.random() > 0.4 ? '#00f0ff' : '#ffffff',
            size: Math.random() * 4 + 2,
            alpha: 1,
            decay: Math.random() * 0.03 + 0.02,
          });
        }
      });
      particlesRef.current = [...particlesRef.current, ...newParticles];
    }
  }, [clearingRows, CANVAS_WIDTH]);

  // Main rendering loop for canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      // 1. Background
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 2. Subtle Cyber Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= BOARD_WIDTH; c++) {
        ctx.beginPath();
        ctx.moveTo(c * BLOCK_SIZE, 0);
        ctx.lineTo(c * BLOCK_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let r = 0; r <= BOARD_HEIGHT; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * BLOCK_SIZE);
        ctx.lineTo(CANVAS_WIDTH, r * BLOCK_SIZE);
        ctx.stroke();
      }

      // 3. Draw Locked Board Blocks
      for (let r = 0; r < BOARD_HEIGHT; r++) {
        const isRowClearing = clearingRows.includes(r);
        for (let c = 0; c < BOARD_WIDTH; c++) {
          const color = board[r][c];
          if (color) {
            drawBlock(
              ctx,
              c * BLOCK_SIZE,
              r * BLOCK_SIZE,
              BLOCK_SIZE,
              color,
              isRowClearing ? 0.4 : 1,
              isRowClearing
            );
          }
        }
      }

      // 4. Draw Ghost Piece (Landing target outline)
      if (currentPiece && ghostY !== null && status === 'PLAYING') {
        const shape = currentPiece.shape;
        const color = currentPiece.color;

        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] !== 0) {
              const x = (currentPiece.x + c) * BLOCK_SIZE;
              const y = (ghostY + r) * BLOCK_SIZE;
              if (y >= 0) {
                drawGhostBlock(ctx, x, y, BLOCK_SIZE, color);
              }
            }
          }
        }
      }

      // 5. Draw Active Piece
      if (currentPiece && status === 'PLAYING') {
        const shape = currentPiece.shape;
        const color = currentPiece.color;

        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] !== 0) {
              const x = (currentPiece.x + c) * BLOCK_SIZE;
              const y = (currentPiece.y + r) * BLOCK_SIZE;
              if (y >= 0) {
                drawBlock(ctx, x, y, BLOCK_SIZE, color, 1, false);
              }
            }
          }
        }
      }

      // 6. Draw Line Clear Beam Effect
      if (clearingRows.length > 0) {
        clearingRows.forEach((r) => {
          const y = r * BLOCK_SIZE;
          const gradient = ctx.createLinearGradient(0, y, CANVAS_WIDTH, y + BLOCK_SIZE);
          gradient.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(1, 'rgba(0, 240, 255, 0.9)');

          ctx.fillStyle = gradient;
          ctx.fillRect(0, y, CANVAS_WIDTH, BLOCK_SIZE);
        });
      }

      // 7. Update and Draw Particles
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // 8. Draw Border Accent
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, CANVAS_WIDTH - 2, CANVAS_HEIGHT - 2);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [board, currentPiece, ghostY, clearingRows, status, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Helper to draw a glowing, beveled retro-modern block
  const drawBlock = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    alpha: number = 1,
    isFlash: boolean = false
  ) => {
    const pad = 1.5;
    const w = size - pad * 2;
    const h = size - pad * 2;

    ctx.save();
    ctx.globalAlpha = alpha;

    if (isFlash) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + pad, y + pad, w, h);
      ctx.restore();
      return;
    }

    // Outer subtle glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;

    // Main neon body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + pad, y + pad, w, h, 3);
    ctx.fill();

    // Disable shadow for inner bevel details
    ctx.shadowBlur = 0;

    // Glossy top-left highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.beginPath();
    ctx.roundRect(x + pad + 1, y + pad + 1, w - 2, h * 0.38, 2);
    ctx.fill();

    // Inner bottom shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect(x + pad + 1, y + pad + h * 0.7, w - 2, h * 0.3, 2);
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  };

  // Helper to draw a ghost block (landing indicator)
  const drawGhostBlock = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string
  ) => {
    const pad = 2;
    const w = size - pad * 2;
    const h = size - pad * 2;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.setLineDash([4, 2]);

    ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(x + pad, y + pad, w, h, 3);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  return (
    <div className="game-board-container" id="tetris-board-wrapper">
      <div className="canvas-frame">
        <canvas
          ref={canvasRef}
          style={{ width: '300px', height: '600px' }}
          className="game-canvas"
          id="tetris-canvas"
          aria-label="Tablero de juego Tetris 10x20"
        />

        {/* Action / Tetris Announcement Toast */}
        {lastActionMessage && (
          <div className="action-announcement" key={lastActionMessage}>
            <span className="announcement-text">{lastActionMessage}</span>
          </div>
        )}

        {/* Overlay: IDLE (Welcome / Start Screen) */}
        {status === 'IDLE' && (
          <div className="board-overlay idle-overlay">
            <div className="overlay-badge">ARCADE EDITION</div>
            <h2 className="overlay-title">TETRIS</h2>
            <p className="overlay-subtitle">Demuestra tu agilidad y reflejos apilando los bloques de neón.</p>
            <div className="overlay-stats-preview">
              <div className="mini-stat">
                <span className="label">RÉCORD</span>
                <span className="value neon-cyan">{highScore}</span>
              </div>
            </div>
            <button
              id="btn-start-game"
              onClick={onStart}
              className="arcade-btn primary-btn pulse-glow"
              autoFocus
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              INICIAR PARTIDA
            </button>
            <div className="overlay-instructions-hint">
              Presiona Espacio o haz clic para comenzar
            </div>
          </div>
        )}

        {/* Overlay: PAUSED */}
        {status === 'PAUSED' && (
          <div className="board-overlay paused-overlay">
            <div className="pause-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="2" />
                <rect x="14" y="4" width="4" height="16" rx="2" />
              </svg>
            </div>
            <h2 className="overlay-title">PAUSA</h2>
            <p className="overlay-subtitle">Partida detenida momentáneamente.</p>
            <button id="btn-resume-game" onClick={onResume} className="arcade-btn primary-btn">
              REANUDAR (P)
            </button>
            <button id="btn-restart-from-pause" onClick={onRestart} className="arcade-btn secondary-btn">
              REINICIAR (R)
            </button>
          </div>
        )}

        {/* Overlay: GAME OVER */}
        {status === 'GAME_OVER' && (
          <div className="board-overlay gameover-overlay">
            <div className="gameover-glitch">GAME OVER</div>
            {isNewHighScore && (
              <div className="new-record-pill">
                ⭐ ¡NUEVO RÉCORD PERSONAL! ⭐
              </div>
            )}
            <div className="gameover-results-card">
              <div className="result-row">
                <span>PUNTUACIÓN</span>
                <span className="result-val neon-yellow">{score}</span>
              </div>
              <div className="result-row">
                <span>RÉCORD</span>
                <span className="result-val neon-cyan">{highScore}</span>
              </div>
              <div className="result-row">
                <span>LÍNEAS</span>
                <span className="result-val">{lines}</span>
              </div>
              <div className="result-row">
                <span>NIVEL</span>
                <span className="result-val">{level}</span>
              </div>
            </div>
            <button
              id="btn-play-again"
              onClick={onRestart}
              className="arcade-btn primary-btn pulse-glow"
              autoFocus
            >
              VOLVER A JUGAR (R)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
