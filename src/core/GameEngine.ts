import * as PIXI from 'pixi.js';
import { path } from './mapData';
import { drawBackground, drawPath } from '../rendering/mapRenderer';

export class GameEngine {
  public app: PIXI.Application;
  private isInitialized = false;

  constructor() {
    this.app = new PIXI.Application();
  }

  /**
   * Монтирует Pixi-приложение в указанный DOM-элемент и запускает игру.
   * @param parentElement - HTML-элемент, куда будет добавлен canvas.
   */
  public async mount(parentElement: HTMLElement): Promise<void> {
    if (this.isInitialized) return;

    await this.app.init({
      width: 800,
      height: 600,
    });

    parentElement.appendChild(this.app.canvas);
    this.app.ticker.add(this.update, this);

    this.drawInitialScene();

    this.isInitialized = true;
    console.log('Game Engine Mounted and Initialized');
  }

  private update(ticker: PIXI.Ticker): void {}

  private drawInitialScene(): void {
    drawBackground(this.app);
    drawPath(this.app, path);
  }

  /**
   * Уничтожает Pixi-приложение и освобождает ресурсы.
   */
  public destroy(): void {
    if (this.isInitialized) {
      this.app.destroy(true, true);
      this.isInitialized = false;
      console.log('Game Engine Destroyed');
    } else {
      console.log(
        'Game Engine destroy called on non-initialized instance. Skipping.'
      );
    }
  }
}
