// src/components/admin/AdminPanel.tsx

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Phone,
  Send,
  User,
  X,
} from 'lucide-react';
import type { Booking, BookingStatus, ScheduleConfig } from '../../types';
import { SERVICES } from '../../constants';

type AdminPanelProps = {
  onLogout: () => void;
};

// --------- утилиты форматирования ---------

const formatDateRu = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const formatTime = (time: string) => time.slice(0, 5);

const STATUS_LABEL: Record<BookingStatus, string> = {
  Pending: 'Ожидает',
  Paid: 'Забронировано',
  Confirmed: 'Подтверждён',
  Canceled: 'Отменено',
  Completed: 'Завершено',
};

const STATUS_BADGE: Record<BookingStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Paid: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  Confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Canceled: 'bg-rose-50 text-rose-700 border border-rose-200',
  Completed: 'bg-slate-50 text-slate-700 border border-slate-200',
};

// те же цвета используем в расписании
const STATUS_SCHEDULE: Record<BookingStatus, string> = {
  Pending: 'bg-amber-100/80 border-amber-200 text-amber-900',
  Paid: 'bg-indigo-100/80 border-indigo-200 text-indigo-900',
  Confirmed: 'bg-emerald-100/80 border-emerald-200 text-emerald-900',
  Canceled: 'bg-rose-100/80 border-rose-200 text-rose-900 line-through opacity-70',
  Completed: 'bg-slate-100/80 border-slate-200 text-slate-900',
};

const WEEKDAY_LABELS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

