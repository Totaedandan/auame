import { useCallback, useEffect, useState } from 'react';

type UseCountdownOptions = {
  durationSeconds: number;
  onFinish?: () => void;
  autostart?: boolean; // запускать ли сразу
};

export const useCountdown = ({
  durationSeconds,
  onFinish,
  autostart = true,
}: UseCountdownOptions) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(durationSeconds);
  const [isActive, setIsActive] = useState<boolean>(autostart);

  useEffect(() => {
    if (!isActive) return;

    const id = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setIsActive(false);
          if (onFinish) onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [isActive, onFinish]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setRemainingSeconds(durationSeconds);
    setIsActive(autostart);
  }, [autostart, durationSeconds]);

  return {
    remainingSeconds,
    minutes,
    seconds,
    isFinished: !isActive && remainingSeconds === 0,
    start,
    pause,
    reset,
  };
};
