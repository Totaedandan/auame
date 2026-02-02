import { Sparkles } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { SERVICES } from '../constants';

type GlowCtaSectionProps = {
  onBook: (serviceId: string) => void;
};

export function GlowCtaSection({ onBook }: GlowCtaSectionProps) {
  // 0 — пробный сеанс
  const trial = SERVICES[0];

  return (
    <section className="py-14 md:py-20 bg-[#3D3440] text-white text-center">
      <div className="max-w-3xl mx-auto px-4">
        <FadeIn>
          <div className="w-14 h-14 md:w-20 md:h-20 bg-[#8BA9F5]/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 animate-pulse">
            <Sparkles className="text-blue-400 w-7 h-7 md:w-10 md:h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-snug md:leading-tight">
            Заметен{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              glow-эффект
            </span>{' '}
            уже после 1 сеанса
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-slate-300 mb-7 md:mb-10 leading-relaxed max-w-2xl mx-auto">
            Кожа светлее, взгляд живее, ощущение легкости в теле. Курс закрепляет результат и
            замедляет процесс старения изнутри.
          </p>

          <div className="bg-white/10 backdrop-blur-md p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 max-w-md md:max-w-lg mx-auto">
            <div className="text-slate-300 uppercase tracking-[0.18em] text-[11px] sm:text-xs mb-1.5">
              Пробный сеанс
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1.5 md:mb-2">
              7 000 ₸
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mb-5 md:mb-6">
              вместо 15 000 ₸
            </div>
            <button
              onClick={() => onBook(trial.id)}
              className="w-full py-3 sm:py-3.5 md:py-4 bg-white text-slate-900 rounded-xl font-semibold md:font-bold hover:bg-[#E4ECF9] transition transform hover:scale-[1.02] md:hover:scale-105"
            >
              ЗАПИСАТЬСЯ НА ПРОБНЫЙ СЕАНС
            </button>
            <p className="mt-3 md:mt-4 text-[11px] sm:text-xs text-slate-400">
              Оплата 5&nbsp;000&nbsp;₸ в студии перед процедурой
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
