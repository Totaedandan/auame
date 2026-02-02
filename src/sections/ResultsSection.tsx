import { useEffect, useState } from 'react';
import { FadeIn } from '../components/FadeIn';

type MediaSlide = {
  type: 'image';
  src: string;
  title: string;
  description: string;
};

const MEDIA_SLIDES: MediaSlide[] = [
  {
    type: 'image',
    src: '/results/photo19.jpeg',
    title: 'Обновление после стресса',
    description:
      'Черты лица смягчились, кожа выглядит спокойнее, уменьшилась выраженность следов стресса.',
  },
  {
    type: 'image',
    src: '/results/photo17.jpeg',
    title: 'Неровный тон и поры',
    description:
      'Тон лица стал ровнее, поры выглядят менее заметными, появился мягкий здоровый блеск.',
  },
  {
    type: 'image',
    src: '/results/photo.jpg',
    title: 'Подтяжка овала лица',
    description:
      'Ушла отёчность, выровнялся овал лица, кожа стала более плотной и сияющей.',
  },
  {
    type: 'image',
    src: '/results/photo2.jpg',
    title: 'Тусклый тон и морщины',
    description:
      'Кожа посветлела, мелкие морщины стали менее заметными, взгляд стал более живым.',
  },
  {
    type: 'image',
    src: '/results/photo4.jpeg',
    title: 'Усталое лицо',
    description:
      'Снизилась выраженность следов усталости, кожа выглядит более ровной и отдохнувшей.',
  },
  {
    type: 'image',
    src: '/results/photo5.jpeg',
    title: 'Освежение кожи',
    description:
      'Лицо выглядит более свежим, текстура кожи стала ровнее, появилась мягкая подсветка.',
  },
  {
    type: 'image',
    src: '/results/photo8.jpeg',
    title: 'Лёгкий лифтинг',
    description:
      'Мягкое подтягивание контура лица и уменьшение заломов в области щёк и носогубной зоны.',
  },
  {
    type: 'image',
    src: '/results/photo11.jpeg',
    title: 'Неровный рельеф',
    description:
      'Рельеф кожи стал более гладким, визуально уменьшилась зернистость и неровности.',
  },
  {
    type: 'image',
    src: '/results/photo12.jpeg',
    title: 'Тусклый цвет лица',
    description:
      'Цвет лица стал более ровным и живым, ушла серость, кожа выглядит напитанной.',
  },
  {
    type: 'image',
    src: '/results/photo13.jpeg',
    title: 'Мелкие морщины вокруг рта',
    description:
      'Смягчились мелкие заломы, кожа вокруг рта и подбородка стала визуально более гладкой.',
  },
  {
    type: 'image',
    src: '/results/photo14.jpeg',
    title: 'Общее омоложение',
    description:
      'Лицо выглядит моложе: улучшился тон, выровнялся рельеф, взгляд стал более открытым.',
  },
  {
    type: 'image',
    src: '/results/photo16.jpeg',
    title: 'Усталость и отёчность',
    description:
      'Уменьшилась отёчность нижней трети лица, кожа стала более подтянутой и светлой.',
  },
  {
    type: 'image',
    src: '/results/photo18.jpeg',
    title: 'Тусклая, обезвоженная кожа',
    description:
      'Кожа визуально стала более увлажнённой, появился естественный glow-эффект.',
  },
  {
    type: 'image',
    src: '/results/photo21.jpeg',
    title: 'Возрастные изменения',
    description:
      'Сгладились возрастные заломы, лицо стало выглядеть свежее и более подтянутым.',
  },
  {
    type: 'image',
    src: '/results/photo22.jpeg',
    title: 'Работа с овалом и тоном',
    description:
      'Улучшился контур лица, тон кожи выровнялся, общий вид стал более ухоженным и сияющим. А так же ушла краснота.',
  },
];

export function ResultsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (MEDIA_SLIDES.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MEDIA_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const activeSlide = MEDIA_SLIDES[activeIndex];

  return (
    <section id="results" className="relative py-10 md:py-16 bg-white overflow-hidden">
      {/* декоративная молекула слева (PNG с прозрачным фоном из public/decor/molecula.png) */}
      <img
        src="/molecula.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute -left-[-60px] top-8 w-86 opacity-80"
      />

      <img
        src="/molecula.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute -right-1 top-48 w-86 opacity-80"
      />

      <div className="max-w-7xl mx-auto px-4">
        <FadeIn>
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-slate-900">
            Результаты До/После
          </h2>
          <p className="text-center text-xs sm:text-sm md:text-base text-slate-500 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Реальные фото и видео клиентов AIR VIBE. На каждом кадре — коллаж до/после одной
            процедуры или курса.
          </p>
        </FadeIn>

        <div className="max-w-md md:max-w-xl mx-auto">
          {/* Карусель — компактная, узкая */}
          <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg bg-black">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {MEDIA_SLIDES.map((slide, index) => (
                <div key={index} className="min-w-full">
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="w-full object-cover aspect-[3/4] sm:aspect-[4/3] max-h-[260px] sm:max-h-[320px]"
                  />
                </div>
              ))}
            </div>

            {/* Плашка формата */}
            <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[9px] sm:text-[11px] text-white uppercase tracking-wide">
              фото
            </div>
          </div>

          {/* Описание — тоже компактное */}
          <div className="mt-3 sm:mt-4 space-y-1 text-center">
            <h4 className="font-semibold text-sm sm:text-base text-slate-900">
              {activeSlide.title}
            </h4>
            <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed">
              {activeSlide.description}
            </p>
          </div>

          {/* Точки навигации */}
          <div className="mt-3 flex justify-center gap-2">
            {MEDIA_SLIDES.map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  className={[
                    'h-2 rounded-full transition-all duration-300',
                    isActive ? 'w-4 bg-[#3D3440]' : 'w-2 bg-slate-300 hover:bg-slate-400',
                  ].join(' ')}
                  aria-label={`Показать кейс ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
