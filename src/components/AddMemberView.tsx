import React, { useState } from 'react';
import { Member } from '../types';

interface AddMemberViewProps {
  onSave: (member: Omit<Member, 'id' | 'initials'>) => void;
  onCancel: () => void;
}

export const AddMemberView: React.FC<AddMemberViewProps> = ({ onSave, onCancel }) => {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [kontak, setKontak] = useState('');
  const [jabatan, setJabatan] = useState<Member['jabatan']>('Anggota');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaLengkap.trim()) {
      alert('Masukkan nama lengkap anggota.');
      return;
    }

    onSave({
      namaLengkap: namaLengkap.trim(),
      kontak: kontak.trim(),
      jabatan,
    });
  };

  return (
    <main className="w-full max-w-3xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.08)] p-stack-lg border border-surface-container/60">
        <form onSubmit={handleSubmit} className="space-y-stack-lg">
          {/* Nama Lengkap */}
          <div className="space-y-stack-sm">
            <label className="block font-body-sm text-body-sm text-on-surface-variant font-medium" htmlFor="namaLengkap">
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline">person</span>
              </div>
              <input
                id="namaLengkap"
                name="namaLengkap"
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary font-body-lg text-body-lg transition-all"
              />
            </div>
          </div>

          {/* Email atau Nomor Telepon */}
          <div className="space-y-stack-sm">
            <label className="block font-body-sm text-body-sm text-on-surface-variant font-medium" htmlFor="kontak">
              Email atau Nomor Telepon
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline">contact_mail</span>
              </div>
              <input
                id="kontak"
                name="kontak"
                type="text"
                value={kontak}
                onChange={(e) => setKontak(e.target.value)}
                placeholder="Contoh: member@email.com atau 0812..."
                className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary font-body-lg text-body-lg transition-all"
              />
            </div>
          </div>

          {/* Jabatan */}
          <div className="space-y-stack-sm">
            <label className="block font-body-sm text-body-sm text-on-surface-variant font-medium" htmlFor="jabatan">
              Jabatan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline">badge</span>
              </div>
              <select
                id="jabatan"
                name="jabatan"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value as Member['jabatan'])}
                required
                className="block w-full pl-10 pr-10 py-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary font-body-lg text-body-lg appearance-none transition-all cursor-pointer"
              >
                <option value="Ketua">Ketua</option>
                <option value="Wakil Ketua">Wakil Ketua</option>
                <option value="Sekretaris">Sekretaris</option>
                <option value="Bendahara">Bendahara</option>
                <option value="Koordinator Bidang">Koordinator Bidang</option>
                <option value="Anggota">Anggota</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-outline">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-stack-md flex flex-col md:flex-row gap-stack-md">
            <button
              type="submit"
              className="w-full md:w-auto flex-1 bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-headline-md text-headline-md py-3 px-6 rounded-lg transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-sm font-bold"
            >
              <span className="material-symbols-outlined">save</span>
              Simpan Anggota
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full md:w-auto flex-1 bg-transparent hover:bg-surface-container-low text-on-surface-variant font-headline-md text-headline-md py-3 px-6 rounded-lg transition-colors border border-transparent hover:border-outline-variant active:scale-95 flex items-center justify-center"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
