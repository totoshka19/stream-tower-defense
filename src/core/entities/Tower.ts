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
  private currentTarget: Enemy | null = null;

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

    // 1. Проверяем, валидна ли текущая цель
    if (this.currentTarget) {
      const isTargetDead = this.currentTarget.isDead;
      const isTargetOutOfRange = this.isEnemyOutOfRange(this.currentTarget);

      if (isTargetDead || isTargetOutOfRange) {
        this.currentTarget = null; // Сбрасываем цель
      }
    }

    // 2. Если цели нет, ищем новую
    if (!this.currentTarget) {
      this.currentTarget = this.findTarget(enemies);
    }

    // 3. Если есть цель и мы можем стрелять, атакуем
    if (this.currentTarget && this.timeSinceLastShot >= this.fireCooldown) {
      this.attack(this.currentTarget);
      this.timeSinceLastShot = 0;
    }
  }

  /**
   * Проверяет, находится ли враг вне радиуса действия башни.
   * @param enemy - Враг для проверки.
   * @returns true, если враг вне радиуса.
   */
  private isEnemyOutOfRange(enemy: Enemy): boolean {
    const towerPosition = this.sprite.position;
    const dx = towerPosition.x - enemy.position.x;
    const dy = towerPosition.y - enemy.position.y;
    const distanceSq = dx * dx + dy * dy;
    return distanceSq > this.range * this.range;
  }

  /**
   * Находит врага, который дальше всех от финиша (т.е., имеет наименьший targetPointIndex)
   * и при этом находится в радиусе атаки.
   * @param enemies - Массив для поиска цели.
   * @returns Наименее продвинутый враг или null.
   */
  private findTarget(enemies: Enemy[]): Enemy | null {
    let bestTarget: Enemy | null = null;
    // Инициализируем минимальный прогресс очень большим числом
    // (индекс пути не может быть больше path.length)
    let minProgress = Infinity;

    for (const enemy of enemies) {
      // Убедимся, что враг жив и находится в радиусе
      if (!enemy.isDead && !this.isEnemyOutOfRange(enemy)) {
        // Ищем врага с наименьшим targetPointIndex (т.е., дальше от финиша)
        if (enemy.targetPointIndex < minProgress) {
          minProgress = enemy.targetPointIndex;
          bestTarget = enemy;
        }
      }
    }

    return bestTarget;
  }

  /**
   * Атакует указанную цель.
   * @param target - Враг, которого нужно атаковать.
   */
  private attack(target: Enemy): void {
    // На данном этапе атака мгновенная.
    // В будущем здесь можно будет создавать снаряды.
    target.takeDamage(this.damage);
  }
}
