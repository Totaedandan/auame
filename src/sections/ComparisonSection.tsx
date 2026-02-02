import type { FC } from 'react';
import { FadeIn } from '../components/FadeIn';

const cards = [
  {
    icon: '✨',
    title: 'Глубокое клеточное воздействие',
    subtitle: 'В отличие от кремов',
    text: 'Наша процедура работает не только на поверхности. Активные компоненты и кислород проникают глубоко в слои дермы, стимулируя регенерацию клеток изнутри.',
  },
  {
    icon: '🧘',
    title: 'Комфорт и естественность',
    subtitle: 'В отличие от инъекций',
    text: 'Эффект достигается мягко, без боли, отеков и синяков. Вы получаете естественный, свежий вид, который сохраняется дольше, чем временные меры.',
  },
  {
    icon: '💧',
    title: 'Обновление без травматизации',
    subtitle: 'В отличие от агрессивных пилингов',
    text: 'Забудьте о жжении, покраснениях и периоде восстановления. Мы предлагаем нежное обновление, которое оставляет кожу сияющей и увлажненной сразу после сеанса.',
  },
];

const ComparisonSection: FC = () => {
  return (
    // Чуть меньше отступы, чтобы блок не казался огромным на мобиле
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
            Почему AIR VIBE — это уход будущего?
          </h2>
        </FadeIn>

        <FadeIn delay={80}>
          <p className="text-center text-sm sm:text-base md:text-lg text-gray-500 max-w-3xl mx-auto mb-10 md:mb-14">
            Мы превосходим привычные методы ухода, работая глубже, мягче и эффективнее.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, idx) => (
            <FadeIn key={card.title} delay={idx * 150}>
              <div className="flex flex-col rounded-2xl md:rounded-3xl bg-gray-50 border border-gray-100 shadow-md md:shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300 ease-in-out">
                {/* Верхняя часть карточки */}
                <div className="p-5 md:p-8 pb-3 md:pb-4 bg-white">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100/70 rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-inner">
                    <span className="text-xl md:text-2xl">{card.icon}</span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-[0.18em] mb-1.5 md:mb-2">
                    {card.subtitle}
                  </h3>
                  <h4 className="text-lg md:text-xl font-extrabold text-gray-900 leading-snug">
                    {card.title}
                  </h4>
                </div>

                {/* Текст */}
                <div className="px-5 md:px-8 pb-5 md:pb-6 pt-2 md:pt-3">
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {card.text}
                  </p>
                </div>

                {/* Нижний акцент — маленький, чтобы не растягивать блок */}
                <div className="h-1 bg-indigo-500 w-1/5 md:w-1/4 rounded-full mx-5 md:mx-8 mb-4 md:mb-5" />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
