import type { FC } from 'react';
import { FadeIn } from '../components/FadeIn';

const items = [
  {
    title: 'Кожа выглядит свежее',
    text: 'Кожа выглядит более ровной и живой, уходит тусклость, появляется здоровое сияние.',
    img: '/thirty_1.jpeg',
  },
  {
    title: 'Мелкие морщины разглаживаются',
    text: 'Благодаря мягкому стимулу к обновлению, мимические заломы становятся менее заметными.',
    img: '/thirty_2.jpeg',
  },
  {
    title: 'Глубокое расслабление',
    text: 'Повышенное насыщение кислородом помогает снять внутреннее напряжение, расслабляя тело и нервную систему.',
    img: '/thirty_3.jpeg',
  },
];

const ThirtyMinutesSection: FC = () => {
  return (
    <section className="py-12 md:py-18 lg:py-20 bg-[#E7EDFA]">
      <div className="max-w-5xl mx-auto px-4">
        <FadeIn>
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 sm:mb-4 tracking-tight">
            Видимый эффект за 30 минут
          </h2>
        </FadeIn>

        <FadeIn delay={80}>
          <p className="text-center text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mb-8 sm:mb-10">
            Пока вы просто лежите и дышите, организм получает больше кислорода, а кожа — мягкий
            импульс к обновлению.
          </p>
        </FadeIn>

        <div className="space-y-4 sm:space-y-6">
          {items.map((item, idx) => (
            <FadeIn key={item.title} delay={120 * (idx + 1)}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-5 sm:p-6 md:p-7 rounded-2xl md:rounded-3xl bg-white border border-gray-100 shadow-md md:shadow-xl transition-shadow duration-300 hover:shadow-2xl">
                {/* Картинка — чуть меньше на мобиле */}
                <div className="shrink-0">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          'https://placehold.co/112x112/cccccc/333333?text=Photo';
                      }}
                    />
                    <div className="absolute inset-0 rounded-full ring-4 ring-indigo-100/70" />
                  </div>
                </div>

                {/* Текст */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                    {item.title}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThirtyMinutesSection;
