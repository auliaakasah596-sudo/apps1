import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { formatCompactRupiah } from '../utils/formatters';

interface DashboardViewProps {
  transactions: Transaction[];
  onNavigate: (tab: 'transaksi' | 'tambah-transaksi' | 'laporan' | 'profil') => void;
  initialBalance?: number;
  onResetData?: () => void;
  onLoadSampleData?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  onNavigate,
  initialBalance = 0,
  onResetData,
  onLoadSampleData,
}) => {
  // Current calendar month key (e.g. "2026-08")
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth() + 1;
  const currentMonthKey = `${currentYear}-${String(currentMonthNum).padStart(2, '0')}`;

  const currentMonthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(now);

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(currentMonthKey);

  // Available month options extracted from transactions + current month
  const monthOptions = useMemo(() => {
    const map = new Map<string, string>();
    map.set(currentMonthKey, `${currentMonthLabel} (Bulan Berjalan)`);

    transactions.forEach((tx) => {
      if (!tx.tanggal) return;
      const parts = tx.tanggal.split('-');
      if (parts.length >= 2) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        if (!isNaN(year) && !isNaN(month)) {
          const key = `${year}-${String(month).padStart(2, '0')}`;
          if (!map.has(key)) {
            const d = new Date(year, month - 1, 1);
            const label = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(d);
            map.set(key, label);
          }
        }
      }
    });

    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [transactions, currentMonthKey, currentMonthLabel]);

  // Selected month label
  const activeMonthLabel = monthOptions.find((m) => m.key === selectedMonthKey)?.label || currentMonthLabel;

  // Filter transactions for selected month
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.tanggal) return false;
      return t.tanggal.startsWith(selectedMonthKey);
    });
  }, [transactions, selectedMonthKey]);

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === 'masuk')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === 'keluar')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const monthlyNet = monthlyIncome - monthlyExpense;

  // Calculate overall dynamic totals
  const totalIncome = transactions
    .filter((t) => t.type === 'masuk')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'keluar')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  // Default starting cash base is 0 + dynamic calculated net
  const totalBalance = initialBalance + totalIncome - totalExpense;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop pt-6 pb-28 md:pb-12">
      {/* Hero Card: Total Saldo */}
      <section className="mb-stack-lg">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.08)] p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between relative overflow-hidden border border-surface-container/60 gap-4">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-surface-container-high rounded-full opacity-20 blur-3xl pointer-events-none"></div>
          <div className="z-10 flex flex-col gap-2">
            <h2 className="font-body-lg text-body-lg text-on-surface-variant font-medium">Saldo Total</h2>
            <p className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
              {formatCompactRupiah(totalBalance)}
            </p>
          </div>
          <div className="z-10 flex flex-wrap items-center gap-2">
            {onResetData && (
              <button
                onClick={onResetData}
                title="Mulai dari 0 (Bersihkan Data)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-error-container/20 hover:text-error text-on-surface-variant text-xs font-semibold transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset ke Rp 0
              </button>
            )}
            {onLoadSampleData && transactions.length === 0 && (
              <button
                onClick={onLoadSampleData}
                title="Muat Contoh Data Transaksi"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-container/30 text-secondary hover:bg-secondary-container/50 text-xs font-semibold transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Muat Contoh Data
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Kartu Ringkasan Bulanan (Bulan Berjalan) */}
      <section className="mb-stack-lg">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.08)] p-5 md:p-6 border border-surface-container/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-secondary-container/30 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">calendar_month</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Ringkasan Bulanan
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Periode: <span className="font-semibold text-primary">{activeMonthLabel}</span>
                </p>
              </div>
            </div>

            {/* Selector Bulan jika ada transaksi di bulan lain */}
            {monthOptions.length > 1 && (
              <div className="relative self-start sm:self-auto">
                <select
                  value={selectedMonthKey}
                  onChange={(e) => setSelectedMonthKey(e.target.value)}
                  className="pl-3 pr-8 py-1.5 bg-surface border border-outline-variant rounded-lg font-numeric-data text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-sm text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  expand_more
                </span>
              </div>
            )}
          </div>

          {/* Grid Stats Bulanan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pemasukan Bulanan */}
            <div className="p-4 rounded-xl bg-secondary-container/15 border border-secondary/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-secondary mb-1">
                <span className="font-body-sm text-xs font-semibold uppercase tracking-wider">
                  Pemasukan Bulan Ini
                </span>
                <span className="material-symbols-outlined text-lg">trending_up</span>
              </div>
              <p className="font-headline-lg-mobile md:font-headline-md text-headline-lg-mobile md:text-headline-md text-secondary font-bold">
                +{formatCompactRupiah(monthlyIncome)}
              </p>
              <span className="font-body-sm text-xs text-on-surface-variant mt-2">
                {monthlyTransactions.filter((t) => t.type === 'masuk').length} transaksi masuk
              </span>
            </div>

            {/* Pengeluaran Bulanan */}
            <div className="p-4 rounded-xl bg-error-container/15 border border-error/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-error mb-1">
                <span className="font-body-sm text-xs font-semibold uppercase tracking-wider">
                  Pengeluaran Bulan Ini
                </span>
                <span className="material-symbols-outlined text-lg">trending_down</span>
              </div>
              <p className="font-headline-lg-mobile md:font-headline-md text-headline-lg-mobile md:text-headline-md text-error font-bold">
                -{formatCompactRupiah(monthlyExpense)}
              </p>
              <span className="font-body-sm text-xs text-on-surface-variant mt-2">
                {monthlyTransactions.filter((t) => t.type === 'keluar').length} transaksi keluar
              </span>
            </div>

            {/* Surplus / Defisit Bulan Ini */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant mb-1">
                <span className="font-body-sm text-xs font-semibold uppercase tracking-wider">
                  Arus Kas Bulan Ini
                </span>
                <span className="material-symbols-outlined text-lg">
                  {monthlyNet >= 0 ? 'account_balance' : 'warning'}
                </span>
              </div>
              <p className={`font-headline-lg-mobile md:font-headline-md text-headline-lg-mobile md:text-headline-md font-bold ${
                monthlyNet >= 0 ? 'text-secondary' : 'text-error'
              }`}>
                {monthlyNet >= 0 ? '+' : ''}{formatCompactRupiah(monthlyNet)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  monthlyNet > 0
                    ? 'bg-secondary/20 text-secondary'
                    : monthlyNet < 0
                    ? 'bg-error/20 text-error'
                    : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {monthlyNet > 0 ? 'Surplus Bulan Ini' : monthlyNet < 0 ? 'Defisit Bulan Ini' : 'Seimbang (Rp 0)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Stats Grid - Keseluruhan */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-gutter mb-stack-lg">
        {/* Pemasukan Total */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.08)] p-5 flex flex-col gap-2 border-l-4 border-secondary border-y border-r border-surface-container/50">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm text-secondary font-bold">arrow_downward</span>
            <h3 className="font-body-sm text-body-sm font-medium">Total Pemasukan (Akumulasi)</h3>
          </div>
          <p className="font-headline-md text-headline-md text-on-surface font-bold">
            {formatCompactRupiah(totalIncome)}
          </p>
        </div>

        {/* Pengeluaran Total */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.08)] p-5 flex flex-col gap-2 border-l-4 border-error border-y border-r border-surface-container/50">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm text-error font-bold">arrow_upward</span>
            <h3 className="font-body-sm text-body-sm font-medium">Total Pengeluaran (Akumulasi)</h3>
          </div>
          <p className="font-headline-md text-headline-md text-on-surface font-bold">
            {formatCompactRupiah(totalExpense)}
          </p>
        </div>
      </section>

      {/* Transaksi Terakhir */}
      <section className="mb-stack-lg">
        <div className="flex justify-between items-center mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
            Transaksi Terakhir
          </h2>
          <button
            onClick={() => onNavigate('transaksi')}
            className="font-body-sm text-body-sm text-primary hover:text-secondary font-semibold hover:underline flex items-center gap-1"
          >
            Lihat Semua
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.08)] overflow-hidden border border-outline-variant/30">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-4xl text-outline">account_balance_wallet</span>
              <p className="font-body-lg font-medium text-on-surface">Belum ada transaksi tersimpan.</p>
              <p className="font-body-sm text-on-surface-variant max-w-sm">
                Aplikasi berada dalam mode saldo bersih (Rp 0). Anda dapat mulai menambah transaksi baru atau memuat contoh data untuk pengujian.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => onNavigate('tambah-transaksi')}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-body-sm hover:bg-inverse-surface transition-colors shadow-sm"
                >
                  + Tambah Transaksi
                </button>
                {onLoadSampleData && (
                  <button
                    onClick={onLoadSampleData}
                    className="px-4 py-2 bg-surface border border-outline-variant text-on-surface rounded-lg font-semibold text-body-sm hover:bg-surface-container-low transition-colors"
                  >
                    Muat Contoh Data
                  </button>
                )}
              </div>
            </div>
          ) : (
            recentTransactions.map((tx, idx) => {
              const isIncome = tx.type === 'masuk';
              return (
                <div
                  key={tx.id}
                  onClick={() => onNavigate('transaksi')}
                  className={`flex items-center justify-between p-4 hover:bg-surface-container-low/70 transition-colors cursor-pointer active:scale-[0.99] ${
                    idx !== recentTransactions.length - 1 ? 'border-b border-outline-variant/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isIncome
                          ? 'bg-secondary-container/20 text-secondary'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {tx.icon || (isIncome ? 'account_balance_wallet' : 'receipt')}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-numeric-data text-numeric-data text-on-surface font-semibold">
                        {tx.kategori}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {tx.tanggal} {tx.time ? `• ${tx.time}` : ''}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-numeric-data text-numeric-data font-bold ${
                      isIncome ? 'text-secondary' : 'text-error'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCompactRupiah(tx.nominal)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => onNavigate('tambah-transaksi')}
        aria-label="Tambah Transaksi"
        className="fixed right-5 bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-10 z-40 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-[0px_6px_20px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-inverse-surface transition-all active:scale-95 hover:scale-105"
        title="Tambah Transaksi Baru"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>
    </main>
  );
};
