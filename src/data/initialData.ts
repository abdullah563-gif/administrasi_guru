import {
  SchoolProfile,
  TeacherProfile,
  Student,
  SubjectItem,
  LearningOutcome,
  LearningObjective,
  LessonPlan,
  AnnualProgramItem,
  SemesterProgramItem,
  TeachingLog,
  AssessmentItem,
  GradeRecord,
  RegulationReference,
  ComplianceCheck,
} from '../types';

export const initialSchoolProfile: SchoolProfile = {
  id: 'sch-001',
  name: '',
  type: 'SD',
  npsn: '',
  nsm: '',
  address: '',
  subdistrict: '',
  city: '',
  province: '',
  postalCode: '',
  principalName: '',
  principalNip: '',
  academicYear: '2026/2027',
  currentSemester: 'Ganjil',
};

export const sampleMiProfile: SchoolProfile = {
  id: 'sch-002',
  name: '',
  type: 'MI',
  npsn: '',
  nsm: '',
  address: '',
  subdistrict: '',
  city: '',
  province: '',
  postalCode: '',
  principalName: '',
  principalNip: '',
  academicYear: '2026/2027',
  currentSemester: 'Ganjil',
};

export const initialTeacherProfile: TeacherProfile = {
  id: 'tch-001',
  fullName: '',
  nip: '',
  nuptk: '',
  role: 'Guru Kelas',
  assignedGrade: 1,
  assignedClassLabel: '',
  assignedSubjects: [],
  signatureDateCity: '',
};

// Data pengguna kosong siap diisi dari awal
export const initialStudents: Student[] = [];

export const initialSubjects: SubjectItem[] = [];

export const initialLearningOutcomes: LearningOutcome[] = [];

export const initialLearningObjectives: LearningObjective[] = [];

export const initialLessonPlans: LessonPlan[] = [];

export const initialAnnualProgram: AnnualProgramItem[] = [];

export const initialSemesterProgram: SemesterProgramItem[] = [];

export const initialTeachingLogs: TeachingLog[] = [];

export const initialAssessments: AssessmentItem[] = [];

export const initialGradeRecords: GradeRecord[] = [];

// Referensi hukum & regulasi resmi pemerintah (tetap tersedia sebagai acuan standar)
export const initialRegulations: RegulationReference[] = [
  {
    id: 'reg-01',
    code: 'Permendikdasmen No. 1 Tahun 2026',
    title: 'Standar Proses pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah',
    topic: 'Standar Proses & Perencanaan Pembelajaran',
    effectiveDate: '15 Januari 2026',
    sourceUrl: 'https://peraturan.bpk.go.id/Details/344196/permendikdasmen-no-1-tahun-2026',
    status: 'Aktif & Berlaku',
    highlights: [
      'Menetapkan penyusunan dokumen perencanaan pembelajaran (Modul Ajar/RPP) yang fleksibel, berpusat pada peserta didik, dan berdiferensiasi.',
      'Menegaskan prinsip pelaksanaan asesmen awal untuk pemetaan kesiapan belajar siswa.',
      'Dokumen perencanaan pembelajaran minimal memuat tujuan pembelajaran, langkah/kegiatan pembelajaran, dan rencana asesmen.',
    ],
  },
  {
    id: 'reg-02',
    code: 'Permendikdasmen No. 12 Tahun 2025',
    title: 'Standar Isi pada Pendidikan Dasar dan Jenjang Pendidikan Menengah',
    topic: 'Standar Isi & Ruang Lingkup Materi',
    effectiveDate: '10 Juni 2025',
    sourceUrl: 'https://peraturan.bpk.go.id/Details/322494/permendikdasmen-no-12-tahun-2025',
    status: 'Aktif & Berlaku',
    highlights: [
      'Menyederhanakan substansi materi ajar agar berfokus pada kedalaman literasi dan numerasi esensial.',
      'Penyesuaian capaian kompetensi dasar per fase pada jenjang SD/MI.',
    ],
  },
  {
    id: 'reg-03',
    code: 'Permendikdasmen No. 13 Tahun 2025',
    title: 'Perubahan Ketentuan Kurikulum Nasional',
    topic: 'Pembaruan Struktur Kurikulum & Beban Belajar',
    effectiveDate: '22 Juli 2025',
    sourceUrl: 'https://peraturan.bpk.go.id/Details/322506/permendikdasmen-no-13-tahun-2025',
    status: 'Aktif & Berlaku',
    highlights: [
      'Pemberian otonomi lebih luas bagi satuan pendidikan untuk mengatur alokasi waktu mata pelajaran.',
      'Penguatan integrasi profil pelajar pancasila ke dalam kegiatan intrakurikuler dan kokurikuler.',
    ],
  },
  {
    id: 'reg-04',
    code: 'UU Nomor 27 Tahun 2022',
    title: 'Pelindungan Data Pribadi (UU PDP)',
    topic: 'Privasi Data Siswa & Dokumen Sekolah',
    effectiveDate: '17 Oktober 2024',
    sourceUrl: 'https://peraturan.bpk.go.id/',
    status: 'Aktif & Berlaku',
    highlights: [
      'Mengharuskan perlindungan ketat terhadap data sensitif anak (NISN, data keluarga, nilai pribadi).',
      'Minimalkan pengiriman data pribadi siswa ke platform pihak ketiga atau mesin kecerdasan buatan.',
    ],
  },
];

export const initialComplianceChecks: ComplianceCheck[] = [
  {
    id: 'cmp-01',
    title: 'Komponen Minimal Modul Ajar (Tujuan, Langkah, Asesmen)',
    regulationSource: 'Permendikdasmen No. 1 Th 2026 Pasal 6',
    mandatory: true,
    status: 'Belum',
    notes: 'Modul Ajar memuat 3 pilar wajib: Tujuan Pembelajaran terukur, Langkah pembelajaran bermakna, dan Instrumen Asesmen formatif & sumatif.',
  },
  {
    id: 'cmp-02',
    title: 'Pelaksanaan Asesmen Diagnostik / Awal Pembelajaran',
    regulationSource: 'Permendikdasmen No. 1 Th 2026 Pasal 9',
    mandatory: true,
    status: 'Belum',
    notes: 'Instrumen asesmen awal dirancang untuk memetakan kesiapan dan gaya belajar siswa sebelum materi inti.',
  },
  {
    id: 'cmp-03',
    title: 'Kesesuaian Alokasi Waktu Jam Pelajaran (JP) dengan Struktur Kurikulum',
    regulationSource: 'Permendikdasmen No. 13 Th 2025',
    mandatory: true,
    status: 'Belum',
    notes: 'Alokasi Prota dan Promes per mata pelajaran sesuai dengan ketetapan jam pelajaran mingguan sekolah.',
  },
  {
    id: 'cmp-04',
    title: 'Kerahasiaan Data Siswa pada Rekap Nilai & Asesmen',
    regulationSource: 'UU No. 27 Th 2022 (UU PDP)',
    mandatory: true,
    status: 'Belum',
    notes: 'Data identitas siswa dienkripsi lokal, bebas dari pengiriman data pribadi mentah ke sistem terbuka.',
  },
  {
    id: 'cmp-05',
    title: 'Pengesahan Dokumen oleh Kepala Sekolah & Tanda Tangan Guru',
    regulationSource: 'Standar Akreditasi BAN-PDM',
    mandatory: true,
    status: 'Belum',
    notes: 'Format dokumen menyertakan kolom pengesahan lengkap dengan NIP dan tanggal resmi.',
  },
];
