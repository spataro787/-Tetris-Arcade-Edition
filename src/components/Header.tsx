import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="game-header">
      <div className="header-badge-row">
        <span className="tech-badge">DEV PORTFOLIO • REACT + TS</span>
        <span className="version-badge">v2.0 • 60 FPS</span>
      </div>
      <div className="title-group">
        <h1 className="retro-title">
          <span className="title-char cyan">T</span>
          <span className="title-char purple">E</span>
          <span className="title-char yellow">T</span>
          <span className="title-char green">R</span>
          <span className="title-char blue">I</span>
          <span className="title-char red">S</span>
        </h1>
        <div className="retro-subtitle">ARCADE EDITION</div>
      </div>
    </header>
  );
};
