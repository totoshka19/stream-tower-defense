import * as PIXI from 'pixi.js';
import { Enemy } from '../entities/Enemy';
import { path } from '../mapData';

const DINO_FRAME_WIDTH = 24;
const DINO_FRAME_HEIGHT = 24;

export class EnemyManager {
  private readonly enemies: Enemy[] = [];
  private readonly container: PIXI.Container;
  private dinoWalkTextures: PIXI.Texture[] = [];

  constructor(stage: PIXI.Container) {
    this.container = new PIXI.Container();
    this.container.zIndex = 1;
    stage.addChild(this.container);
  }

  // Новый метод для загрузки ассетов
  public async loadAssets(): Promise<void> {
    // 1. Загружаем основную текстуру спрайт-листа
    const baseTexture = await PIXI.Assets.load<PIXI.Texture>(
      'assets/dino_spritesheet.png'
    );

    // 2. Создаем объект Spritesheet для удобной работы с кадрами
    const spritesheet = new PIXI.Spritesheet(baseTexture, {
      frames: {
        dino_frame_0: {
          frame: {
            x: 0 * DINO_FRAME_WIDTH,
            y: 0,
            w: DINO_FRAME_WIDTH,
            h: DINO_FRAME_HEIGHT,
          },
        },
        dino_frame_1: {
          frame: {
            x: 1 * DINO_FRAME_WIDTH,
            y: 0,
            w: DINO_FRAME_WIDTH,
            h: DINO_FRAME_HEIGHT,
          },
        },
        dino_frame_2: {
          frame: {
            x: 2 * DINO_FRAME_WIDTH,
            y: 0,
            w: DINO_FRAME_WIDTH,
            h: DINO_FRAME_HEIGHT,
          },
        },
        dino_frame_3: {
          frame: {
            x: 3 * DINO_FRAME_WIDTH,
            y: 0,
            w: DINO_FRAME_WIDTH,
            h: DINO_FRAME_HEIGHT,
          },
        },
        dino_frame_4: {
          frame: {
            x: 4 * DINO_FRAME_WIDTH,
            y: 0,
            w: DINO_FRAME_WIDTH,
            h: DINO_FRAME_HEIGHT,
          },
        },
        dino_frame_5: {
          frame: {
            x: 5 * DINO_FRAME_WIDTH,
            y: 0,
            w: DINO_FRAME_WIDTH,
            h: DINO_FRAME_HEIGHT,
          },
        },
        // ... при необходимости можно описать все 24 кадра
      },
      meta: {
        scale: '1',
      },
    });

    // 3. Парсим спрайт-лист, чтобы получить доступ к кадрам по их именам
    await spritesheet.parse();

    // 4. Сохраняем текстуры для анимации ходьбы в наше свойство
    this.dinoWalkTextures = Object.values(spritesheet.textures);
  }

  public spawnEnemy(): void {
    const startPosition = path[0];
    const newEnemy = new Enemy({
      position: startPosition,
      health: 100,
      speed: 50, // 50 пикселей в секунду
      textures: this.dinoWalkTextures,
    });

    this.enemies.push(newEnemy);
    this.container.addChild(newEnemy.sprite);
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
