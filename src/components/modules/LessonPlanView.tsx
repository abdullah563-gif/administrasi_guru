import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Download,
  Printer,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Target,
  FileCheck,
  ChevronRight,
  Eye,
  Edit3,
} from 'lucide-react';
import { LessonPlan, SchoolProfile, TeacherProfile } from '../../types';
import { generateLessonPlanAI } from '../../services/geminiService';
import { exportLessonPlanDocx } from '../../utils/docxExport';

interface LessonPlanViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  lessonPlans: LessonPlan[];
  onAddLessonPlan: (plan: LessonPlan) => void;
  onUpdateLessonPlan: (plan: LessonPlan) => void;
  onDeleteLessonPlan: (id: string) => void;
  onOpenPreview: (type: 'modul') => void;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({
  school,
  teacher,
  lessonPlans,
  onAddLessonPlan,
  onUpdateLessonPlan,
  onDeleteLessonPlan,
  onOpenPreview,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(lessonPlans[0]?.id || '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  const activePlan = lessonPlans.find((p) => p.id === selectedPlanId) || lessonPlans[0];

  const handleGenerateWithAI = async () => {
    if (!aiTopicInput.trim()) return;
    setIsAiLoading(true);

    try {
      const draft = await generateLessonPlanAI(
        aiTopicInput.trim(),
        'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
        teacher.assignedGrade,
        school.type,
        `Memahami dan menganalisis ${aiTopicInput.trim()} serta kaitannya dengan lingkungan sekitar.`
      );

      const newPlan: LessonPlan = {
        id: `modul-${Date.now()}`,
        title: aiTopicInput.trim(),
        subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
        grade: teacher.assignedGrade,
        classLabel: teacher.assignedClassLabel,
        semester: school.currentSemester,
        academicYear: school.academicYear,
        allocatedTime: '2 x 35 Menit (1 Pertemuan)',
        targetStudents: `Peserta Didik Reguler (${teacher.assignedClassLabel})`,
        model: 'Problem Based Learning (PBL) Berdiferensiasi',
        profilPancasila: ['Bernalar Kritis', 'Gotong Royong', 'Mandiri'],
        saranaPrasarana: 'Benda konkrit di lingkungan sekitar, proyektor, LKPD eksplorasi.',
        learningObjectives: [
          `Melalui kegiatan observasi dan eksplorasi, peserta didik dapat mendeskripsikan ${aiTopicInput.trim()} secara tepat.`,
          `Melalui diskusi kelompok dan refleksi, peserta didik dapat menghubungkan konsep ${aiTopicInput.trim()} dengan kehidupan sehari-hari.`,
        ],
        meaningfulUnderstanding: draft.meaningfulUnderstanding,
        triggerQuestions: draft.triggerQuestions,
        introActivities: draft.introActivities,
        coreActivities: draft.coreActivities,
        closingActivities: draft.closingActivities,
        assessmentTypes: {
          diagnostic: draft.diagnosticAssessment,
          formative: draft.formativeAssessment,
          summative: draft.summativeAssessment,
        },
        remedialPlan: draft.remedialPlan,
        enrichmentPlan: draft.enrichmentPlan,
        status: 'validated',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      onAddLessonPlan(newPlan);
      setSelectedPlanId(newPlan.id);
      setShowAiModal(false);
      setAiTopicInput('');
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
          <h2 className="text-xl font-bold text-slate-900">
            Modul Ajar / RPP Berdiferensiasi
          </h2>
          <p className="text-xs text-slate-500">
            Penyusunan modul ajar standar Permendikdasmen No. 1 Tahun 2026, berpusat pada peserta didik dan siap pakai.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Susun dengan Asisten AI</span>
          </button>
          {activePlan && (
            <>
              <button
                type="button"
                onClick={() => onOpenPreview('modul')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Pratinjau / Cetak</span>
              </button>
              <button
                type="button"
                onClick={() => exportLessonPlanDocx(activePlan, school, teacher)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unduh DOCX (Word)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Layout: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plan Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Daftar Modul ({lessonPlans.length})
            </span>
            <span className="text-[11px] text-slate-400">Kelas {teacher.assignedGrade}</span>
          </div>

          <div className="space-y-2">
            {lessonPlans.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 bg-slate-50/50">
                <BookOpen className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="font-semibold text-slate-700">Belum Ada Modul Ajar</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Mulai dengan menyusun modul pertama Anda.</p>
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="mt-2.5 inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Susun Modul</span>
                </button>
              </div>
            ) : (
              lessonPlans.map((plan) => {
                const isSelected = plan.id === activePlan?.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                        {plan.subject}
                      </span>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                          plan.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {plan.status === 'approved' ? 'Disahkan' : 'Tervalidasi'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{plan.title}</h4>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{plan.allocatedTime}</span>
                      <span>Sem. {plan.semester}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          {activePlan ? (
            <div>
              {/* Header Meta */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                    {activePlan.subject} • {activePlan.classLabel}
                  </span>
                  <div className="text-xs text-slate-400">
                    Diperbarui: {activePlan.updatedAt}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{activePlan.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Model: <span className="font-semibold text-slate-700">{activePlan.model}</span> |
                  Alokasi: <span className="font-semibold text-slate-700">{activePlan.allocatedTime}</span>
                </p>
              </div>

              {/* Differentiated Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  Target: {activePlan.targetStudents}
                </span>
                {activePlan.profilPancasila.map((p, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100"
                  >
                    Profil: {p}
                  </span>
                ))}
              </div>

              {/* Tujuan Pembelajaran */}
              <div className="mt-6 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tujuan Pembelajaran Spesifik</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {activePlan.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Pemahaman Bermakna & Pertanyaan Pemantik */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800 block mb-1">
                    Pemahaman Bermakna
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activePlan.meaningfulUnderstanding}
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800 block mb-1">
                    Pertanyaan Pemantik
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {activePlan.triggerQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Langkah Kegiatan Berdiferensiasi */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sintaks & Kegiatan Pembelajaran (Berdiferensiasi)</span>
                </h4>

                <div className="space-y-3">
                  {/* Pendahuluan */}
                  <div className="border border-slate-200 rounded-xl p-3">
                    <span className="text-xs font-bold text-slate-800 block mb-1.5">
                      1. Kegiatan Pendahuluan (15 Menit)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                      {activePlan.introActivities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Inti */}
                  <div className="border border-emerald-200 bg-emerald-50/20 rounded-xl p-3">
                    <span className="text-xs font-bold text-emerald-950 block mb-1.5">
                      2. Kegiatan Inti Berdiferensiasi (50 Menit)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                      {activePlan.coreActivities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Penutup */}
                  <div className="border border-slate-200 rounded-xl p-3">
                    <span className="text-xs font-bold text-slate-800 block mb-1.5">
                      3. Kegiatan Penutup & Refleksi (10 Menit)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                      {activePlan.closingActivities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Asesmen & Remedial */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Rencana Asesmen:</span>
                  <p className="text-slate-600 mb-1">
                    <span className="font-medium text-slate-700">Awal:</span> {activePlan.assessmentTypes.diagnostic}
                  </p>
                  <p className="text-slate-600 mb-1">
                    <span className="font-medium text-slate-700">Formatif:</span> {activePlan.assessmentTypes.formative}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-700">Sumatif:</span> {activePlan.assessmentTypes.summative}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block mb-1">Tindak Lanjut Belajar:</span>
                  <p className="text-slate-600 mb-1">
                    <span className="font-medium text-amber-700">Remedial:</span> {activePlan.remedialPlan}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium text-emerald-700">Pengayaan:</span> {activePlan.enrichmentPlan}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Belum Ada Modul Ajar Terpilih</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Silakan buat modul ajar baru menggunakan asisten AI terpadu atau tambahkan topik pembelajaran Anda.
              </p>
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Susun Modul Ajar Pertama</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3>Asisten AI Perancang Modul Ajar</h3>
                <p className="text-xs font-normal text-slate-500">
                  Otomatisasi draf modul ajar berdiferensiasi ramah anak SD & MI
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Prinsip & Keamanan Data (Guardrails):</p>
              <p>• Draf AI wajib ditinjau dan disesuaikan guru sebelum disahkan.</p>
              <p>• Tidak ada data pribadi atau nilai siswa yang dikirimkan ke model AI.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Topik / Materi Pembelajaran yang Ingin Disusun:
              </label>
              <input
                type="text"
                placeholder="Contoh: Perubahan Wujud Benda di Sekitar Kita"
                value={aiTopicInput}
                onChange={(e) => setAiTopicInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:outline-emerald-500"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Daur Hidup Kupu-kupu', 'Sifat Kemagnetan Benda', 'Pecahan Senilai Sederhana', 'Hak dan Kewajiban Anak'].map((hint) => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() => setAiTopicInput(hint)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md transition-colors"
                  >
                    + {hint}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isAiLoading || !aiTopicInput.trim()}
                onClick={handleGenerateWithAI}
                className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white rounded-xl shadow-xs transition-colors"
              >
                {isAiLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyusun Modul...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Modul Ajar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
