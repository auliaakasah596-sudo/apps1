import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, Transaction, Member } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_MEMBERS } from './data/initialData';
import { HeaderBar, BottomNav } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { AddTransactionView } from './components/AddTransactionView';
import { ReportView } from './components/ReportView';
import { MembersView } from './components/MembersView';
import { AddMemberView } from './components/AddMemberView';
import { LoginView } from './components/LoginView';
import { api, UserProfile } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [previousTab, setPreviousTab] = useState<ActiveTab>('beranda');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Members state
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  // Dark Mode state with persistence and system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('uangkas_theme');
      if (savedTheme !== null) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('uangkas_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('uangkas_theme', 'light');
      }
    } catch {
      // Ignore
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Initial user session check & data fetch from backend
  useEffect(() => {
    async function loadInitialData() {
      try {
        const currentUser = await api.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);

          // Load data from API
          try {
            const [txs, mems] = await Promise.all([
              api.fetchTransactions(),
              api.fetchMembers()
            ]);
            setTransactions(txs);
            if (mems && mems.length > 0) setMembers(mems);
          } catch (err) {
            console.warn('Backend server offline or unreachable, fallback to initial state:', err);
          }
        }
      } catch (err) {
        console.error('Error loading initial session:', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadInitialData();
  }, []);

  const handleNavigate = (newTab: ActiveTab) => {
    if (activeTab !== 'tambah-transaksi' && activeTab !== 'tambah-anggota' && activeTab !== 'masuk') {
      setPreviousTab(activeTab);
    }
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = async (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setIsLoggedIn(true);

    try {
      const [txs, mems] = await Promise.all([
        api.fetchTransactions(),
        api.fetchMembers()
      ]);
      setTransactions(txs);
      if (mems && mems.length > 0) setMembers(mems);
    } catch {
      // Fallback
    }

    handleNavigate('beranda');
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setIsLoggedIn(false);
    setTransactions([]);
    handleNavigate('masuk');
  };

  const handleSaveTransaction = async (txData: Omit<Transaction, 'id'>) => {
    try {
      const savedTx = await api.addTransaction(txData);
      setTransactions((prev) => [savedTx, ...prev]);
    } catch (err) {
      // Local state fallback if backend isn't available
      const localTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}`,
      };
      setTransactions((prev) => [localTx, ...prev]);
    }
    handleNavigate(previousTab === 'tambah-transaksi' ? 'transaksi' : previousTab);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
    } catch {
      // Ignore
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetData = async () => {
    if (window.confirm('Apakah Anda yakin ingin meriset seluruh transaksi dan saldo mulai dari Rp 0?')) {
      try {
        await api.resetTransactions();
      } catch {
        // Ignore
      }
      setTransactions([]);
    }
  };

  const handleLoadSampleData = async () => {
    try {
      for (const tx of INITIAL_TRANSACTIONS) {
        await api.addTransaction(tx);
      }
      const updated = await api.fetchTransactions();
      setTransactions(updated);
    } catch {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  };

  const handleSaveMember = async (memData: Omit<Member, 'id' | 'initials'>) => {
    try {
      const savedMem = await api.addMember(memData);
      setMembers((prev) => [...prev, savedMem]);
    } catch (err) {
      const nameParts = memData.namaLengkap.trim().split(' ');
      let initials = nameParts[0].charAt(0).toUpperCase();
      if (nameParts.length > 1) {
        initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
      } else if (nameParts[0].length > 1) {
        initials += nameParts[0].charAt(1).toUpperCase();
      }
      const localMem: Member = {
        ...memData,
        id: `mem-${Date.now()}`,
        initials,
      };
      setMembers((prev) => [...prev, localMem]);
    }
    handleNavigate('profil');
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await api.deleteMember(id);
    } catch {
      // Ignore
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Header Title based on active view
  let headerTitle = 'Uangkas';
  let showBack = false;

  if (activeTab === 'tambah-transaksi') {
    headerTitle = 'Tambah Transaksi';
    showBack = true;
  } else if (activeTab === 'tambah-anggota') {
    headerTitle = 'Tambah Anggota';
    showBack = true;
  } else if (activeTab === 'profil') {
    headerTitle = 'Daftar Anggota';
  } else if (activeTab === 'laporan') {
    headerTitle = 'Laporan Keuangan';
  } else if (activeTab === 'transaksi') {
    headerTitle = 'Riwayat Transaksi';
  }

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="font-body-lg text-on-surface font-semibold">Memuat Database Uangkas...</p>
        </div>
      </div>
    );
  }

  // Render Login view directly if selected
  if (activeTab === 'masuk' || !isLoggedIn) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="masuk"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onCancel={isLoggedIn ? () => handleNavigate(previousTab) : undefined}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-lg antialiased">
      {/* Top Header Navigation */}
      <HeaderBar
        title={headerTitle}
        showBack={showBack}
        onBack={() => handleNavigate(previousTab)}
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => handleNavigate('masuk')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Logged in User Bar */}
      {user && (
        <div className="bg-surface-container-low border-b border-outline-variant/20 px-container-padding-mobile md:px-container-padding-desktop py-1.5 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-on-surface-variant font-medium">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Terhubung sebagai: <strong className="text-primary font-bold">{user.namaLengkap}</strong> ({user.email})</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-error font-bold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Keluar
          </button>
        </div>
      )}

      {/* Main Content Area with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-grow w-full flex flex-col"
        >
          {activeTab === 'beranda' && (
            <DashboardView
              transactions={transactions}
              onNavigate={(tab) => handleNavigate(tab)}
              initialBalance={0}
              onResetData={handleResetData}
              onLoadSampleData={handleLoadSampleData}
            />
          )}

          {activeTab === 'transaksi' && (
            <TransactionsView
              transactions={transactions}
              onNavigate={(tab) => handleNavigate(tab)}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'tambah-transaksi' && (
            <AddTransactionView
              onSave={handleSaveTransaction}
              onCancel={() => handleNavigate(previousTab)}
            />
          )}

          {activeTab === 'laporan' && (
            <ReportView transactions={transactions} />
          )}

          {activeTab === 'profil' && (
            <MembersView
              members={members}
              onNavigate={(tab) => handleNavigate(tab)}
              onDeleteMember={handleDeleteMember}
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />
          )}

          {activeTab === 'tambah-anggota' && (
            <AddMemberView
              onSave={handleSaveMember}
              onCancel={() => handleNavigate('profil')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => handleNavigate('masuk')}
      />
    </div>
  );
}
