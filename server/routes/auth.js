import express from 'express';
import crypto from 'crypto';
import { readDB, writeDB, hashPassword, verifyPassword } from '../db.js';

export const authRouter = express.Router();

// Simple secure token generator using crypto
const SECRET_KEY = 'uangkas_super_secret_jwt_key_2026';

function generateToken(user: any) {
  const payload = {
    id: user.id,
    email: user.email,
    namaLengkap: user.namaLengkap,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const strPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(strPayload).digest('base64url');
  return `${strPayload}.${signature}`;
}

function verifyTokenStr(token: string) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [strPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(strPayload).digest('base64url');
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(strPayload, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Middleware to authenticate token
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const payload = verifyTokenStr(token);
  if (!payload) {
    return res.status(403).json({ message: 'Token tidak valid atau telah kedaluwarsa.' });
  }

  req.user = payload;
  next();
}

// POST /api/auth/register
authRouter.post('/register', (req: any, res: any) => {
  const { email, password, namaLengkap } = req.body;

  if (!email || !password || !namaLengkap) {
    return res.status(400).json({ message: 'Nama lengkap, email, dan kata sandi wajib diisi.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Kata sandi minimal 6 karakter.' });
  }

  const db = readDB();
  const existingUser = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah terdaftar. Silakan login.' });
  }

  const { hash, salt } = hashPassword(password);
  const newUser = {
    id: `user-${Date.now()}`,
    email: email.toLowerCase(),
    namaLengkap: namaLengkap.trim(),
    passwordHash: hash,
    salt,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const token = generateToken(newUser);
  res.status(201).json({
    message: 'Registrasi berhasil!',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      namaLengkap: newUser.namaLengkap,
      role: newUser.role
    }
  });
});

// POST /api/auth/login
authRouter.post('/login', (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan kata sandi wajib diisi.' });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(400).json({ message: 'Email atau kata sandi salah.' });
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    return res.status(400).json({ message: 'Email atau kata sandi salah.' });
  }

  const token = generateToken(user);
  res.json({
    message: 'Login berhasil!',
    token,
    user: {
      id: user.id,
      email: user.email,
      namaLengkap: user.namaLengkap,
      role: user.role
    }
  });
});

// GET /api/auth/me
authRouter.get('/me', authenticateToken, (req: any, res: any) => {
  const db = readDB();
  const user = db.users.find((u: any) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      namaLengkap: user.namaLengkap,
      role: user.role
    }
  });
});
