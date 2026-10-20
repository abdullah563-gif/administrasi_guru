import React, { useState } from 'react';
import {
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Copy,
  LogOut,
  Building2,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { User } from '../../types/auth';
import { authService } from '../../services/authService';

interface ActivationPendingScreenProps {
  user: User;
  onActivated: (updatedUser: User) => void;
  onLogout: () => void;
}

export const ActivationPendingScreen: React.FC<ActivationPendingScreenProps> = ({
  user,
  onActivated,
  onLogout,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Handle Token Submission
  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanToken = tokenInput.trim();
    if (!cleanToken) {
      setErrorMsg('Harap masukkan Kode Token Aktivasi yang Anda terima dari Administrator.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.activateWithToken({
        userId: user.id,
        token: cleanToken,
      });

      if (res.success && res.user) {
        setSuccessMsg('Verifikasi berhasil! Akun Anda telah aktif.');
        setTimeout(() => {
          onActivated(res.user!);
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Kode Token Aktivasi tidak valid atau belum sesuai.');
      }
    } catch (err) {
      setErrorMsg('Gagal melakukan verifikasi ke database server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/95 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 text-slate-100 relative">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        {/* Header Alert Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-xl mb-3">
            <KeyRound className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Menunggu Aktivasi Akun Guru</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Verifikasi Token Panel Admin
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Akun Anda telah berhasil terdaftar dalam database. Untuk membuka akses administrasi pembelajaran, masukkan Kode Token Aktivasi yang diterbitkan oleh Operator / Admin Sekolah.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-100">
          {/* User Registration Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Data Pendaftaran Anda di Database:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Nama Guru:</span>
                <span className="font-semibold text-slate-900 text-sm">{user.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">NIP / NUPTK:</span>
                <span className="font-semibold text-slate-900">{user.nip || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email Terdaftar:</span>
                <span className="font-semibold text-slate-900">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Asal Sekolah:</span>
                <span className="font-semibold text-emerald-800">{user.schoolName} ({user.schoolType})</span>
              </div>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{successMsg}</div>
            </div>
          )}

          {/* Form Token Input */}
          <form onSubmit={handleVerifyToken} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Masukkan Kode Token Aktivasi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                </div>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  placeholder="Contoh: AG-8419-7201"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-amber-50/40 border-2 border-amber-300/80 rounded-xl text-base font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal placeholder:font-sans"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Format token biasanya diawali dengan <code>AG-</code> diikuti 8 digit karakter acak.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!successMsg}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Memvalidasi Token...</span>
              ) : successMsg ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Akses Terbuka! Memuat...</span>
                </>
              ) : (
                <>
                  <span>Aktifkan Akun Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guidance Info */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800 block mb-1">Informasi Aktivasi:</span>
              Data pendaftaran Anda telah tercatat di database sekolah. Kode Token diterbitkan secara resmi melalui <strong>Panel Administrator</strong> oleh Kepala Sekolah atau Operator Kurikulum untuk memverifikasi penugasan guru.
            </div>
          </div>

          {/* Logout Action */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar / Ganti ke Akun Lain</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
