import * as PIXI from 'pixi.js';
import { Enemy } from '../entities/Enemy';
import { path } from '../mapData';
import { ENEMY_CONFIG } from '../config';
import { generateTexturesFromSpritesheet } from '../../utils/spriteUtils';
import type { SoundManager } from './SoundManager';

export class EnemyManager {
  private readonly enemies: Enemy[] = [];
  private readonly container: PIXI.Container;
  private dinoWalkTextures: PIXI.Texture[] = [];
  private soundManager: SoundManager | null = null;

  constructor(stage: PIXI.Container) {
    this.container = new PIXI.Container();
    this.container.zIndex = 1;
    stage.addChild(this.container);
  }

  /**
   * Устанавливает SoundManager для воспроизведения звуков.
   * @param soundManager - Экземпляр SoundManager.
   */
  public setSoundManager(soundManager: SoundManager): void {
    this.soundManager = soundManager;
  }

  public async loadAssets(): Promise<void> {
    const baseTexture = await PIXI.Assets.load<PIXI.Texture>(
      ENEMY_CONFIG.DINO.SPRITE_SHEET
    );

    this.dinoWalkTextures = generateTexturesFromSpritesheet({
      baseTexture,
      frameWidth: ENEMY_CONFIG.DINO.FRAME_WIDTH,
      frameHeight: ENEMY_CONFIG.DINO.FRAME_HEIGHT,
      frameCount: ENEMY_CONFIG.DINO.WALK_FRAMES,
    });
  }

  public spawnEnemy(): void {
    const startPosition = path[0];
    const newEnemy = new Enemy({
      position: startPosition,
      health: ENEMY_CONFIG.DINO.BASE_HEALTH,
      speed: ENEMY_CONFIG.DINO.BASE_SPEED,
      textures: this.dinoWalkTextures,
    });

    newEnemy.sprite.animationSpeed = ENEMY_CONFIG.DINO.ANIMATION_SPEED;

    this.enemies.push(newEnemy);
    this.container.addChild(newEnemy.sprite);
  }

  public update(delta: number): void {
    for (const enemy of this.enemies) {
      enemy.update(delta);
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].isDead) {
        this.soundManager?.playSound('explosion');
        this.enemies.splice(i, 1);
      }
    }
  }

  /**
   * Возвращает массив всех активных врагов.
   * @returns Массив экземпляров Enemy.
   */
  public getEnemies(): Enemy[] {
    return this.enemies;
  }

  public destroy(): void {
    for (const enemy of this.enemies) {
      enemy.destroy();
    }
    this.enemies.length = 0;
    this.container.destroy();
  }
}
