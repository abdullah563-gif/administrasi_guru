import React, { useState } from 'react';
import {
  Files,
  Download,
  Printer,
  CheckCircle2,
  FileText,
  CalendarCheck2,
  Award,
  Archive,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  SchoolProfile,
  TeacherProfile,
  LessonPlan,
  AnnualProgramItem,
  TeachingLog,
  GradeRecord,
} from '../../types';
import {
  exportLessonPlanDocx,
  exportProtaDocx,
  exportTeachingLogDocx,
  exportGradebookDocx,
} from '../../utils/docxExport';

interface DocumentCenterViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  lessonPlans: LessonPlan[];
  annualProgram: AnnualProgramItem[];
  teachingLogs: TeachingLog[];
  gradeRecords: GradeRecord[];
  onOpenPreview: (type: 'modul' | 'prota' | 'jurnal' | 'nilai') => void;
}

export const DocumentCenterView: React.FC<DocumentCenterViewProps> = ({
  school,
  teacher,
  lessonPlans,
  annualProgram,
  teachingLogs,
  gradeRecords,
  onOpenPreview,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<string>('Semua');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const documents = [
    ...lessonPlans.map((plan, idx) => ({
      id: plan.id,
      title: `Modul Ajar: ${plan.title}`,
      category: 'Perencanaan Pembelajaran',
      status: plan.status === 'approved' ? 'Disahkan' : 'Tervalidasi',
      date: plan.updatedAt,
      pages: 'Format Lengkap',
      type: 'modul' as const,
      onDownload: () => exportLessonPlanDocx(plan, school, teacher),
    })),
    ...(annualProgram.length > 0
      ? [
          {
            id: 'doc-prota',
            title: `Program Tahunan (Prota) - ${teacher.assignedClassLabel || 'Kelas Binaan'}`,
            category: 'Perencanaan Pembelajaran',
            status: 'Tervalidasi',
            date: new Date().toISOString().split('T')[0],
            pages: `${annualProgram.length} Baris Materi`,
            type: 'prota' as const,
            onDownload: () => exportProtaDocx(annualProgram, school, teacher, 'Mata Pelajaran'),
          },
        ]
      : []),
    ...(teachingLogs.length > 0
      ? [
          {
            id: 'doc-jurnal',
            title: `Jurnal Harian Mengajar (${teachingLogs.length} Pertemuan)`,
            category: 'Pelaksanaan Pembelajaran',
            status: 'Tervalidasi',
            date: teachingLogs[teachingLogs.length - 1]?.date || new Date().toISOString().split('T')[0],
            pages: `${teachingLogs.length} Sesi Pertemuan`,
            type: 'jurnal' as const,
            onDownload: () => exportTeachingLogDocx(teachingLogs, school, teacher),
          },
        ]
      : []),
    ...(gradeRecords.length > 0
      ? [
          {
            id: 'doc-nilai',
            title: `Rekapitulasi Hasil Belajar Siswa (${gradeRecords.length} Peserta Didik)`,
            category: 'Asesmen & Hasil Belajar',
            status: 'Tervalidasi',
            date: new Date().toISOString().split('T')[0],
            pages: `${gradeRecords.length} Siswa`,
            type: 'nilai' as const,
            onDownload: () => exportGradebookDocx(gradeRecords, school, teacher, 'Nilai'),
          },
        ]
      : []),
  ];

  const handleDownloadAll = async () => {
    if (documents.length === 0) {
      showNotice('Belum ada dokumen yang dibuat. Silakan buat modul atau input data terlebih dahulu.');
      return;
    }
    for (const doc of documents) {
      await doc.onDownload();
    }
    showNotice('Semua dokumen yang tersedia berhasil diunduh dalam format DOCX!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pusat Dokumen & Arsip Administrasi</h2>
          <p className="text-xs text-slate-500">
            Katalog resmi dokumen pembelajaran siap cetak dan ekspor format DOCX (Microsoft Word / Google Docs).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleDownloadAll}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Seluruh Paket (DOCX)</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center space-x-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Daftar Dokumen Resmi Siap Pakai ({documents.length} Berkas)
          </h3>
          <div className="text-xs text-slate-500">
            Format: Microsoft Word (.docx) & Cetak Terstandar A4
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-3.5">Nama Dokumen</th>
                <th className="py-3 px-3.5 w-44">Kategori Berkas</th>
                <th className="py-3 px-3.5 w-28 text-center">Tanggal Draf</th>
                <th className="py-3 px-3.5 w-28 text-center">Status</th>
                <th className="py-3 px-3.5 w-40 text-center">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 text-xs">Belum Ada Dokumen yang Dihasilkan</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                      Buat modul ajar, susun prota, isi jurnal, atau rekap nilai untuk mengunduh dan mencetak berkas resmi ber-Kop Surat.
                    </p>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-900 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{doc.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pl-6">{doc.pages} • Kop Surat Resmi</div>
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">{doc.category}</td>
                    <td className="py-3 px-3.5 text-center text-slate-500 font-mono text-[11px]">{doc.date}</td>
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.status === 'Disahkan'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenPreview(doc.type)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Pratinjau Resmi & Cetak PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={doc.onDownload}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg transition-colors border border-slate-200"
                          title="Unduh file .docx"
                        >
                          <Download className="w-3 h-3" />
                          <span>DOCX</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
