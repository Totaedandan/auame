import { Check } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

export function DoubleImpactSection() {
  return (
    <section className="relative py-14 md:py-20 bg-white">
      {/* декоративные молекулы */}
      <img
        src="/moleculas.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute -left-[40px] -top-60 w-112 opacity-80"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-slate-900 mb-8 md:mb-12">
          Двойное воздействие
        </h2>

        {/* Шаг 1 */}
        <FadeIn>
          <div className="bg-[#ECE7F0] rounded-2xl md:rounded-3xl p-5 md:p-8 mb-8 md:mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 border border-slate-100">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-md">
                <img
                  src="/double_1.jpg"   // лежит в public/double_1.jpg
                  alt="Через дыхание"
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-3 left-3 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-base md:text-xl text-slate-900 shadow">
                  01
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold md:font-bold mb-3">
                Через дыхание
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-4 md:mb-5 leading-relaxed">
                Организм получает больше кислорода. Легче мозгу, тело расслабляется, уходит нервное
                напряжение.
              </p>
              <div className="bg-[#E4ECF9] border border-blue-100 p-3 md:p-4 rounded-xl text-blue-800 text-xs sm:text-sm font-medium leading-snug">
                У&nbsp;91% пациентов с&nbsp;бессонницей улучшился сон и&nbsp;снизился уровень стресса.
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Шаг 2 */}
        <FadeIn delay={160}>
          <div className="bg-[#ECE7F0] rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row-reverse items-center gap-6 md:gap-10 border border-slate-100">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-md">
                <img
                  src="/double_2.jpg"   // лежит в public/double_2.jpg
                  alt="Через кожу"
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-3 right-3 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-base md:text-xl text-slate-900 shadow">
                  02
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold md:font-bold mb-3">
                Через кожу
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-4 md:mb-5 leading-relaxed">
                Ионы помогают убрать серость, вернуть свежий тон и увлажнённость. Клетки начинают
                вырабатывать собственный коллаген.
              </p>
              <div className="flex items-center gap-2 text-sm sm:text-base text-slate-800 font-semibold">
                <Check className="text-green-500 w-4 h-4" />
                Кожа обновляется естественным образом
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
