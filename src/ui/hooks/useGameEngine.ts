import { useEffect, useState } from 'react';
import { GameEngine } from '../../core/GameEngine';

/**
 * Кастомный хук для управления жизненным циклом GameEngine.
 * @param containerRef - Ref на DOM-элемент, в который будет монтироваться canvas.
 * @returns { engine: GameEngine | null, isLoading: boolean } - Экземпляр движка и состояние загрузки.
 */
export const useGameEngine = (
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    let gameEngine: GameEngine | null = null;
    let isCancelled = false;

    const init = async () => {
      gameEngine = new GameEngine();
      setEngine(gameEngine);

      await gameEngine.mount(containerElement);

      if (isCancelled) {
        gameEngine.destroy();
        return;
      }

      setIsLoading(false);
    };

    init();

    return () => {
      isCancelled = true;
      if (gameEngine) {
        gameEngine.destroy();
      }
      setEngine(null);
      if (containerElement) {
        containerElement.innerHTML = '';
      }
    };
  }, [containerRef]);

  return { engine, isLoading };
};
