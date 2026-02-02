// src/constants.ts
import type { Service } from './types';

// Пароль для входа в админку (можешь поменять)
export const ADMIN_PASSWORD = 'airvibe-admin-2025';

// Тарифы
export const SERVICES: Service[] = [
    {
    id: 'trial',
    name: 'Пробный сеанс AIR VIBE',
    duration: 20,
    price: 7000,
  },
  {
    id: 'balance',
    name: 'BALANCE — самочувствие',
    price: 70_000,
    duration: 30,
  },
  {
    id: 'beauty',
    name: 'BEAUTY — омоложение',
    price: 120_000,
    duration: 30,
  },
  {
    id: 'glowPro',
    name: 'GLOW PRO — максимальное сияние',
    price: 170_000,
    duration: 45,
  },
];
