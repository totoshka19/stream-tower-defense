import { useEffect, useState, useRef } from 'react';
import { GameEngine } from '../../core/GameEngine';

export const useGameEngine = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const engineRef = useRef<GameEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    if (!engineRef.current) {
      engineRef.current = new GameEngine();
    }

    const engine = engineRef.current;
    let isCancelled = false;

    const init = async () => {
      containerElement.innerHTML = '';

      await engine.mount(containerElement);

      if (isCancelled) {
        engine.destroy();
        return;
      }
      setIsLoading(false);
    };

    init();

    return () => {
      isCancelled = true;
    };
  }, [containerRef]);

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  return { engine: engineRef.current, isLoading };
};
