import {
  GraduationCap,
  Building2,
  Calendar,
  CheckCircle2,
  Printer,
  Sparkles,
  School,
  LogOut,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { SchoolProfile, TeacherProfile } from '../../types';
import { User } from '../../types/auth';

interface NavbarProps {
  currentSchool: SchoolProfile;
  teacher: TeacherProfile;
  currentUser?: User | null;
  onSwitchSchool: (type: 'SD' | 'MI') => void;
  onOpenQuickPrint: () => void;
  onLogout?: () => void;
  completionRate: number;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSchool,
  teacher,
  currentUser,
  onSwitchSchool,
  onOpenQuickPrint,
  onLogout,
  completionRate,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            {onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                title="Buka Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Admin Guru</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  SD & MI
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Administrasi Pembelajaran Otomatis • Standar Permendikdasmen 2026
              </p>
            </div>
          </div>

          {/* School switcher & Academic info */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* School Type Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => onSwitchSchool('SD')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentSchool.type === 'SD'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SD Negeri
              </button>
              <button
                type="button"
                onClick={() => onSwitchSchool('MI')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentSchool.type === 'MI'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Madrasah (MI)
              </button>
            </div>

            {/* Academic badge */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>TP {currentSchool.academicYear}</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-slate-800">Sem. {currentSchool.currentSemester}</span>
            </div>

            {/* Progress pill */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kelengkapan:</span>
              <span className="font-bold text-emerald-900">{completionRate}%</span>
            </div>

            {/* Quick Print Button */}
            <button
              type="button"
              onClick={onOpenQuickPrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
              title="Cetak format resmi atau simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Cetak Dokumen</span>
            </button>

            {/* Active User Avatar & Logout */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-2 ${
                  currentUser?.role === 'admin'
                    ? 'bg-indigo-800 text-white ring-indigo-500/30'
                    : 'bg-slate-800 text-white ring-emerald-500/30'
                }`}
                title={currentUser ? `${currentUser.name} (${currentUser.role})` : teacher.fullName}
              >
                {currentUser?.name
                  ? currentUser.name.slice(0, 2).toUpperCase()
                  : teacher.fullName.trim()
                  ? teacher.fullName.slice(0, 2).toUpperCase()
                  : 'GR'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser?.name || teacher.fullName.trim() || 'Profil Guru'}
                </div>
                <div className="text-[11px] text-slate-500 leading-none flex items-center space-x-1 mt-0.5">
                  <span>{currentUser?.role === 'admin' ? 'Administrator' : teacher.assignedClassLabel.trim() || 'Guru'}</span>
                  {currentUser && (
                    <span className="text-emerald-600 font-bold">• Aktif</span>
                  )}
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1 cursor-pointer"
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
