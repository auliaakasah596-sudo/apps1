import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCompactRupiah } from '../utils/formatters';
import { exportTransactionsToCSV } from '../utils/exportCsv';

interface TransactionsViewProps {
  transactions: Transaction[];
  onNavigate: (tab: 'tambah-transaksi') => void;
  onDeleteTransaction?: (id: string) => void;
}

type TimeFilter = 'semua' | 'harian' | 'mingguan' | 'bulanan';

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onNavigate,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'semua' | TransactionType>('semua');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('semua');
  const [selectedTxDetail, setSelectedTxDetail] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type match
      if (typeFilter !== 'semua' && tx.type !== typeFilter) {
        return false;
      }

      // Search match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesCategory = tx.kategori.toLowerCase().includes(query);
        const matchesNote = tx.keterangan?.toLowerCase().includes(query);
        const matchesDate = tx.tanggal.toLowerCase().includes(query);
        if (!matchesCategory && !matchesNote && !matchesDate) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, typeFilter, searchQuery]);

  // Group transactions by date heading
  const groupedTransactions = useMemo<Record<string, Transaction[]>>(() => {
    const groups: Record<string, Transaction[]> = {};

    filteredTransactions.forEach((tx) => {
      let groupKey = tx.tanggal;
      if (tx.tanggal === '2023-10-24') {
        groupKey = 'Hari Ini, 24 Okt 2023';
      } else if (tx.tanggal === '2023-10-23') {
        groupKey = 'Kemarin, 23 Okt 2023';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });

    return groups;
  }, [filteredTransactions]);

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg pb-32">
      {/* Page Title & Add Header Button */}
      <div className="flex justify-between items-center mb-stack-md flex-wrap gap-2">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface font-bold">
          Riwayat Transaksi
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportTransactionsToCSV(filteredTransactions, 'Riwayat_Transaksi', timeFilter)}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface border border-outline-variant text-on-surface rounded-lg font-numeric-data text-body-sm font-semibold hover:bg-surface-container-low transition-colors shadow-sm active:scale-95"
            title="Ekspor transaksi yang difilter ke CSV/Excel"
          >
            <span className="material-symbols-outlined text-lg text-on-surface-variant">table_chart</span>
            <span className="hidden xs:inline">Ekspor Excel</span>
          </button>
          <button
            onClick={() => onNavigate('tambah-transaksi')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-numeric-data text-body-sm font-semibold hover:bg-inverse-surface transition-colors shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-stack-sm group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari Transaksi (makan, bensin, gaji...)"
          className="w-full pl-12 pr-10 py-3 bg-surface border border-outline-variant rounded-lg font-body-lg text-body-lg text-on-surface placeholder-outline focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm hover:border-outline"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary p-1"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {/* Filters (Scrollable Chips) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-stack-md items-center">
        {/* Status Filters */}
        <button
          onClick={() => setTypeFilter('semua')}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps transition-colors shadow-sm ${
            typeFilter === 'semua'
              ? 'bg-primary text-on-primary font-bold'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setTypeFilter('masuk')}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps transition-colors shadow-sm ${
            typeFilter === 'masuk'
              ? 'bg-secondary text-on-secondary font-bold'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Masuk
        </button>
        <button
          onClick={() => setTypeFilter('keluar')}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps transition-colors shadow-sm ${
            typeFilter === 'keluar'
              ? 'bg-error text-on-error font-bold'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Keluar
        </button>

        <div className="w-px h-6 bg-outline-variant mx-1 self-center shrink-0"></div>

        {/* Time Filters */}
        <button
          onClick={() => setTimeFilter('semua')}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps transition-colors ${
            timeFilter === 'semua'
              ? 'bg-surface-variant text-on-surface font-semibold shadow-sm'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Semua Periode
        </button>
        <button
          onClick={() => setTimeFilter('harian')}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps transition-colors ${
            timeFilter === 'harian'
              ? 'bg-surface-variant text-on-surface font-semibold shadow-sm'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Harian
        </button>
        <button
          onClick={() => setTimeFilter('mingguan')}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps transition-colors ${
            timeFilter === 'mingguan'
              ? 'bg-surface-variant text-on-surface font-semibold shadow-sm'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Mingguan
        </button>
        <button
          onClick={() => setTimeFilter('bulanan')}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps transition-colors ${
            timeFilter === 'bulanan'
              ? 'bg-surface-variant text-on-surface font-semibold shadow-sm'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Bulanan
        </button>
      </div>

      {/* Transaction List grouped by Date */}
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/30 my-4">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
          <p className="font-body-lg text-on-surface-variant">Tidak ada transaksi yang cocok dengan filter ini.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-stack-md">
          {Object.keys(groupedTransactions).map((dateLabel) => {
            const items = groupedTransactions[dateLabel];
            return (
              <div key={dateLabel}>
                <h2 className="font-numeric-data text-numeric-data text-outline mb-stack-sm px-1 font-medium">
                  {dateLabel}
                </h2>
                <div className="flex flex-col bg-surface p-2 rounded-xl shadow-sm border border-surface-container/70">
                  {items.map((tx, idx) => {
                    const isIncome = tx.type === 'masuk';
                    return (
                      <React.Fragment key={tx.id}>
                        <div
                          onClick={() => setSelectedTxDetail(tx)}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer active:scale-[0.99]"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isIncome
                                  ? 'bg-secondary-container/30 text-secondary'
                                  : 'bg-surface-variant text-on-surface'
                              }`}
                            >
                              <span className="material-symbols-outlined">
                                {tx.icon || (isIncome ? 'account_balance_wallet' : 'receipt')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-headline-md text-headline-md text-on-surface text-[16px] font-semibold">
                                {tx.kategori}
                              </h3>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {tx.time || tx.tanggal}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`font-numeric-data text-numeric-data font-bold ${
                              isIncome ? 'text-secondary' : 'text-error'
                            }`}
                          >
                            {isIncome ? '+ ' : '- '}
                            {formatCompactRupiah(tx.nominal)}
                          </div>
                        </div>
                        {idx !== items.length - 1 && (
                          <div className="h-px w-full bg-surface-container-low"></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTxDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl border border-surface-container animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-headline-md font-bold text-primary">Detail Transaksi</h3>
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="text-outline hover:text-primary p-1 rounded-full hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                <span className="font-body-sm text-on-surface-variant">Jenis</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedTxDetail.type === 'masuk'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  {selectedTxDetail.type === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex justify-between items-center">
                <span className="font-body-sm text-on-surface-variant">Nominal</span>
                <span
                  className={`font-numeric-data text-headline-md font-bold ${
                    selectedTxDetail.type === 'masuk' ? 'text-secondary' : 'text-error'
                  }`}
                >
                  {selectedTxDetail.type === 'masuk' ? '+' : '-'} {formatCompactRupiah(selectedTxDetail.nominal)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low space-y-1">
                <span className="font-body-sm text-on-surface-variant block">Kategori</span>
                <span className="font-body-lg text-on-surface font-semibold">{selectedTxDetail.kategori}</span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low space-y-1">
                <span className="font-body-sm text-on-surface-variant block">Tanggal & Waktu</span>
                <span className="font-body-lg text-on-surface">
                  {selectedTxDetail.tanggal} {selectedTxDetail.time ? `(${selectedTxDetail.time})` : ''}
                </span>
              </div>

              {selectedTxDetail.keterangan && (
                <div className="p-3 rounded-lg bg-surface-container-low space-y-1">
                  <span className="font-body-sm text-on-surface-variant block">Keterangan</span>
                  <span className="font-body-lg text-on-surface">{selectedTxDetail.keterangan}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              {onDeleteTransaction && (
                <button
                  onClick={() => {
                    if (confirm('Hapus transaksi ini?')) {
                      onDeleteTransaction(selectedTxDetail.id);
                      setSelectedTxDetail(null);
                    }
                  }}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-error-container text-on-error-container font-semibold hover:bg-error hover:text-white transition-colors"
                >
                  Hapus
                </button>
              )}
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-inverse-surface transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
