import { useCallback, useState, useEffect } from "react";

const STORAGE_KEY_BGM = "mogura-game-bgm-enabled";
const STORAGE_KEY_SFX = "mogura-game-sfx-enabled";

/**
 * 音設定管理用のカスタムフック
 */
export const useSoundSettings = () => {
  const [isBGMEnabled, setIsBGMEnabled] = useState(true);
  const [isSFXEnabled, setIsSFXEnabled] = useState(true);

  // 初回マウント時にlocalStorageから設定を復元
  useEffect(() => {
    const savedBGM = localStorage.getItem(STORAGE_KEY_BGM);
    const savedSFX = localStorage.getItem(STORAGE_KEY_SFX);

    if (savedBGM !== null) {
      setIsBGMEnabled(savedBGM === "true");
    }
    if (savedSFX !== null) {
      setIsSFXEnabled(savedSFX === "true");
    }
  }, []);

  const toggleBGM = useCallback(() => {
    setIsBGMEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY_BGM, String(newValue));
      return newValue;
    });
  }, []);

  const toggleSFX = useCallback(() => {
    setIsSFXEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY_SFX, String(newValue));
      return newValue;
    });
  }, []);

  return {
    isBGMEnabled,
    isSFXEnabled,
    toggleBGM,
    toggleSFX,
  };
};
