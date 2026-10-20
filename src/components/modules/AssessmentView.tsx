import React, { useState } from 'react';
import {
  FileCheck2,
  Award,
  Sparkles,
  Download,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import {
  AssessmentItem,
  GradeRecord,
  SchoolProfile,
  TeacherProfile,
  Student,
} from '../../types';
import { generateAssessmentAI } from '../../services/geminiService';
import { exportGradebookDocx } from '../../utils/docxExport';

interface AssessmentViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  students: Student[];
  assessments: AssessmentItem[];
  gradeRecords: GradeRecord[];
  onUpdateGrade: (studentId: string, updated: Partial<GradeRecord>) => void;
  onAddAssessment: (item: AssessmentItem) => void;
  onOpenPreview: (type: 'nilai' | 'asesmen') => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  school,
  teacher,
  students,
  assessments,
  gradeRecords,
  onUpdateGrade,
  onAddAssessment,
  onOpenPreview,
}) => {
  const [subTab, setSubTab] = useState<'rekap_nilai' | 'kisi_soal' | 'remedial'>('rekap_nilai');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPromptTopic, setAiPromptTopic] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  // Calculate statistics
  const passingStudents = gradeRecords.filter((g) => g.status === 'Tuntas');
  const remedialStudents = gradeRecords.filter((g) => g.status === 'Perlu Bimbingan');
  const averageScore = Math.round(
    gradeRecords.reduce((acc, curr) => acc + curr.finalScore, 0) / (gradeRecords.length || 1)
  );

  const handleGenerateQuestions = async () => {
    if (!aiPromptTopic.trim()) return;
    setIsAiLoading(true);
    try {
      const generated = await generateAssessmentAI(aiPromptTopic.trim(), teacher.assignedGrade, 3);
      const newAsm: AssessmentItem = {
        id: `asm-${Date.now()}`,
        title: `Asesmen Formatif: ${aiPromptTopic.trim()}`,
        type: 'Formatif',
        subject: 'IPAS',
        grade: teacher.assignedGrade,
        tpReference: 'TP Terkait',
        kisiKisi: [
          {
            indicator: `Memahami konsep pokok terkait ${aiPromptTopic.trim()}`,
            cognitiveLevel: 'C2',
            questionType: 'Pilihan Ganda',
            questionCount: 3,
          },
        ],
        questions: generated.questions,
        rubricCriteria: [
          {
            aspect: 'Pemahaman Konseptual',
            good: 'Menjawab dengan akurat disertai alasan logis.',
            adequate: 'Menjawab benar pada sebagian soal pokok.',
            needsImprovement: 'Memerlukan pendampingan konsep dari awal.',
          },
        ],
      };
      onAddAssessment(newAsm);
      setShowAiModal(false);
      setAiPromptTopic('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Asesmen & Pengolahan Hasil Belajar</h2>
          <p className="text-xs text-slate-500">
            Kisi-kisi soal, rubrik asesmen, rekapitulasi nilai formatif & sumatif, serta program remedial & pengayaan.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Generate Soal AI</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenPreview('nilai')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Pratinjau Cetak</span>
          </button>
          <button
            type="button"
            onClick={() => exportGradebookDocx(gradeRecords, school, teacher, 'IPAS')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unduh Nilai DOCX</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setSubTab('rekap_nilai')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'rekap_nilai'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rekapitulasi Nilai Siswa ({gradeRecords.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('kisi_soal')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'kisi_soal'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Kisi-kisi & Butir Soal ({assessments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('remedial')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'remedial'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Program Remedial & Pengayaan ({remedialStudents.length} Siswa)</span>
        </button>
      </div>

      {/* SUBTAB 1: REKAP NILAI */}
      {subTab === 'rekap_nilai' && (
        <div className="space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Rata-rata Kelas</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{averageScore} / 100</div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                KKTP 75
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Siswa Tuntas</span>
                <div className="text-xl font-bold text-emerald-700 mt-0.5">
                  {passingStudents.length} Siswa ({Math.round((passingStudents.length / (gradeRecords.length || 1)) * 100)}%)
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Perlu Bimbingan</span>
                <div className="text-xl font-bold text-amber-700 mt-0.5">
                  {remedialStudents.length} Siswa
                </div>
              </div>
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          {/* Gradebook Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Buku Nilai Mata Pelajaran IPAS - {teacher.assignedClassLabel}
              </h3>
              <span className="text-xs text-slate-500">
                Formula Otomatis: (F1 + F2 + SumLM + SAS) / 4
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3">Nama Peserta Didik</th>
                    <th className="py-2.5 px-3 w-20 text-center">Formatif 1</th>
                    <th className="py-2.5 px-3 w-20 text-center">Formatif 2</th>
                    <th className="py-2.5 px-3 w-24 text-center">Sumatif LM</th>
                    <th className="py-2.5 px-3 w-24 text-center">Sumatif Akhir</th>
                    <th className="py-2.5 px-3 w-20 text-center font-bold">Nilai Akhir</th>
                    <th className="py-2.5 px-3 w-28 text-center">Status</th>
                    <th className="py-2.5 px-3">Catatan Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradeRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Belum ada data nilai peserta didik. Daftarkan siswa di Data Master terlebih dahulu untuk mengisi rekap penilaian.
                      </td>
                    </tr>
                  ) : (
                    gradeRecords.map((item, idx) => (
                      <tr key={item.studentId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{item.studentName}</td>

                        {/* Editable Formatif 1 */}
                        <td className="py-1 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.formatif1}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              const final = Math.round((val + item.formatif2 + item.sumatifLM + item.sumatifAkhir) / 4);
                              onUpdateGrade(item.studentId, {
                                formatif1: val,
                                finalScore: final,
                                status: final >= 75 ? 'Tuntas' : 'Perlu Bimbingan',
                              });
                            }}
                            className="w-16 px-1.5 py-1 text-center font-semibold rounded border border-slate-200 focus:border-emerald-500"
                          />
                        </td>

                        {/* Editable Formatif 2 */}
                        <td className="py-1 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.formatif2}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              const final = Math.round((item.formatif1 + val + item.sumatifLM + item.sumatifAkhir) / 4);
                              onUpdateGrade(item.studentId, {
                                formatif2: val,
                                finalScore: final,
                                status: final >= 75 ? 'Tuntas' : 'Perlu Bimbingan',
                              });
                            }}
                            className="w-16 px-1.5 py-1 text-center font-semibold rounded border border-slate-200 focus:border-emerald-500"
                          />
                        </td>

                        {/* Editable Sumatif LM */}
                        <td className="py-1 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.sumatifLM}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              const final = Math.round((item.formatif1 + item.formatif2 + val + item.sumatifAkhir) / 4);
                              onUpdateGrade(item.studentId, {
                                sumatifLM: val,
                                finalScore: final,
                                status: final >= 75 ? 'Tuntas' : 'Perlu Bimbingan',
                              });
                            }}
                            className="w-16 px-1.5 py-1 text-center font-semibold rounded border border-slate-200 focus:border-emerald-500"
                          />
                        </td>

                        {/* Editable Sumatif Akhir */}
                        <td className="py-1 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.sumatifAkhir}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              const final = Math.round((item.formatif1 + item.formatif2 + item.sumatifLM + val) / 4);
                              onUpdateGrade(item.studentId, {
                                sumatifAkhir: val,
                                finalScore: final,
                                status: final >= 75 ? 'Tuntas' : 'Perlu Bimbingan',
                              });
                            }}
                            className="w-16 px-1.5 py-1 text-center font-semibold rounded border border-slate-200 focus:border-emerald-500"
                          />
                        </td>

                        <td className="py-2 px-3 text-center font-bold text-slate-900 bg-slate-50/50">
                          {item.finalScore}
                        </td>

                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'Tuntas'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                                : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="py-2 px-3 text-slate-600 text-[11px] max-w-xs truncate">
                          {item.achievementNotes}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: KISI-KISI SOAL */}
      {subTab === 'kisi_soal' && (
        <div className="space-y-6">
          {assessments.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-300 text-center text-xs text-slate-500">
              <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Belum Ada Butir Soal & Asesmen Tersimpan</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Gunakan asisten AI untuk merumuskan kisi-kisi soal, kunci jawaban, dan rubrik asesmen secara otomatis.
              </p>
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="mt-3.5 inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Soal dengan AI</span>
              </button>
            </div>
          ) : (
            assessments.map((asm) => (
            <div key={asm.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    {asm.type}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{asm.title}</h3>
                  <p className="text-xs text-slate-500">Referensi: {asm.tpReference}</p>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Daftar Butir Soal Terstandar:
                </h4>
                {asm.questions.map((q) => (
                  <div key={q.number} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-900">
                        {q.number}. {q.text}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0 ml-2">
                        Bobot: {q.scoreWeight} Poin
                      </span>
                    </div>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-3">
                        {q.options.map((opt, i) => (
                          <div key={i} className="text-slate-600">
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-1.5 border-t border-slate-200 flex items-center text-[11px] text-emerald-800 font-semibold">
                      <span>Kunci Jawaban: {q.correctAnswer}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rubric Criteria */}
              {asm.rubricCriteria && asm.rubricCriteria.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Rubrik Penilaian:
                  </h4>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2 w-1/4">Aspek Penilaian</th>
                        <th className="p-2 text-emerald-800">Sangat Baik (3)</th>
                        <th className="p-2 text-blue-800">Cukup (2)</th>
                        <th className="p-2 text-amber-800">Perlu Bimbingan (1)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asm.rubricCriteria.map((r, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="p-2 font-semibold text-slate-800">{r.aspect}</td>
                          <td className="p-2 text-slate-600">{r.good}</td>
                          <td className="p-2 text-slate-600">{r.adequate}</td>
                          <td className="p-2 text-slate-600">{r.needsImprovement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )))}
        </div>
      )}

      {/* SUBTAB 3: REMEDIAL & PENGAYAAN */}
      {subTab === 'remedial' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Rencana Tindak Lanjut Hasil Asesmen Belajar
            </h3>
            <p className="text-xs text-slate-500">
              Menjamin setiap peserta didik mendapatkan layanan pembelajaran yang adil dan bermakna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Remedial Column */}
            <div className="border border-amber-200 bg-amber-50/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Peserta Didik Mengikuti Remedial ({remedialStudents.length} Siswa)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Diberikan bimbingan terfokus secara individu atau kelompok kecil dengan alat peraga konkrit.
              </p>

              <div className="space-y-2">
                {remedialStudents.map((s) => (
                  <div key={s.studentId} className="bg-white p-3 rounded-xl border border-amber-200/80 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{s.studentName}</span>
                      <span className="text-amber-700">Nilai: {s.finalScore}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{s.achievementNotes}</p>
                    <div className="mt-2 text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded">
                      Rencana: Pendampingan visual miniatur organ tumbuhan & tugas mandiri terarah.
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrichment Column */}
            <div className="border border-emerald-200 bg-emerald-50/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Peserta Didik Mengikuti Pengayaan ({passingStudents.length} Siswa)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Diberikan tantangan memperluas wawasan dan menjadi tutor sebaya dalam praktikum kelas.
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {passingStudents.slice(0, 5).map((s) => (
                  <div key={s.studentId} className="bg-white p-3 rounded-xl border border-emerald-200/80 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{s.studentName}</span>
                      <span className="text-emerald-700">Nilai: {s.finalScore}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{s.achievementNotes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Assessment Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3>Buat Butir Soal & Rubrik dengan AI</h3>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Topik / Materi Asesmen:
              </label>
              <input
                type="text"
                placeholder="Contoh: Peran Fotosintesis bagi Makhluk Hidup"
                value={aiPromptTopic}
                onChange={(e) => setAiPromptTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isAiLoading || !aiPromptTopic.trim()}
                onClick={handleGenerateQuestions}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-semibold"
              >
                {isAiLoading ? 'Menyusun Soal...' : 'Generate Soal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
