import { Brain, Clock, HeartPulse, MoonStar } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

export function ProblemsSection() {
  return (
    <section id="problems" className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <FadeIn>
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-slate-900">
            Если стресс стал нормой
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            {
              icon: <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400 mb-3" />,
              text: 'Вы просыпаетесь уже уставшими: много дел, голова не выключается ни днём, ни вечером.',
            },
            {
              icon: <MoonStar className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400 mb-3" />,
              text: 'Трудно уснуть, сон поверхностный: крутятся мысли, просыпаетесь без ощущения отдыха.',
            },
            {
              icon: <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-violet-400 mb-3" />,
              text: 'Часто напряжены шея и плечи, болит голова, сложно “отпустить” тревогу и внутренний диалог.',
            },
            {
              icon: <HeartPulse className="w-7 h-7 sm:w-8 sm:h-8 text-rose-400 mb-3" />,
              text: 'Чувствуете раздражительность, выгорание, перепады настроения и постоянную усталость.',
            },
          ].map((item, idx) => (
            <FadeIn delay={idx * 100} key={idx}>
              <div className="h-full p-5 sm:p-6 bg-[#ECE7F0] rounded-2xl md:rounded-3xl border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 group">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={450}>
          <div className="mt-8 md:mt-10 text-center space-y-4">
            <p className="text-base sm:text-lg text-slate-500 font-light">
              AIR VIBE мягко снимает нервное напряжение: мозг получает больше кислорода, 
              <span className="font-semibold text-slate-800"> нервная система переходит из режима стресса в режим восстановления</span>.
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium">
                Глубокое расслабление без седации
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                Улучшение сна и качества отдыха
              </span>
              <span className="px-4 py-2 rounded-full bg-violet-50 text-violet-700 font-medium">
                Больше энергии и устойчивости к стрессу
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
