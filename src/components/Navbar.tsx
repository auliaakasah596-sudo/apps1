import React from 'react';
import { ActiveTab } from '../types';
import { AVATAR_HEADER, AVATAR_SMALL } from '../data/initialData';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  unreadCount?: number;
}

export const HeaderBar: React.FC<{
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}> = ({
  title = 'Uangkas',
  showBack = false,
  onBack,
  activeTab,
  setActiveTab,
  isLoggedIn,
  onLoginClick,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  return (
    <header className="bg-surface dark:bg-background w-full sticky top-0 z-40 shadow-sm border-b border-outline-variant/20 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop h-16 w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="text-on-surface-variant hover:text-primary transition-colors p-2 -ml-2 rounded-full hover:bg-surface-container-low active:scale-95"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          ) : (
            <div
              className="w-9 h-9 rounded-full overflow-hidden bg-primary-container text-on-primary-container flex items-center justify-center border border-outline-variant/40 cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
              onClick={() => setActiveTab('profil')}
              title="Lihat Profil & Anggota"
            >
              <img
                src={AVATAR_HEADER}
                alt="User Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback icon if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="material-symbols-outlined text-sm font-bold">person</span>
            </div>
          )}
          <h1 className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
            {!showBack && (
              <span className="material-symbols-outlined text-2xl text-secondary filled">
                account_balance
              </span>
            )}
            {title}
          </h1>
        </div>

        {/* Desktop Header Links */}
        {!showBack && (
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('beranda')}
              className={`font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'beranda'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${activeTab === 'beranda' ? 'filled' : ''}`}>
                dashboard
              </span>
              Beranda
            </button>
            <button
              onClick={() => setActiveTab('transaksi')}
              className={`font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'transaksi'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${activeTab === 'transaksi' ? 'filled' : ''}`}>
                receipt_long
              </span>
              Transaksi
            </button>
            <button
              onClick={() => setActiveTab('laporan')}
              className={`font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'laporan'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${activeTab === 'laporan' ? 'filled' : ''}`}>
                analytics
              </span>
              Laporan
            </button>
            <button
              onClick={() => setActiveTab('profil')}
              className={`font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'profil'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${activeTab === 'profil' ? 'filled' : ''}`}>
                person
              </span>
              Profil & Anggota
            </button>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
              className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container-low transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}

          {!isLoggedIn ? (
            <button
              onClick={onLoginClick}
              className="text-body-sm font-semibold px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-inverse-surface transition-colors"
            >
              Masuk
            </button>
          ) : (
            <button
              aria-label="Notifications"
              className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container-low transition-colors active:scale-95 relative"
              onClick={() => alert('Notifikasi: Tidak ada pemberitahuan baru saat ini.')}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary"></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export const BottomNav: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  // Hide bottom nav on full-page modal/transactional forms or login view
  if (activeTab === 'tambah-transaksi' || activeTab === 'tambah-anggota' || activeTab === 'masuk') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0px_-4px_16px_rgba(15,23,42,0.1)] rounded-t-2xl md:hidden border-t border-outline-variant/30 pb-[max(12px,env(safe-area-inset-bottom))] pt-2">
      <div className="flex justify-around items-center px-1 max-w-lg mx-auto">
        {/* Beranda */}
        <button
          onClick={() => setActiveTab('beranda')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90 min-w-[60px] ${
            activeTab === 'beranda'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${activeTab === 'beranda' ? 'filled' : ''}`}>
            dashboard
          </span>
          <span className="font-label-caps text-[10px] mt-0.5 tracking-tight">Beranda</span>
        </button>

        {/* Transaksi */}
        <button
          onClick={() => setActiveTab('transaksi')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90 min-w-[60px] ${
            activeTab === 'transaksi'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${activeTab === 'transaksi' ? 'filled' : ''}`}>
            receipt_long
          </span>
          <span className="font-label-caps text-[10px] mt-0.5 tracking-tight">Transaksi</span>
        </button>

        {/* Laporan */}
        <button
          onClick={() => setActiveTab('laporan')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90 min-w-[60px] ${
            activeTab === 'laporan'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${activeTab === 'laporan' ? 'filled' : ''}`}>
            analytics
          </span>
          <span className="font-label-caps text-[10px] mt-0.5 tracking-tight">Laporan</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90 min-w-[60px] ${
            activeTab === 'profil'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${activeTab === 'profil' ? 'filled' : ''}`}>
            person
          </span>
          <span className="font-label-caps text-[10px] mt-0.5 tracking-tight">Profil</span>
        </button>
      </div>
    </nav>
  );
};
