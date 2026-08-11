import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCompactRupiah } from '../utils/formatters';
import { exportTransactionsToCSV } from '../utils/exportCsv';

interface ReportViewProps {
  transactions: Transaction[];
}

export function ReportView({ transactions }: ReportViewProps) {
  const [selectedMonth, setSelectedMonth] = useState('September 2023');

  // Compute stats dynamically from real transaction data
  const totalIncome = transactions
    .filter((t: Transaction) => t.type === 'masuk')
    .reduce((acc: number, curr: Transaction) => acc + curr.nominal, 0);

  const totalExpense = transactions
    .filter((t: Transaction) => t.type === 'keluar')
    .reduce((acc: number, curr: Transaction) => acc + curr.nominal, 0);

  const netBalance = totalIncome - totalExpense;

  // Compute category totals
  const categoryStats = transactions.reduce(
    (
      acc: Record<string, { total: number; type: 'masuk' | 'keluar' }>,
      tx: Transaction
    ) => {
      if (!acc[tx.kategori]) {
        acc[tx.kategori] = { total: 0, type: tx.type };
      }
      acc[tx.kategori].total += tx.nominal;
      return acc;
    },
    {} as Record<string, { total: number; type: 'masuk' | 'keluar' }>
  );

  const totalOverallVolume = totalIncome + totalExpense;

  const handleDownloadReport = () => {
    exportTransactionsToCSV(transactions, 'Laporan_Keuangan', selectedMonth);
  };

  const handleExportExcel = () => {
    exportTransactionsToCSV(transactions, 'Data_Transaksi_Excel', selectedMonth);
  };

  return (
    <main className="max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg pb-32 md:pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-lg">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
            Laporan Keuangan
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-unit">
            Ringkasan transaksi dan performa keuangan Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-stack-sm">
          {/* Period Selector */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e: any) => setSelectedMonth(e.target.value)}
              className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors shadow-sm font-body-sm text-body-sm text-on-surface font-semibold cursor-pointer appearance-none pr-8"
            >
              <option value="September 2023">September 2023</option>
              <option value="Oktober 2023">Oktober 2023</option>
              <option value="November 2023">November 2023</option>
              <option value="Desember 2023">Desember 2023</option>
            </select>
            <span className="material-symbols-outlined text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm active:scale-95"
            title="Unduh Laporan PDF"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span className="font-body-sm text-body-sm font-semibold hidden md:inline">
              Unduh Laporan
            </span>
          </button>

          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors shadow-sm active:scale-95"
            title="Ekspor Format Excel"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-lg">
              table_chart
            </span>
            <span className="font-body-sm text-body-sm text-on-surface font-semibold">
              Ekspor Excel
            </span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Summary Card (Left Col) */}
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary font-bold mb-stack-sm">
              Ringkasan Periode
            </h2>
            <div className="flex items-end gap-4 mb-stack-lg">
              <div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Total Saldo Bersih</p>
                <p className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
                  {formatCompactRupiah(netBalance)}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-secondary/10 text-secondary rounded-full font-label-caps text-label-caps mb-1 font-bold">
                +15% vs Bln Lalu
              </span>
            </div>
          </div>

          {/* Progress Bar Area */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-body-sm text-body-sm mb-1">
                <span className="text-on-surface-variant font-medium">Pemasukan</span>
                <span className="text-secondary font-bold">{formatCompactRupiah(totalIncome)}</span>
              </div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-body-sm text-body-sm mb-1">
                <span className="text-on-surface-variant font-medium">Pengeluaran</span>
                <span className="text-error font-bold">{formatCompactRupiah(totalExpense)}</span>
              </div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats (Right Col) */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          {/* Kas Masuk Tertinggi */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined font-bold">trending_up</span>
            </div>
            <div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Kas Masuk Tertinggi</p>
              <p className="font-numeric-data text-numeric-data text-primary font-bold">Penjualan Produk</p>
            </div>
          </div>

          {/* Pengeluaran Terbesar */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-error-container/30 flex items-center justify-center text-error shrink-0">
              <span className="material-symbols-outlined font-bold">trending_down</span>
            </div>
            <div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Pengeluaran Terbesar</p>
              <p className="font-numeric-data text-numeric-data text-primary font-bold">Operasional Kantor</p>
            </div>
          </div>

          {/* Mini Cash Flow Trend Chart */}
          <div className="flex-grow bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 overflow-hidden relative min-h-[120px] flex flex-col justify-between">
            <p className="font-label-caps text-label-caps text-on-surface-variant font-semibold">Tren Arus Kas</p>
            <div className="h-16 flex items-end justify-between gap-1.5 opacity-80 pt-2">
              <div className="w-full bg-primary/70 hover:bg-primary transition-colors rounded-t-sm h-[30%]" title="Minggu 1"></div>
              <div className="w-full bg-primary/70 hover:bg-primary transition-colors rounded-t-sm h-[50%]" title="Minggu 2"></div>
              <div className="w-full bg-primary/70 hover:bg-primary transition-colors rounded-t-sm h-[40%]" title="Minggu 3"></div>
              <div className="w-full bg-primary/70 hover:bg-primary transition-colors rounded-t-sm h-[70%]" title="Minggu 4"></div>
              <div className="w-full bg-primary/70 hover:bg-primary transition-colors rounded-t-sm h-[60%]" title="Minggu 5"></div>
              <div className="w-full bg-secondary hover:bg-secondary/90 transition-colors rounded-t-sm h-[90%]" title="Minggu 6"></div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="md:col-span-12 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mt-stack-sm">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface/50">
            <h3 className="font-headline-md text-headline-md text-primary font-bold">
              Detail Kategori
            </h3>
            <button
              onClick={() => alert('Menampilkan seluruh rincian laporan kategori.')}
              className="text-primary font-body-sm text-body-sm font-semibold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-outline-variant/30">
                  <th className="p-4 font-label-caps text-label-caps text-on-surface-variant font-bold">
                    KATEGORI
                  </th>
                  <th className="p-4 font-label-caps text-label-caps text-on-surface-variant font-bold">
                    TIPE
                  </th>
                  <th className="p-4 font-label-caps text-label-caps text-on-surface-variant text-right font-bold">
                    JUMLAH (Rp)
                  </th>
                  <th className="p-4 font-label-caps text-label-caps text-on-surface-variant text-right font-bold">
                    % DARI TOTAL
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant/10">
                {Object.keys(categoryStats).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                      Belum ada transaksi pada periode ini (Saldo Rp 0).
                    </td>
                  </tr>
                ) : (
                  Object.keys(categoryStats).map((catName: string) => {
                    const stat = categoryStats[catName];
                    const percentage = totalOverallVolume > 0
                      ? ((stat.total / totalOverallVolume) * 100).toFixed(1)
                      : '0';
                    const isIncome = stat.type === 'masuk';

                    return (
                      <tr key={catName} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-sm">
                              {isIncome ? 'account_balance_wallet' : 'receipt'}
                            </span>
                          </div>
                          <span className="font-semibold text-primary">{catName}</span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isIncome
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-error/10 text-error'
                            }`}
                          >
                            {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </td>
                        <td className="p-4 text-right font-numeric-data text-numeric-data font-bold">
                          {formatCompactRupiah(stat.total)}
                        </td>
                        <td className="p-4 text-right text-on-surface-variant font-medium">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};
