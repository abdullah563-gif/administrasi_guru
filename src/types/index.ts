export type EducationLevel = 'SD' | 'MI';
export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type PhaseLevel = 'Fase A (Kelas 1-2)' | 'Fase B (Kelas 3-4)' | 'Fase C (Kelas 5-6)';
export type SemesterType = 'Ganjil' | 'Genap';

export interface SchoolProfile {
  id: string;
  name: string;
  type: EducationLevel;
  npsn: string;
  nsm?: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
  principalName: string;
  principalNip: string;
  academicYear: string;
  currentSemester: SemesterType;
  logoUrl?: string;
}

export interface TeacherProfile {
  id: string;
  fullName: string;
  nip: string;
  nuptk: string;
  role: 'Guru Kelas' | 'Guru Mata Pelajaran' | 'Kepala Sekolah';
  assignedGrade: GradeLevel;
  assignedClassLabel: string; // e.g. "4-A"
  assignedSubjects: string[];
  signatureDateCity: string;
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classLabel: string;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  category: 'Wajib' | 'Pilihan' | 'Khas MI/Agama';
  weeklyHours: number; // JP per minggu
}

export interface LearningOutcome {
  id: string;
  subjectId: string;
  phase: PhaseLevel;
  element: string; // misal: "Menyimak", "Membaca dan Memirsa", "Bilangan", "Aljabar"
  statement: string;
}

export interface LearningObjective {
  id: string;
  outcomeId: string;
  code: string; // misal: TP 4.1
  description: string;
  allocatedHours: number; // Alokasi JP
  semester: SemesterType;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: GradeLevel;
  classLabel: string;
  semester: SemesterType;
  academicYear: string;
  allocatedTime: string; // e.g. "2 x 35 Menit (1 Pertemuan)"
  targetStudents: string; // e.g. "Peserta Didik Reguler (28 Siswa)"
  model: string; // e.g. "Problem Based Learning (PBL) / Discovery Learning"
  profilPancasila: string[]; // e.g. ["Bernalar Kritis", "Gotong Royong", "Mandiri"]
  saranaPrasarana: string;
  learningObjectives: string[];
  meaningfulUnderstanding: string;
  triggerQuestions: string[];
  introActivities: string[];
  coreActivities: string[];
  closingActivities: string[];
  assessmentTypes: {
    diagnostic: string;
    formative: string;
    summative: string;
  };
  remedialPlan: string;
  enrichmentPlan: string;
  status: 'draft' | 'validated' | 'approved';
  createdAt: string;
  updatedAt: string;
}

export interface AnnualProgramItem {
  no: number;
  tpCode: string;
  topic: string;
  learningObjective: string;
  allocatedHours: number;
  semester: SemesterType;
}

export interface SemesterProgramWeek {
  month: string;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5?: number;
}

export interface SemesterProgramItem {
  no: number;
  tpCode: string;
  materi: string;
  totalHours: number;
  distribution: {
    [month: string]: number[]; // hours per week
  };
}

export interface TeachingLog {
  id: string;
  date: string;
  classLabel: string;
  subject: string;
  meetingNo: number;
  timeSlot: string; // e.g. "07:30 - 08:40"
  learningObjective: string;
  topicSummary: string;
  attendancePresent: number;
  attendanceTotal: number;
  absentNotes: string;
  reflection: string;
  followUp: string;
  verifiedByPrincipal: boolean;
}

export interface AssessmentItem {
  id: string;
  title: string;
  type: 'Formatif' | 'Sumatif Lingkup Materi' | 'Sumatif Akhir Semester';
  subject: string;
  grade: GradeLevel;
  tpReference: string;
  kisiKisi: {
    indicator: string;
    cognitiveLevel: 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
    questionType: 'Pilihan Ganda' | 'Isian' | 'Uraian';
    questionCount: number;
  }[];
  questions: {
    number: number;
    text: string;
    options?: string[];
    correctAnswer: string;
    scoreWeight: number;
  }[];
  rubricCriteria: {
    aspect: string;
    good: string;
    adequate: string;
    needsImprovement: string;
  }[];
}

export interface GradeRecord {
  studentId: string;
  studentName: string;
  formatif1: number;
  formatif2: number;
  formatif3: number;
  sumatifLM: number;
  sumatifAkhir: number;
  finalScore: number;
  achievementNotes: string;
  status: 'Tuntas' | 'Perlu Bimbingan';
}

export interface RegulationReference {
  id: string;
  code: string;
  title: string;
  topic: string;
  effectiveDate: string;
  sourceUrl: string;
  status: 'Aktif & Berlaku' | 'Perlu Verifikasi';
  highlights: string[];
}

export interface ComplianceCheck {
  id: string;
  title: string;
  regulationSource: string;
  mandatory: boolean;
  status: 'Lengkap' | 'Perhatian' | 'Belum';
  notes: string;
}
