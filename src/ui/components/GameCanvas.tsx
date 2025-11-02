import { useRef } from 'react';
import { Spinner } from './Spinner';
import { useGameEngine } from '../hooks/useGameEngine';

export const GameCanvas = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useGameEngine(parentRef);

  return (
    <div
      style={{
        position: 'relative',
        width: '800px',
        height: '600px',
        border: '2px solid #fff',
      }}
    >
      {isLoading && <Spinner />}
      <div ref={parentRef} style={{ display: isLoading ? 'none' : 'block' }} />
    </div>
  );
};
