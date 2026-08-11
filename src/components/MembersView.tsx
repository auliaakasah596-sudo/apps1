import React, { useState } from 'react';
import { Member } from '../types';

interface MembersViewProps {
  members: Member[];
  onNavigate: (tab: 'tambah-anggota') => void;
  onDeleteMember?: (id: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  onNavigate,
  onDeleteMember,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredMembers = members.filter((m) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.namaLengkap.toLowerCase().includes(query) ||
      m.jabatan.toLowerCase().includes(query) ||
      m.kontak.toLowerCase().includes(query)
    );
  });

  const getRoleBadgeStyle = (jabatan: string) => {
    switch (jabatan) {
      case 'Ketua':
        return 'bg-secondary/10 text-secondary font-bold';
      case 'Bendahara':
        return 'bg-primary/10 text-primary font-bold';
      case 'Wakil Ketua':
      case 'Sekretaris':
        return 'bg-surface-container-high text-on-surface-variant font-bold';
      default:
        return 'bg-surface-variant text-on-surface-variant font-semibold';
    }
  };

  return (
    <main className="w-full max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg pb-32 md:pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-stack-lg gap-stack-md">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-bold">
            Daftar Anggota
          </h1>
          <p className="font-body-sm text-body-sm md:font-body-lg md:text-body-lg text-on-surface-variant mt-unit">
            Kelola anggota dan peran dalam organisasi.
          </p>
        </div>

        <button
          onClick={() => onNavigate('tambah-anggota')}
          className="bg-primary text-on-primary font-numeric-data text-numeric-data px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 font-semibold"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Tambah Anggota
        </button>
      </div>

      {/* Pengaturan Tampilan & Tema */}
      <div className="bg-surface-container-lowest rounded-xl p-5 mb-stack-lg border border-outline-variant/30 shadow-[0px_4px_12px_rgba(15,23,42,0.03)]">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">palette</span>
          Pengaturan Tampilan
        </h2>
        <div className="flex items-center justify-between p-3.5 bg-surface-container-low/60 rounded-lg border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isDarkMode ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              <span className="material-symbols-outlined text-xl">
                {isDarkMode ? 'dark_mode' : 'light_mode'}
              </span>
            </div>
            <div>
              <p className="font-numeric-data text-body-sm font-semibold text-on-surface">
                Mode Gelap (Dark Mode)
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant">
                {isDarkMode ? 'Tema gelap aktif untuk kenyamanan mata' : 'Tampilan terang default aplikasi'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={onToggleDarkMode}
            type="button"
            role="switch"
            aria-checked={isDarkMode}
            aria-label="Toggle Mode Gelap"
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isDarkMode ? 'bg-primary' : 'bg-outline-variant'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-surface-container-lowest shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-xs ${
                isDarkMode ? 'translate-x-5 text-primary' : 'translate-x-0 text-outline'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isDarkMode ? 'dark_mode' : 'light_mode'}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-stack-lg relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama atau peran..."
          className="w-full bg-surface border border-outline-variant text-on-surface rounded-lg py-3 pl-12 pr-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body-sm text-body-sm md:font-body-lg md:text-body-lg shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary p-1"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/30">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">person_search</span>
          <p className="font-body-lg text-on-surface-variant">Tidak ada anggota yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-surface rounded-xl p-stack-md flex items-center gap-stack-md border border-outline-variant/30 shadow-[0px_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0px_4px_12px_rgba(15,23,42,0.08)] transition-all group relative bg-surface-container-lowest"
            >
              {/* Avatar or Initials */}
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.namaLengkap}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-outline-variant/40"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-primary font-headline-md text-headline-md font-bold border border-outline-variant/20">
                  {member.initials}
                </div>
              )}

              {/* Member Details */}
              <div className="flex-grow min-w-0">
                <h3 className="font-numeric-data text-numeric-data text-on-surface group-hover:text-primary transition-colors font-semibold truncate">
                  {member.namaLengkap}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${getRoleBadgeStyle(
                      member.jabatan
                    )}`}
                  >
                    {member.jabatan}
                  </span>
                </div>
                {member.kontak && (
                  <p className="text-xs text-on-surface-variant truncate mt-1">{member.kontak}</p>
                )}
              </div>

              {/* Action Menu */}
              <div className="relative">
                <button
                  onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                  aria-label="Opsi anggota"
                  className="text-outline-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </button>

                {activeMenuId === member.id && (
                  <div className="absolute right-0 top-10 bg-surface-container-lowest shadow-lg rounded-lg border border-outline-variant/30 py-1 w-40 z-20">
                    <button
                      onClick={() => {
                        alert(`Kontak: ${member.kontak || 'Belum diisi'}`);
                        setActiveMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">info</span>
                      Detail Kontak
                    </button>
                    {onDeleteMember && (
                      <button
                        onClick={() => {
                          if (confirm(`Hapus ${member.namaLengkap} dari daftar anggota?`)) {
                            onDeleteMember(member.id);
                          }
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-error hover:bg-error-container/20 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Hapus Anggota
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};
