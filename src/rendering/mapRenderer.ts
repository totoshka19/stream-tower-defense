import * as PIXI from 'pixi.js';
import type { Point } from '../types/common';
import { MAP_CONFIG } from '../core/config';

export const drawBackground = (app: PIXI.Application) => {
  const background = new PIXI.Graphics();

  background
    .rect(0, 0, app.screen.width, app.screen.height)
    .fill(MAP_CONFIG.BACKGROUND_COLOR);

  app.stage.addChild(background);
};

export const drawPath = (app: PIXI.Application, path: Point[]) => {
  const pathGraphics = new PIXI.Graphics();
  pathGraphics.moveTo(path[0].x, path[0].y);

  for (let i = 1; i < path.length; i++) {
    pathGraphics.lineTo(path[i].x, path[i].y);
  }

  pathGraphics.stroke({
    width: MAP_CONFIG.PATH_WIDTH,
    color: MAP_CONFIG.PATH_COLOR,
    cap: 'round',
    join: 'round',
  });

  app.stage.addChild(pathGraphics);
};
