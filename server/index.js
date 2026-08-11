import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import { authRouter } from './routes/auth.js';
import transactionsRouter from './routes/transactions.js';
import membersRouter from './routes/members.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database on startup
initDB();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/members', membersRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Uangkas Database Server running normally.' });
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Uangkas Server Running on http://localhost:${PORT}`);
  console.log(`=================================`);
});
