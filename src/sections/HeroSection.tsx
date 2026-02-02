import type { FC } from 'react';
import { Clock } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

export type HeroSectionProps = {
  onBook: () => void;
};

const HeroSection: FC<HeroSectionProps> = ({ onBook }) => {
  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-[#E4ECF9]">
      {/* Фото и градиент поверх него */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[url('/hero_2.jpg')] bg-cover bg-center opacity-70" />
        {/* Молочный градиент слева, чтобы текст читался */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6F4F7]/95 via-[#F6F4F7]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        <div className="max-w-xl">
          <FadeIn delay={60}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEFF] text-[#495269] text-[11px] font-semibold tracking-[0.18em] uppercase">
              AIR VIBE — новая технология
            </div>
          </FadeIn>

          <FadeIn delay={140}>
            <h1 className="mt-6 text-[32px] sm:text-[38px] lg:text-[44px] leading-tight font-semibold text-[#2D2528]">
              СИЯЮЩЕЕ ЛИЦО БЕЗ
              <span className="block">УКОЛОВ И БОЛИ —</span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-3 text-lg font-medium text-[#51484C]">
              уже после первого сеанса
            </p>
          </FadeIn>

          <FadeIn delay={260}>
            <p className="mt-4 text-[15px] sm:text-base text-[#6F676C] max-w-md leading-relaxed">
              AIR VIBE создаёт поток воздуха, насыщенного ионами кислорода.  
              Клетки кожи получают мягкий заряд энергии — тон выравнивается,
              уходит серость и усталость.
            </p>
          </FadeIn>

          <FadeIn delay={320}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
              <button
                onClick={onBook}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#4C4459] text-white text-sm sm:text-base font-semibold shadow-md shadow-[#4C4459]/30 hover:bg-[#3F374C] transition-transform hover:-translate-y-0.5"
              >
                Записаться на пробный сеанс
              </button>

              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/85 border border-[#E5E0F2] shadow-sm">
                <div className="flex -space-x-2">
                  {[
                    { src: '/avatars/ava_1.jpg', alt: 'Клиент 1' },
                    { src: '/avatars/ava_2.jpg', alt: 'Клиент 2' },
                    { src: '/avatars/ava_3.jpg', alt: 'Клиент 3' },
                  ].map((avatar) => (
                    <div
                      key={avatar.src}
                      className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-slate-200"
                    >
                      <img
                        src={avatar.src}
                        alt={avatar.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-[#342C33]">
                    150+ довольных клиентов
                  </span>
                  <span className="block text-[#928A93]">
                    видели результат уже после 1 сеанса
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={380}>
            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white/90 border border-[#E9E2F0] px-4 py-3 text-sm text-[#524A52] shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE9E1] text-[#F25F5C]">
                <Clock size={18} />
              </div>
              <div>
                <div className="font-semibold">Процедура всего 30 минут</div>
                <div className="text-xs text-[#8C828C]">
                  Лицо свежеет, морщины мягко разглаживаются, тело расслабляется.
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
