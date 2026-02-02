// src/auth/adminAuth.ts
// Простая авторизация админки через логин/пароль из .env
// (Vite: только переменные с префиксом VITE_* доступны в import.meta.env)

const AUTH_FLAG_KEY = 'airvibe_admin_authed_v1';

export function getAdminEnvCredentials(): { login: string; password: string } {
  const login = (import.meta.env.VITE_ADMIN_LOGIN as string | undefined) ?? '';
  const password = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? '';
  return { login, password };
}

export function isAdminAuthed(): boolean {
  try {
    return localStorage.getItem(AUTH_FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

export function setAdminAuthed(value: boolean): void {
  try {
    if (value) localStorage.setItem(AUTH_FLAG_KEY, '1');
    else localStorage.removeItem(AUTH_FLAG_KEY);
  } catch {
    // ignore
  }
}

export function verifyAdminCredentials(inputLogin: string, inputPassword: string): boolean {
  const { login, password } = getAdminEnvCredentials();

  // Если в .env ничего не задано, чтобы не "запереть" себя в разработке,
  // используем fallback admin/admin и пишем предупреждение в консоль.
  const effectiveLogin = login || 'admin';
  const effectivePassword = password || 'admin';

  if (!login || !password) {
    // eslint-disable-next-line no-console
    console.warn(
      '[ADMIN AUTH] VITE_ADMIN_LOGIN/VITE_ADMIN_PASSWORD не заданы. Используется fallback admin/admin (только для dev).',
    );
  }

  return inputLogin === effectiveLogin && inputPassword === effectivePassword;
}
