import * as PIXI from 'pixi.js';
import { Tower } from '../entities/Tower';
import type { Enemy } from '../entities/Enemy';
import type { Point } from '../../types/common';
import { TOWER_CONFIG } from '../config';

// Определяем доступные типы башен. В будущем можно будет расширить.
export type TowerType = 'BASIC_TOWER';

export class TowerManager {
  private readonly towers: Tower[] = [];
  private readonly container: PIXI.Container;
  private readonly app: PIXI.Application;

  // Хранилище для текстур башен, чтобы не генерировать их каждый раз
  private towerTextures = new Map<TowerType, PIXI.Texture>();

  constructor(stage: PIXI.Container, app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();
    this.container.zIndex = 2; // Башни должны быть выше врагов (z-index 1)
    stage.addChild(this.container);
  }

  /**
   * Загружает или генерирует ассеты для башен.
   */
  public async loadAssets(): Promise<void> {
    // Временное решение: генерируем простую графику для башни
    const basicTowerGraphics = new PIXI.Graphics()
      .circle(0, 0, TOWER_CONFIG.BASIC_TOWER.PLACEHOLDER_RADIUS)
      .fill(TOWER_CONFIG.BASIC_TOWER.PLACEHOLDER_COLOR);

    // Превращаем графику в текстуру, которую можно будет использовать для спрайтов
    const texture = this.app.renderer.generateTexture({
      target: basicTowerGraphics,
    });

    this.towerTextures.set('BASIC_TOWER', texture);

    // Очищаем временный графический объект
    basicTowerGraphics.destroy();
  }

  /**
   * Создает и размещает башню на сцене.
   * @param position - Координаты для размещения башни.
   * @param type - Тип создаваемой башни.
   */
  public addTower(position: Point, type: TowerType): void {
    const texture = this.towerTextures.get(type);
    if (!texture) {
      console.error(`Текстура для башни типа "${type}" не найдена.`);
      return;
    }

    let newTower: Tower;

    switch (type) {
      case 'BASIC_TOWER':
        newTower = new Tower({
          position,
          texture,
          range: TOWER_CONFIG.BASIC_TOWER.RANGE,
          damage: TOWER_CONFIG.BASIC_TOWER.DAMAGE,
          fireRate: TOWER_CONFIG.BASIC_TOWER.FIRE_RATE,
        });
        break;
      default:
        console.error(`Неизвестный тип башни: ${type}`);
        return;
    }

    this.towers.push(newTower);
    this.container.addChild(newTower.sprite);
  }

  /**
   * Обновляет состояние всех башен.
   * @param delta - Время с прошлого кадра.
   * @param enemies - Массив врагов для поиска целей.
   */
  public update(delta: number, enemies: Enemy[]): void {
    for (const tower of this.towers) {
      tower.update(delta, enemies);
    }
  }

  /**
   * Уничтожает все башни и контейнер.
   */
  public destroy(): void {
    this.towers.length = 0;
    this.container.destroy({ children: true });
    this.towerTextures.forEach((texture) => texture.destroy());
    this.towerTextures.clear();
  }
}
