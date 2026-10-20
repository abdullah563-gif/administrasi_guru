import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  KeyRound,
  LogOut,
  Database,
  Server,
  Sparkles,
  Settings,
  Activity,
  Layers,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { User } from '../../types/auth';
import { AdminPanelView } from './AdminPanelView';

interface AdminPortalLayoutProps {
  currentUser: User;
  onLogout: () => void;
}

type AdminTab = 'tokens' | 'all_users' | 'system_info';

export const AdminPortalLayout: React.FC<AdminPortalLayoutProps> = ({
  currentUser,
  onLogout,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('tokens');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Admin Executive Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Admin Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0 ring-2 ring-indigo-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                    PANEL ADMINISTRATOR
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Sistem Pusat
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Pusat Kendali Pengguna, Lisensi, & Token Aktivasi Guru SD/MI
                </p>
              </div>
            </div>

            {/* Cloud Status & Admin Profile */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Cloud Database Badge */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium text-slate-300">Cloud Firestore:</span>
                <span className="text-emerald-400 font-bold">Aktif</span>
              </div>

              {/* Admin Identity */}
              <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner ring-2 ring-indigo-400/30">
                  {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-indigo-400 font-medium">
                    Super Administrator
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors cursor-pointer ml-1"
                  title="Keluar dari Panel Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Portal Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Bar inside Admin Portal */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveAdminTab('tokens')}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeAdminTab === 'tokens'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Manajemen Pendaftar & Token Aktivasi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('system_info')}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeAdminTab === 'system_info'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Konfigurasi & Database Cloud</span>
            </button>
          </div>

          <div className="hidden sm:block text-xs text-slate-400">
            Terpisah dari Lingkungan Administrasi Pembelajaran Guru
          </div>
        </div>

        {/* Tab 1: Token & User Management */}
        {activeAdminTab === 'tokens' && (
          <AdminPanelView currentUser={currentUser} />
        )}

        {/* Tab 2: System & Cloud Configuration */}
        {activeAdminTab === 'system_info' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Status Infrastruktur Database Cloud</h3>
                  <p className="text-xs text-slate-400">Penyimpanan Terdistribusi & Keamanan Akses Token</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Database Cloud</span>
                  <div className="text-base font-bold text-white flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Firebase Firestore</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    ID: ai-studio-remixadminguruad-...
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Keamanan Data (ABAC)</span>
                  <div className="text-base font-bold text-white flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Firestore Security Rules</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Aturan Ter-deploy & Tervalidasi
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Isolasi Hak Akses</span>
                  <div className="text-base font-bold text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Portal Terpisah 100%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Guru tidak dapat mengakses panel ini
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-indigo-300 block mb-1">SOP Aktivasi Guru:</span>
                1. Setiap guru yang mendaftar melalui form registrasi akan secara otomatis muncul di tab <strong>Manajemen Pendaftar & Token</strong>.<br/>
                2. Klik tombol <strong>Generate Token</strong> untuk menerbitkan kode aktivasi unik (format: <code>AG-XXXX-XXXX</code>).<br/>
                3. Salin dan kirimkan token tersebut kepada guru bersangkutan, atau klik <strong>Aktivasi Langsung</strong> jika verifikasi dilakukan secara tatap muka.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
