import { Check, Star } from 'lucide-react';
import { SERVICES } from '../constants';

type PricingSectionProps = {
  // передаём id услуги, чтобы модалка могла открыть нужный тариф
  onBook: (serviceId: string) => void;
};

export function PricingSection({ onBook }: PricingSectionProps) {
  // Предполагаем порядок в SERVICES:
  // 0 — ПРОБНЫЙ СЕАНС, 1 — BALANCE, 2 — BEAUTY, 3 — GLOW PRO
  const balance = SERVICES[1];
  const beauty = SERVICES[2];
  const glowPro = SERVICES[3];

  return (
    <section id="prices" className="py-14 md:py-20 bg-[#ECE7F0]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3 text-[#2D2528]">
          Курсы AIR VIBE
        </h2>
        <p className="text-center text-sm sm:text-base text-slate-500 mb-10 md:mb-14 max-w-2xl mx-auto">
          Курсы сеансов AIR VIBE — это красота, энергия и молодость в одном курсе. 
          Выберите формат под свои задачи: самочувствие, омоложение или максимальный вау-эффект.
        </p>

        {/* Сетка под 3 тарифа */}
        <div className="grid gap-6 md:gap-7 md:grid-cols-2 lg:grid-cols-3">
          {/* BALANCE — самочувствие */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              BALANCE — самочувствие
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 text-[#1E1820]">
              Курс внутреннего баланса и восстановления
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-3">
              10 дней • базовый курс самочувствия
            </p>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              {balance.price.toLocaleString('ru-RU')} ₸
            </div>

            <ul className="space-y-2.5 text-sm text-slate-700 mb-5 flex-1">
              <li className="flex gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Снижение стресса и тревожности, глубокое расслабление.</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Крепкий сон и восстановление нервной системы.</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Укрепление иммунитета и поддержка гормонального баланса.</span>
              </li>
            </ul>

            <p className="text-xs text-slate-500 mb-4">
              Подходит при хронической усталости, выгорании, тревожности, частых простудах
              и плохом сне. Идеален как первое знакомство с AIR VIBE.
            </p>

            <button
              onClick={() => onBook(balance.id)}
              className="w-full py-2.5 sm:py-3 border-2 border-slate-900 rounded-xl font-semibold text-sm hover:bg-[#3D3440] hover:text-white transition"
            >
              Выбрать BALANCE
            </button>
          </div>

          {/* BEAUTY — омоложение */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
              BEAUTY — омоложение
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 text-[#1E1820]">
              Чистая кожа, лифтинг и эффект «дорогого ухода»
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-3">
              10 дней • антиэйдж без уколов
            </p>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              {beauty.price.toLocaleString('ru-RU')} ₸
            </div>

            <ul className="space-y-2.5 text-sm text-slate-700 mb-5 flex-1">
              <li className="flex gap-2.5">
                <Check className="w-4 h-4 text-rose-500 mt-0.5" />
                <span>Лифтинг-эффект и сияние кожи без инъекций и боли.</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="w-4 h-4 text-rose-500 mt-0.5" />
                <span>Уменьшение покраснений, воспалений и сухости.</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="w-4 h-4 text-rose-500 mt-0.5" />
                <span>Ровный тон и более плотная, упругая кожа.</span>
              </li>
            </ul>

            <p className="text-xs text-slate-500 mb-4">
              Для тех, у кого тусклая кожа, возрастные изменения, розацеа, сухость
              и усталый вид лица.
            </p>

            <button
              onClick={() => onBook(beauty.id)}
              className="w-full py-2.5 sm:py-3 border-2 border-slate-900 rounded-xl font-semibold text-sm hover:bg-[#3D3440] hover:text-white transition"
            >
              Выбрать BEAUTY
            </button>
          </div>

          {/* GLOW PRO — максимальный вау-эффект */}
          <div className="bg-[#3D3440] text-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 border border-slate-800 shadow-xl flex flex-col relative md:-translate-y-1">
            <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl flex items-center gap-1">
              <Star className="w-3 h-3" />
              ХИТ КУРС
            </div>
            <div className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              GLOW PRO — максимальное сияние
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5">
              Максимальное сияние, энергия и эффект дорогого ухода
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-3">
              10 дней • полный курс
            </p>
            <div className="text-2xl sm:text-3xl font-extrabold mb-4">
              {glowPro.price.toLocaleString('ru-RU')} ₸
            </div>

            <ul className="space-y-2.5 text-sm text-slate-100 mb-5 flex-1">
              <li className="flex gap-2.5">
                <Check className="w-4 h-4 text-emerald-300 mt-0.5" />
                <span>Глубокое клеточное обновление и мощное сияние кожи.</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="w-4 h-4 text-emerald-300 mt-0.5" />
                <span>Уменьшение отёков и следов усталости, заметный лифтинг-эффект.</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="w-4 h-4 text-emerald-300 mt-0.5" />
                <span>Усиление энергии и тонуса всего организма.</span>
              </li>
            </ul>

            <p className="text-xs text-slate-300 mb-4">
              Для тех, кто хочет максимальный результат: важные события, свадьба, съёмка,
              отпуск — когда нужно выглядеть максимально свежо и дорого уже с 2–3 дня курса.
            </p>

            <button
              onClick={() => onBook(glowPro.id)}
              className="w-full py-2.5 sm:py-3 bg-rose-500 rounded-xl font-semibold text-sm hover:bg-rose-600 transition shadow-lg shadow-rose-900/40"
            >
              Выбрать GLOW PRO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
