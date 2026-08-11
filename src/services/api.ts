import { Transaction, Member } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('uangkas_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export interface UserProfile {
  id: string;
  email: string;
  namaLengkap: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  message?: string;
}

export const api = {
  // Authentication
  async register(namaLengkap: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ namaLengkap, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registrasi gagal.');
    }

    localStorage.setItem('uangkas_token', data.token);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login gagal. Periksa email dan password.');
    }

    localStorage.setItem('uangkas_token', data.token);
    return data;
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const token = localStorage.getItem('uangkas_token');
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        localStorage.removeItem('uangkas_token');
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('uangkas_token');
  },

  // Transactions
  async fetchTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE}/transactions`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data transaksi dari server.');
    }

    return res.json();
  },

  async addTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tx)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Gagal menyimpan transaksi.');
    }

    return res.json();
  },

  async deleteTransaction(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Gagal menghapus transaksi dari server.');
    }
  },

  async resetTransactions(): Promise<void> {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Gagal membersihkan transaksi.');
    }
  },

  // Members
  async fetchMembers(): Promise<Member[]> {
    const res = await fetch(`${API_BASE}/members`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil daftar anggota.');
    }

    return res.json();
  },

  async addMember(mem: Omit<Member, 'id' | 'initials'>): Promise<Member> {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(mem)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Gagal menyimpan anggota.');
    }

    return res.json();
  },

  async deleteMember(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Gagal menghapus anggota.');
    }
  }
};
