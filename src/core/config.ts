export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
};

export const MAP_CONFIG = {
  PATH_COLOR: 0xdeb887, // Цвет "выжженной травы"
  PATH_WIDTH: 50,
  BACKGROUND_COLOR: 0x006400, // Темно-зеленый
};

export const ENEMY_CONFIG = {
  DINO: {
    SPRITE_SHEET: 'assets/dino_spritesheet.png',
    FRAME_WIDTH: 24,
    FRAME_HEIGHT: 24,
    WALK_FRAMES: 6, // Количество кадров в анимации ходьбы
    BASE_SPEED: 50, // пикселей в секунду
    BASE_HEALTH: 100,
    ANIMATION_SPEED: 0.15,
  },
  SPAWN_INTERVAL_MS: 2000,
};

export const TOWER_CONFIG = {
  BASIC_TOWER: {
    RANGE: 160, // Радиус атаки в пикселях
    DAMAGE: 10,
    FIRE_RATE: 1, // Выстрелов в секунду
    // Параметры для временной графики, пока нет спрайта
    PLACEHOLDER_COLOR: 0xcccccc, // Светло-серый
    PLACEHOLDER_RADIUS: 15,
  },
};
