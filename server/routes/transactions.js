import express from 'express';
import { readDB, writeDB } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET /api/transactions
router.get('/', authenticateToken, (req: any, res: any) => {
  const db = readDB();
  const userTransactions = db.transactions.filter(
    (t: any) => t.userId === req.user.id || t.userId === 'user-default'
  );
  res.json(userTransactions);
});

// POST /api/transactions
router.post('/', authenticateToken, (req: any, res: any) => {
  const { type, nominal, kategori, tanggal, time, keterangan, icon } = req.body;

  if (!type || !nominal || !kategori || !tanggal) {
    return res.status(400).json({ message: 'Data transaksi tidak lengkap.' });
  }

  const db = readDB();
  const newTx = {
    id: `tx-${Date.now()}`,
    type,
    nominal: Number(nominal),
    kategori,
    tanggal,
    time: time || '',
    keterangan: keterangan || '',
    icon: icon || (type === 'masuk' ? 'account_balance_wallet' : 'receipt'),
    userId: req.user.id,
    createdAt: new Date().toISOString()
  };

  db.transactions.unshift(newTx);
  writeDB(db);

  res.status(201).json(newTx);
});

// DELETE /api/transactions/:id
router.delete('/:id', authenticateToken, (req: any, res: any) => {
  const { id } = req.params;
  const db = readDB();

  const initialLength = db.transactions.length;
  db.transactions = db.transactions.filter((t: any) => t.id !== id);

  if (db.transactions.length === initialLength) {
    return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
  }

  writeDB(db);
  res.json({ message: 'Transaksi berhasil dihapus.' });
});

// DELETE /api/transactions (Reset All)
router.delete('/', authenticateToken, (req: any, res: any) => {
  const db = readDB();
  db.transactions = [];
  writeDB(db);
  res.json({ message: 'Seluruh data transaksi berhasil dibersihkan.' });
});

export default router;
