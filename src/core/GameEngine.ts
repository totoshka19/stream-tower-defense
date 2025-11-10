import * as PIXI from 'pixi.js';
import { path } from './mapData';
import { drawBackground, drawPath } from '../rendering/mapRenderer';
import { EnemyManager } from './managers/EnemyManager';
import { TowerManager } from './managers/TowerManager'; // --- ИМПОРТ
import { GAME_CONFIG, ENEMY_CONFIG } from './config';
import type { Point } from '../types/common'; // --- ИМПОРТ

export class GameEngine {
  public app: PIXI.Application;
  private isInitialized = false;

  private enemyManager!: EnemyManager;
  private towerManager!: TowerManager; // --- НОВОЕ СВОЙСТВО
  private spawnInterval: number | undefined;

  constructor() {
    this.app = new PIXI.Application();
    this.app.stage.sortableChildren = true;
  }

  public async mount(parentElement: HTMLElement): Promise<void> {
    if (this.isInitialized) return;

    await this.app.init({
      width: GAME_CONFIG.CANVAS_WIDTH,
      height: GAME_CONFIG.CANVAS_HEIGHT,
    });

    parentElement.appendChild(this.app.canvas);

    this.enemyManager = new EnemyManager(this.app.stage);
    this.towerManager = new TowerManager(this.app.stage, this.app);

    await Promise.all([
      this.enemyManager.loadAssets(),
      this.towerManager.loadAssets(),
    ]);

    this.app.ticker.add(this.update, this);

    this.drawInitialScene();

    this.isInitialized = true;

    // --- Демонстрационный спавн врагов ---
    this.enemyManager.spawnEnemy();
    this.spawnInterval = setInterval(() => {
      if (this.isInitialized) {
        this.enemyManager.spawnEnemy();
      }
    }, ENEMY_CONFIG.SPAWN_INTERVAL_MS);
    // ------------------------------------

    // --- Демонстрационная установка башни ---
    this.placeTower({ x: 200, y: 200 });
    // ------------------------------------
  }

  /**
   * Размещает башню на карте.
   * Метод будет вызываться из UI.
   * @param position - Координаты для установки башни.
   */
  public placeTower(position: Point): void {
    // Пока что размещаем только базовый тип башни
    this.towerManager.addTower(position, 'BASIC_TOWER');
  }

  private update(ticker: PIXI.Ticker): void {
    const deltaSeconds = ticker.deltaMS / 1000;

    if (this.enemyManager) {
      this.enemyManager.update(deltaSeconds);
    }

    if (this.towerManager) {
      // Передаем башням актуальный список врагов для атаки
      this.towerManager.update(deltaSeconds, this.enemyManager.getEnemies());
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
      if (this.towerManager) {
        this.towerManager.destroy();
      }
      this.app.destroy(true, true);
      this.isInitialized = false;
    }
  }
}
