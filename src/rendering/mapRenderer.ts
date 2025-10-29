import * as PIXI from 'pixi.js';
import type { Point } from '../core/mapData';

const PATH_COLOR = 0xdeb887;
const PATH_WIDTH = 50;

export const drawBackground = (app: PIXI.Application) => {
  const background = new PIXI.Graphics();

  background.rect(0, 0, app.screen.width, app.screen.height).fill(0x006400); // Темно-зеленый цвет травы

  app.stage.addChild(background);
};

export const drawPath = (app: PIXI.Application, path: Point[]) => {
  const pathGraphics = new PIXI.Graphics();
  pathGraphics.moveTo(path[0].x, path[0].y);

  for (let i = 1; i < path.length; i++) {
    pathGraphics.lineTo(path[i].x, path[i].y);
  }

  pathGraphics.stroke({
    width: PATH_WIDTH,
    color: PATH_COLOR,
    cap: 'round',
    join: 'round',
  });

  app.stage.addChild(pathGraphics);
};
