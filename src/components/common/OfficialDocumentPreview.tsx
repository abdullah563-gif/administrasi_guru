import React from 'react';
import { Download, Printer, X, FileText, CheckCircle2 } from 'lucide-react';
import {
  SchoolProfile,
  TeacherProfile,
  LessonPlan,
  AnnualProgramItem,
  TeachingLog,
  GradeRecord,
  AssessmentItem,
} from '../../types';
import {
  exportLessonPlanDocx,
  exportProtaDocx,
  exportTeachingLogDocx,
  exportGradebookDocx,
} from '../../utils/docxExport';

export type PreviewDocType = 'modul' | 'prota' | 'jurnal' | 'nilai' | 'asesmen';

interface OfficialDocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  docType: PreviewDocType;
  school: SchoolProfile;
  teacher: TeacherProfile;
  activePlan?: LessonPlan;
  annualItems?: AnnualProgramItem[];
  teachingLogs?: TeachingLog[];
  gradeRecords?: GradeRecord[];
  assessment?: AssessmentItem;
}

export const OfficialDocumentPreview: React.FC<OfficialDocumentPreviewProps> = ({
  isOpen,
  onClose,
  docType,
  school,
  teacher,
  activePlan,
  annualItems = [],
  teachingLogs = [],
  gradeRecords = [],
  assessment,
}) => {
  if (!isOpen) return null;

  const handleDownloadDocx = () => {
    if (docType === 'modul' && activePlan) {
      exportLessonPlanDocx(activePlan, school, teacher);
    } else if (docType === 'prota') {
      exportProtaDocx(annualItems, school, teacher, 'Ilmu Pengetahuan Alam dan Sosial (IPAS)');
    } else if (docType === 'jurnal') {
      exportTeachingLogDocx(teachingLogs, school, teacher);
    } else if (docType === 'nilai') {
      exportGradebookDocx(gradeRecords, school, teacher, 'IPAS');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Toolbar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white no-print">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-base tracking-tight">
              Pratinjau Dokumen Resmi Administrasi Guru
            </h3>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              Format Baku A4
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadDocx}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh DOCX (Word)</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Sheet Preview */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
          <div className="bg-white shadow-xl max-w-[210mm] w-full p-8 sm:p-12 min-h-[297mm] text-slate-900 font-serif leading-relaxed border border-slate-300 print:border-none print:shadow-none print:p-0">
            {/* Kop Surat Resmi */}
            <div className="text-center pb-3 border-b-4 border-double border-slate-900 mb-6">
              <h4 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
                {school.type === 'MI'
                  ? 'KEMENTERIAN AGAMA REPUBLIK INDONESIA'
                  : `PEMERINTAH DAERAH ${school.province.toUpperCase()}`}
              </h4>
              <h3 className="text-base font-extrabold text-slate-900 uppercase">
                {school.type === 'MI'
                  ? `KANTOR KEMENTERIAN AGAMA ${school.city.toUpperCase()}`
                  : `DINAS PENDIDIKAN ${school.city.toUpperCase()}`}
              </h3>
              <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight my-0.5">
                {school.name}
              </h2>
              <p className="text-xs text-slate-600 italic">
                {school.address}, {school.city}. NPSN: {school.npsn}{' '}
                {school.nsm ? `| NSM: ${school.nsm}` : ''} | Kode Pos: {school.postalCode}
              </p>
            </div>

            {/* Document Content Renderers */}
            {docType === 'modul' && !activePlan && (
              <div className="text-center py-16 text-slate-500 font-sans text-xs">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-800">Belum Ada Modul Ajar</p>
                <p className="mt-1 text-slate-400">Silakan susun modul ajar di menu Modul Ajar / RPP untuk melihat pratinjau lembar resmi ini.</p>
              </div>
            )}

            {docType === 'modul' && activePlan && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 uppercase underline tracking-wide">
                    MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN (RPP)
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-sans">
                    Tahun Ajaran {school.academicYear} | Semester {activePlan.semester}
                  </p>
                </div>

                <div className="mb-6 font-sans text-xs">
                  <div className="font-bold text-sm font-serif mb-2 text-slate-900 uppercase">
                    A. INFORMASI UMUM
                  </div>
                  <table className="w-full border-collapse border border-slate-400 text-xs">
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-1.5 font-semibold bg-slate-50 w-1/3">
                          Penyusun
                        </td>
                        <td className="border border-slate-300 p-1.5">{teacher.fullName}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1.5 font-semibold bg-slate-50">
                          Satuan Pendidikan
                        </td>
                        <td className="border border-slate-300 p-1.5">{school.name}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1.5 font-semibold bg-slate-50">
                          Mata Pelajaran / Fase
                        </td>
                        <td className="border border-slate-300 p-1.5">
                          {activePlan.subject} / Fase B (Kelas {activePlan.grade})
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1.5 font-semibold bg-slate-50">
                          Alokasi Waktu
                        </td>
                        <td className="border border-slate-300 p-1.5">{activePlan.allocatedTime}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1.5 font-semibold bg-slate-50">
                          Model Pembelajaran
                        </td>
                        <td className="border border-slate-300 p-1.5">{activePlan.model}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1.5 font-semibold bg-slate-50">
                          Dimensi Profil Pancasila
                        </td>
                        <td className="border border-slate-300 p-1.5">
                          {activePlan.profilPancasila.join(', ')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-4 font-sans text-xs">
                  <div className="font-bold text-sm font-serif mb-2 text-slate-900 uppercase">
                    B. KOMPONEN INTI
                  </div>

                  <div className="mb-3">
                    <span className="font-bold text-slate-800">1. Tujuan Pembelajaran:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700">
                      {activePlan.learningObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-3">
                    <span className="font-bold text-slate-800">2. Pemahaman Bermakna:</span>
                    <p className="mt-1 text-slate-700">{activePlan.meaningfulUnderstanding}</p>
                  </div>

                  <div className="mb-3">
                    <span className="font-bold text-slate-800">3. Pertanyaan Pemantik:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700">
                      {activePlan.triggerQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-3">
                    <span className="font-bold text-slate-800">4. Kegiatan Pembelajaran Berdiferensiasi:</span>
                    <div className="mt-1 pl-2 space-y-2 border-l-2 border-slate-200">
                      <div>
                        <span className="font-semibold text-slate-800">a. Pendahuluan:</span>
                        <ul className="list-disc list-inside text-slate-700">
                          {activePlan.introActivities.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">b. Inti:</span>
                        <ul className="list-disc list-inside text-slate-700">
                          {activePlan.coreActivities.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">c. Penutup:</span>
                        <ul className="list-disc list-inside text-slate-700">
                          {activePlan.closingActivities.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="font-bold text-slate-800">5. Rencana Asesmen:</span>
                    <p className="mt-1 text-slate-700">
                      • Formatif: {activePlan.assessmentTypes.formative}
                    </p>
                    <p className="text-slate-700">
                      • Sumatif: {activePlan.assessmentTypes.summative}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {docType === 'prota' && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 uppercase underline tracking-wide">
                    PROGRAM TAHUNAN (PROTA)
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-sans">
                    Kelas: {teacher.assignedClassLabel} | Tahun Ajaran: {school.academicYear}
                  </p>
                </div>
                <table className="w-full border-collapse border border-slate-400 text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-slate-300 p-2 w-10">No</th>
                      <th className="border border-slate-300 p-2 w-20">Kode TP</th>
                      <th className="border border-slate-300 p-2">Tujuan Pembelajaran & Pokok Bahasan</th>
                      <th className="border border-slate-300 p-2 w-16">Alokasi</th>
                      <th className="border border-slate-300 p-2 w-20">Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {annualItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="border border-slate-300 p-4 text-center text-slate-400">
                          Belum ada data materi Program Tahunan (Prota).
                        </td>
                      </tr>
                    ) : (
                      annualItems.map((item) => (
                        <tr key={item.no}>
                          <td className="border border-slate-300 p-2 text-center">{item.no}</td>
                          <td className="border border-slate-300 p-2 text-center font-semibold">{item.tpCode}</td>
                          <td className="border border-slate-300 p-2">
                            <span className="font-semibold">{item.topic}</span>: {item.learningObjective}
                          </td>
                          <td className="border border-slate-300 p-2 text-center">{item.allocatedHours} JP</td>
                          <td className="border border-slate-300 p-2 text-center">{item.semester}</td>
                        </tr>
                      ))
                    )}
                    {annualItems.length > 0 && (
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={3} className="border border-slate-300 p-2 text-right">
                          Total Alokasi Jam Pelajaran (JP):
                        </td>
                        <td className="border border-slate-300 p-2 text-center">
                          {annualItems.reduce((acc, curr) => acc + curr.allocatedHours, 0)} JP
                        </td>
                        <td className="border border-slate-300 p-2"></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {docType === 'jurnal' && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 uppercase underline tracking-wide">
                    JURNAL HARIAN MENGAJAR GURU
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-sans">
                    Guru: {teacher.fullName} ({teacher.nip}) | Kelas: {teacher.assignedClassLabel}
                  </p>
                </div>
                <table className="w-full border-collapse border border-slate-400 text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-slate-300 p-2 w-12">Prtm</th>
                      <th className="border border-slate-300 p-2 w-28">Hari, Tanggal</th>
                      <th className="border border-slate-300 p-2">Materi & Tujuan yang Diajarkan</th>
                      <th className="border border-slate-300 p-2 w-24">Kehadiran</th>
                      <th className="border border-slate-300 p-2">Refleksi & Catatan Guru</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachingLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="border border-slate-300 p-4 text-center text-slate-400">
                          Belum ada catatan jurnal mengajar harian yang tersimpan.
                        </td>
                      </tr>
                    ) : (
                      teachingLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="border border-slate-300 p-2 text-center font-bold">#{log.meetingNo}</td>
                          <td className="border border-slate-300 p-2">
                            <div className="font-semibold">{log.date}</div>
                            <div className="text-[10px] text-slate-500">{log.timeSlot}</div>
                          </td>
                          <td className="border border-slate-300 p-2">
                            <div className="font-semibold text-slate-900">{log.learningObjective}</div>
                            <div className="text-slate-600">{log.topicSummary}</div>
                          </td>
                          <td className="border border-slate-300 p-2 text-center">
                            <span className="font-bold">{log.attendancePresent}</span>/{log.attendanceTotal}
                            <div className="text-[10px] text-slate-500">{log.absentNotes}</div>
                          </td>
                          <td className="border border-slate-300 p-2">
                            <div className="text-slate-800">{log.reflection}</div>
                            <div className="text-[10px] text-emerald-800 font-medium mt-1">TL: {log.followUp}</div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {docType === 'nilai' && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 uppercase underline tracking-wide">
                    REKAPITULASI HASIL BELAJAR SISWA
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-sans">
                    Kelas: {teacher.assignedClassLabel || 'Kelas Binaan'} | Semester: {school.currentSemester} TP {school.academicYear}
                  </p>
                </div>
                <table className="w-full border-collapse border border-slate-400 text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-slate-300 p-2 w-10">No</th>
                      <th className="border border-slate-300 p-2">Nama Peserta Didik</th>
                      <th className="border border-slate-300 p-2 w-12">F-1</th>
                      <th className="border border-slate-300 p-2 w-12">F-2</th>
                      <th className="border border-slate-300 p-2 w-16">Sum LM</th>
                      <th className="border border-slate-300 p-2 w-16">Sum SAS</th>
                      <th className="border border-slate-300 p-2 w-14">Akhir</th>
                      <th className="border border-slate-300 p-2 w-24">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="border border-slate-300 p-4 text-center text-slate-400">
                          Belum ada rekapan nilai peserta didik.
                        </td>
                      </tr>
                    ) : (
                      gradeRecords.map((rec, i) => (
                        <tr key={rec.studentId}>
                          <td className="border border-slate-300 p-1.5 text-center">{i + 1}</td>
                          <td className="border border-slate-300 p-1.5 font-medium">{rec.studentName}</td>
                          <td className="border border-slate-300 p-1.5 text-center">{rec.formatif1}</td>
                          <td className="border border-slate-300 p-1.5 text-center">{rec.formatif2}</td>
                          <td className="border border-slate-300 p-1.5 text-center">{rec.sumatifLM}</td>
                          <td className="border border-slate-300 p-1.5 text-center">{rec.sumatifAkhir}</td>
                          <td className="border border-slate-300 p-1.5 text-center font-bold text-slate-900">
                            {rec.finalScore}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                rec.status === 'Tuntas'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Official Signature Block (Standard Indonesian Format) */}
            <div className="mt-12 pt-6 flex justify-between font-sans text-xs">
              <div className="w-5/12 text-center">
                <p>Mengetahui,</p>
                <p className="font-bold mb-14">
                  {school.type === 'MI' ? 'Kepala Madrasah,' : 'Kepala Sekolah,'}
                </p>
                <p className="font-bold underline text-slate-900">{school.principalName}</p>
                <p className="text-slate-600">NIP. {school.principalNip}</p>
              </div>

              <div className="w-5/12 text-center">
                <p>{school.city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold mb-14">Guru Kelas / Mata Pelajaran,</p>
                <p className="font-bold underline text-slate-900">{teacher.fullName}</p>
                <p className="text-slate-600">NIP. {teacher.nip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
