import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client safely with fallback
let aiClient: GoogleGenAI | null = null;
try {
  // Checks environment API key if injected
  aiClient = new GoogleGenAI();
} catch (e) {
  console.warn('Gemini AI client initialization skipped or running client-side without key', e);
}

export interface GeneratedPlanDraft {
  meaningfulUnderstanding: string;
  triggerQuestions: string[];
  introActivities: string[];
  coreActivities: string[];
  closingActivities: string[];
  diagnosticAssessment: string;
  formativeAssessment: string;
  summativeAssessment: string;
  remedialPlan: string;
  enrichmentPlan: string;
}

export interface GeneratedAssessmentDraft {
  questions: {
    number: number;
    text: string;
    options?: string[];
    correctAnswer: string;
    scoreWeight: number;
  }[];
  rubricNotes: string;
}

/**
 * Generate a complete differentiated lesson plan draft tailored for Indonesian SD/MI
 */
export async function generateLessonPlanAI(
  topic: string,
  subject: string,
  grade: number,
  schoolType: 'SD' | 'MI',
  learningObjective: string
): Promise<GeneratedPlanDraft> {
  const prompt = `Anda adalah pakar kurikulum dan pengembang modul ajar SD/MI Indonesia berpengalaman sesuai Permendikdasmen No. 1 Tahun 2026.
Tolong buatkan draf rincian kegiatan pembelajaran dan asesmen berdiferensiasi untuk:
- Jenjang: ${schoolType} Kelas ${grade}
- Mata Pelajaran: ${subject}
- Topik: ${topic}
- Tujuan Pembelajaran: ${learningObjective}

Berikan output dalam format JSON valid murni (tanpa markdown blok pembuka/penutup bila memungkinkan, atau json valid) dengan struktur objek:
{
  "meaningfulUnderstanding": "Pemahaman bermakna bagi peserta didik usia SD/MI...",
  "triggerQuestions": ["Pertanyaan pemantik 1?", "Pertanyaan pemantik 2?", "Pertanyaan pemantik 3?"],
  "introActivities": ["Aktivitas pendahuluan 1 (salam, apersepsi konkrit)", "Aktivitas pendahuluan 2 (motivasi & kesepakatan)"],
  "coreActivities": ["Langkah 1: Orientasi masalah nyata", "Langkah 2: Penyelidikan aktif/kelompok", "Langkah 3: Pembuatan karya sederhana", "Langkah 4: Berbagi dan refleksi"],
  "closingActivities": ["Aktivitas penutup 1 (simpulan bersama)", "Aktivitas penutup 2 (refleksi perasaan & doa)"],
  "diagnosticAssessment": "Asesmen awal sederhana...",
  "formativeAssessment": "Asesmen proses (observasi diskusi & rubrik LKPD)...",
  "summativeAssessment": "Asesmen akhir lingkup materi...",
  "remedialPlan": "Bimbingan terarah bagi siswa yang belum tuntas...",
  "enrichmentPlan": "Tantangan eksplorasi bagi siswa yang tuntas cepat..."
}`;

  try {
    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text?.trim();
      if (text) {
        // Strip code fences if present
        const cleaned = text.replace(/^```json\s*/, '').replace(/```\s*$/, '');
        const parsed = JSON.parse(cleaned);
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gemini API call failed, falling back to curated Indonesian pedagogical template:', err);
  }

  // High quality curated fallback if API is not configured
  return {
    meaningfulUnderstanding: `Memahami konsep ${topic} membantu peserta didik menyadari keteraturan ciptaan Tuhan dan menerapkannya dalam memecahkan masalah sehari-hari di lingkungan rumah dan sekolah.`,
    triggerQuestions: [
      `Pernahkah kalian melihat peristiwa ${topic} secara langsung di sekitar rumah kalian?`,
      `Apa yang kira-kira terjadi jika fenomena ini tidak berjalan seimbang di alam?`,
      `Bagaimana cara kita membuktikan kebenaran hal ini melalui pengamatan sederhana?`,
    ],
    introActivities: [
      'Guru membuka pembelajaran dengan salam ceria, doa bersama, dan mengecek kesiapan fisik serta emosional siswa (5 menit).',
      `Apersepsi: Guru menampilkan gambar/benda nyata terkait ${topic} dan memantik rasa ingin tahu siswa melalui tebakan singkat (5 menit).`,
      'Guru menyampaikan tujuan pembelajaran, cakupan aktivitas, serta kriteria keberhasilan yang akan dicapai bersama (5 menit).',
    ],
    coreActivities: [
      `Orientasi Masalah: Peserta didik mengamati kasus atau fenomena kontekstual tentang ${topic} yang disajikan guru (10 menit).`,
      'Organisasi Kelompok: Siswa berkolaborasi dalam kelompok kecil heterogen (4-5 siswa) dan menerima LKPD berbasis eksplorasi (10 menit).',
      'Penyelidikan Terbimbing: Peserta didik melakukan pengamatan, mencatat fakta, dan mendiskusikan temuan dengan panduan bertahap (15 menit).',
      'Penyajian Hasil: Setiap kelompok membagikan simpulan mereka melalui diagram mini atau presentasi singkat di depan kelas (15 menit).',
      'Penguatan Konsep: Guru meluruskan miskonsepsi dan memberikan penguatan konsep inti secara interaktif (10 menit).',
    ],
    closingActivities: [
      'Guru memfasilitasi peserta didik menarik 2 poin simpulan terpenting dari kegiatan hari ini (5 menit).',
      'Refleksi Diri: Siswa mengacungkan jempol atau kartu warna untuk menunjukkan tingkat kepahaman mereka (3 menit).',
      'Penyampaian tindak lanjut, apresiasi usaha seluruh peserta didik, doa penutup, dan salam hangat (2 menit).',
    ],
    diagnosticAssessment: `Tanya jawab lisan santai di awal pelajaran tentang pengalaman peserta didik terkait ${topic}.`,
    formativeAssessment: 'Lembar observasi keaktifan diskusi, kemampuan bekerja sama, dan kelengkapan lembar kerja siswa (LKPD).',
    summativeAssessment: 'Kuis akhir berupa 5 soal pilihan ganda kontekstual dan 1 soal penjelasan penalaran sederhana.',
    remedialPlan: 'Pendampingan khusus secara personal dengan media kartu gambar bergambar dan bantuan tutor sebaya.',
    enrichmentPlan: 'Diberikan lembar tantangan mini riset sederhana untuk meneliti penerapan materi pada kasus yang lebih kompleks.',
  };
}

/**
 * Generate quick assessment questions and rubric
 */
export async function generateAssessmentAI(
  topic: string,
  grade: number,
  count: number = 3
): Promise<GeneratedAssessmentDraft> {
  const prompt = `Buatkan ${count} butir soal pilihan ganda asesmen sumatif SD/MI kelas ${grade} untuk materi: "${topic}".
Format JSON:
{
  "questions": [
    {
      "number": 1,
      "text": "Pertanyaan...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A. ...",
      "scoreWeight": 25
    }
  ],
  "rubricNotes": "Catatan penilaian dan rubrik kriteria ketuntasan..."
}`;

  try {
    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });
      const text = response.text?.trim();
      if (text) {
        const cleaned = text.replace(/^```json\s*/, '').replace(/```\s*$/, '');
        return JSON.parse(cleaned);
      }
    }
  } catch (e) {
    console.warn('Gemini assessment fallback:', e);
  }

  return {
    questions: [
      {
        number: 1,
        text: `Manakah pernyataan yang paling tepat mengenai konsep ${topic}?`,
        options: [
          'A. Merupakan proses penting yang mendukung kelangsungan hidup lingkungan sekitar.',
          'B. Terjadi hanya ketika tidak ada interaksi dengan makhluk lain.',
          'C. Tidak memberikan pengaruh apapun bagi keseimbangan alam.',
          'D. Selalu berlangsung tanpa memerlukan energi atau bahan awal.',
        ],
        correctAnswer: 'A. Merupakan proses penting yang mendukung kelangsungan hidup lingkungan sekitar.',
        scoreWeight: 30,
      },
      {
        number: 2,
        text: `Dalam kehidupan sehari-hari siswa kelas ${grade}, contoh penerapan dari ${topic} dapat ditemukan pada ...`,
        options: [
          'A. Menjaga kebersihan tanaman dan memanfaatkan sumber daya secara bijak.',
          'B. Membiarkan sampah menumpuk di saluran air sekolah.',
          'C. Menutup semua ventilasi udara di dalam kelas.',
          'D. Merusak sarana pembelajaran yang ada di taman.',
        ],
        correctAnswer: 'A. Menjaga kebersihan tanaman dan memanfaatkan sumber daya secara bijak.',
        scoreWeight: 35,
      },
      {
        number: 3,
        text: `Apa akibat yang paling mungkin timbul jika peserta didik tidak memahami peran ${topic}?`,
        options: [
          'A. Kesulitan menghubungkan materi sains dengan fenomena di lingkungan sekitar.',
          'B. Nilai kehadiran siswa otomatis terhapus.',
          'C. Seluruh tanaman di halaman sekolah mendadak layu.',
          'D. Jam istirahat sekolah menjadi berkurang.',
        ],
        correctAnswer: 'A. Kesulitan menghubungkan materi sains dengan fenomena di lingkungan sekitar.',
        scoreWeight: 35,
      },
    ],
    rubricNotes: 'Skor maksimal 100. Siswa dengan nilai di bawah 75 diberikan penguatan konsep lewat remedial kartu belajar.',
  };
}
