import { Clock, Instagram, MapPin, Phone} from 'lucide-react';

type SiteFooterProps = {
  onBook: () => void;
};

export function SiteFooter({ onBook }: SiteFooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200 pt-10 md:pt-14 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-8 md:gap-10 lg:gap-12 mb-8 md:mb-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Лого + описание */}
          <div>
            <div className="flex items-center">
              <img
                src="/logo.png"              // твой новый логотип с текстом
                alt="AIR VIBE Shymkent"
                className="h-8 md:h-10 w-auto"
              />
            </div>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs">
              Инновационная wellness & beauty студия в Шымкенте. 
              Новый способ выглядеть свежо каждый день.
            </p>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 md:mb-4">Контакты</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-[1px]" />
                <span>г. Шымкент</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+7 (702) 168-61-76</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} />
                <span>Пн–Сб: 09:00 – 20:00</span>
              </li>
            </ul>
          </div>

          {/* Соцсети */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 md:mb-4">Мы в соцсетях</h4>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600 hover:text-pink-600 transition"
            >
              <Instagram className="w-4 h-4" /> @gulnara_rahym
            </a>
          </div>

          {/* Кнопка записи */}
          <div className="flex items-start md:items-center lg:items-start">
            <button
              onClick={onBook}
              className="w-full bg-[#3D3440] text-white py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm hover:bg-slate-800 transition"
            >
              Записаться
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5 md:pt-6 text-center text-[10px] sm:text-xs text-slate-400 leading-relaxed">
          © 2025 Air Vibe. Все права защищены. <br />
          Сайт разработан для продвижения услуг косметологии в Шымкенте.
        </div>
      </div>
    </footer>
  );
}
