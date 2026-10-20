import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  KeyRound,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  UserPlus,
  Building2,
  Sparkles,
  AlertCircle,
  X,
  ExternalLink,
  Ban,
  Shield,
  School,
  ArrowRight,
} from 'lucide-react';
import { User, RegisterPayload } from '../../types/auth';
import { authService } from '../../services/authService';

interface AdminPanelViewProps {
  currentUser: User;
  onClose?: () => void;
  onUserSelected?: (user: User) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  onClose,
  onUserSelected,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_activation' | 'active' | 'suspended'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('guru123');
  const [newUserNip, setNewUserNip] = useState('');
  const [newUserSchool, setNewUserSchool] = useState('');
  const [newUserSchoolType, setNewUserSchoolType] = useState<'SD' | 'MI'>('SD');

  // Load users from database
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await authService.getAdminUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Generate or Regenerate Token
  const handleGenerateToken = async (userId: string, userName: string) => {
    try {
      const res = await authService.generateToken(userId);
      if (res.success && res.token) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, activationToken: res.token, tokenCreatedAt: new Date().toISOString() } : u))
        );
        showToast(`Token baru untuk "${userName}" berhasil digenerate: ${res.token}`);
      }
    } catch (e) {
      showToast('Gagal men-generate token baru.');
    }
  };

  // Direct Activate
  const handleDirectActivate = async (userId: string, userName: string) => {
    try {
      const res = await authService.directActivate(userId);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: 'active', activatedAt: new Date().toISOString() } : u))
        );
        showToast(`Akun "${userName}" berhasil diaktifkan langsung.`);
      }
    } catch (e) {
      showToast('Gagal mengaktifkan akun.');
    }
  };

  // Toggle Suspended / Active
  const handleToggleStatus = async (userId: string, currentStatus: string, userName: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await authService.toggleStatus(userId, nextStatus);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
        );
        showToast(`Status "${userName}" diubah menjadi ${nextStatus === 'active' ? 'Aktif' : 'Dinonaktifkan'}.`);
      }
    } catch (e) {
      showToast('Gagal mengubah status.');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}" dari database?`)) {
      return;
    }
    try {
      const res = await authService.deleteUser(userId);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showToast(`Pengguna "${userName}" telah dihapus.`);
      }
    } catch (e) {
      showToast('Gagal menghapus pengguna.');
    }
  };

  // Copy token to clipboard
  const handleCopyToken = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    showToast(`Token "${token}" disalin ke clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add manual user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserSchool.trim()) {
      showToast('Harap lengkapi nama, email, dan sekolah.');
      return;
    }

    const payload: RegisterPayload = {
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      password: newUserPassword,
      nip: newUserNip.trim() || undefined,
      schoolName: newUserSchool.trim(),
      schoolType: newUserSchoolType,
    };

    const res = await authService.register(payload);
    if (res.success && res.user) {
      setUsers((prev) => [...prev, res.user!]);
      setIsAddingUser(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserNip('');
      setNewUserSchool('');
      showToast(`Guru "${res.user.name}" berhasil ditambahkan ke database!`);
    } else {
      showToast(res.message || 'Gagal mendaftarkan guru.');
    }
  };

  // Metrics
  const totalUsers = users.length;
  const pendingUsers = users.filter((u) => u.status === 'pending_activation');
  const activeUsers = users.filter((u) => u.status === 'active');
  const sdCount = users.filter((u) => u.schoolType === 'SD').length;
  const miCount = users.filter((u) => u.schoolType === 'MI').length;

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchFilter =
      filterStatus === 'all' ? true : u.status === filterStatus;
    const matchQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.nip && u.nip.includes(searchQuery)) ||
      (u.activationToken && u.activationToken.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchFilter && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Pusat Kendali & Database Akun</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Panel Admin & Manajemen Token Aktivasi
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Kelola data pendaftaran guru SD & MI. Setiap guru baru yang mendaftar akan muncul di panel ini secara real-time dan dapat diaktivasi menggunakan Kode Token resmi.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={loadUsers}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all border border-white/10 cursor-pointer"
              title="Perbarui data pendaftar"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Segarkan Data</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddingUser(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah Guru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Terdaftar</span>
            <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalUsers}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {sdCount} SD Negeri • {miCount} Madrasah
          </div>
        </div>

        {/* Pending Activation */}
        <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs relative overflow-hidden">
          {pendingUsers.length > 0 && (
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          )}
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Menunggu Aktivasi</span>
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-950">{pendingUsers.length}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            {pendingUsers.length > 0 ? 'Memerlukan generate token/aktivasi' : 'Semua pendaftar aktif'}
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-emerald-50/60 rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Akun Aktif</span>
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950">{activeUsers.length}</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            Akses penuh administrasi pembelajaran
          </div>
        </div>

        {/* Token summary */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sistem Token</span>
            <div className="p-2 bg-slate-100 rounded-xl text-emerald-700">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {users.filter((u) => u.activationToken).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Format: AG-XXXX-XXXX
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIP, sekolah, atau token..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({totalUsers})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending_activation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 ${
              filterStatus === 'pending_activation'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>Menunggu Aktivasi</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
              {pendingUsers.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterStatus === 'active'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Aktif ({activeUsers.length})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Daftar Pengguna & Token Database</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredUsers.length} dari total {totalUsers} akun terdaftar
            </p>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Tidak ada data pengguna yang sesuai kriteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Guru / Pengguna</th>
                  <th className="py-3 px-4">Unit Kerja & Jenjang</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4">Token Aktivasi Panel Admin</th>
                  <th className="py-3 px-4 text-right">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isUserAdmin = user.role === 'admin';
                  const isPending = user.status === 'pending_activation';
                  const isActive = user.status === 'active';
                  const isSuspended = user.status === 'suspended';

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isPending ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Name & Email & NIP */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isUserAdmin
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : isPending
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                              <span>{user.name}</span>
                              {isUserAdmin && (
                                <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 text-[11px]">{user.email}</div>
                            {user.nip && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                NIP: {user.nip}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* School & Type */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 text-xs">{user.schoolName}</div>
                        <div className="mt-0.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              user.schoolType === 'MI'
                                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {user.schoolType === 'MI' ? 'Madrasah (MI)' : 'Sekolah Dasar (SD)'}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {isPending && (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px] border border-amber-300/80">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Menunggu Aktivasi</span>
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-300/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Aktif</span>
                          </span>
                        )}
                        {isSuspended && (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-semibold text-[11px] border border-rose-300/80">
                            <Ban className="w-3.5 h-3.5 text-rose-700" />
                            <span>Dinonaktifkan</span>
                          </span>
                        )}
                      </td>

                      {/* Activation Token Info */}
                      <td className="py-3.5 px-4">
                        {user.activationToken ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 font-mono text-xs font-bold text-slate-800 tracking-wider">
                                {user.activationToken}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyToken(user.activationToken!, user.id)}
                                className="p-1 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="Salin Kode Token"
                              >
                                {copiedId === user.id ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Dibuat: {new Date(user.tokenCreatedAt || user.registeredAt).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Belum digenerate
                          </span>
                        )}
                      </td>

                      {/* Admin Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Generate Token Button */}
                          <button
                            type="button"
                            onClick={() => handleGenerateToken(user.id, user.name)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                            title="Generate token baru untuk guru ini"
                          >
                            <KeyRound className="w-3 h-3 text-amber-600" />
                            <span>Generate Token</span>
                          </button>

                          {/* Direct Activate Button (for pending users) */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleDirectActivate(user.id, user.name)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                              title="Aktivasi langsung akun ini"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Aktivasi</span>
                            </button>
                          )}

                          {/* Toggle Active / Suspended (Non-admin only) */}
                          {!isUserAdmin && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user.id, user.status, user.name)}
                              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                isSuspended
                                  ? 'text-emerald-700 hover:bg-emerald-50'
                                  : 'text-slate-500 hover:text-amber-700 hover:bg-amber-50'
                              }`}
                              title={isSuspended ? 'Aktifkan Kembali' : 'Nonaktifkan Akun'}
                            >
                              {isSuspended ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {/* Delete User */}
                          {!isUserAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Tambah Akun Guru Baru</h3>
                  <p className="text-xs text-slate-500">Didaftarkan langsung oleh Administrator</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingUser(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Guru *
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="contoh: Ahmad Farhan, S.Pd."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    value={newUserNip}
                    onChange={(e) => setNewUserNip(e.target.value)}
                    placeholder="1987..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenjang Satuan
                  </label>
                  <select
                    value={newUserSchoolType}
                    onChange={(e) => setNewUserSchoolType(e.target.value as 'SD' | 'MI')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <input
                  type="text"
                  value={newUserSchool}
                  onChange={(e) => setNewUserSchool(e.target.value)}
                  placeholder="contoh: SDN 04 Pagi"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Akun *
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="ahmad@guru.sd.belajar.id"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Awal
                </label>
                <input
                  type="text"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="guru123"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Simpan & Daftarkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
