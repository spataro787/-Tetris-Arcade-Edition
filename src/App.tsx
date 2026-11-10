import React from 'react';
import './App.css';
import { ControlsGuide } from './components/ControlsGuide';
import { GameBoard } from './components/GameBoard';
import { Header } from './components/Header';
import { MobileControls } from './components/MobileControls';
import { ScorePanel } from './components/ScorePanel';
import { useTetris } from './hooks/useTetris';

export const App: React.FC = () => {
  const {
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
    startGame,
    resumeGame,
    togglePause,
    restartGame,
    moveLeft,
    moveRight,
    rotatePiece,
    softDrop,
    hardDrop,
    toggleSound,
  } = useTetris();

  return (
    <div className="tetris-app-container">
      {/* Background ambient lighting effects */}
      <div className="ambient-glow cyan-ambient" />
      <div className="ambient-glow purple-ambient" />

      <main className="game-wrapper">
        <Header />

        <div className="game-layout">
          {/* Main Board Section */}
          <section className="board-section" aria-label="Zona principal del juego">
            <GameBoard
              board={board}
              currentPiece={currentPiece}
              ghostY={ghostY}
              clearingRows={clearingRows}
              status={status}
              score={score}
              highScore={highScore}
              lines={lines}
              level={level}
              isNewHighScore={isNewHighScore}
              lastActionMessage={lastActionMessage}
              onStart={startGame}
              onResume={resumeGame}
              onRestart={restartGame}
            />

            {/* Mobile Touch Controller (only displayed on touch screens via CSS media queries) */}
            <MobileControls
              onMoveLeft={moveLeft}
              onMoveRight={moveRight}
              onRotate={rotatePiece}
              onSoftDrop={softDrop}
              onHardDrop={hardDrop}
              disabled={status !== 'PLAYING'}
            />
          </section>

          {/* Right/Side Section: Stats, Next Piece, Action Buttons & Controls Guide */}
          <section className="info-section">
            <ScorePanel
              score={score}
              highScore={highScore}
              lines={lines}
              level={level}
              nextPiece={nextPiece}
              status={status}
              isSoundEnabled={isSoundEnabled}
              onStart={startGame}
              onTogglePause={togglePause}
              onRestart={restartGame}
              onToggleSound={toggleSound}
            />

            <ControlsGuide />
          </section>
        </div>

        {/* Footer credentials for developer portfolio */}
        <footer className="portfolio-footer">
          <p>
            Desarrollado para <strong>Portfolio de Desarrollador Web</strong> • Motor de juego puro en <strong>React 19 + TypeScript + Canvas + Web Audio API</strong>.
          </p>
          <div className="footer-links">
            <span>Récord almacenado en <code>localStorage</code></span>
            <span>•</span>
            <span>Zero dependencias externas pesadas</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
