import type { FC } from 'react';
import { FadeIn } from '../components/FadeIn';
import { SERVICES } from '../constants';

type Props = {
  onBook: (serviceId: string) => void;
};

const SoftPriceCtaSection: FC<Props> = ({ onBook }) => {
  const trial = SERVICES[0]; // пробный сеанс

  return (
    <section className="py-14 md:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <FadeIn>
          <div className="rounded-2xl md:rounded-3xl bg-white shadow-xl md:shadow-2xl border border-indigo-100/70 px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10 text-center relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-indigo-100/80 flex items-center justify-center shadow-md">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-300/60" />
            </div>

            <div className="mt-2 sm:mt-3 text-[11px] sm:text-xs tracking-[0.16em] uppercase text-gray-500 font-semibold">
              Попробуйте первый сеанс всего за
            </div>

            <div className="mt-3 text-3xl sm:text-4xl md:text-[40px] font-extrabold text-gray-900 tracking-tight">
              7000₸
            </div>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              и увидите результат в зеркало сразу — кожа светлее, взгляд живее, ощущение
              лёгкости в теле.
            </p>

            <button
              onClick={() => onBook(trial.id)}
              className="mt-7 sm:mt-8 inline-flex px-9 sm:px-10 md:px-12 py-2.5 sm:py-3.5 rounded-full 
                         bg-indigo-600 text-white text-sm sm:text-base font-semibold 
                         shadow-lg shadow-indigo-400/25 
                         hover:bg-indigo-700 transition-all duration-300 
                         transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Записаться на пробный сеанс
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default SoftPriceCtaSection;
