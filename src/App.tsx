import { useEffect, useState } from 'react';
import { Menu, Phone, User, X } from 'lucide-react';

import type { View } from './types';
import { SERVICES } from './constants';
import { initializeFirebase } from './firebase';

import { SEO } from './components/SEO';
import { BookingModal } from './components/booking/BookingModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import { StickyPromoTimer } from './components/StickyPromoTimer';

import HeroSection from './sections/HeroSection';
import { ProblemsSection } from './sections/ProblemsSection';
import ComparisonSection from './sections/ComparisonSection';
import { TechnologySection } from './sections/TechnologySection';
import { DoubleImpactSection } from './sections/DoubleImpactSection';
import { GlowCtaSection } from './sections/GlowCtaSection';
import { ResultsSection } from './sections/ResultsSection';
import { PricingSection } from './sections/PricingSection';
import { SiteFooter } from './sections/SiteFooter';
import ThirtyMinutesSection from './sections/ThirtyMinutesSection';
import SoftPriceCtaSection from './sections/SoftPriceCtaSection';
import { VideoReviewsSection } from './sections/VideoReviewsSection';
import { FAQSection } from './sections/FAQSection';

import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { isAdminAuthed, setAdminAuthed } from './auth/adminAuth';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');

  // id услуги, которая должна быть предвыбранной в модалке
  const [initialServiceId, setInitialServiceId] = useState<string | null>(null);

  // Инициализация Firebase и слушатель скролла
  useEffect(() => {
    initializeFirebase();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Синхронизация view <-> URL (без react-router)
  useEffect(() => {
    const applyFromPath = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        // /admin/login всегда показывает логин, даже если пользователь ещё не вошёл
        if (path === '/admin/login') {
          setCurrentView(isAdminAuthed() ? 'admin' : 'admin_login');
          return;
        }
        setCurrentView(isAdminAuthed() ? 'admin' : 'admin_login');
        return;
      }
      setCurrentView('home');
    };

    applyFromPath();
    const onPop = () => applyFromPath();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const desiredPath =
      currentView === 'home' ? '/' : currentView === 'admin' ? '/admin' : '/admin/login';
    if (window.location.pathname !== desiredPath) {
      window.history.pushState({}, '', desiredPath);
    }
  }, [currentView]);

  // открыть модалку; если передали serviceId — выбираем его, иначе по умолчанию пробный сеанс
  const openBooking = (serviceId?: string) => {
    const fallbackTrialId = SERVICES[0]?.id; // пробный сеанс 5 000 ₸ (первый в списке)
    setInitialServiceId(serviceId ?? fallbackTrialId ?? null);
    setIsModalOpen(true);
  };

  const closeBooking = () => {
    setIsModalOpen(false);
  };

  const goToAdmin = () => setCurrentView(isAdminAuthed() ? 'admin' : 'admin_login');
  const goToHome = () => setCurrentView('home');
  const logoutAdmin = () => {
    setAdminAuthed(false);
    setCurrentView('home');
  };

  // --- ADMIN LOGIN VIEW ---
  if (currentView === 'admin_login') {
    return (
      <>
        <SEO />
        <AdminLogin onSuccess={() => setCurrentView('admin')} onBack={goToHome} />
      </>
    );
  }

  // --- ADMIN VIEW ---
  if (currentView === 'admin') {
    if (!isAdminAuthed()) {
      return (
        <>
          <SEO />
          <AdminLogin onSuccess={() => setCurrentView('admin')} onBack={goToHome} />
        </>
      );
    }
    return (
      <div className="min-h-screen bg-[#ECE7F0] font-sans">
        <SEO />
        <button
          onClick={goToHome}
          className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg text-slate-600 hover:bg-slate-100 transition"
        >
          <span className="sr-only">Назад на главную</span>
          <X className="w-5 h-5 rotate-180" />
        </button>
        <AdminPanel onLogout={logoutAdmin} />
      </div>
    );
  }

  // --- HOME VIEW ---
  return (
    <div className="min-h-screen bg-[#DCE7F8] font-sans text-[#363037] selection:bg-[#F3E4EC] overflow-x-hidden">
      <SEO />

      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/logo.png"              // твой новый логотип с текстом
              alt="AIR VIBE Shymkent"
              className="h-8 md:h-10 w-auto"
            />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#problems" className="hover:text-blue-600 transition">
              Проблемы
            </a>
            <a href="#technology" className="hover:text-blue-600 transition">
              Технология
            </a>
            <a href="#results" className="hover:text-blue-600 transition">
              Результаты
            </a>
            <a href="#prices" className="hover:text-blue-600 transition">
              Цены
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={goToAdmin}
              className="hidden md:flex items-center gap-2 text-slate-600 hover:text-blue-600 transition text-sm"
            >
              <User size={18} /> Админка
            </button>
            <button
              onClick={() => openBooking()} // по умолчанию откроется пробный сеанс
              className="bg-[#3D3440] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#8BA9F5] transition-colors shadow-lg shadow-slate-200"
            >
              Записаться
            </button>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 text-slate-600"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 animate-in slide-in-from-right duration-200">
          <div className="flex flex-col gap-6 text-xl font-medium text-slate-800">
            <a href="#problems" onClick={() => setIsMenuOpen(false)}>
              Проблемы
            </a>
            <a href="#technology" onClick={() => setIsMenuOpen(false)}>
              Технология
            </a>
            <a href="#results" onClick={() => setIsMenuOpen(false)}>
              Результаты
            </a>
            <a href="#prices" onClick={() => setIsMenuOpen(false)}>
              Цены
            </a>
            <hr className="border-slate-100" />
            <button
              onClick={() => {
                goToAdmin();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 text-slate-600"
            >
              <User /> Админка
            </button>
            <a href="tel:+77001234567" className="flex items-center gap-3 text-blue-600">
              <Phone /> +7 (700) 123-45-67
            </a>
          </div>
        </div>
      )}

      {/* СЕКЦИИ — порядок под конверсию */}
      <HeroSection onBook={() => openBooking()} />

      {/* 1. Боль и зачем вообще процедура */}
      <ProblemsSection />

      {/* 2. Объяснение технологии и как именно работает */}
      <TechnologySection />
      <DoubleImpactSection />

      {/* 3. Быстрый эффект за 30 минут */}
      <ThirtyMinutesSection />

      {/* 4. Визуальные результаты + видео-отзывы */}
      <ResultsSection />
      <VideoReviewsSection />

      {/* 5. Мягкий оффер на пробный сеанс */}
      <SoftPriceCtaSection onBook={openBooking} />

      {/* 6. Почему лучше, чем другие методы */}
      <ComparisonSection />

      {/* 7. Пакеты и цены */}
      <PricingSection onBook={openBooking} />

      <FAQSection />

      {/* 8. Финальный эмоциональный призыв */}
      <GlowCtaSection onBook={openBooking} />

      <SiteFooter onBook={() => openBooking()} />

      <FloatingWhatsAppButton />
      <StickyPromoTimer onClickBook={() => openBooking()} />

      <BookingModal
        isOpen={isModalOpen}
        onClose={closeBooking}
        services={SERVICES}
        // если ничего не выбрали — по умолчанию пробный сеанс
        initialServiceId={initialServiceId ?? SERVICES[0]?.id}
      />
    </div>
  );
}
