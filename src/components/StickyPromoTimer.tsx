import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { AlarmClock, X } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

type StickyPromoTimerProps = {
  onClickBook: () => void;
};

export const StickyPromoTimer: FC<StickyPromoTimerProps> = ({ onClickBook }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const { minutes, seconds, start } = useCountdown({
    durationSeconds: 10 * 60, // 10 минут акции
    autostart: false,
  });

  useEffect(() => {
    const showTimeout = window.setTimeout(() => {
      setMounted(true);
      window.setTimeout(() => setVisible(true), 30);
      start();
    }, 2_000);

    return () => window.clearTimeout(showTimeout);
  }, [start]);

  if (!mounted) return null;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const handleClose = () => {
    setVisible(false);
    window.setTimeout(() => setMounted(false), 300);
  };

  return (
    <div
      className={[
        // >>> тут подняли блок выше
        'fixed z-40 max-w-xs sm:max-w-sm right-3 sm:right-4 bottom-20 sm:bottom-20',
        'transition-all duration-500 ease-out transform',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-rose-200 bg-rose-50/95 shadow-xl sm:shadow-2xl shadow-rose-200/70 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-100 via-rose-50 to-white opacity-80" />

        <div className="relative px-3.5 py-3 sm:px-4 sm:py-3.5">
          <div className="mb-2.5 flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
                <AlarmClock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-500">
                акция на первый визит
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="text-rose-300 hover:text-rose-500"
              aria-label="Закрыть таймер"
            >
              <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>

          <div className="mb-2.5 rounded-2xl border border-rose-100 bg-white/80 px-3.5 py-3 text-center shadow-sm">
            <div className="mb-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-rose-400">
              осталось времени
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-semibold leading-none text-rose-600">
              {formattedTime}
            </div>
            <div className="mt-1 text-[10px] sm:text-[11px] text-rose-400">
              первые записи по <span className="font-semibold text-rose-600">5 000 ₸</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClickBook}
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-md hover:bg-rose-600"
            >
              записаться сейчас
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
