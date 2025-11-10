import * as PIXI from 'pixi.js';
import type { Enemy } from './Enemy';
import type { Point } from '../../types/common';

/**
 * Опции для создания башни.
 */
export interface TowerOptions {
  position: Point;
  texture: PIXI.Texture;
  range: number;
  damage: number;
  fireRate: number; // Выстрелов в секунду
}

export class Tower {
  public readonly sprite: PIXI.Sprite;
  private readonly range: number;
  private readonly damage: number;
  private readonly fireCooldown: number; // Задержка между выстрелами в секундах
  private timeSinceLastShot: number;

  constructor(options: TowerOptions) {
    this.range = options.range;
    this.damage = options.damage;
    this.fireCooldown = 1 / options.fireRate;
    this.timeSinceLastShot = this.fireCooldown; // Готовность стрелять сразу

    this.sprite = new PIXI.Sprite(options.texture);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(options.position.x, options.position.y);
  }

  /**
   * Основной метод обновления башни, вызываемый в каждом кадре игрового цикла.
   * @param delta - Время, прошедшее с предыдущего кадра, в секундах.
   * @param enemies - Массив всех активных врагов на карте.
   */
  public update(delta: number, enemies: Enemy[]): void {
    this.timeSinceLastShot += delta;

    if (this.timeSinceLastShot >= this.fireCooldown) {
      const target = this.findTarget(enemies);

      if (target) {
        this.attack(target);
        this.timeSinceLastShot = 0;
      }
    }
  }

  /**
   * Находит ближайшего врага в радиусе атаки.
   * @param enemies - Массив для поиска цели.
   * @returns Ближайший враг или null, если врагов в радиусе нет.
   */
  private findTarget(enemies: Enemy[]): Enemy | null {
    let closestEnemy: Enemy | null = null;
    let minDistanceSq = Infinity;

    const towerPosition = this.sprite.position;

    for (const enemy of enemies) {
      const dx = towerPosition.x - enemy.position.x;
      const dy = towerPosition.y - enemy.position.y;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq < this.range * this.range && distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        closestEnemy = enemy;
      }
    }

    return closestEnemy;
  }

  /**
   * Атакует указанную цель.
   * @param target - Враг, которого нужно атаковать.
   */
  private attack(target: Enemy): void {
    console.log('Башня атакует врага!', {
      towerPos: this.sprite.position,
      enemyPos: target.position,
    });
    // На данном этапе атака мгновенная.
    // В будущем здесь можно будет создавать снаряды.
    target.takeDamage(this.damage);
  }
}
