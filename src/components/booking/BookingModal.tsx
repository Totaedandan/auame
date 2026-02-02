/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, Loader2, X } from 'lucide-react';
import type {
  Booking,
  ScheduleConfig,
  Service,
  Step,
  WeekdayKey,
} from '../../types';

// ---------- утилиты ----------

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const getWeekdayKeyFromDate = (dateString: string): WeekdayKey => {
  const d = new Date(dateString + 'T00:00:00');
  const day = d.getDay(); // 0 - воскресенье
  switch (day) {
    case 0:
      return 'sunday';
    case 1:
      return 'monday';
    case 2:
      return 'tuesday';
    case 3:
      return 'wednesday';
    case 4:
      return 'thursday';
    case 5:
      return 'friday';
    case 6:
      return 'saturday';
    default:
      return 'monday';
  }
};

const generateTimeSlots = (start: string, end: string, stepMinutes = 60): string[] => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  const result: string[] = [];
  for (let t = startMinutes; t + stepMinutes <= endMinutes; t += stepMinutes) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    result.push(`${hh}:${mm}`);
  }
  return result;
};

const getMonthLabel = (d: Date) =>
  d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

const startOfDay = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

// ---------- основной модал ----------

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  initialServiceId?: string | null; // добавлено
};

export const BookingModal = ({ isOpen, onClose, services, initialServiceId }: BookingModalProps) => {
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookingStatus, setBookingStatus] =
    useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // шаги, которые участвуют в прогресс-баре
  const stepsForProgress: Step[] = ['service', 'date', 'time', 'details', 'payment'];

  // загрузка расписания при открытии модалки
  useEffect(() => {
    if (!isOpen) return;

    setScheduleLoading(true);
    setScheduleError(null);

    const fetchSchedule = async () => {
      try {
        const res = await fetch('https://air-vibe-xpiw.onrender.com/api/schedule');
        if (!res.ok) throw new Error('Ошибка при загрузке расписания');
        const data: ScheduleConfig = await res.json();
        setScheduleConfig(data);
      } catch (e) {
        console.error(e);
        setScheduleError('Не удалось загрузить расписание. Попробуйте позже.');
      } finally {
        setScheduleLoading(false);
      }
    };

    void fetchSchedule();
  }, [isOpen]);

  // сброс состояния + выбор стартовой услуги
  useEffect(() => {
    if (!isOpen || !services.length) return;

    // 1) Выбираем, какая услуга должна быть подсвечена
    //   - если передан initialServiceId → ищем её
    //   - иначе пробный сеанс с id = 'trial'
    //   - если и его нет → берём первую из массива
    const initialService =
      (initialServiceId && services.find((s) => s.id === initialServiceId)) ||
      services.find((s) => s.id === 'trial') ||
      services[0];

    setSelectedService(initialService);
    setSelectedDate('');
    setSelectedTime('');
    setClientName('');
    setClientPhone('');
    setBookingStatus('idle');

    // 2) ВСЕГДА начинаем с шага выбора процедуры
    setStep('service');
  }, [isOpen, services, initialServiceId]);



  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('date');
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) {
      setBookingStatus('error');
      return;
    }

    setBookingStatus('loading');

    try {
      const response = await fetch('https://air-vibe-xpiw.onrender.com/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          price: selectedService.price,
          date: selectedDate,
          time: selectedTime,
          clientName,
          clientPhone,
        } satisfies Omit<Booking, 'id' | 'status' | 'timestamp' | 'userId'>),
      });

      if (response.status === 409) {
        setBookingStatus('error');
        alert('К сожалению, это время только что заняли. Выберите другое время.');
        setStep('time');
        return;
      }

      if (!response.ok) {
        throw new Error('Ошибка при создании бронирования');
      }

      await response.json();
      setBookingStatus('success');
      setStep('confirmation');
    } catch (error) {
      console.error(error);
      setBookingStatus('error');
    }
  };

  if (!isOpen) return null;

  const currentStepIndex = stepsForProgress.indexOf(step);
  const showProgress = step !== 'confirmation';

  const renderContent = () => {
    switch (step) {
      case 'service':
        return (
          <ServiceSelection
            services={services}
            onSelect={handleServiceSelect}
            selectedService={selectedService}
          />
        );

      case 'date':
        return (
          <DateSelection
            selectedDate={selectedDate}
            onSelectDate={(d) => setSelectedDate(d)}
            onBack={() => setStep('service')}
            onNext={() => selectedDate && setStep('time')}
            scheduleConfig={scheduleConfig}
            scheduleLoading={scheduleLoading}
            scheduleError={scheduleError}
          />
        );

      case 'time':
        return (
          <TimeSelection
            selectedDate={selectedDate}
            onSelectTime={(time) => {
              setSelectedTime(time);
              setStep('details');
            }}
            onBack={() => setStep('date')}
          />
        );

      case 'details':
        return (
          <DetailsForm
            service={selectedService!}
            date={selectedDate}
            time={selectedTime}
            name={clientName}
            phone={clientPhone}
            setName={setClientName}
            setPhone={setClientPhone}
            onNext={() => setStep('payment')}
            onBack={() => setStep('time')}
          />
        );

      case 'payment':
        return (
          <ConsentStep
            service={selectedService!}
            date={selectedDate}
            time={selectedTime}
            status={bookingStatus}
            onConfirm={handleConfirmBooking}
            onBack={() => setStep('details')}
          />
        );

      case 'confirmation':
        return (
          <ConfirmationScreen
            onClose={onClose}
            service={selectedService!}
            date={selectedDate}
            time={selectedTime}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/45 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md sm:max-w-xl rounded-3xl bg-white p-5 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {showProgress && (
          <div className="mb-1.5 text-xs sm:text-sm font-medium text-blue-600">
            ШАГ {currentStepIndex + 1} из {stepsForProgress.length}
          </div>
        )}

        <h3 className="mb-5 text-xl sm:text-2xl font-bold text-slate-900">
          {step === 'service' && 'Выберите процедуру'}
          {step === 'date' && 'Выберите дату'}
          {step === 'time' && 'Выберите время'}
          {step === 'details' && 'Ваши данные'}
          {step === 'payment' && 'Согласие и подтверждение записи'}
          {step === 'confirmation' && 'Бронирование завершено!'}
        </h3>

        {renderContent()}
      </div>
    </div>
  );
};

// ---------- подкомпоненты ----------

type ServiceSelectionProps = {
  services: Service[];
  onSelect: (service: Service) => void;
  selectedService: Service | null;
};

const ServiceSelection = ({ services, onSelect, selectedService }: ServiceSelectionProps) => (
  <div className="space-y-3">
    {services.map((service) => (
      <button
        key={service.id}
        onClick={() => onSelect(service)}
        className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 sm:p-5 text-left text-sm sm:text-base transition-all ${
          selectedService?.id === service.id
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-100 bg-white hover:border-slate-300'
        }`}
      >
        <div>
          <div className="text-base sm:text-lg font-bold text-slate-900">{service.name}</div>
          <div className="text-xs sm:text-sm text-slate-500">{service.duration} мин.</div>
        </div>
        <div className="text-lg sm:text-xl font-bold text-indigo-600">
          {service.price.toLocaleString('ru-RU')} ₸
        </div>
      </button>
    ))}
  </div>
);

type DateSelectionProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onBack: () => void;
  onNext: () => void;
  scheduleConfig: ScheduleConfig | null;
  scheduleLoading: boolean;
  scheduleError: string | null;
};

const DateSelection = ({
  selectedDate,
  onSelectDate,
  onBack,
  onNext,
  scheduleConfig,
  scheduleLoading,
  scheduleError,
}: DateSelectionProps) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const today = startOfDay(new Date());

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstWeekday = firstDayOfMonth.getDay(); // 0-6

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: {
      label: string;
      iso: string;
      isPast: boolean;
      enabledBySchedule: boolean;
    }[] = [];

    const leadingEmpty = (firstWeekday + 6) % 7;
    for (let i = 0; i < leadingEmpty; i++) {
      cells.push({
        label: '',
        iso: '',
        isPast: true,
        enabledBySchedule: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(
        2,
        '0',
      )}`;
      const isPast = startOfDay(date) < today;

      const weekdayKey = getWeekdayKeyFromDate(iso);
      const cfg = scheduleConfig ? scheduleConfig[weekdayKey] : undefined;
      const enabledBySchedule = cfg ? cfg.enabled : true;

      cells.push({
        label: day.toString(),
        iso,
        isPast,
        enabledBySchedule,
      });
    }

    return cells;
  }, [currentMonth, scheduleConfig, today]);

  const canGoNextMonth = true;

  const handleDayClick = (iso: string, disabled: boolean) => {
    if (!iso || disabled) return;
    onSelectDate(iso);
  };

  const isContinueDisabled = !selectedDate;

  return (
    <div className="space-y-5">
      <div className="mb-1.5 flex items-center justify_between justify-between">
        <button
          type="button"
          onClick={() =>
            setCurrentMonth((prev) => {
              const d = new Date(prev);
              d.setMonth(prev.getMonth() - 1);
              return d;
            })
          }
          className="flex items-center text-xs sm:text-sm text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Предыдущий
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
          <Calendar className="h-4 w-4 text-indigo-500" />
          {getMonthLabel(currentMonth)}
        </div>

        <button
          type="button"
          disabled={!canGoNextMonth}
          onClick={() =>
            setCurrentMonth((prev) => {
              const d = new Date(prev);
              d.setMonth(prev.getMonth() + 1);
              return d;
            })
          }
          className="flex items-center text-xs sm:text-sm text-slate-500 hover:text-indigo-600 disabled:opacity-40"
        >
          Следующий
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs font-medium text-slate-400">
        <div>ПН</div>
        <div>ВТ</div>
        <div>СР</div>
        <div>ЧТ</div>
        <div>ПТ</div>
        <div>СБ</div>
        <div>ВС</div>
      </div>

      {scheduleLoading ? (
        <div className="py-6 text-center text-sm text-slate-500">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          Загрузка расписания...
        </div>
      ) : scheduleError ? (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{scheduleError}</div>
      ) : (
        <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm">
          {days.map((day, idx) => {
            if (!day.label) {
              return <div key={idx} />;
            }

            const isSelected = selectedDate === day.iso;
            const disabled = day.isPast || !day.enabledBySchedule;

            return (
              <button
                key={day.iso}
                type="button"
                disabled={disabled}
                onClick={() => handleDayClick(day.iso, disabled)}
                className={[
                  'flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full transition',
                  disabled
                    ? 'cursor-not-allowed text-slate-300'
                    : 'hover:bg-indigo-50 hover:text-indigo-600',
                  isSelected && !disabled ? 'bg-indigo-600 text-white hover:bg-indigo-600' : '',
                ].join(' ')}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-xs sm:text-sm text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          Назад
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isContinueDisabled}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs sm:text-sm font-semibold transition ${
            isContinueDisabled
              ? 'cursor-not-allowed bg-slate-200 text-slate-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          Далее
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

type TimeSelectionProps = {
  selectedDate: string;
  onSelectTime: (time: string) => void;
  onBack: () => void;
};

const TimeSelection = ({ selectedDate, onSelectTime, onBack }: TimeSelectionProps) => {
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    setScheduleLoading(true);
    const fetchSchedule = async () => {
      try {
        const res = await fetch('https://air-vibe-xpiw.onrender.com/api/schedule');
        if (!res.ok) throw new Error('Ошибка при загрузке расписания');
        const data: ScheduleConfig = await res.json();
        setScheduleConfig(data);
      } catch (e) {
        console.error(e);
      } finally {
        setScheduleLoading(false);
      }
    };
    void fetchSchedule();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookingsForDate = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://air-vibe-xpiw.onrender.com/api/bookings?date=${encodeURIComponent(selectedDate)}`,
        );
        if (!res.ok) throw new Error('Ошибка при загрузке бронирований');
        const data: Booking[] = await res.json();
        const busyTimes = data.filter((b) => b.status !== 'Canceled').map((b) => b.time);
        setBookedTimes(busyTimes);
      } catch (e) {
        console.error(e);
        setBookedTimes([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchBookingsForDate();
  }, [selectedDate]);

  const timeSlots = useMemo(() => {
    if (!scheduleConfig || !selectedDate) return [];
    const key = getWeekdayKeyFromDate(selectedDate);
    const cfg = scheduleConfig[key];
    if (!cfg || !cfg.enabled) return [];
    return generateTimeSlots(cfg.start, cfg.end, 60);
  }, [scheduleConfig, selectedDate]);

  const isBusy = (time: string) => bookedTimes.includes(time);

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-indigo-50 p-3.5 text-xs sm:text-sm text-slate-700">
        <div className="mb-1 flex items-center gap-2 font-semibold text-slate-900">
          <Calendar className="h-4 w-4 text-indigo-500" />
          {formatDate(selectedDate)}
        </div>
        <p>Выберите удобное время для визита.</p>
      </div>

      {loading || scheduleLoading ? (
        <div className="py-6 text-center text-sm text-slate-500">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          Загрузка доступного времени...
        </div>
      ) : timeSlots.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          В этот день запись недоступна. Вернитесь назад и выберите другую дату.
        </div>
      ) : (
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {timeSlots.map((time, idx) => {
            const next = timeSlots[idx + 1];
            const label =
              next && idx < timeSlots.length - 1
                ? `${time} – ${next}`
                : `${time}`;

            const busy = isBusy(time);

            return (
              <button
                key={time}
                type={busy ? 'button' : 'submit'}
                disabled={busy}
                onClick={() => !busy && onSelectTime(time)}
                className={[
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-left text-xs sm:text-sm font_medium font-medium transition',
                  busy
                    ? 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400 line-through'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-indigo-50',
                ].join(' ')}
              >
                <span>{label}</span>
                {!busy && (
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    свободно
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-xs sm:text-sm text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft size={16} className="mr-1" />
        Назад
      </button>
    </div>
  );
};

type DetailsFormProps = {
  service: Service;
  date: string;
  time: string;
  name: string;
  phone: string;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
};

const DetailsForm = ({
  service,
  date,
  time,
  name,
  phone,
  setName,
  setPhone,
  onNext,
  onBack,
}: DetailsFormProps) => {
  const isFormValid = name.trim() !== '' && phone.length > 5;
  const isTrial = service.id === 'trial'; // <<<

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-5"
    >
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-xs sm:text-sm">
        <p className="mb-1 font-semibold text-slate-900">Ваше бронирование:</p>
        <p className="text-slate-600">
          {service.name} ({service.price.toLocaleString('ru-RU')} ₸)
          <br />
          <Clock size={14} className="mr-1 inline" /> {formatDate(date)} в {time}
        </p>
        <p className="mt-2 text-[11px] sm:text-xs text-slate-500">
          {isTrial ? (
            <>
              Стоимость пробного сеанса —{' '}
              <span className="font-semibold">
                {service.price.toLocaleString('ru-RU')} ₸
              </span>
              . Оплата производится в студии перед началом процедуры.
            </>
          ) : (
            <>
              Стоимость курса —{' '}
              <span className="font-semibold">
                {service.price.toLocaleString('ru-RU')} ₸
              </span>
              . Оплата производится в студии (наличные или перевод).
            </>
          )}
        </p>
      </div>

      <input
        type="text"
        placeholder="Ваше имя"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="+7 (___) ___-__-__"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <div className="flex items-center justify-between pt-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-xs sm:text-sm text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          Назад
        </button>
        <button
          type="submit"
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition ${
            isFormValid
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'cursor-not-allowed bg-slate-300 text-slate-500'
          }`}
          disabled={!isFormValid}
        >
          Продолжить
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
};

// ---------- ШАГ СОГЛАСИЯ И ПРОТИВОПОКАЗАНИЯ ----------

type ConsentStepProps = {
  service: Service;
  date: string;
  time: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  onConfirm: () => void;
  onBack: () => void;
};

const ConsentStep = ({ service, date, time, status, onConfirm, onBack }: ConsentStepProps) => {
  const [accepted, setAccepted] = useState(false);
  const disabled = !accepted || status === 'loading';
  const isTrial = service.id === 'trial'; // <<<

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-slate-800">
        <p className="mb-1 font-bold text-slate-900">Условия записи</p>
        <p className="mb-2">
          Вы записываетесь на: <span className="font-semibold">{service.name}</span>
          <br />
          <Calendar size={14} className="mr-1 inline" /> {formatDate(date)}{' '}
          <Clock size={14} className="ml-2 mr-1 inline" /> {time}
        </p>
        <p className="text-[11px] sm:text-xs text-slate-600">
          {isTrial ? (
            <>
              Стоимость пробного сеанса —{' '}
              <span className="font-semibold">
                {service.price.toLocaleString('ru-RU')} ₸
              </span>
              . Оплата производится <span className="font-semibold">в студии</span> перед началом
              процедуры (наличные или перевод).
            </>
          ) : (
            <>
              Стоимость курса —{' '}
              <span className="font-semibold">
                {service.price.toLocaleString('ru-RU')} ₸
              </span>
              . Оплата производится <span className="font-semibold">в студии</span> (наличные или
              перевод).
            </>
          )}
        </p>
      </div>

      {/* блок противопоказаний оставляю как у тебя */}

      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-slate-800 max-h-52 overflow-y-auto">
        <p className="mb-2 font-bold text-rose-900">Противопоказания</p>
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            <span className="font-semibold">наличие в теле кардиостимулятора</span>
          </li>
          <li>
            <span className="font-semibold">высокая температура тела</span>
          </li>
          <li>
            <span className="font-semibold">наличие в теле железной  пластины</span>
          </li>
          <li>
            <span className="font-semibold">онкология</span>
          </li>
          <li>
            <span className="font-semibold">беременность</span>
          </li>
          <li>
            <span className="font-semibold">в стадии обострения заболевания</span>
          </li>
          <li>
            <span className="font-semibold">
              ⁠⁠кормление грудью до 6 месяцев 
            </span>
          </li>
          <li>
            <span className="font-semibold">Психические заболевания (например, шизофрения).</span>
          </li>
        </ol>
        <p className="mt-3 text-[11px] sm:text-xs text-slate-600">
          Нажимая кнопку «Я согласен», вы подтверждаете, что ознакомлены с противопоказаниями,
          не имеете указанных состояний (или получили разрешение врача) и берёте ответственность
          за своё здоровье на себя.
        </p>
      </div>

      <label className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span>
          Я внимательно прочитал(а) противопоказания, согласен(на) с условиями записи и подтверждаю
          ответственность за своё здоровье.
        </span>
      </label>

      {status === 'error' && (
        <div className="rounded-xl bg-red-50 p-3 text-xs sm:text-sm text-red-700">
          Что-то пошло не так при создании бронирования. Попробуйте ещё раз.
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-xs sm:text-sm text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          Назад
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onConfirm}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition ${
            disabled
              ? 'cursor-not-allowed bg-slate-200 text-slate-500'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
          Я согласен — подтвердить запись
        </button>
      </div>
    </div>
  );
};

type ConfirmationScreenProps = {
  onClose: () => void;
  service: Service;
  date: string;
  time: string;
};

const ConfirmationScreen = ({ onClose, service, date, time }: ConfirmationScreenProps) => {
  const isTrial = service.id === 'trial'; // <<<

  return (
    <div className="py-6 text-center sm:py-8">
      <Check className="mx-auto mb-4 h-14 w-14 animate-bounce-in text-emer
ald-500" />
      <h4 className="mb-3 text-2xl sm:text-3xl font-bold text-slate-900">Бронь подтверждена!</h4>
      <p className="mb-5 text-sm sm:text-base text-slate-600">
        Спасибо! Мы ждём вас в студии AIR VIBE.
      </p>
      <div className="mb-6 inline-block rounded-xl bg-indigo-50 p-4 text-left text-xs sm:text-sm">
        <p className="mb-1 font-semibold text-slate-900">Детали:</p>
        <p className="text-slate-700">
          <span className="font-medium">{service.name}</span>
          <br />
          <Calendar size={14} className="mr-1 inline" /> {formatDate(date)}
          <Clock size={14} className="ml-3 mr-1 inline" /> {time}
        </p>
        <p className="mt-2 text-[11px] sm:text-xs text-slate-600">
          {isTrial ? (
            <>
              Оплата пробного сеанса —{' '}
              <span className="font-semibold">
                {service.price.toLocaleString('ru-RU')} ₸
              </span>{' '}
              — производится в студии перед процедурой.
            </>
          ) : (
            <>
              Оплата курса —{' '}
              <span className="font-semibold">
                {service.price.toLocaleString('ru-RU')} ₸
              </span>{' '}
              — производится в студии.
            </>
          )}
        </p>
      </div>
      <button
        onClick={onClose}
        className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
      >
        Закрыть
      </button>
    </div>
  );
};
