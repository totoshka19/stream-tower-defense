import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { path } from '../../core/mapData';
import { drawBackground, drawPath } from '../../rendering/mapRenderer';
import { Spinner } from './Spinner';

export const GameCanvas = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initPixi = async () => {
      const parentElement = parentRef.current;
      if (!parentElement) return;

      const app = new PIXI.Application();
      await app.init({
        width: 800,
        height: 600,
      });

      if (!isMounted) {
        app.destroy(true, true);
        return;
      }

      appRef.current = app;
      parentElement.innerHTML = '';
      parentElement.appendChild(app.canvas);

      drawBackground(app);
      drawPath(app, path);

      setIsLoading(false);
    };

    initPixi();

    return () => {
      isMounted = false;

      if (appRef.current) {
        appRef.current.destroy(true, true);
        appRef.current = null;
      }
    };
  }, []);

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
