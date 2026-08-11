import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

interface AddTransactionViewProps {
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export const AddTransactionView: React.FC<AddTransactionViewProps> = ({ onSave, onCancel }) => {
  const [type, setType] = useState<TransactionType>('masuk');
  const [nominal, setNominal] = useState<string>('');
  const [kategori, setKategori] = useState<string>('');
  const [tanggal, setTanggal] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [keterangan, setKeterangan] = useState<string>('');

  const incomeCategories = [
    'Gaji Bulanan',
    'Bonus',
    'Hasil Investasi',
    'Iuran Anggota',
    'Pencairan Dana Proyek',
    'Lainnya',
  ];

  const expenseCategories = [
    'Sewa Kantor',
    'Operasional',
    'Makan Siang / Konsumsi',
    'Bensin',
    'Pembelian Alat / Laptop',
    'Tagihan Air & Listrik',
    'Lainnya',
  ];

  const categories = type === 'masuk' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericNominal = parseFloat(nominal.replace(/[^0-9]/g, ''));
    if (!numericNominal || numericNominal <= 0) {
      alert('Masukkan nominal transaksi yang valid.');
      return;
    }

    if (!kategori) {
      alert('Pilih kategori transaksi terlebih dahulu.');
      return;
    }

    // Determine icon based on category
    let icon = 'receipt';
    if (kategori.includes('Gaji') || kategori.includes('Dana') || kategori.includes('Investasi')) {
      icon = 'account_balance_wallet';
    } else if (kategori.includes('Makan') || kategori.includes('Konsumsi')) {
      icon = 'restaurant';
    } else if (kategori.includes('Bensin')) {
      icon = 'local_gas_station';
    } else if (kategori.includes('Sewa')) {
      icon = 'corporate_fare';
    } else if (kategori.includes('Alat') || kategori.includes('Laptop')) {
      icon = 'devices';
    } else if (kategori.includes('Air') || kategori.includes('Listrik')) {
      icon = 'water_drop';
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    onSave({
      type,
      nominal: numericNominal,
      kategori,
      tanggal,
      time: timeStr,
      keterangan,
      icon,
    });
  };

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg overflow-y-auto min-h-screen">
      <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container/60 p-6">
        {/* Segmented Control */}
        <div className="flex p-1 bg-surface-container rounded-lg mb-stack-lg">
          <button
            type="button"
            onClick={() => {
              setType('masuk');
              setKategori('');
            }}
            className={`flex-1 py-2 text-center rounded-md font-label-caps text-label-caps transition-all focus:outline-none ${
              type === 'masuk'
                ? 'bg-surface-container-lowest shadow-sm font-bold text-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setType('keluar');
              setKategori('');
            }}
            className={`flex-1 py-2 text-center rounded-md font-label-caps text-label-caps transition-all focus:outline-none ${
              type === 'keluar'
                ? 'bg-surface-container-lowest shadow-sm font-bold text-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Keluar
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-stack-md">
          {/* Nominal */}
          <div className="flex flex-col space-y-unit">
            <label className="font-body-sm text-body-sm text-on-surface-variant font-medium" htmlFor="nominal">
              Nominal
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant font-numeric-data text-numeric-data font-bold">
                Rp
              </span>
              <input
                id="nominal"
                name="nominal"
                type="text"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="0"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-primary font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-bold"
              />
            </div>
          </div>

          {/* Pilih Kategori */}
          <div className="flex flex-col space-y-unit">
            <label className="font-body-sm text-body-sm text-on-surface-variant font-medium" htmlFor="kategori">
              Pilih Kategori
            </label>
            <div className="relative">
              <select
                id="kategori"
                name="kategori"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                required
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-primary font-body-lg text-body-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Pilih kategori...
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>

          {/* Tanggal */}
          <div className="flex flex-col space-y-unit">
            <label className="font-body-sm text-body-sm text-on-surface-variant font-medium" htmlFor="tanggal">
              Tanggal
            </label>
            <div className="relative">
              <input
                id="tanggal"
                name="tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-primary font-body-lg text-body-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>
          </div>

          {/* Keterangan */}
          <div className="flex flex-col space-y-unit">
            <label className="font-body-sm text-body-sm text-on-surface-variant font-medium" htmlFor="keterangan">
              Keterangan (Opsional)
            </label>
            <textarea
              id="keterangan"
              name="keterangan"
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Tambahkan catatan..."
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-primary font-body-lg text-body-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-stack-md flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-headline-md text-headline-md font-bold hover:bg-inverse-surface active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary-fixed shadow-md"
            >
              Simpan Transaksi
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-transparent text-on-surface-variant py-3 rounded-xl font-body-lg font-medium hover:bg-surface-container-low transition-colors text-center"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
