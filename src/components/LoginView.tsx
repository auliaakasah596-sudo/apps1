import React, { useState } from 'react';
import { api, UserProfile } from '../services/api';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onCancel }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('admin@uangkas.org');
  const [password, setPassword] = useState('admin123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isRegistering) {
      if (!namaLengkap.trim()) {
        setErrorMessage('Nama lengkap wajib diisi.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Konfirmasi kata sandi tidak cocok.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Kata sandi minimal 6 karakter.');
        return;
      }
    }

    try {
      setLoading(true);
      if (isRegistering) {
        const res = await api.register(namaLengkap, email, password);
        onLoginSuccess(res.user);
      } else {
        const res = await api.login(email, password);
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses permintaan Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body-sm text-on-surface bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-container-padding-mobile sm:px-0">
        <div className="flex justify-center mb-stack-lg">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-4xl text-primary font-bold filled"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance
            </span>
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
              Uangkas
            </h1>
          </div>
        </div>
        <h2 className="mt-2 text-center font-headline-md text-headline-md font-bold text-on-surface">
          {isRegistering ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
        </h2>
        <p className="mt-2 text-center font-body-sm text-body-sm text-on-surface-variant">
          {isRegistering
            ? 'Daftar untuk mengelola data keuangan kas organisasi'
            : 'Masuk ke akun Anda untuk mengelola keuangan'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-container-padding-mobile sm:px-0">
        <div className="bg-surface-container-lowest py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-surface-dim">
          {/* Segmented Control Switcher */}
          <div className="flex bg-surface-container rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-md transition-all ${
                !isRegistering
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-md transition-all ${
                isRegistering
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-error-container/20 border border-error/30 text-error text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap (Registrasi Only) */}
            {isRegistering && (
              <div>
                <label className="block font-body-sm text-xs text-on-surface mb-1 font-semibold" htmlFor="nama">
                  Nama Lengkap
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg">person</span>
                  </div>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    required
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Contoh: Ahmad Bendahara"
                    className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg focus:ring-primary focus:border-primary text-sm bg-surface text-on-surface placeholder-outline focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-body-sm text-xs text-on-surface mb-1 font-semibold" htmlFor="email">
                Email
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">mail</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@uangkas.org"
                  className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg focus:ring-primary focus:border-primary text-sm bg-surface text-on-surface placeholder-outline focus:bg-surface-container-lowest transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-body-sm text-xs text-on-surface mb-1 font-semibold" htmlFor="password">
                Kata Sandi (Password)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg focus:ring-primary focus:border-primary text-sm bg-surface text-on-surface placeholder-outline focus:bg-surface-container-lowest transition-colors"
                />
              </div>
            </div>

            {/* Confirm Password (Registrasi Only) */}
            {isRegistering && (
              <div>
                <label className="block font-body-sm text-xs text-on-surface mb-1 font-semibold" htmlFor="confirmPassword">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg">lock_reset</span>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg focus:ring-primary focus:border-primary text-sm bg-surface text-on-surface placeholder-outline focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Default Admin Info Hint */}
            {!isRegistering && (
              <div className="p-2.5 rounded bg-surface-container-low text-[11px] text-on-surface-variant flex items-start gap-1.5 border border-outline-variant/30">
                <span className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5">info</span>
                <span>
                  <strong>Akun Demo Default:</strong><br />
                  Email: <code>admin@uangkas.org</code> | Password: <code>admin123</code>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-body-lg text-body-lg font-bold text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Memproses...
                  </>
                ) : isRegistering ? (
                  'Daftarkan Akun'
                ) : (
                  'Masuk Ke Aplikasi'
                )}
              </button>
            </div>
          </form>

          {onCancel && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-on-surface-variant hover:text-primary transition-colors py-1"
              >
                Kembali ke Aplikasi
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-outline font-label-caps text-label-caps mt-8">
          © 2026 Uangkas Organization Finance • SQLite Database Backend.
        </p>
      </div>
    </main>
  );
};
