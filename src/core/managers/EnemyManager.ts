import * as PIXI from 'pixi.js';
import { Enemy } from '../entities/Enemy';
import { path } from '../mapData';

export class EnemyManager {
  private readonly enemies: Enemy[] = [];
  private readonly container: PIXI.Container;

  constructor(stage: PIXI.Container) {
    this.container = new PIXI.Container();
    this.container.zIndex = 1;
    stage.addChild(this.container);
  }

  public spawnEnemy(): void {
    const startPosition = path[0];
    const newEnemy = new Enemy({
      position: startPosition,
      health: 100,
      speed: 50, // 50 пикселей в секунду
      radius: 15,
      color: 0xff0000,
    });

    this.enemies.push(newEnemy);
    this.container.addChild(newEnemy.graphics);
  }

  public update(delta: number): void {
    for (const enemy of this.enemies) {
      enemy.update(delta);
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].isDead) {
        this.enemies.splice(i, 1);
      }
    }
  }

  public destroy(): void {
    for (const enemy of this.enemies) {
      enemy.destroy();
    }
    this.enemies.length = 0;
    this.container.destroy();
  }
}
