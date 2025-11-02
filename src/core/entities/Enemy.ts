import * as PIXI from 'pixi.js';
import { path, type Point } from '../mapData';

export interface EnemyOptions {
  position: Point;
  health: number;
  speed: number;
  textures: PIXI.Texture[];
}

export class Enemy {
  public health: number;
  public speed: number;
  public position: Point;
  public readonly sprite: PIXI.AnimatedSprite;
  private isDestroyed = false;
  private targetPointIndex = 1;

  constructor(options: EnemyOptions) {
    this.health = options.health;
    this.speed = options.speed;
    this.position = { ...options.position };
    this.sprite = new PIXI.AnimatedSprite(options.textures);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.15;
    this.sprite.play();
    this.sprite.position.set(this.position.x, this.position.y);
  }

  public update(delta: number): void {
    if (this.isDestroyed) return;
    if (this.targetPointIndex >= path.length) {
      this.destroy();
      return;
    }

    const targetPoint = path[this.targetPointIndex];
    const dx = targetPoint.x - this.position.x;
    const dy = targetPoint.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveDistance = this.speed * delta;

    if (distance < moveDistance) {
      this.position.x = targetPoint.x;
      this.position.y = targetPoint.y;
      this.targetPointIndex++;
    } else {
      const dirX = dx / distance;
      const dirY = dy / distance;
      this.position.x += dirX * moveDistance;
      this.position.y += dirY * moveDistance;
    }

    this.sprite.position.set(this.position.x, this.position.y);
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
    this.sprite.destroy();
  }

  public get isDead(): boolean {
    return this.isDestroyed;
  }
}
