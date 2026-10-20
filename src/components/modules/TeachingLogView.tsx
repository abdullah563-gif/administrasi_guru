import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  Download,
  Users,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { TeachingLog, SchoolProfile, TeacherProfile, Student } from '../../types';
import { exportTeachingLogDocx } from '../../utils/docxExport';

interface TeachingLogViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  students: Student[];
  teachingLogs: TeachingLog[];
  onAddLog: (log: TeachingLog) => void;
  onDeleteLog: (id: string) => void;
  onToggleVerify: (id: string) => void;
  onOpenPreview: (type: 'jurnal') => void;
}

export const TeachingLogView: React.FC<TeachingLogViewProps> = ({
  school,
  teacher,
  students,
  teachingLogs,
  onAddLog,
  onDeleteLog,
  onToggleVerify,
  onOpenPreview,
}) => {
  const [showForm, setShowForm] = useState(false);

  // Form states
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [meetingNo, setMeetingNo] = useState(teachingLogs.length + 1);
  const [timeSlot, setTimeSlot] = useState('07:30 - 08:40 WIB');
  const [subject, setSubject] = useState('IPAS');
  const [objective, setObjective] = useState('TP 4.3 Mengidentifikasi perubahan wujud zat dalam kehidupan sehari-hari');
  const [summary, setSummary] = useState('Praktikum mencair dan membeku menggunakan es batu dan lilin secara berkelompok.');
  const [present, setPresent] = useState(students.length || 20);
  const [absentNotes, setAbsentNotes] = useState('Nihil (Hadir semua)');
  const [reflection, setReflection] = useState('Peserta didik memahami konsep kalor yang menyebabkan perubahan wujud benda.');
  const [followUp, setFollowUp] = useState('Lanjutkan materi penguapan dan pengembunan pada pertemuan esok.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: TeachingLog = {
      id: `log-${Date.now()}`,
      date,
      classLabel: teacher.assignedClassLabel,
      subject,
      meetingNo: Number(meetingNo) || 1,
      timeSlot,
      learningObjective: objective,
      topicSummary: summary,
      attendancePresent: Number(present) || students.length,
      attendanceTotal: students.length || 20,
      absentNotes,
      reflection,
      followUp,
      verifiedByPrincipal: false,
    };
    onAddLog(newLog);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Jurnal Mengajar Harian Guru</h2>
          <p className="text-xs text-slate-500">
            Pencatatan tatap muka, kehadiran siswa, materi yang diajarkan, refleksi harian, dan tindak lanjut.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onOpenPreview('jurnal')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Pratinjau Cetak</span>
          </button>
          <button
            type="button"
            onClick={() => exportTeachingLogDocx(teachingLogs, school, teacher)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Jurnal DOCX</span>
          </button>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showForm ? 'Batal' : 'Isi Jurnal Baru'}</span>
          </button>
        </div>
      </div>

      {/* New Log Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-emerald-300 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Formulir Jurnal Mengajar Pertemuan #{meetingNo}
            </h3>
            <span className="text-[11px] text-slate-500">
              Kelas: {teacher.assignedClassLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Mengajar</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pertemuan Ke-</label>
              <input
                type="number"
                min="1"
                value={meetingNo}
                onChange={(e) => setMeetingNo(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alokasi Jam / Waktu</label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tujuan Pembelajaran (TP)</label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ringkasan Aktivitas Kelas</label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jumlah Siswa Hadir</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={students.length || 30}
                  value={present}
                  onChange={(e) => setPresent(Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-lg border border-slate-300 text-center font-bold"
                  required
                />
                <span className="text-slate-500">dari total {students.length || 20} siswa</span>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catatan Ketidakhadiran</label>
              <input
                type="text"
                value={absentNotes}
                onChange={(e) => setAbsentNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
                placeholder="Contoh: 1 sakit (Nama Siswa)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Refleksi Pembelajaran Guru</label>
              <textarea
                rows={2}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rencana Tindak Lanjut</label>
              <textarea
                rows={2}
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              Simpan Jurnal Mengajar
            </button>
          </div>
        </form>
      )}

      {/* Teaching Logs Timeline / Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Riwayat Pertemuan Terdata ({teachingLogs.length} Sesi)
          </h3>
          <span className="text-xs text-slate-500">
            Pengesahan berkala oleh Kepala Sekolah: {school.principalName}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {teachingLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <CalendarDays className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Belum Ada Sesi Jurnal Mengajar</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Catat pelaksanaan kegiatan pembelajaran harian, presensi kehadiran, refleksi, dan tindak lanjut mengajar Anda.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-3 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Isi Jurnal Pertama</span>
              </button>
            </div>
          ) : (
            teachingLogs.map((log) => (
            <div key={log.id} className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium leading-none text-slate-400">Prtm</span>
                  <span className="text-xs font-bold leading-none mt-0.5">#{log.meetingNo}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{log.date}</span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[11px] font-medium text-slate-600">{log.timeSlot}</span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      {log.subject}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{log.learningObjective}</h4>
                  <p className="text-xs text-slate-600">{log.topicSummary}</p>

                  <div className="mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-700">
                      <span className="font-semibold text-slate-900">Refleksi:</span> {log.reflection}
                    </p>
                    <p className="text-emerald-800 font-medium">
                      <span className="font-semibold text-emerald-950">Tindak Lanjut:</span> {log.followUp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right column: Attendance & Principal Verification */}
              <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 space-y-2">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    {log.attendancePresent}/{log.attendanceTotal} Hadir
                  </div>
                  <div className="text-[11px] text-slate-500">{log.absentNotes}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onToggleVerify(log.id)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      log.verifiedByPrincipal
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{log.verifiedByPrincipal ? 'Telah Disahkan' : 'Klik Sahkan'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteLog(log.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Hapus log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};
