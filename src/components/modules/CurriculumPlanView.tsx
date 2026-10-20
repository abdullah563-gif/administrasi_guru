import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Calendar,
  Download,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  BookMarked,
  Check,
} from 'lucide-react';
import {
  LearningOutcome,
  LearningObjective,
  AnnualProgramItem,
  SemesterProgramItem,
  SchoolProfile,
  TeacherProfile,
} from '../../types';
import { exportProtaDocx } from '../../utils/docxExport';

interface CurriculumPlanViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  learningOutcomes: LearningOutcome[];
  learningObjectives: LearningObjective[];
  annualProgram: AnnualProgramItem[];
  semesterProgram: SemesterProgramItem[];
  onAddAnnualItem: (item: AnnualProgramItem) => void;
  onDeleteAnnualItem: (no: number) => void;
  onOpenPreview: (type: 'prota') => void;
}

export const CurriculumPlanView: React.FC<CurriculumPlanViewProps> = ({
  school,
  teacher,
  learningOutcomes,
  learningObjectives,
  annualProgram,
  semesterProgram,
  onAddAnnualItem,
  onDeleteAnnualItem,
  onOpenPreview,
}) => {
  const [subTab, setSubTab] = useState<'cp_atp' | 'prota' | 'promes'>('cp_atp');

  // Form for new Prota item
  const [newTopic, setNewTopic] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newHours, setNewHours] = useState(10);
  const [newSemester, setNewSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');

  const totalJP = annualProgram.reduce((acc, curr) => acc + curr.allocatedHours, 0);

  const handleCreateProta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    const nextNo = annualProgram.length > 0 ? Math.max(...annualProgram.map((a) => a.no)) + 1 : 1;
    const item: AnnualProgramItem = {
      no: nextNo,
      tpCode: `TP 4.${nextNo}`,
      topic: newTopic.trim(),
      learningObjective: newObjective.trim() || newTopic.trim(),
      allocatedHours: Number(newHours) || 5,
      semester: newSemester,
    };
    onAddAnnualItem(item);
    setNewTopic('');
    setNewObjective('');
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kurikulum & Perencanaan Pembelajaran</h2>
          <p className="text-xs text-slate-500">
            Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), Program Tahunan (Prota), dan Program Semester (Promes).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onOpenPreview('prota')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Pratinjau Cetak</span>
          </button>
          <button
            type="button"
            onClick={() => exportProtaDocx(annualProgram, school, teacher, 'IPAS')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Prota DOCX</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setSubTab('cp_atp')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'cp_atp'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Capaian (CP) & Alur Tujuan (ATP)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('prota')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'prota'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Program Tahunan (Prota)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('promes')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'promes'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Program Semester (Promes)</span>
        </button>
      </div>

      {/* SUBTAB 1: CP & ATP */}
      {subTab === 'cp_atp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningOutcomes.length === 0 ? (
              <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-dashed border-slate-300 text-center text-xs text-slate-500">
                <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700">Belum Ada Capaian Pembelajaran (CP) Tersimpan</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  CP dan elemen pembelajaran fase SD/MI siap disesuaikan dengan kurikulum satuan pendidikan Anda.
                </p>
              </div>
            ) : (
              learningOutcomes.map((cp) => (
                <div key={cp.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {cp.phase}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{cp.element}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">Deskripsi Capaian Pembelajaran (CP)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{cp.statement}"
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Alur Tujuan Pembelajaran (ATP) Terpilih</h3>
              <p className="text-xs text-slate-500">
                Tujuan pembelajaran yang telah diturunkan dari CP dan dialokasikan ke jam pembelajaran efektif.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3 w-20">Kode</th>
                    <th className="py-2.5 px-3">Rumusan Tujuan Pembelajaran (TP)</th>
                    <th className="py-2.5 px-3 w-28 text-center">Alokasi Waktu</th>
                    <th className="py-2.5 px-3 w-28 text-center">Semester</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {learningObjectives.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        Belum ada Alur Tujuan Pembelajaran (ATP) yang didaftarkan.
                      </td>
                    </tr>
                  ) : (
                    learningObjectives.map((tp) => (
                      <tr key={tp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{tp.code}</td>
                        <td className="py-2.5 px-3 text-slate-800 font-medium">{tp.description}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700">{tp.allocatedHours} JP</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {tp.semester}
                          </span>
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

      {/* SUBTAB 2: PROTA */}
      {subTab === 'prota' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Program Tahunan (Prota) - IPAS Kelas 4</h3>
              <p className="text-xs text-slate-500">
                Penyebaran materi dan alokasi jam belajar selama satu tahun ajaran penuh (Semester Ganjil & Genap).
              </p>
            </div>
            <div className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
              Total Beban: {totalJP} Jam Pelajaran (JP)
            </div>
          </div>

          {/* Quick Add Prota Row */}
          <form onSubmit={handleCreateProta} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="font-semibold text-slate-800 mb-2 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Materi / Bab ke Prota</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Topik / Pokok Bahasan"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Rincian Tujuan Pembelajaran"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="2"
                  max="40"
                  value={newHours}
                  onChange={(e) => setNewHours(Number(e.target.value))}
                  className="w-20 px-2 py-2 rounded-lg border border-slate-300 bg-white text-center"
                  title="Alokasi JP"
                />
                <select
                  value={newSemester}
                  onChange={(e) => setNewSemester(e.target.value as any)}
                  className="w-full px-2 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Ganjil">Sem. Ganjil</option>
                  <option value="Genap">Sem. Genap</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-3 py-2"
                >
                  Tambahkan ke Prota
                </button>
              </div>
            </div>
          </form>

          {/* Prota Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3 w-24">Kode TP</th>
                  <th className="py-2.5 px-3">Topik & Materi Pokok Pembelajaran</th>
                  <th className="py-2.5 px-3 w-28 text-center">Alokasi (JP)</th>
                  <th className="py-2.5 px-3 w-24 text-center">Semester</th>
                  <th className="py-2.5 px-3 w-16 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {annualProgram.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada rincian materi pada Program Tahunan (Prota). Tambahkan topik pertama melalui formulir di atas.
                    </td>
                  </tr>
                ) : (
                  annualProgram.map((item) => (
                    <tr key={item.no} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-medium">{item.no}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{item.tpCode}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{item.topic}</div>
                        <div className="text-[11px] text-slate-500">{item.learningObjective}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-800">{item.allocatedHours} JP</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {item.semester}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onDeleteAnnualItem(item.no)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PROMES MATRIX */}
      {subTab === 'promes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Program Semester (Promes) Matriks Mingguan</h3>
              <p className="text-xs text-slate-500">
                Distribusi jam efektif per minggu pada Semester {school.currentSemester} (Juli - Desember).
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Format baku kalender pendidikan 18-20 minggu efektif per semester.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold text-center">
                  <th rowSpan={2} className="border border-slate-300 p-2 w-12">No</th>
                  <th rowSpan={2} className="border border-slate-300 p-2">Materi / Tujuan Pembelajaran</th>
                  <th rowSpan={2} className="border border-slate-300 p-2 w-16">Jml JP</th>
                  <th colSpan={4} className="border border-slate-300 p-1 bg-emerald-50/70">Juli</th>
                  <th colSpan={4} className="border border-slate-300 p-1 bg-emerald-50/70">Agustus</th>
                  <th colSpan={4} className="border border-slate-300 p-1 bg-emerald-50/70">September</th>
                  <th colSpan={4} className="border border-slate-300 p-1 bg-emerald-50/70">Oktober</th>
                </tr>
                <tr className="bg-slate-50 text-[10px] text-center font-semibold">
                  {/* Juli 1-4 */}
                  <th className="border border-slate-300 p-1 w-6">1</th>
                  <th className="border border-slate-300 p-1 w-6">2</th>
                  <th className="border border-slate-300 p-1 w-6">3</th>
                  <th className="border border-slate-300 p-1 w-6">4</th>
                  {/* Agustus 1-4 */}
                  <th className="border border-slate-300 p-1 w-6">1</th>
                  <th className="border border-slate-300 p-1 w-6">2</th>
                  <th className="border border-slate-300 p-1 w-6">3</th>
                  <th className="border border-slate-300 p-1 w-6">4</th>
                  {/* September 1-4 */}
                  <th className="border border-slate-300 p-1 w-6">1</th>
                  <th className="border border-slate-300 p-1 w-6">2</th>
                  <th className="border border-slate-300 p-1 w-6">3</th>
                  <th className="border border-slate-300 p-1 w-6">4</th>
                  {/* Oktober 1-4 */}
                  <th className="border border-slate-300 p-1 w-6">1</th>
                  <th className="border border-slate-300 p-1 w-6">2</th>
                  <th className="border border-slate-300 p-1 w-6">3</th>
                  <th className="border border-slate-300 p-1 w-6">4</th>
                </tr>
              </thead>
              <tbody>
                {semesterProgram.length === 0 ? (
                  <tr>
                    <td colSpan={19} className="border border-slate-300 py-8 text-center text-slate-400">
                      Belum ada rincian matriks mingguan Program Semester (Promes). Tambahkan materi pada Prota untuk menyusun matriks.
                    </td>
                  </tr>
                ) : (
                  semesterProgram.map((item) => (
                    <tr key={item.no} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-2 text-center font-medium">{item.no}</td>
                      <td className="border border-slate-300 p-2 font-medium text-slate-900">{item.materi}</td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-slate-800">{item.totalHours}</td>
                      {/* Juli */}
                      {item.distribution['Juli'].map((val, idx) => (
                        <td key={`jul-${idx}`} className={`border border-slate-300 p-1 text-center font-bold ${val > 0 ? 'bg-emerald-100 text-emerald-900' : 'text-slate-300'}`}>
                          {val > 0 ? val : ''}
                        </td>
                      ))}
                      {/* Agustus */}
                      {item.distribution['Agustus'].map((val, idx) => (
                        <td key={`agt-${idx}`} className={`border border-slate-300 p-1 text-center font-bold ${val > 0 ? 'bg-emerald-100 text-emerald-900' : 'text-slate-300'}`}>
                          {val > 0 ? val : ''}
                        </td>
                      ))}
                      {/* September */}
                      {item.distribution['September'].map((val, idx) => (
                        <td key={`sep-${idx}`} className={`border border-slate-300 p-1 text-center font-bold ${val > 0 ? 'bg-emerald-100 text-emerald-900' : 'text-slate-300'}`}>
                          {val > 0 ? val : ''}
                        </td>
                      ))}
                      {/* Oktober */}
                      {item.distribution['Oktober'].map((val, idx) => (
                        <td key={`okt-${idx}`} className={`border border-slate-300 p-1 text-center font-bold ${val > 0 ? 'bg-emerald-100 text-emerald-900' : 'text-slate-300'}`}>
                          {val > 0 ? val : ''}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
