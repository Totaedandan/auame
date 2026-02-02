const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ----------------- БРОНИРОВАНИЯ -----------------

/**
 * ВАЖНО: статус "Paid" во фронте показываем как "Забронировано".
 * @typedef {'Pending' | 'Paid' | 'Confirmed' | 'Canceled' | 'Completed'} BookingStatus
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} serviceId
 * @property {string} serviceName
 * @property {number} price
 * @property {string} date      // "YYYY-MM-DD"
 * @property {string} time      // "HH:mm"
 * @property {string} clientName
 * @property {string} clientPhone
 * @property {BookingStatus} status
 * @property {number} timestamp
 * @property {string} userId
 */

/** @type {Booking[]} */
let bookings = [];

// --- маленькие утилиты ---

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

/** Проверка что слот занят (всё, что НЕ Canceled — занято) */
function isSlotBusy(date, time) {
  return bookings.some(
    (b) => b.date === date && b.time === time && b.status !== 'Canceled',
  );
}

// ----------------- ОДИНОЧНАЯ ЗАПИСЬ С САЙТА -----------------

// Создать бронирование с сайта
app.post('/api/bookings', (req, res) => {
  const {
    serviceId,
    serviceName,
    price,
    date,
    time,
    clientName,
    clientPhone,
    userId = 'anonymous',
  } = req.body;

  if (
    !serviceId ||
    !serviceName ||
    typeof price !== 'number' ||
    !date ||
    !time ||
    !clientName ||
    !clientPhone
  ) {
    return res.status(400).json({ message: 'Не все поля заполнены' });
  }

  // проверяем, что слот свободен (все кроме Canceled считаем занятыми)
  if (isSlotBusy(date, time)) {
    return res
      .status(409)
      .json({ message: 'В это время уже есть запись. Выберите другое время.' });
  }

  /** @type {Booking} */
  const newBooking = {
    id: uuid(),
    serviceId,
    serviceName,
    price,
    date,
    time,
    clientName,
    clientPhone,
    status: 'Paid', // внутренний код, во фронте показываем "Забронировано"
    timestamp: Date.now(),
    userId,
  };

  bookings.push(newBooking);
  console.log('New booking created:', newBooking);

  return res.status(201).json(newBooking);
});

// Получить бронирования (опционально по дате)
app.get('/api/bookings', (req, res) => {
  const { date } = req.query;

  let result = bookings;

  if (typeof date === 'string' && date.trim() !== '') {
    result = result.filter((b) => b.date === date);
  }

  const sorted = [...result].sort((a, b) => b.timestamp - a.timestamp);
  return res.json(sorted);
});

// Обновить статус брони
app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  /** @type {BookingStatus[]} */
  const allowed = ['Pending', 'Paid', 'Confirmed', 'Canceled', 'Completed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Неверный статус' });
  }

  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ message: 'Бронирование не найдено' });
  }

  booking.status = status;
  console.log(`Booking ${id} status changed to ${status}`);

  return res.json(booking);
});

// ----------------- МАССОВАЯ ЗАПИСЬ ПО ПАКЕТУ -----------------

/**
 * @typedef {{ date: string, time: string }} SessionInput
 */

/**
 * @typedef {Object} BulkBookingBody
 * @property {string} clientName
 * @property {string} clientPhone
 * @property {string} packageName
 * @property {number | undefined} price
 * @property {SessionInput[]} sessions
 */

