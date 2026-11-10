import React from 'react';

export const ControlsGuide: React.FC = () => {
  return (
    <section className="controls-guide-card" aria-label="Instrucciones y Controles de Teclado">
      <div className="panel-badge">GUÍA DE CONTROLES</div>
      <div className="controls-list">
        <div className="control-item">
          <div className="key-badges">
            <kbd className="arcade-kbd">←</kbd>
            <kbd className="arcade-kbd">→</kbd>
          </div>
          <span className="control-desc">Mover lateral</span>
        </div>

        <div className="control-item">
          <div className="key-badges">
            <kbd className="arcade-kbd">↑</kbd>
            <span className="key-separator">/</span>
            <kbd className="arcade-kbd">X</kbd>
          </div>
          <span className="control-desc">Rotar pieza</span>
        </div>

        <div className="control-item">
          <div className="key-badges">
            <kbd className="arcade-kbd">↓</kbd>
          </div>
          <span className="control-desc">Caída suave (+1 pt)</span>
        </div>

        <div className="control-item">
          <div className="key-badges">
            <kbd className="arcade-kbd kbd-space">ESPACIO</kbd>
          </div>
          <span className="control-desc">Caída instantánea (+2 pts)</span>
        </div>

        <div className="control-item">
          <div className="key-badges">
            <kbd className="arcade-kbd">P</kbd>
          </div>
          <span className="control-desc">Pausar / Reanudar</span>
        </div>

        <div className="control-item">
          <div className="key-badges">
            <kbd className="arcade-kbd">R</kbd>
          </div>
          <span className="control-desc">Reiniciar partida</span>
        </div>
      </div>
    </section>
  );
};
