import * as PIXI from 'pixi.js';
import { path } from './mapData';
import { drawBackground, drawPath } from '../rendering/mapRenderer';
import { EnemyManager } from './managers/EnemyManager';

export class GameEngine {
  public app: PIXI.Application;
  private isInitialized = false;

  private enemyManager!: EnemyManager;
  private spawnInterval: number | undefined;

  constructor() {
    this.app = new PIXI.Application();
    this.app.stage.sortableChildren = true;
  }

  public async mount(parentElement: HTMLElement): Promise<void> {
    if (this.isInitialized) return;

    await this.app.init({
      width: 800,
      height: 600,
    });

    parentElement.appendChild(this.app.canvas);

    this.enemyManager = new EnemyManager(this.app.stage);

    await this.enemyManager.loadAssets();

    this.app.ticker.add(this.update, this);

    this.drawInitialScene();

    this.isInitialized = true;

    // --- Демонстрационный спавн врагов ---
    this.enemyManager.spawnEnemy();
    this.spawnInterval = setInterval(() => {
      if (this.isInitialized) {
        this.enemyManager.spawnEnemy();
      }
    }, 2000);
    // ------------------------------------
  }

  private update(ticker: PIXI.Ticker): void {
    const deltaSeconds = ticker.deltaMS / 1000;

    if (this.enemyManager) {
      this.enemyManager.update(deltaSeconds);
    }
  }

  private drawInitialScene(): void {
    drawBackground(this.app);
    drawPath(this.app, path);
  }

  public destroy(): void {
    if (this.isInitialized) {
      clearInterval(this.spawnInterval);

      if (this.enemyManager) {
        this.enemyManager.destroy();
      }
      this.app.destroy(true, true);
      this.isInitialized = false;
    }
  }
}
