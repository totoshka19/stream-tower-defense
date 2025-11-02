import * as PIXI from 'pixi.js';
import type { Point } from '../mapData';

export interface EnemyOptions {
  position: Point;
  health: number;
  speed: number;
  radius: number;
  color: number;
}

export class Enemy {
  public health: number;
  public speed: number;
  public position: Point;

  public readonly graphics: PIXI.Graphics;

  private isDestroyed = false;

  constructor(options: EnemyOptions) {
    this.health = options.health;
    this.speed = options.speed;
    this.position = { ...options.position };

    this.graphics = new PIXI.Graphics();
    this.graphics
      .rect(0, 0, options.radius * 2, options.radius * 2)
      .fill(options.color);
    this.graphics.pivot.set(options.radius, options.radius);
    this.graphics.position.set(this.position.x, this.position.y);
  }

  public update(delta: number): void {
    if (this.isDestroyed) return;

    // Логику движения добавим здесь

    this.graphics.position.set(this.position.x, this.position.y);
  }

  public takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.graphics.destroy();
  }

  public get isDead(): boolean {
    return this.isDestroyed;
  }
}
