import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';


type VideoReview = {
  src: string;
  title: string;
};

const VIDEO_REVIEWS: VideoReview[] = [
  {
    src: '/video_review/review1.mp4',
    title: '«Я увидела результат уже после первого сеанса»',
  },
  {
    src: '/video_review/review2.mp4',
    title: '«Кожа стала свежее, а сон — крепче»',
  },
  {
    src: '/video_review/review3.mp4',
    title: '«Не верила, пока не увидела себя в зеркало»',
  },
  {
    src: '/video_review/review4.mp4',
    title: '«Лицо подтянулось, ушла отёчность»',
  },
  {
    src: '/video_review/review5.mp4',
    title: '«Это не про уколы, а про комфорт»',
  },
  {
    src: '/video_review/review6.mp4',
    title: '«Подруги начали спрашивать, что я сделала с кожей»',
  },
];

export const VideoReviewsSection: FC = () => {
  const [index, setIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null); // для модалки

  // Авто-прокрутка по кругу
  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % VIDEO_REVIEWS.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  const visible = [0, 1, 2].map((offset) => {
    const i = (index + offset) % VIDEO_REVIEWS.length;
    return VIDEO_REVIEWS[i];
  });

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + VIDEO_REVIEWS.length) % VIDEO_REVIEWS.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % VIDEO_REVIEWS.length);
  };

  return (
    <section className="py-16 md:py-24 bg-[#3D3440] relative overflow-hidden">
      {/* мягкий фон */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-32 -left-16 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-rose-500/25 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col items-center gap-4 mb-10 md:mb-14 text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.18em]">
              <Quote className="w-3 h-3" />
              живые видео-отзывы
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Что говорят клиенты после AIR VIBE
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Короткие вертикальные видео без фильтров и постановки — реальные эмоции сразу после
              процедуры.
            </p>
          </div>
        </FadeIn>

        {/* Карусель */}
        <div className="flex items-center gap-3">
          {/* стрелка влево (прячем на мобиле) */}
          <button
            type="button"
            onClick={handlePrev}
            className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:bg-white/10 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex justify-center gap-4 md:gap-6">
            {visible.map((video) => (
              <button
                key={video.src}
                type="button"
                onClick={() => setActiveVideo(video.src)}
                className="
                  group relative overflow-hidden rounded-[2rem] border border-rose-300/70 bg-slate-950/40 
                  shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm
                  w-32 xs:w-36 sm:w-40 md:w-48 lg:w-56 aspect-[9/16]
                  flex-shrink-0
                "
              >
                <video
                  src={video.src}
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  muted
                  loop
                  playsInline
                  autoPlay
                />

                {/* градиент снизу */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* плей-кнопка */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 shadow-xl shadow-rose-500/60 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white translate-x-[1px]" />
                  </div>
                </div>

                {/* подпись сверху */}
                <div className="absolute top-2 left-2 right-2 text-[10px] text-white/90 font-medium text-left line-clamp-2 drop-shadow">
                  {video.title}
                </div>
              </button>
            ))}
          </div>

          {/* стрелка вправо (прячем на мобиле) */}
          <button
            type="button"
            onClick={handleNext}
            className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:bg-white/10 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-8 text-center text-xs sm:text-sm text-slate-400">
          Листайте отзывы — карусель крутится по кругу, можно смотреть сколько угодно.
        </p>
      </div>

      {/* простая модалка для просмотра видео с управлением */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-md">
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-slate-200 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src={activeVideo}
              controls
              autoPlay
              className="w-full rounded-2xl shadow-2xl border border-slate-700 bg-black"
            />
          </div>
        </div>
      )}
    </section>
  );
};
