import { Transaction } from '../types';

/**
 * Utility to export transactions to CSV/Excel format compatible with MS Excel & Google Sheets.
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  filenamePrefix: string = 'Laporan_Keuangan',
  selectedPeriod: string = 'Semua Periode'
) {
  if (transactions.length === 0) {
    alert('Tidak ada data transaksi untuk diekspor.');
    return;
  }

  // BOM for UTF-8 Excel compatibility
  const BOM = '\uFEFF';

  // Calculate summary
  const totalIncome = transactions
    .filter((t) => t.type === 'masuk')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'keluar')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const netBalance = totalIncome - totalExpense;

  // Header rows with metadata for Treasurer
  const metaLines = [
    `"LAPORAN KEUANGAN KAS ORGANISASI"`,
    `"Periode: ${selectedPeriod}"`,
    `"Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}"`,
    `""`,
    `"RINGKASAN KEUANGAN"`,
    `"Total Pemasukan (Rp)";${totalIncome}`,
    `"Total Pengeluaran (Rp)";${totalExpense}`,
    `"Saldo Bersih (Rp)";${netBalance}`,
    `""`,
    `"RINCIAN TRANSAKSI"`,
  ];

  // Column headers
  const tableHeaders = [
    'No',
    'ID Transaksi',
    'Tanggal',
    'Waktu',
    'Jenis Transaksi',
    'Kategori',
    'Nominal (Rp)',
    'Keterangan',
  ];

  // Data rows
  const dataRows = transactions.map((tx, idx) => {
    const jenis = tx.type === 'masuk' ? 'Pemasukan' : 'Pengeluaran';
    const keteranganClean = (tx.keterangan || '-').replace(/"/g, '""');
    const kategoriClean = tx.kategori.replace(/"/g, '""');

    return [
      idx + 1,
      `"${tx.id}"`,
      `"${tx.tanggal}"`,
      `"${tx.time || '-'}"`,
      `"${jenis}"`,
      `"${kategoriClean}"`,
      tx.nominal,
      `"${keteranganClean}"`,
    ].join(';');
  });

  const csvBody = [
    ...metaLines,
    tableHeaders.join(';'),
    ...dataRows,
  ].join('\n');

  const fullContent = BOM + csvBody;

  // Create Blob and trigger download
  const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const sanitizedPeriod = selectedPeriod.replace(/\s+/g, '_');
  const filename = `${filenamePrefix}_${sanitizedPeriod}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
