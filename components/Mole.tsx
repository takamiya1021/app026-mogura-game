"use client";

type MoleProps = {
  isVisible: boolean;
  isHit: boolean;
};

export const Mole = ({ isVisible, isHit }: MoleProps) => {
  const visibilityClasses = isVisible
    ? "translate-y-0 opacity-100 animate-mole-pop"
    : "translate-y-[65%] opacity-0";

  const hitClasses = isHit ? "animate-hit-bounce" : "";

  return (
    <div
      className={`pointer-events-none relative z-10 flex flex-col items-center justify-end transition-all duration-200 ${visibilityClasses} ${hitClasses}`}
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-y-[35%] -left-3 right-3 rounded-full bg-earth-500/45 blur-md" />
        <div className="relative flex h-full w-full flex-col items-center justify-start">
          <div className="h-[70%] w-full rounded-full bg-mole-body shadow-md">
            <div className="absolute left-1/2 top-[28%] h-2 w-2 -translate-x-4 rounded-full bg-white shadow-sm">
              <div className="h-1 w-1 translate-x-[2px] translate-y-[1px] rounded-full bg-emerald-900" />
            </div>
            <div className="absolute left-1/2 top-[28%] h-2 w-2 translate-x-2 rounded-full bg-white shadow-sm">
              <div className="h-1 w-1 translate-x-[1px] translate-y-[1px] rounded-full bg-emerald-900" />
            </div>
            <div className="absolute left-1/2 top-[50%] h-3 w-6 -translate-x-1/2 rounded-full bg-mole-belly" />
            <div className="absolute left-1/2 top-[44%] h-3 w-3 -translate-x-1/2 rounded-full bg-mole-nose shadow" />
            <div className="absolute left-1/2 top-[64%] h-2 w-10 -translate-x-1/2 rounded-full border-b-[3px] border-emerald-900/70" />
          </div>
          <div className="mt-1 h-3 w-[85%] rounded-full bg-mole-belly/80" />
        </div>
      </div>
    </div>
  );
};
