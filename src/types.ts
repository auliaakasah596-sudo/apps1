export type TransactionType = 'masuk' | 'keluar';

export interface Transaction {
  id: string;
  type: TransactionType;
  nominal: number;
  kategori: string;
  tanggal: string; // e.g. "2023-10-24" or "24 Okt 2023"
  time: string; // e.g. "12:30 WIB"
  keterangan?: string;
  icon?: string;
}

export interface Member {
  id: string;
  namaLengkap: string;
  kontak: string;
  jabatan: 'Ketua' | 'Wakil Ketua' | 'Sekretaris' | 'Bendahara' | 'Koordinator Bidang' | 'Anggota';
  initials: string;
  avatarUrl?: string;
  bgColor?: string;
}

export type ActiveTab = 'beranda' | 'transaksi' | 'laporan' | 'profil' | 'tambah-transaksi' | 'tambah-anggota' | 'masuk';
