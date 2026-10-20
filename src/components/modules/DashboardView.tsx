import React from 'react';
import {
  FileText,
  CalendarCheck2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Printer,
  Download,
  BookOpen,
  Award,
  Users,
  ShieldAlert,
} from 'lucide-react';
import {
  SchoolProfile,
  TeacherProfile,
  LessonPlan,
  TeachingLog,
  GradeRecord,
  ComplianceCheck,
  AnnualProgramItem,
} from '../../types';
import { ActiveTab } from '../layout/Sidebar';

interface DashboardViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  lessonPlans: LessonPlan[];
  annualProgram?: AnnualProgramItem[];
  teachingLogs: TeachingLog[];
  gradeRecords: GradeRecord[];
  complianceChecks: ComplianceCheck[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenPreview: (type: 'modul' | 'prota' | 'jurnal' | 'nilai') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  school,
  teacher,
  lessonPlans,
  annualProgram = [],
  teachingLogs,
  gradeRecords,
  complianceChecks,
  onNavigate,
  onOpenPreview,
}) => {
  const completedChecks = complianceChecks.filter((c) => c.status === 'Lengkap').length;
  const progressPercent = Math.round((completedChecks / complianceChecks.length) * 100);

  const passingStudents = gradeRecords.filter((g) => g.status === 'Tuntas').length;
  const passingRate = Math.round((passingStudents / (gradeRecords.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tahun Ajaran {school.academicYear} • Semester {school.currentSemester}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang{teacher.fullName.trim() ? `, ${teacher.fullName}` : ', Bapak/Ibu Guru'}
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Platform otomatisasi administrasi pembelajaran {school.type} {school.name.trim() ? `(${school.name})` : ''}.
            Semua data siap diisi dari awal, terintegrasi data master, tersinkronisasi kurikulum nasional, dan siap ekspor DOCX/PDF.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('lesson_plan')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Susun Modul Ajar (+ AI)</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('teaching_delivery')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/20"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Isi Jurnal Pembelajaran Hari Ini</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPreview('modul')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/20"
            >
              <Printer className="w-4 h-4" />
              <span>Pratinjau & Cetak Resmi</span>
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kelengkapan Berkas
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{progressPercent}%</span>
            <span className="text-xs text-emerald-700 font-medium">Sesuai Regulasi</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Modul Ajar / RPP
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{lessonPlans.length}</span>
            <span className="text-xs text-slate-500">Tersedia</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center">
            {lessonPlans.length > 0 ? (
              <span className="text-emerald-700 font-medium mr-1">Berdiferensiasi (PBL/Inkuiri)</span>
            ) : (
              <span>Belum ada modul ajar tersimpan</span>
            )}
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Jurnal Mengajar
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{teachingLogs.length}</span>
            <span className="text-xs text-slate-500">Pertemuan Terekam</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {teachingLogs.length > 0
              ? `Terakhir: ${teachingLogs[teachingLogs.length - 1]?.date}`
              : 'Belum ada sesi tatap muka'}
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ketuntasan Siswa
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{gradeRecords.length > 0 ? `${passingRate}%` : '0%'}</span>
            <span className="text-xs text-slate-500">
              ({passingStudents}/{gradeRecords.length} Siswa)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {gradeRecords.length > 0
              ? gradeRecords.length - passingStudents > 0
                ? `${gradeRecords.length - passingStudents} siswa perlu remedial`
                : 'Semua siswa tuntas'
              : 'Belum ada data nilai'}
          </p>
        </div>
      </div>

      {/* Main Grid: Checklist & Quick Exports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checklist Administrasi Guru */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pemeriksaan Kelengkapan Berkas Administrasi
              </h2>
              <p className="text-xs text-slate-500">
                Diverifikasi terhadap Permendikdasmen No. 1/2026 dan Standar Akreditasi
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('regulation_engine')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>Lihat Regulasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {complianceChecks.map((item) => (
              <div key={item.id} className="py-3 flex items-start justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {item.status === 'Lengkap' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.notes}</p>
                    <span className="inline-block mt-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      Dasar: {item.regulationSource}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    item.status === 'Lengkap'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Instant Official Exports */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Aksi Cepat Ekspor</h2>
            <p className="text-xs text-slate-500">
              Unduh dokumen berformat Word atau cetak ke PDF dengan Kop Surat otomatis
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onOpenPreview('modul')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Modul Ajar / RPP {lessonPlans[0]?.subject ? `(${lessonPlans[0].subject})` : ''}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {lessonPlans.length > 0 ? `${lessonPlans.length} Modul Tersedia` : 'Format Baku Berdiferensiasi'}
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
            </button>

            <button
              type="button"
              onClick={() => onOpenPreview('prota')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Program Tahunan (Prota)</div>
                  <div className="text-[11px] text-slate-500">
                    {annualProgram.length > 0 ? `${annualProgram.length} Materi Pokok Terdata` : 'Distribusi Alokasi Jam (JP)'}
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
            </button>

            <button
              type="button"
              onClick={() => onOpenPreview('jurnal')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Jurnal Mengajar Harian</div>
                  <div className="text-[11px] text-slate-500">
                    {teachingLogs.length > 0 ? `${teachingLogs.length} Sesi Pertemuan` : 'Rekap Tatap Muka & Refleksi'}
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-700" />
            </button>

            <button
              type="button"
              onClick={() => onOpenPreview('nilai')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Rekap Nilai Siswa</div>
                  <div className="text-[11px] text-slate-500">
                    {gradeRecords.length > 0 ? `${gradeRecords.length} Siswa Terdata` : 'Format Penilaian Formatif & Sumatif'}
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 text-xs">
            <span className="font-semibold text-slate-900">Perhatian Pengesahan:</span> Seluruh
            ekspor otomatis menyertakan tanda tangan Kepala Sekolah{' '}
            {school.principalName ? `(${school.principalName})` : ''} dan Guru Kelas{' '}
            {teacher.fullName ? `(${teacher.fullName})` : ''} sesuai Data Master yang Anda atur.
          </div>
        </div>
      </div>
    </div>
  );
};
