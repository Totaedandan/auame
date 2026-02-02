// Общие типы для приложения

export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

export type BookingStatus = 'Pending' | 'Paid' | 'Confirmed' | 'Canceled' | 'Completed';

export type Booking = {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  clientName: string;
  clientPhone: string;
  status: BookingStatus;
  timestamp: number;
  userId: string;
};

// Шаги бронирования: теперь отдельно дата и время
export type Step = 'service' | 'date' | 'time' | 'details' | 'payment' | 'confirmation';

export type View = 'home' | 'admin' | 'admin_login';

export type WeekdayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type ScheduleDayConfig = {
  enabled: boolean;
  start: string; // 'HH:MM'
  end: string;   // 'HH:MM'
};

export type ScheduleConfig = Record<WeekdayKey, ScheduleDayConfig>;
