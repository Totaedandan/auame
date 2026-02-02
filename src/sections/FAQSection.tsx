import { useState } from 'react';
import type { ReactNode } from 'react';
import { HelpCircle, Info, MoonStar, ShieldCheck, ChevronDown } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

type FAQItem = {
  question: string;
  icon?: ReactNode;
  answer: ReactNode;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Что такое AIR VIBE?',
    icon: <HelpCircle className="w-5 h-5 text-blue-500" />,
    answer: (
      <div className="space-y-2 text-sm sm:text-base text-slate-600">
        <p>
          AIR VIBE — это wellness-сеанс, во время которого вы дышите воздухом,
          насыщенным отрицательными ионами кислорода, в комфортной расслабляющей
          обстановке.
        </p>
        <p>Процедура направлена на:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>восстановление энергии;</li>
          <li>снижение стресса;</li>
          <li>улучшение состояния кожи;</li>
          <li>поддержку иммунитета;</li>
          <li>общее ощущение лёгкости и спокойствия.</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Как проходит сеанс?',
    icon: <Info className="w-5 h-5 text-emerald-500" />,
    answer: (
      <div className="space-y-2 text-sm sm:text-base text-slate-600">
        <p>
          Вы удобно располагаетесь, расслабляетесь и спокойно дышите. Сеанс проходит
          без боли, уколов, нагрева или давления.
        </p>
        <p>Во время процедуры:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>не нужно ничего делать;</li>
          <li>можно закрыть глаза, отдыхать, медитировать;</li>
          <li>организм сам включает процессы восстановления.</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Что я могу почувствовать во время сеанса?',
    icon: <MoonStar className="w-5 h-5 text-violet-500" />,
    answer: (
      <div className="space-y-2 text-sm sm:text-base text-slate-600">
        <p>Ощущения индивидуальны, чаще всего отмечают:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>глубокое расслабление и лёгкость в теле;</li>
          <li>спокойствие и ясность в голове;</li>
          <li>лёгкое тепло или прохладу;</li>
          <li>сонливость или, наоборот, прилив энергии.</li>
        </ul>
        <p>Все эти состояния — нормальная реакция организма.</p>
      </div>
    ),
  },
  {
    question: 'Какой эффект после сеанса и сколько сеансов нужно?',
    icon: <MoonStar className="w-5 h-5 text-pink-500" />,
    answer: (
      <div className="space-y-2 text-sm sm:text-base text-slate-600">
        <p>После сеанса многие отмечают:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>улучшение сна и более ровное настроение;</li>
          <li>уменьшение усталости;</li>
          <li>свежее и сияющее лицо;</li>
          <li>ощущение «перезагрузки».</li>
        </ul>
        <p>
          Один сеанс длится около <span className="font-semibold">30 минут</span>.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>для устойчивого результата — курс от 10 сеансов;</li>
          <li>для поддержания — 2–3 раза в неделю после курса.</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Есть ли противопоказания?',
    icon: <ShieldCheck className="w-5 h-5 text-rose-500" />,
    answer: (
      <div className="space-y-2 text-sm sm:text-base text-slate-600">
        <p>
          Сеанс AIR VIBE — мягкая и безопасная wellness-процедура, но есть
          противопоказания:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>кардиостимулятор или металлические пластины в теле;</li>
          <li>онкологические заболевания;</li>
          <li>беременность и грудное вскармливание до 6 месяцев;</li>
          <li>психические заболевания (например, шизофрения);</li>
          <li>обострение хронических заболеваний;</li>
          <li>высокая температура тела.</li>
        </ul>
        <p>
          При серьёзных диагнозах обязательно проконсультируйтесь с лечащим врачом.
        </p>
      </div>
    ),
  },
  {
    question: 'Можно ли сочетать AIR VIBE с другими процедурами?',
    icon: <Info className="w-5 h-5 text-sky-500" />,
    answer: (
      <div className="space-y-2 text-sm sm:text-base text-slate-600">
        <p>Да, сеанс хорошо сочетается с:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>уходами за кожей и массажем;</li>
          <li>SPA-процедурами;</li>
          <li>периодами восстановления после стресса и болезней.</li>
        </ul>
        <p>Он усиливает ощущение расслабления и восстановления.</p>
      </div>
    ),
  },
  {
    question: 'Нужно ли готовиться и когда лучше приходить?',
    icon: <HelpCircle className="w-5 h-5 text-teal-500" />,
    answer: (
      <div className="space-y-2 text-sm sm:text-base text-slate-600">
        <p>Специальная подготовка не требуется.</p>
        <p>Рекомендуем:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>приходить в комфортной одежде;</li>
          <li>после сеанса не спешить и позволить себе отдых;</li>
          <li>пить воду.</li>
        </ul>
        <p>
          Сеансы можно делать и утром, и вечером: утром — для энергии и ясности,
          вечером — для расслабления и глубокого сна.
        </p>
      </div>
    ),
  },
];

export function FAQSection() {
  // ВСЁ ЗАКРЫТО ПО УМОЛЧАНИЮ
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-16 md:py-24 bg-gradient-to-b from-[#F4F2FB] via-white to-[#F8FBFF]"
    >
      <div className="max-w-5xl mx-auto px-4">
        <FadeIn>
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Ответы на частые вопросы
          </h2>
          <p className="text-center text-sm sm:text-base text-slate-500 mb-8 md:mb-10 max-w-2xl mx-auto">
            Всё, что вы хотели узнать о сеансе AIR VIBE: ощущения, эффект, безопасность и
            рекомендации по курсу.
          </p>
        </FadeIn>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <FadeIn key={item.question} delay={index * 40}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left rounded-2xl bg-white/90 border border-slate-100 shadow-sm hover:shadow-md transition-shadow px-4 sm:px-6 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {item.icon && (
                        <div className="flex items-center justify-center rounded-xl bg-slate-50 w-9 h-9">
                          {item.icon}
                        </div>
                      )}
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-slate-900">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  <div
                    className={`mt-3 grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-1 border-t border-slate-100 mt-2">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </button>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={FAQ_ITEMS.length * 40 + 80}>
          <div className="mt-8 md:mt-10 text-center text-xs sm:text-sm text-slate-500">
            Сеанс AIR VIBE — это отдых для нервной системы, поддержка энергии и мягкая забота о себе
            без стресса.
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
