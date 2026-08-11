import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'database.json');

// Helper to hash password with salt using built-in crypto
export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, storedHash: string, storedSalt: string) {
  const hash = crypto.pbkdf2Sync(password, storedSalt, 1000, 64, 'sha512').toString('hex');
  return hash === storedHash;
}

// Initial Data Seed
const DEFAULT_MEMBERS = [
  {
    id: 'mem-1',
    namaLengkap: 'Ahmad Santoso',
    kontak: 'ahmad.santoso@uangkas.org',
    jabatan: 'Ketua',
    initials: 'AS',
    userId: 'user-default'
  },
  {
    id: 'mem-2',
    namaLengkap: 'Budi Wijaya',
    kontak: 'budi.wijaya@uangkas.org',
    jabatan: 'Bendahara',
    initials: 'BW',
    userId: 'user-default'
  },
  {
    id: 'mem-3',
    namaLengkap: 'Citra Dewi',
    kontak: 'citra.dewi@uangkas.org',
    jabatan: 'Anggota',
    initials: 'CD',
    userId: 'user-default'
  }
];

const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'keluar',
    nominal: 50000,
    kategori: 'Makan Siang',
    tanggal: '2023-10-24',
    time: '12:30 WIB',
    keterangan: 'Makan siang bersama tim operasional',
    icon: 'restaurant',
    userId: 'user-default'
  },
  {
    id: 'tx-2',
    type: 'keluar',
    nominal: 30000,
    kategori: 'Bensin',
    tanggal: '2023-10-24',
    time: '08:15 WIB',
    keterangan: 'Bensin operasional kantor',
    icon: 'local_gas_station',
    userId: 'user-default'
  },
  {
    id: 'tx-3',
    type: 'masuk',
    nominal: 8500000,
    kategori: 'Gaji Bulanan',
    tanggal: '2023-10-23',
    time: '09:00 WIB',
    keterangan: 'Pencairan gaji bulanan',
    icon: 'account_balance_wallet',
    userId: 'user-default'
  }
];

export function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    const defaultAdminPass = hashPassword('admin123');
    const initialData = {
      users: [
        {
          id: 'user-default',
          email: 'admin@uangkas.org',
          namaLengkap: 'Administrator Kas',
          passwordHash: defaultAdminPass.hash,
          salt: defaultAdminPass.salt,
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ],
      transactions: DEFAULT_TRANSACTIONS,
      members: DEFAULT_MEMBERS
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

export function readDB() {
  initDB();
  try {
    const content = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { users: [], transactions: [], members: [] };
  }
}

export function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}
