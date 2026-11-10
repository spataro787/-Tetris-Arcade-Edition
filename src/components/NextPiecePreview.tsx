import React, { useEffect, useRef } from 'react';
import { TETROMINOES } from '../constants/tetris';
import type { TetrominoType } from '../types/tetris';

interface NextPiecePreviewProps {
  nextPiece: TetrominoType;
}

export const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({ nextPiece }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const size = 120;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.clearRect(0, 0, size, size);

    const def = TETROMINOES[nextPiece];
    const shape = def.shape;
    const rows = shape.length;
    const cols = shape[0].length;

    const blockSize = 24;
    const pieceWidth = cols * blockSize;
    const pieceHeight = rows * blockSize;
    const startX = (size - pieceWidth) / 2;
    const startY = (size - pieceHeight) / 2;

    shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0) {
          const x = startX + c * blockSize;
          const y = startY + r * blockSize;
          const padding = 2;
          const w = blockSize - padding * 2;
          const h = blockSize - padding * 2;

          // Block glow
          ctx.shadowColor = def.color;
          ctx.shadowBlur = 10;

          // Main block fill
          ctx.fillStyle = def.color;
          ctx.beginPath();
          ctx.roundRect(x + padding, y + padding, w, h, 4);
          ctx.fill();

          // Reset shadow
          ctx.shadowBlur = 0;

          // Top-left highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.roundRect(x + padding, y + padding, w, h * 0.35, 3);
          ctx.fill();

          // Border bevel
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
  }, [nextPiece]);

  return (
    <div className="next-piece-container">
      <div className="panel-badge">SIGUIENTE</div>
      <div className="next-piece-canvas-wrapper">
        <canvas
          ref={canvasRef}
          style={{ width: '120px', height: '120px' }}
          className="next-piece-canvas"
          aria-label={`Pieza siguiente: ${nextPiece}`}
        />
      </div>
      <div className="piece-tag">{nextPiece}-PIECE</div>
    </div>
  );
};
