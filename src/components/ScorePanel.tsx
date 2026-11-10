import React from 'react';
import type { GameStatus, TetrominoType } from '../types/tetris';
import { NextPiecePreview } from './NextPiecePreview';

interface ScorePanelProps {
  score: number;
  highScore: number;
  lines: number;
  level: number;
  nextPiece: TetrominoType;
  status: GameStatus;
  isSoundEnabled: boolean;
  onStart: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  score,
  highScore,
  lines,
  level,
  nextPiece,
  status,
  isSoundEnabled,
  onStart,
  onTogglePause,
  onRestart,
  onToggleSound,
}) => {
  const isPaused = status === 'PAUSED';

  return (
    <aside className="side-panel" aria-label="Panel de estadísticas y controles">
      {/* Next Piece Card */}
      <section className="panel-card next-card">
        <NextPiecePreview nextPiece={nextPiece} />
      </section>

      {/* Stats Counters */}
      <section className="panel-card stats-card">
        <div className="stat-group">
          <span className="stat-title">PUNTUACIÓN</span>
          <div className="stat-display score-glow" id="current-score-display">
            {score.toLocaleString()}
          </div>
        </div>

        <div className="stat-group">
          <span className="stat-title">
            <span className="crown-icon">👑</span> RÉCORD
          </span>
          <div className="stat-display record-glow" id="high-score-display">
            {highScore.toLocaleString()}
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-group half">
            <span className="stat-title">NIVEL</span>
            <div className="stat-display-small" id="level-display">
              {level}
            </div>
          </div>
          <div className="stat-group half">
            <span className="stat-title">LÍNEAS</span>
            <div className="stat-display-small" id="lines-display">
              {lines}
            </div>
          </div>
        </div>
      </section>

      {/* Control Actions */}
      <section className="panel-card controls-card">
        <div className="button-stack">
          {status === 'IDLE' ? (
            <button
              id="side-btn-start"
              className="arcade-btn primary-btn btn-lg"
              onClick={onStart}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              INICIAR JUEGO
            </button>
          ) : (
            <button
              id="side-btn-pause"
              className={`arcade-btn ${isPaused ? 'accent-btn' : 'secondary-btn'}`}
              onClick={onTogglePause}
              disabled={status === 'GAME_OVER'}
            >
              {isPaused ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  REANUDAR (P)
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="2" />
                    <rect x="14" y="4" width="4" height="16" rx="2" />
                  </svg>
                  PAUSAR (P)
                </>
              )}
            </button>
          )}

          <button
            id="side-btn-restart"
            className="arcade-btn danger-btn"
            onClick={onRestart}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            REINICIAR (R)
          </button>

          <button
            id="side-btn-sound"
            className={`arcade-btn sound-toggle-btn ${isSoundEnabled ? 'sound-active' : 'sound-muted'}`}
            onClick={onToggleSound}
            title={isSoundEnabled ? 'Desactivar Sonido' : 'Activar Sonido'}
          >
            {isSoundEnabled ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                SONIDO: ACTIVADO
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                SONIDO: SILENCIADO
              </>
            )}
          </button>
        </div>
      </section>
    </aside>
  );
};
