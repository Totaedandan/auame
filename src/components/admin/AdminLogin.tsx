// src/components/admin/AdminLogin.tsx

import { useMemo, useState, type FormEvent } from 'react';
import { Lock, User } from 'lucide-react';
import { getAdminEnvCredentials, setAdminAuthed, verifyAdminCredentials } from '../../auth/adminAuth';

type AdminLoginProps = {
  onSuccess: () => void;
  onBack?: () => void;
};

export function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hasEnvCreds = useMemo(() => {
    const { login: envLogin, password: envPass } = getAdminEnvCredentials();
    return Boolean(envLogin && envPass);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // небольшая задержка, чтобы UI выглядел "живым"
    setTimeout(() => {
      const ok = verifyAdminCredentials(login.trim(), password);
      if (!ok) {
        setSubmitting(false);
        setError('Неверный логин или пароль');
        return;
      }

      setAdminAuthed(true);
      setSubmitting(false);
      onSuccess();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#ECE7F0] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">Вход в админку</div>
            <div className="text-xs text-slate-500">Только для сотрудников AIR VIBE</div>
          </div>
        </div>

        {!hasEnvCreds && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Внимание: в <span className="font-semibold">.env</span> не заданы
            <span className="font-semibold"> VITE_ADMIN_LOGIN</span> / <span className="font-semibold">VITE_ADMIN_PASSWORD</span>.
            Сейчас работает dev‑fallback: <span className="font-semibold">admin / admin</span>.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Логин</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <User className="w-4 h-4 text-slate-400" />
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                placeholder="Введите логин"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-600">Пароль</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                placeholder="Введите пароль"
                type="password"
                autoComplete="current-password"
              />
            </div>
          </label>

          {error && <div className="text-sm text-rose-600">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-indigo-600 text-white py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? 'Проверяем…' : 'Войти'}
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Назад на сайт
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