type AdminTab = 'schedule' | 'bookings' | 'settings' | 'packages';
type BookingFilter = 'Pending' | 'Paid' | 'Confirmed' | 'Completed' | 'Canceled' | 'All';

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('schedule');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<BookingFilter>('Paid');

  // ---- загрузка бронирований ----
  const loadBookings = async () => {
    try {
      setBookingsLoading(true);
      setBookingsError(null);
      const res = await fetch('https://air-vibe-xpiw.onrender.com/api/bookings');
      if (!res.ok) throw new Error('Ошибка при загрузке бронирований');
      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (e) {
      console.error(e);
      setBookingsError('Не удалось загрузить бронирования');
    } finally {
      setBookingsLoading(false);
    }
  };

  // ---- загрузка расписания ----
  const loadScheduleConfig = async () => {
    try {
      setScheduleLoading(true);
      setScheduleError(null);
      const res = await fetch('https://air-vibe-xpiw.onrender.com/api/schedule');
      if (!res.ok) throw new Error('Ошибка при загрузке расписания');
      const data: ScheduleConfig = await res.json();
      setScheduleConfig(data);
    } catch (e) {
      console.error(e);
      setScheduleError('Не удалось загрузить настройки расписания');
    } finally {
      setScheduleLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
    void loadScheduleConfig();
  }, []);

  // ---- смена статуса брони ----
  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    try {
      const res = await fetch(`https://air-vibe-xpiw.onrender.com/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Ошибка при обновлении статуса');
      const updated: Booking = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (e) {
      console.error(e);
      alert('Не удалось обновить статус. Попробуйте ещё раз.');
    }
  };

  // ---- WhatsApp ----
  const openWhatsApp = (booking: Booking) => {
    const phoneDigits = booking.clientPhone.replace(/\D/g, '');
    if (!phoneDigits) {
      alert('У клиента не указан телефон');
      return;
    }

    const text = `Спасибо, ${booking.clientName}, что выбрали AIR VIBE. Ваша бронь подтверждена на ${formatDateRu(
      booking.date,
    )} в ${formatTime(booking.time)}. Ждём вас в студии!`;

    const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // ---- фильтруем бронирования для таблицы ----
  const filteredBookings = useMemo(() => {
    if (filterStatus === 'All') return bookings;
    return bookings.filter((b) => b.status === filterStatus);
  }, [bookings, filterStatus]);

  // ---- вкладка "Настройки расписания" ----
  const handleScheduleDayChange = (
    dayKey: keyof ScheduleConfig,
    patch: Partial<ScheduleConfig[keyof ScheduleConfig]>,
  ) => {
    setScheduleConfig((prev) =>
      prev ? { ...prev, [dayKey]: { ...prev[dayKey], ...patch } } : prev,
    );
  };

  const saveScheduleConfig = async () => {
    if (!scheduleConfig) return;
    try {
      const res = await fetch('https://air-vibe-xpiw.onrender.com/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleConfig),
      });
      if (!res.ok) throw new Error('Ошибка при сохранении расписания');
      const data: ScheduleConfig = await res.json();
      setScheduleConfig(data);
      alert('Расписание сохранено');
    } catch (e) {
      console.error(e);
      alert('Не удалось сохранить расписание');
    }
  };

  // ---- вкладка "Запись клиентов" (по пакетам) ----
  const [packageClientId, setPackageClientId] = useState<string>('new');
  const [packageClientName, setPackageClientName] = useState('');
  const [packageClientPhone, setPackageClientPhone] = useState('');
  const [packageServiceId, setPackageServiceId] = useState<string>(SERVICES[1].id);
  const [packagePrice, setPackagePrice] = useState<number>(SERVICES[1].price);
  const [packageSlots, setPackageSlots] = useState<{ date: string; time: string }[]>(
    Array.from({ length: 10 }, () => ({ date: '', time: '' })),
  );
  const [packageCreating, setPackageCreating] = useState(false);

  const existingClients = useMemo(() => {
    const map = new Map<string, { name: string; phone: string }>();
    bookings.forEach((b) => {
      if (!map.has(b.clientPhone)) {
        map.set(b.clientPhone, { name: b.clientName, phone: b.clientPhone });
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  const handleSelectExistingClient = (phone: string) => {
    if (phone === 'new') {
      setPackageClientId('new');
      setPackageClientName('');
      setPackageClientPhone('');
      return;
    }
    const found = existingClients.find((c) => c.phone === phone);
    if (found) {
      setPackageClientId(phone);
      setPackageClientName(found.name);
      setPackageClientPhone(found.phone);
    }
  };

  const handleChangeSlot = (index: number, field: 'date' | 'time', value: string) => {
    setPackageSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    );
  };

  const handleCreatePackageBookings = async () => {
    const trimmedName = packageClientName.trim();
    const trimmedPhone = packageClientPhone.trim();

    if (!trimmedName || !trimmedPhone) {
      alert('Введите имя и телефон клиента');
      return;
    }

    const usefulSlots = packageSlots.filter((s) => s.date && s.time);
    if (!usefulSlots.length) {
      alert('Укажите хотя бы одну дату и время');
      return;
    }

    const service = SERVICES.find((s) => s.id === packageServiceId) ?? SERVICES[1];

    setPackageCreating(true);
    try {
      for (const slot of usefulSlots) {
        const body = {
          serviceId: service.id,
          serviceName: service.name,
          price: packagePrice,
          date: slot.date,
          time: slot.time,
          clientName: trimmedName,
          clientPhone: trimmedPhone,
        };

        const res = await fetch('https://air-vibe-xpiw.onrender.com/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          console.error(await res.text());
        }
      }

      await loadBookings();
      alert('Записи по пакету созданы');
    } catch (e) {
      console.error(e);
      alert('Не удалось создать записи по пакету');
    } finally {
      setPackageCreating(false);
    }
  };

  // ---------------- РЕНДЕР ----------------

  return (
    <div className="min-h-screen bg-[#ECE7F0]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Админ-панель</div>
            <div className="text-xs text-slate-500">Управление бронированиями AIR VIBE</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
        >
          <X className="w-3 h-3" />
          Выйти
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        {/* TABBAR */}
        <div className="mb-6 flex rounded-full bg-white p-1 shadow-sm">
          {[
            { id: 'schedule', label: 'Расписание' },
            { id: 'bookings', label: 'Бронирования' },
            { id: 'settings', label: 'Настройки расписания' },
            { id: 'packages', label: 'Запись клиентов' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex-1 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {activeTab === 'schedule' && (
          <ScheduleWeekView bookings={bookings} scheduleConfig={scheduleConfig} />
        )}

        {activeTab === 'bookings' && (
          <BookingsTable
            bookings={filteredBookings}
            allBookings={bookings}
            loading={bookingsLoading}
            error={bookingsError}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onStatusChange={handleStatusChange}
            onReload={loadBookings}
            onWhatsApp={openWhatsApp}
          />
        )}

        {activeTab === 'settings' && (
          <ScheduleSettingsTab
            scheduleConfig={scheduleConfig}
            loading={scheduleLoading}
            error={scheduleError}
            onChangeDay={handleScheduleDayChange}
            onSave={saveScheduleConfig}
          />
        )}

        {activeTab === 'packages' && (
          <PackagesTab
            existingClients={existingClients}
            packageClientId={packageClientId}
            packageClientName={packageClientName}
            packageClientPhone={packageClientPhone}
            packageServiceId={packageServiceId}
            packagePrice={packagePrice}
            packageSlots={packageSlots}
            packageCreating={packageCreating}
            setPackageClientName={setPackageClientName}
            setPackageClientPhone={setPackageClientPhone}
            setPackageServiceId={setPackageServiceId}
            setPackagePrice={setPackagePrice}
            onSelectExistingClient={handleSelectExistingClient}
            onChangeSlot={handleChangeSlot}
            onCreateBookings={handleCreatePackageBookings}
          />
        )}
      </main>
    </div>
  );
}

// ---------------- ВКЛАДКА «РАСПИСАНИЕ» (НЕДЕЛЯ) ----------------

type ScheduleWeekViewProps = {
  bookings: Booking[];
  scheduleConfig: ScheduleConfig | null;
};

const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 вс, 1 пн...
  const diff = (day + 6) % 7; // сколько дней откатить до понедельника
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatWeekRangeLabel = (weekStart: Date) => {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);

  const startDay = weekStart.getDate();
  const endDay = end.getDate();

  const monthLabel = weekStart.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  return `${startDay}–${endDay} ${monthLabel}`;
};

const ScheduleWeekView = ({ bookings, scheduleConfig }: ScheduleWeekViewProps) => {
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));

  // диапазон часов по расписанию
  const [startHour, endHour] = useMemo(() => {
    if (!scheduleConfig) return [10, 20];

    let min = 23;
    let max = 0;
    Object.values(scheduleConfig).forEach((cfg) => {
      if (!cfg.enabled) return;
      const [sh] = cfg.start.split(':').map(Number);
      const [eh] = cfg.end.split(':').map(Number);
      if (sh < min) min = sh;
      if (eh > max) max = eh;
    });

    if (min === 23 && max === 0) return [10, 20];
    return [min, max];
  }, [scheduleConfig]);

  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = startHour; h <= endHour; h += 1) arr.push(h);
    return arr;
  }, [startHour, endHour]);

  const days = useMemo(() => {
    const res: { iso: string; label: string; weekdayLabel: string }[] = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const dayNum = d.getDate().toString().padStart(2, '0');
      res.push({
        iso,
        label: dayNum,
        weekdayLabel: WEEKDAY_LABELS[i],
      });
    }
    return res;
  }, [weekStart]);

  const weekBookings = useMemo(() => {
    const start = weekStart.getTime();
    const end = new Date(weekStart).setDate(weekStart.getDate() + 7);
    return bookings.filter((b) => {
      const d = new Date(b.date + 'T00:00:00').getTime();
      return d >= start && d < end;
    });
  }, [bookings, weekStart]);

  const bookingsMap = useMemo(() => {
    const map = new Map<string, Booking[]>();
    weekBookings.forEach((b) => {
      const hour = parseInt(b.time.slice(0, 2), 10);
      const key = `${b.date}-${hour}`;
      const arr = map.get(key) ?? [];
      arr.push(b);
      map.set(key, arr);
    });
    return map;
  }, [weekBookings]);

  const handlePrevWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 7);
      return getMonday(d);
    });
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 7);
      return getMonday(d);
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify_between justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Расписание по неделям
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Вид как у календаря: по дням и часам. Цветом отмечены разные статусы записей.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Предыдущая
          </button>
          <div className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs sm:text-sm font-medium">
            {formatWeekRangeLabel(weekStart)}
          </div>
          <button
            type="button"
            onClick={handleNextWeek}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            Следующая
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {/* заголовок дней недели */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] border-b border-slate-200 bg-slate-50/80">
          <div className="h-10" />
          {days.map((d) => (
            <div
              key={d.iso}
              className="h-10 flex flex-col items-center justify-center border-l border-slate-200 first:border-l-0"
            >
              <div className="text-[10px] uppercase text-slate-400">{d.weekdayLabel}</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800">{d.label}</div>
            </div>
          ))}
        </div>

        {/* сетка по часам */}
        <div className="max-h-[540px] overflow-y-auto">
          {hours.map((h) => (
            <div
              key={h}
              className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] border-t border-slate-100"
            >
              {/* колонка времени */}
              <div className="border-r border-slate-100 text-[10px] sm:text-xs text-slate-400 flex items-start justify-end pr-2 pt-1.5">
                {String(h).padStart(2, '0')}:00
              </div>

              {/* 7 дней */}
              {days.map((d) => {
                const key = `${d.iso}-${h}`;
                const items = bookingsMap.get(key) ?? [];
                return (
                  <div
                    key={d.iso}
                    className="border-r border-slate-50 min-h-11 sm:min-h-[52px] px-1.5 py-1.5"
                  >
                    {items.map((b) => (
                      <div
                        key={b.id}
                        className={`mb-1 rounded-lg border text-[10px] sm:text-xs px-1.5 py-1 leading-tight ${STATUS_SCHEDULE[b.status]}`}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="font-semibold">
                            {formatTime(b.time)} · {b.serviceName}
                          </span>
                        </div>
                        <div className="mt-0.5 truncate">{b.clientName}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-indigo-300" />
          Забронировано
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-emerald-300" />
          Подтверждено
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          Завершено
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          Ожидает
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-rose-300" />
          Отменено
        </span>
      </div>
    </section>
  );
};

// ---------------- ВКЛАДКА «БРОНИРОВАНИЯ» ----------------

type BookingsTableProps = {
  bookings: Booking[];
  allBookings: Booking[];
  loading: boolean;
  error: string | null;
  filterStatus: BookingFilter;
  setFilterStatus: (f: BookingFilter) => void;
  onStatusChange: (id: string, status: BookingStatus) => void;
  onReload: () => void;
  onWhatsApp: (b: Booking) => void;
};

const BookingsTable = ({
  bookings,
  allBookings,
  loading,
  error,
  filterStatus,
  setFilterStatus,
  onStatusChange,
  onReload,
  onWhatsApp,
}: BookingsTableProps) => {
  const countsByStatus = useMemo(() => {
    const counts: Record<BookingFilter, number> = {
      Pending: 0,
      Paid: 0,
      Confirmed: 0,
      Completed: 0,
      Canceled: 0,
      All: allBookings.length,
    };
    allBookings.forEach((b) => {
      counts[b.status] += 1;
    });
    return counts;
  }, [allBookings]);

  const tabs: { id: BookingFilter; label: string }[] = [
    { id: 'Pending', label: 'Ожидает' },
    { id: 'Paid', label: 'Забронировано' },
    { id: 'Confirmed', label: 'Подтверждено' },
    { id: 'Completed', label: 'Завершено' },
    { id: 'Canceled', label: 'Отменено' },
    { id: 'All', label: 'Все' },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Бронирования</span>
        </div>
        <button
          type="button"
          onClick={onReload}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
        >
          Обновить
        </button>
      </div>

      {/* фильтр по статусам */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterStatus(tab.id)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filterStatus === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
            <span className="min-w-[1.4rem] rounded-full bg-slate-900/5 px-2 py-px text-[10px] text-slate-500">
              {countsByStatus[tab.id]}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-[1.3fr_1.3fr_1.2fr_1.1fr_1.1fr] border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500">
          <div className="px-4 py-2.5">Дата &amp; время</div>
          <div className="px-4 py-2.5">Клиент</div>
          <div className="px-4 py-2.5">Услуга</div>
          <div className="px-4 py-2.5">Статус</div>
          <div className="px-4 py-2.5">Действия</div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-sm text-slate-500">Загрузка бронирований…</div>
        ) : error ? (
          <div className="p-6 text-center text-sm text-rose-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            Нет броней с таким статусом.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-[1.3fr_1.3fr_1.2fr_1.1fr_1.1fr] items-center px-4 py-3"
              >
                <div className="pr-3">
                  <div className="font-medium text-slate-900">{formatDateRu(b.date)}</div>
                  <div className="mt-0.5 flex items-center text-[11px] text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(b.time)}
                  </div>
                </div>

                <div className="pr-3">
                  <div className="font-medium text-slate-900">{b.clientName}</div>
                  <div className="mt-0.5 flex items-center text-[11px] text-slate-500">
                    <Phone className="w-3 h-3 mr-1" />
                    {b.clientPhone}
                  </div>
                </div>

                <div className="pr-3">
                  <div className="font-medium text-slate-900">{b.serviceName}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    {b.price.toLocaleString('ru-RU')} ₸
                  </div>
                </div>

                <div className="pr-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_BADGE[b.status]}`}
                  >
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={b.status}
                    onChange={(e) => onStatusChange(b.id, e.target.value as BookingStatus)}
                    className="h-8 rounded-full border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Pending">Ожидает</option>
                    <option value="Paid">Забронировано</option>
                    <option value="Confirmed">Подтверждено</option>
                    <option value="Completed">Завершено</option>
                    <option value="Canceled">Отменено</option>
                  </select>

                  {b.status === 'Paid' && (
                    <button
                      type="button"
                      onClick={() => onWhatsApp(b)}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-600"
                    >
                      <Send className="w-3 h-3" />
                      WhatsApp
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ---------------- ВКЛАДКА «НАСТРОЙКИ РАСПИСАНИЯ» ----------------

type ScheduleSettingsTabProps = {
  scheduleConfig: ScheduleConfig | null;
  loading: boolean;
  error: string | null;
  onChangeDay: (
    day: keyof ScheduleConfig,
    patch: Partial<ScheduleConfig[keyof ScheduleConfig]>,
  ) => void;
  onSave: () => void;
};

const DAY_LABELS: Record<keyof ScheduleConfig, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье',
};

const ScheduleSettingsTab = ({
  scheduleConfig,
  loading,
  error,
  onChangeDay,
  onSave,
}: ScheduleSettingsTabProps) => (
  <section className="space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Настройки расписания</h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-500">
        Управляйте рабочими днями и часами. Эти данные используются и для онлайн-записи, и для
        просмотра расписания.
      </p>
    </div>

    {loading ? (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
        Загрузка настроек…
      </div>
    ) : error ? (
      <div className="rounded-2xl bg-white p-6 text-sm text-rose-600 shadow-sm">{error}</div>
    ) : !scheduleConfig ? (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
        Нет данных по расписанию.
      </div>
    ) : (
      <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-200 space-y-3">
        {(Object.keys(scheduleConfig) as (keyof ScheduleConfig)[]).map((dayKey) => {
          const cfg = scheduleConfig[dayKey];
          return (
            <div
              key={dayKey}
              className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={cfg.enabled}
                    onChange={(e) => onChangeDay(dayKey, { enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {DAY_LABELS[dayKey]}
                </label>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <span className="text-[11px] uppercase tracking-wide text-slate-400">
                  Рабочее время
                </span>
                <input
                  type="time"
                  value={cfg.start}
                  onChange={(e) => onChangeDay(dayKey, { start: e.target.value })}
                  disabled={!cfg.enabled}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                />
                <span className="text-slate-400">—</span>
                <input
                  type="time"
                  value={cfg.end}
                  onChange={(e) => onChangeDay(dayKey, { end: e.target.value })}
                  disabled={!cfg.enabled}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                />
              </div>
            </div>
          );
        })}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onSave}
            className="rounded-full bg-indigo-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-indigo-700"
          >
            Сохранить расписание
          </button>
        </div>
      </div>
    )}
  </section>
);

// ---------------- ВКЛАДКА «ЗАПИСЬ КЛИЕНТОВ» ----------------

type PackagesTabProps = {
  existingClients: { name: string; phone: string }[];
  packageClientId: string;
  packageClientName: string;
  packageClientPhone: string;
  packageServiceId: string;
  packagePrice: number;
  packageSlots: { date: string; time: string }[];
  packageCreating: boolean;
  setPackageClientName: (v: string) => void;
  setPackageClientPhone: (v: string) => void;
  setPackageServiceId: (v: string) => void;
  setPackagePrice: (v: number) => void;
  onSelectExistingClient: (phone: string) => void;
  onChangeSlot: (index: number, field: 'date' | 'time', value: string) => void;
  onCreateBookings: () => void;
};

const PackagesTab = ({
  existingClients,
  packageClientId,
  packageClientName,
  packageClientPhone,
  packageServiceId,
  packagePrice,
  packageSlots,
  packageCreating,
  setPackageClientName,
  setPackageClientPhone,
  setPackageServiceId,
  setPackagePrice,
  onSelectExistingClient,
  onChangeSlot,
  onCreateBookings,
}: PackagesTabProps) => (
  <section className="space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Запись клиентов по пакетам</h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-500">
        Используйте этот блок, чтобы заранее забить все даты для клиентов с пакетами (10 сеансов и
        т.п.). Эти слоты будут считаться занятыми для онлайн-записи.
      </p>
    </div>

    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Клиент
          </label>
          <select
            value={packageClientId}
            onChange={(e) => onSelectExistingClient(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="new">Новый клиент</option>
            {existingClients.map((c) => (
              <option key={c.phone} value={c.phone}>
                {c.name} · {c.phone}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Имя клиента"
            value={packageClientName}
            onChange={(e) => setPackageClientName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="tel"
            placeholder="Телефон клиента"
            value={packageClientPhone}
            onChange={(e) => setPackageClientPhone(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Пакет
          </label>
          <select
            value={packageServiceId}
            onChange={(e) => {
              const id = e.target.value;
              setPackageServiceId(id);
              const service = SERVICES.find((s) => s.id === id);
              if (service) setPackagePrice(service.price);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {SERVICES.slice(1).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={packagePrice}
              onChange={(e) => setPackagePrice(Number(e.target.value) || 0)}
              className="w-32 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-xs sm:text-sm text-slate-500">₸ за сеанс</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Даты и время сеансов
          </span>
          <span className="text-[11px] text-slate-400">
            Заполните 10 ячеек (или меньше, если пакет меньше)
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {packageSlots.map((slot, idx) => (
            <div
              key={`${idx}-${slot.date}-${slot.time}`}
              className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2"
            >
              <span className="text-[11px] text-slate-400 min-w-[18px]">{idx + 1}.</span>
              <input
                type="date"
                value={slot.date}
                onChange={(e) => onChangeSlot(idx, 'date', e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] sm:text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="time"
                value={slot.time}
                onChange={(e) => onChangeSlot(idx, 'time', e.target.value)}
                className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] sm:text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={packageCreating}
          onClick={onCreateBookings}
          className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {packageCreating ? 'Создание записей…' : 'Создать записи'}
        </button>
      </div>
    </div>
  </section>
);