// Создать несколько бронирований для одного клиента (пакет 10 сеансов и т.п.)
app.post('/api/bulk-bookings', (req, res) => {
  /** @type {BulkBookingBody} */
  const { clientName, clientPhone, packageName, price, sessions } = req.body || {};

  if (!clientName || !clientPhone || !packageName || !Array.isArray(sessions)) {
    return res.status(400).json({ message: 'Неверные данные. Проверьте клиента и сеансы.' });
  }

  // Оставляем только валидные слоты
  const normalizedSessions = sessions
    .filter((s) => s && s.date && s.time)
    .map((s) => ({
      date: String(s.date),
      time: String(s.time).slice(0, 5),
    }));

  if (normalizedSessions.length === 0) {
    return res
      .status(400)
      .json({ message: 'Нужно указать хотя бы одну дату и время для сеанса.' });
  }

  // Базовая валидация формата
  for (const s of normalizedSessions) {
    if (!dateRegex.test(s.date) || !timeRegex.test(s.time)) {
      return res.status(400).json({
        message: 'Неверный формат даты или времени. Ожидается YYYY-MM-DD и HH:mm.',
      });
    }
  }

  // Проверяем конфликты
  const conflicts = normalizedSessions.filter((s) => isSlotBusy(s.date, s.time));

  if (conflicts.length > 0) {
    return res.status(409).json({
      message: 'Некоторые слоты уже заняты. Исправьте расписание.',
      conflicts,
    });
  }

  // Всё ок — создаём брони. Используем отдельный serviceId/packageName.
  const basePrice = typeof price === 'number' ? price : 0;
  const now = Date.now();

  /** @type {Booking[]} */
  const created = normalizedSessions.map((s, idx) => {
    /** @type {Booking} */
    const booking = {
      id: uuid(),
      serviceId: 'package',
      serviceName: packageName,
      price: basePrice,
      date: s.date,
      time: s.time,
      clientName,
      clientPhone,
      status: 'Paid', // тоже "Забронировано"
      timestamp: now + idx, // чуть сдвигаем, чтобы сортировка была стабильной
      userId: 'package-admin',
    };
    bookings.push(booking);
    return booking;
  });

  console.log(
    `Bulk bookings created for ${clientName} (${clientPhone}), sessions:`,
    normalizedSessions,
  );

  return res.status(201).json({
    message: 'Записи по пакету успешно созданы.',
    created: created.length,
    bookings: created,
  });
});

// ----------------- РАСПИСАНИЕ -----------------

const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/**
 * @typedef {{ enabled: boolean, start: string, end: string }} ScheduleDayConfig
 */

/**
 * @typedef {Record<string, ScheduleDayConfig>} ScheduleConfig
 */

/** @type {ScheduleConfig} */
let scheduleConfig = {
  monday: { enabled: true, start: '10:00', end: '19:00' },
  tuesday: { enabled: true, start: '10:00', end: '19:00' },
  wednesday: { enabled: true, start: '10:00', end: '19:00' },
  thursday: { enabled: true, start: '10:00', end: '19:00' },
  friday: { enabled: true, start: '10:00', end: '19:00' },
  saturday: { enabled: true, start: '10:00', end: '18:00' },
  sunday: { enabled: false, start: '10:00', end: '17:00' },
};

function isValidScheduleDay(dayConfig) {
  if (typeof dayConfig.enabled !== 'boolean') return false;

  if (!dayConfig.enabled) {
    // даже для выходных держим строки, чтобы не ломать фронт
    return typeof dayConfig.start === 'string' && typeof dayConfig.end === 'string';
  }

  if (!timeRegex.test(dayConfig.start) || !timeRegex.test(dayConfig.end)) {
    return false;
  }

  const [sh, sm] = dayConfig.start.split(':').map(Number);
  const [eh, em] = dayConfig.end.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  return endMinutes > startMinutes;
}

// Получить расписание
app.get('/api/schedule', (req, res) => {
  return res.json(scheduleConfig);
});

// Обновить расписание
app.put('/api/schedule', (req, res) => {
  const body = req.body;

  for (const day of WEEKDAYS) {
    if (!body[day]) {
      return res.status(400).json({ message: `Отсутствуют настройки для дня: ${day}` });
    }
    if (!isValidScheduleDay(body[day])) {
      return res.status(400).json({ message: `Некорректные значения для дня: ${day}` });
    }
  }

  scheduleConfig = { ...scheduleConfig, ...body };

  console.log('Schedule updated:', scheduleConfig);

  return res.json(scheduleConfig);
});

// ----------------- START -----------------

app.listen(PORT, () => {
  console.log(`AIR VIBE backend started on http://localhost:${PORT}`);
});
