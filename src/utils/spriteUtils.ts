import * as PIXI from 'pixi.js';

interface TextureGenerationOptions {
  baseTexture: PIXI.BaseTexture;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  row?: number; // Номер ряда, если спрайты в несколько рядов
}

export function generateTexturesFromSpritesheet(
  options: TextureGenerationOptions
): PIXI.Texture[] {
  const { baseTexture, frameWidth, frameHeight, frameCount, row = 0 } = options;
  const textures: PIXI.Texture[] = [];

  for (let i = 0; i < frameCount; i++) {
    const frame = new PIXI.Rectangle(
      i * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight
    );
    textures.push(new PIXI.Texture({ source: baseTexture, frame }));
  }

  return textures;
}
