import { useCallback, useRef, useEffect } from "react";

type UseSoundEffectOptions = {
  isSFXEnabled?: boolean;
  isBGMEnabled?: boolean;
};

/**
 * 効果音・BGM再生用のカスタムフック
 */
export const useSoundEffect = (options: UseSoundEffectOptions = {}) => {
  const { isSFXEnabled = true, isBGMEnabled = true } = options;
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  // BGM用のAudio要素を初期化
  useEffect(() => {
    if (typeof window !== "undefined" && !bgmAudioRef.current) {
      const audio = new Audio("/bgm.mp3");
      audio.loop = true;
      audio.volume = 0.4; // 音量を40%に設定（調整可能）
      bgmAudioRef.current = audio;
    }

    return () => {
      // クリーンアップ
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current = null;
      }
    };
  }, []);

  // AudioContextの初期化（効果音用）
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  }, []);

  /**
   * 「ポコッ」という効果音を生成・再生
   */
  const playHitSound = useCallback(() => {
    if (!isSFXEnabled) return; // 効果音がOFFの場合は再生しない
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // オシレーター（音の高さを生成）
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 「ポコッ」という感じの音
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, now); // 初期周波数
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.05); // 素早く下がる

    // 音量エンベロープ（アタック→ディケイ→リリース）
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // アタック
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15); // ディケイ

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }, [initAudioContext, isSFXEnabled]);

  /**
   * SUNO生成BGMを再生
   */
  const playBGM = useCallback(() => {
    if (!isBGMEnabled || !bgmAudioRef.current) {
      return { stop: () => {} }; // BGMがOFFの場合は何もしない
    }

    const audio = bgmAudioRef.current;

    // 再生開始
    audio
      .play()
      .catch((error) => {
        console.warn("BGM再生エラー:", error);
      });

    return {
      stop: () => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0; // 最初に戻す
        }
      },
    };
  }, [isBGMEnabled]);

  return {
    playHitSound,
    playBGM,
  };
};
