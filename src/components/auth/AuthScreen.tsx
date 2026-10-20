import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  School,
  IdCard,
} from 'lucide-react';
import { User, RegisterPayload, LoginPayload } from '../../types/auth';
import { authService } from '../../services/authService';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regSchoolName, setRegSchoolName] = useState('');
  const [regSchoolType, setRegSchoolType] = useState<'SD' | 'MI'>('SD');

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Mohon lengkapi email dan kata sandi.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: LoginPayload = {
        email: loginEmail.trim(),
        password: loginPassword,
      };
      const res = await authService.login(payload);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Email atau kata sandi tidak cocok.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword || !regSchoolName.trim()) {
      setErrorMsg('Nama lengkap, email, sekolah, dan kata sandi wajib diisi.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter demi keamanan akun.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: RegisterPayload = {
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        nip: regNip.trim() || undefined,
        schoolName: regSchoolName.trim(),
        schoolType: regSchoolType,
      };

      const res = await authService.register(payload);
      if (res.success && res.user) {
        setSuccessMsg(
          'Pendaftaran berhasil tersimpan dalam database! Akun Anda sedang menunggu aktivasi dengan Token dari Panel Admin.'
        );
        // Automatically switch to login with prefilled credentials
        setLoginEmail(res.user.email);
        setLoginPassword(regPassword);
        setTimeout(() => {
          setMode('login');
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Gagal melakukan pendaftaran.');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung dengan database server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Logins for instant review
  const handleQuickLogin = async (email: string, pass: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoginEmail(email);
    setLoginPassword(pass);
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password: pass });
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Login demo gagal.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 text-slate-100 relative">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 mb-4 ring-4 ring-emerald-500/20">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Guru SD & MI
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-sm mx-auto">
            Platform Administrasi Pembelajaran Terpadu, RPP/Modul Ajar, Prota, Promes, & Asesmen
          </p>
          <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sistem Database & Keamanan Token Aktivasi Panel Admin</span>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-slate-900">
          {/* Tabs: Masuk / Daftar */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Daftar Akun Guru
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Akun / Belajar.id
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@guru.sd.belajar.id atau email Anda"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Administrator Portal Access */}
              <div className="mt-5 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Portal Administrator:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@adminguru.id', 'admin123')}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Login sbg Admin</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Guru (dengan gelar) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="contoh: Siti Nurhaliza, S.Pd."
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP / NUPTK / NIK
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <IdCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={regNip}
                      onChange={(e) => setRegNip(e.target.value)}
                      placeholder="198904122019032005"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenjang Satuan *
                  </label>
                  <select
                    value={regSchoolType}
                    onChange={(e) => setRegSchoolType(e.target.value as 'SD' | 'MI')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  >
                    <option value="SD">SD (Sekolah Dasar)</option>
                    <option value="MI">MI (Madrasah Ibtidaiyah)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Sekolah / Madrasah *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regSchoolName}
                    onChange={(e) => setRegSchoolName(e.target.value)}
                    placeholder="contoh: SDN 01 Rawamangun atau MIN 1"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Akun *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="guru@sekolah.sch.id / belajar.id"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ulangi Sandi *
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang sandi"
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                <span className="font-semibold">Informasi Aktivasi:</span> Setelah pendaftaran tersimpan ke database, akun Anda akan muncul di <strong>Panel Admin</strong>. Anda wajib memasukkan <strong>Kode Token Aktivasi</strong> yang digenerate oleh Admin untuk mengaktifkan akun.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <span>Menyimpan ke Database...</span>
                ) : (
                  <>
                    <span>Daftar Akun Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Kementerian Pendidikan Dasar & Menengah • Kementerian Agama Republik Indonesia
        </p>
      </div>
    </div>
  );
};
