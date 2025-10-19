"use client";

type SoundSettingsProps = {
  isBGMEnabled: boolean;
  isSFXEnabled: boolean;
  onToggleBGM: () => void;
  onToggleSFX: () => void;
};

export const SoundSettings = ({
  isBGMEnabled,
  isSFXEnabled,
  onToggleBGM,
  onToggleSFX,
}: SoundSettingsProps) => {
  return (
    <div className="w-full max-w-md rounded-3xl bg-white/70 p-5 shadow-badge">
      <h3 className="mb-4 text-center text-lg font-bold text-emerald-900">
        🔊 音設定
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-800">BGM</span>
          <button
            type="button"
            onClick={onToggleBGM}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
              isBGMEnabled ? "bg-emerald-500" : "bg-gray-300"
            }`}
            aria-label="BGMの切り替え"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                isBGMEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-800">効果音</span>
          <button
            type="button"
            onClick={onToggleSFX}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
              isSFXEnabled ? "bg-emerald-500" : "bg-gray-300"
            }`}
            aria-label="効果音の切り替え"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                isSFXEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
