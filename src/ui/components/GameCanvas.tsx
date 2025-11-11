import { useRef } from 'react';
import { Spinner } from './Spinner';
import { useGameEngine } from '../hooks/useGameEngine';
import { GAME_CONFIG } from '../../core/config';

export const GameCanvas = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { engine, isLoading } = useGameEngine(parentRef);

  const handleCanvasClick = () => {
    if (engine) {
      engine.initializeAudio();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: GAME_CONFIG.CANVAS_WIDTH,
        height: GAME_CONFIG.CANVAS_HEIGHT,
        border: '2px solid #fff',
      }}
      onClick={handleCanvasClick}
    >
      {isLoading && <Spinner />}
      <div ref={parentRef} style={{ display: isLoading ? 'none' : 'block' }} />
    </div>
  );
};
