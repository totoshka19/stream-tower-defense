import { sound } from '@pixi/sound';

export type SoundAlias = 'explosion';

export class SoundManager {
  /**
   * Загружает все необходимые звуковые ассеты.
   */
  public async loadAssets(): Promise<void> {
    // --- ИСПРАВЛЕНО: `sound.add` возвращает Promise, который мы и должны ожидать. ---
    await sound.add({
      explosion: 'assets/audio/mixkit-cartoon-quick-splat-2890.wav',
    });
    // --- Строка `await sound.load(...)` полностью удалена. ---
  }

  /**
   * Воспроизводит звук по его псевдониму.
   * @param alias - Имя звука для воспроизведения.
   */
  public playSound(alias: SoundAlias): void {
    if (sound.exists(alias)) {
      sound.play(alias);
    } else {
      console.warn(`Звук с псевдонимом "${alias}" не найден.`);
    }
  }

  /**
   * Очищает ресурсы при уничтожении игры.
   */
  public destroy(): void {
    sound.removeAll();
  }
}
