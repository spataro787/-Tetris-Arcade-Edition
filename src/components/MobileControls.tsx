import React from 'react';

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  disabled?: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  disabled = false,
}) => {
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Ignore
      }
    }
  };

  const handleTouch = (action: () => void) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    triggerHaptic();
    action();
  };

  return (
    <div className="mobile-touch-controller" aria-label="Controles táctiles para móvil">
      <div className="dpad-cluster">
        <button
          type="button"
          className="touch-btn dpad-left"
          onTouchStart={handleTouch(onMoveLeft)}
          onClick={handleTouch(onMoveLeft)}
          disabled={disabled}
          aria-label="Mover a la izquierda"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          className="touch-btn dpad-down"
          onTouchStart={handleTouch(onSoftDrop)}
          onClick={handleTouch(onSoftDrop)}
          disabled={disabled}
          aria-label="Caída suave"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 9 12 15 18 9" />
          </svg>
        </button>

        <button
          type="button"
          className="touch-btn dpad-right"
          onTouchStart={handleTouch(onMoveRight)}
          onClick={handleTouch(onMoveRight)}
          disabled={disabled}
          aria-label="Mover a la derecha"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      <div className="action-buttons-cluster">
        <button
          type="button"
          className="touch-btn action-rotate"
          onTouchStart={handleTouch(onRotate)}
          onClick={handleTouch(onRotate)}
          disabled={disabled}
          aria-label="Rotar pieza"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.8 1.04 6.44 2.73" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
          <span className="touch-label">ROTAR</span>
        </button>

        <button
          type="button"
          className="touch-btn action-drop"
          onTouchStart={handleTouch(onHardDrop)}
          onClick={handleTouch(onHardDrop)}
          disabled={disabled}
          aria-label="Caída instantánea"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 2h2v12h4l-5 7-5-7h4z" />
          </svg>
          <span className="touch-label">CAÍDA</span>
        </button>
      </div>
    </div>
  );
};
