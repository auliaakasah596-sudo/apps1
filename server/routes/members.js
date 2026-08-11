import express from 'express';
import { readDB, writeDB } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET /api/members
router.get('/', authenticateToken, (req: any, res: any) => {
  const db = readDB();
  const userMembers = db.members.filter(
    (m: any) => m.userId === req.user.id || m.userId === 'user-default'
  );
  res.json(userMembers);
});

// POST /api/members
router.post('/', authenticateToken, (req: any, res: any) => {
  const { namaLengkap, kontak, jabatan, initials, avatarUrl, bgColor } = req.body;

  if (!namaLengkap || !jabatan) {
    return res.status(400).json({ message: 'Nama lengkap dan jabatan wajib diisi.' });
  }

  const db = readDB();

  let computedInitials = initials;
  if (!computedInitials) {
    const nameParts = namaLengkap.trim().split(' ');
    computedInitials = nameParts[0].charAt(0).toUpperCase();
    if (nameParts.length > 1) {
      computedInitials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    } else if (nameParts[0].length > 1) {
      computedInitials += nameParts[0].charAt(1).toUpperCase();
    }
  }

  const newMem = {
    id: `mem-${Date.now()}`,
    namaLengkap: namaLengkap.trim(),
    kontak: kontak || '',
    jabatan,
    initials: computedInitials,
    avatarUrl: avatarUrl || '',
    bgColor: bgColor || '',
    userId: req.user.id,
    createdAt: new Date().toISOString()
  };

  db.members.push(newMem);
  writeDB(db);

  res.status(201).json(newMem);
});

// DELETE /api/members/:id
router.delete('/:id', authenticateToken, (req: any, res: any) => {
  const { id } = req.params;
  const db = readDB();

  const initialLength = db.members.length;
  db.members = db.members.filter((m: any) => m.id !== id);

  if (db.members.length === initialLength) {
    return res.status(404).json({ message: 'Anggota tidak ditemukan.' });
  }

  writeDB(db);
  res.json({ message: 'Anggota berhasil dihapus.' });
});

export default router;
