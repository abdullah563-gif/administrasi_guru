import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  Users,
  BookOpen,
  Plus,
  Trash2,
  Save,
  Check,
  Sparkles,
  School,
  FileBadge,
} from 'lucide-react';
import {
  SchoolProfile,
  TeacherProfile,
  Student,
  SubjectItem,
  EducationLevel,
} from '../../types';

interface MasterDataViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  students: Student[];
  subjects: SubjectItem[];
  onUpdateSchool: (updated: SchoolProfile) => void;
  onUpdateTeacher: (updated: TeacherProfile) => void;
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onAddSubject: (subject: SubjectItem) => void;
  onDeleteSubject: (id: string) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  school,
  teacher,
  students,
  subjects,
  onUpdateSchool,
  onUpdateTeacher,
  onAddStudent,
  onDeleteStudent,
  onAddSubject,
  onDeleteSubject,
}) => {
  const [activeTab, setActiveTab] = useState<'school' | 'teacher' | 'students' | 'subjects'>('school');
  const [schoolForm, setSchoolForm] = useState<SchoolProfile>({ ...school });
  const [teacherForm, setTeacherForm] = useState<TeacherProfile>({ ...teacher });
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // New Student input state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNisn, setNewStudentNisn] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'L' | 'P'>('L');

  // New Subject input state
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectHours, setNewSubjectHours] = useState(4);
  const [newSubjectCategory, setNewSubjectCategory] = useState<'Wajib' | 'Pilihan' | 'Khas MI/Agama'>('Wajib');

  const showSavedMessage = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchool(schoolForm);
    showSavedMessage('Data profil sekolah/madrasah berhasil diperbarui.');
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacher(teacherForm);
    showSavedMessage('Data profil guru & pengesahan berhasil diperbarui.');
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentNisn.trim()) return;
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      name: newStudentName.trim(),
      nisn: newStudentNisn.trim(),
      gender: newStudentGender,
      classLabel: teacher.assignedClassLabel,
    };
    onAddStudent(newStudent);
    setNewStudentName('');
    setNewStudentNisn('');
    showSavedMessage(`Siswa ${newStudent.name} berhasil ditambahkan.`);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;
    const newSbj: SubjectItem = {
      id: `sbj-${Date.now()}`,
      code: newSubjectCode.trim().toUpperCase(),
      name: newSubjectName.trim(),
      category: newSubjectCategory,
      weeklyHours: Number(newSubjectHours) || 2,
    };
    onAddSubject(newSbj);
    setNewSubjectName('');
    setNewSubjectCode('');
    showSavedMessage(`Mata pelajaran ${newSbj.name} berhasil ditambahkan.`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Subnav */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Master Administrasi</h2>
          <p className="text-xs text-slate-500">
            Pusat data terpadu untuk sekolah, identitas guru, rombongan belajar (siswa), dan alokasi mata pelajaran.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-lg border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{savedNotice}</span>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('school')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'school'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Profil Sekolah / Madrasah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('teacher')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'teacher'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Profil Guru & Pengesahan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'students'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Siswa ({students.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'subjects'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mata Pelajaran ({subjects.length})</span>
        </button>
      </div>

      {/* TAB 1: Profil Sekolah */}
      {activeTab === 'school' && (
        <form onSubmit={handleSaveSchool} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Identitas Satuan Pendidikan</h3>
              <p className="text-xs text-slate-500">
                Data ini dicetak otomatis pada Kop Surat dan lembar pengesahan seluruh dokumen resmi.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Simpan Perubahan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bentuk Pendidikan</label>
              <select
                value={schoolForm.type}
                onChange={(e) => setSchoolForm({ ...schoolForm, type: e.target.value as EducationLevel })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
              >
                <option value="SD">Sekolah Dasar (SD)</option>
                <option value="MI">Madrasah Ibtidaiyah (MI)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
              <input
                type="text"
                value={schoolForm.name}
                onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN (Nomor Pokok Sekolah Nasional)</label>
              <input
                type="text"
                value={schoolForm.npsn}
                onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                required
              />
            </div>

            {schoolForm.type === 'MI' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NSM (Nomor Statistik Madrasah)</label>
                <input
                  type="text"
                  value={schoolForm.nsm || ''}
                  onChange={(e) => setSchoolForm({ ...schoolForm, nsm: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={schoolForm.address}
                onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                value={schoolForm.city}
                onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={schoolForm.province}
                onChange={(e) => setSchoolForm({ ...schoolForm, province: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Kepala {schoolForm.type === 'MI' ? 'Madrasah' : 'Sekolah'} (Lengkap Beserta Gelar)
              </label>
              <input
                type="text"
                value={schoolForm.principalName}
                onChange={(e) => setSchoolForm({ ...schoolForm, principalName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP Kepala {schoolForm.type === 'MI' ? 'Madrasah' : 'Sekolah'}
              </label>
              <input
                type="text"
                value={schoolForm.principalNip}
                onChange={(e) => setSchoolForm({ ...schoolForm, principalNip: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran Aktif</label>
              <input
                type="text"
                value={schoolForm.academicYear}
                onChange={(e) => setSchoolForm({ ...schoolForm, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester Berjalan</label>
              <select
                value={schoolForm.currentSemester}
                onChange={(e) => setSchoolForm({ ...schoolForm, currentSemester: e.target.value as 'Ganjil' | 'Genap' })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
              >
                <option value="Ganjil">Semester Ganjil (Gasal)</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Profil Guru */}
      {activeTab === 'teacher' && (
        <form onSubmit={handleSaveTeacher} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Identitas Guru & Jabatan Mengajar</h3>
              <p className="text-xs text-slate-500">
                Digunakan pada penandatangan dokumen Modul Ajar, Prota, Promes, Asesmen, dan Jurnal Harian.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Simpan Perubahan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={teacherForm.fullName}
                onChange={(e) => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
              <input
                type="text"
                value={teacherForm.nip}
                onChange={(e) => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NUPTK</label>
              <input
                type="text"
                value={teacherForm.nuptk}
                onChange={(e) => setTeacherForm({ ...teacherForm, nuptk: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Peran Mengajar</label>
              <select
                value={teacherForm.role}
                onChange={(e) => setTeacherForm({ ...teacherForm, role: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
              >
                <option value="Guru Kelas">Guru Kelas (SD/MI)</option>
                <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tingkat Kelas Binaan</label>
              <select
                value={teacherForm.assignedGrade}
                onChange={(e) => setTeacherForm({ ...teacherForm, assignedGrade: Number(e.target.value) as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
              >
                <option value={1}>Kelas 1 (Fase A)</option>
                <option value={2}>Kelas 2 (Fase A)</option>
                <option value={3}>Kelas 3 (Fase B)</option>
                <option value={4}>Kelas 4 (Fase B)</option>
                <option value={5}>Kelas 5 (Fase C)</option>
                <option value={6}>Kelas 6 (Fase C)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Label Rombongan Belajar (Rombel)</label>
              <input
                type="text"
                value={teacherForm.assignedClassLabel}
                onChange={(e) => setTeacherForm({ ...teacherForm, assignedClassLabel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                placeholder="Contoh: Kelas 4-A"
                required
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: Daftar Siswa */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Data Peserta Didik ({teacher.assignedClassLabel})
              </h3>
              <p className="text-xs text-slate-500">
                Data ini terhubung langsung ke Jurnal Mengajar (presensi) dan format rekap penilaian siswa.
              </p>
            </div>

            <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Total: {students.length} Siswa (L: {students.filter(s => s.gender === 'L').length}, P: {students.filter(s => s.gender === 'P').length})
            </div>
          </div>

          {/* Quick Add Student Form */}
          <form onSubmit={handleCreateStudent} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="font-semibold text-slate-800 mb-2 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Peserta Didik Baru</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Nama Lengkap Siswa"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="NISN (10 Digit)"
                  value={newStudentNisn}
                  onChange={(e) => setNewStudentNisn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={newStudentGender}
                  onChange={(e) => setNewStudentGender(e.target.value as 'L' | 'P')}
                  className="w-24 px-2 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="L">L (Laki-laki)</option>
                  <option value="P">P (Perempuan)</option>
                </select>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-3 py-2"
                >
                  Simpan
                </button>
              </div>
            </div>
          </form>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3">Nama Lengkap Siswa</th>
                  <th className="py-2.5 px-3 w-32">NISN</th>
                  <th className="py-2.5 px-3 w-20 text-center">L/P</th>
                  <th className="py-2.5 px-3 w-24 text-center">Rombel</th>
                  <th className="py-2.5 px-3 w-16 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada data peserta didik. Gunakan formulir di atas untuk mendaftarkan siswa baru ke dalam rombel.
                    </td>
                  </tr>
                ) : (
                  students.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{student.name}</td>
                      <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{student.nisn}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${student.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                          {student.gender}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">{student.classLabel}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Hapus siswa"
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

      {/* TAB 4: Mata Pelajaran */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Alokasi Mata Pelajaran & Jam Pelajaran (JP)
              </h3>
              <p className="text-xs text-slate-500">
                Sesuai struktur kurikulum Permendikdasmen No. 13 Tahun 2025 dan Kemenag untuk MI.
              </p>
            </div>
            <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              Total Beban Belajar: {subjects.reduce((a, b) => a + b.weeklyHours, 0)} JP / Minggu
            </div>
          </div>

          {/* Quick Add Subject */}
          <form onSubmit={handleCreateSubject} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="font-semibold text-slate-800 mb-2 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Mata Pelajaran Baru</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Kode (contoh: MTK)"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white uppercase"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Nama Mata Pelajaran"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={newSubjectCategory}
                  onChange={(e) => setNewSubjectCategory(e.target.value as any)}
                  className="w-full px-2 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Wajib">Wajib</option>
                  <option value="Pilihan">Pilihan</option>
                  <option value="Khas MI/Agama">Khas MI / Agama</option>
                </select>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newSubjectHours}
                  onChange={(e) => setNewSubjectHours(Number(e.target.value))}
                  className="w-20 px-2 py-2 rounded-lg border border-slate-300 bg-white text-center"
                  title="JP per minggu"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-3 py-2"
                >
                  Simpan Mapel
                </button>
              </div>
            </div>
          </form>

          {/* Subjects Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3 w-24">Kode</th>
                  <th className="py-2.5 px-3">Nama Mata Pelajaran</th>
                  <th className="py-2.5 px-3 w-32">Kategori</th>
                  <th className="py-2.5 px-3 w-28 text-center">Alokasi Mingguan</th>
                  <th className="py-2.5 px-3 w-16 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada mata pelajaran terdaftar. Gunakan formulir di atas untuk menambahkan mata pelajaran dan alokasi jam.
                    </td>
                  </tr>
                ) : (
                  subjects.map((sbj, idx) => (
                    <tr key={sbj.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-800">{sbj.code}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{sbj.name}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          sbj.category === 'Wajib'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                            : sbj.category === 'Khas MI/Agama'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200/60'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {sbj.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800">{sbj.weeklyHours} JP / Minggu</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onDeleteSubject(sbj.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Hapus mapel"
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
    </div>
  );
};
