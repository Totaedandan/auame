import { Zap, Wind } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

export function TechnologySection() {
  return (
    <section
      id="technology"
      className="py-14 md:py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-14">
          {/* Картинка */}
          <div className="lg:w-1/2 w-full">
            <FadeIn direction="right">
              <div className="relative max-w-xl w-full rounded-[32px] overflow-hidden shadow-xl bg-black/5">
                <video
                  src="/air_vibe.mp4"          // ВАЖНО: путь именно так, без "public/"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute -bottom-6 left-6 right-6">
                  <div className="inline-block rounded-2xl bg-white shadow-md px-5 py-3 text-sm text-[#505565]">
                    «Как легко дышится после дождя…»
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Текст */}
          <div className="lg:w-1/2 w-full space-y-5 md:space-y-8">
            <FadeIn>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-snug">
                Как работает метод <br className="hidden sm:block" />
                <span className="text-blue-600">AIR VIBE</span>?
              </h2>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="pl-4 sm:pl-6 border-l-4 border-blue-200">
                <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed">
                  Вы замечали, как легко дышится после грозы? Это действие отрицательных ионов
                  кислорода.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
                Аппарат AIR VIBE воспроизводит этот природный эффект в студии, но в мягком и
                контролируемом формате. Клетки кожи получают заряд энергии, запускается{' '}
                <span className="font-semibold">естественное обновление</span>.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2.5 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg text-blue-600">
                    <Zap size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-800">
                    Энергия клеток
                  </span>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2.5 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg text-blue-600">
                    <Wind size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-800">
                    Оксигенация
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
