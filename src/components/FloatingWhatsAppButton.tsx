import type { FC } from 'react';
import { MessageCircle } from 'lucide-react';

type FloatingWhatsAppButtonProps = {
  /** телефон в формате для wa.me — без плюса и пробелов */
  phone?: string;
};

export const FloatingWhatsAppButton: FC<FloatingWhatsAppButtonProps> = ({
  phone = '77021686176', // +77021686176
}) => {
  const message = encodeURIComponent(
    'Здравствуйте! Хочу записаться на пробный сеанс AIR VIBE.',
  );
  const link = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-[70] group"
    >
      <div className="relative flex items-center gap-2 rounded-full bg-[#25D366] px-3.5 py-2 shadow-lg border border-emerald-200 neon-whatsapp">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>

        <div className="pr-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
            WhatsApp
          </div>
          <div className="text-xs font-medium text-white leading-tight">
            Написать администратору
          </div>
        </div>
      </div>
    </a>
  );
};
