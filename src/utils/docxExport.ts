import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  Footer,
  PageNumber,
} from 'docx';
import { saveAs } from 'file-saver';
import {
  LessonPlan,
  SchoolProfile,
  TeacherProfile,
  AnnualProgramItem,
  SemesterProgramItem,
  TeachingLog,
  AssessmentItem,
  GradeRecord,
} from '../types';

// Helper to create official Indonesian Kop Surat paragraph
function createKopSurat(school: SchoolProfile): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: school.type === 'MI' ? 'KEMENTERIAN AGAMA REPUBLIK INDONESIA' : 'PEMERINTAH DAERAH ' + school.province.toUpperCase(),
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (school.type === 'MI' ? 'KANTOR KEMENTERIAN AGAMA ' : 'DINAS PENDIDIKAN ') + school.city.toUpperCase(),
          bold: true,
          size: 24,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: school.name.toUpperCase(),
          bold: true,
          size: 28,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${school.address}, ${school.city}. NPSN: ${school.npsn}${school.nsm ? ` / NSM: ${school.nsm}` : ''}`,
          size: 18,
          italics: true,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: {
        bottom: {
          style: BorderStyle.DOUBLE,
          size: 16,
          color: '000000',
        },
      },
      children: [],
    }),
    new Paragraph({ children: [] }), // spacer
  ];
}

// Helper for official signatures table
function createSignatureTable(school: SchoolProfile, teacher: TeacherProfile, docTitleDate?: string): Table {
  const dateStr = docTitleDate || `${school.city}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Mengetahui,', font: 'Times New Roman', size: 22 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: school.type === 'MI' ? 'Kepala Madrasah,' : 'Kepala Sekolah,',
                    bold: true,
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({ text: '', spacing: { after: 1200 } }), // Signature space
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: school.principalName,
                    bold: true,
                    underline: {},
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `NIP. ${school.principalNip}`, font: 'Times New Roman', size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: dateStr, font: 'Times New Roman', size: 22 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Guru Kelas / Mata Pelajaran,', bold: true, font: 'Times New Roman', size: 22 })],
              }),
              new Paragraph({ text: '', spacing: { after: 1200 } }), // Signature space
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: teacher.fullName,
                    bold: true,
                    underline: {},
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `NIP. ${teacher.nip}`, font: 'Times New Roman', size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Export Modul Ajar / RPP to true DOCX format
 */
export async function exportLessonPlanDocx(plan: LessonPlan, school: SchoolProfile, teacher: TeacherProfile) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }, // 1 inch / 2.54 cm margins
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: `${school.name} | Modul Ajar - Halaman `, size: 18, font: 'Times New Roman' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Times New Roman' }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...createKopSurat(school),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN (RPP)',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Tahun Ajaran ${school.academicYear} | Semester ${plan.semester}`,
                italics: true,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),

          // Identitas Umum
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'A. INFORMASI UMUM', bold: true, size: 24, font: 'Times New Roman' })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              ['Nama Penyusun', teacher.fullName],
              ['Instansi / Satuan Pendidikan', school.name],
              ['Tahun Pelajaran', school.academicYear],
              ['Jenjang Sekolah / Fase', `${school.type} / Fase B (Kelas ${plan.grade})`],
              ['Mata Pelajaran', plan.subject],
              ['Alokasi Waktu', plan.allocatedTime],
              ['Target Peserta Didik', plan.targetStudents],
              ['Model Pembelajaran', plan.model],
              ['Profil Pelajar Pancasila', plan.profilPancasila.join(', ')],
              ['Sarana dan Prasarana', plan.saranaPrasarana],
            ].map(([k, v]) => (
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, size: 20, font: 'Times New Roman' })] })],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: v, size: 20, font: 'Times New Roman' })] })],
                  }),
                ],
              })
            )),
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Komponen Inti
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'B. KOMPONEN INTI', bold: true, size: 24, font: 'Times New Roman' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: '1. Tujuan Pembelajaran:', bold: true, size: 22, font: 'Times New Roman' })],
          }),
          ...plan.learningObjectives.map(
            (obj, idx) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: `${obj}`, size: 20, font: 'Times New Roman' })],
              })
          ),

          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({ text: '2. Pemahaman Bermakna:', bold: true, size: 22, font: 'Times New Roman' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: plan.meaningfulUnderstanding, size: 20, font: 'Times New Roman' })],
          }),

          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({ text: '3. Pertanyaan Pemantik:', bold: true, size: 22, font: 'Times New Roman' })],
          }),
          ...plan.triggerQuestions.map(
            (q) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: q, size: 20, font: 'Times New Roman' })],
              })
          ),

          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({ text: '4. Kegiatan Pembelajaran (Berdiferensiasi):', bold: true, size: 22, font: 'Times New Roman' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: 'a. Kegiatan Pendahuluan:', bold: true, size: 20, font: 'Times New Roman' })],
          }),
          ...plan.introActivities.map(
            (act) =>
              new Paragraph({
                bullet: { level: 1 },
                children: [new TextRun({ text: act, size: 20, font: 'Times New Roman' })],
              })
          ),
          new Paragraph({
            children: [new TextRun({ text: 'b. Kegiatan Inti:', bold: true, size: 20, font: 'Times New Roman' })],
          }),
          ...plan.coreActivities.map(
            (act) =>
              new Paragraph({
                bullet: { level: 1 },
                children: [new TextRun({ text: act, size: 20, font: 'Times New Roman' })],
              })
          ),
          new Paragraph({
            children: [new TextRun({ text: 'c. Kegiatan Penutup:', bold: true, size: 20, font: 'Times New Roman' })],
          }),
          ...plan.closingActivities.map(
            (act) =>
              new Paragraph({
                bullet: { level: 1 },
                children: [new TextRun({ text: act, size: 20, font: 'Times New Roman' })],
              })
          ),

          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({ text: '5. Rencana Asesmen:', bold: true, size: 22, font: 'Times New Roman' })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Asesmen Awal/Diagnostik: ', bold: true, size: 20, font: 'Times New Roman' }),
              new TextRun({ text: plan.assessmentTypes.diagnostic, size: 20, font: 'Times New Roman' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Asesmen Formatif: ', bold: true, size: 20, font: 'Times New Roman' }),
              new TextRun({ text: plan.assessmentTypes.formative, size: 20, font: 'Times New Roman' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Asesmen Sumatif: ', bold: true, size: 20, font: 'Times New Roman' }),
              new TextRun({ text: plan.assessmentTypes.summative, size: 20, font: 'Times New Roman' }),
            ],
          }),

          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({ text: '6. Kegiatan Pengayaan dan Remedial:', bold: true, size: 22, font: 'Times New Roman' })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Program Remedial: ', bold: true, size: 20, font: 'Times New Roman' }),
              new TextRun({ text: plan.remedialPlan, size: 20, font: 'Times New Roman' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Program Pengayaan: ', bold: true, size: 20, font: 'Times New Roman' }),
              new TextRun({ text: plan.enrichmentPlan, size: 20, font: 'Times New Roman' }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 500 } }),
          createSignatureTable(school, teacher),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Modul_Ajar_${plan.subject.replace(/[^a-zA-Z0-9]/g, '_')}_Kelas_${plan.grade}.docx`;
  saveAs(blob, fileName);
}

/**
 * Export Program Tahunan (Prota) to DOCX
 */
export async function exportProtaDocx(
  items: AnnualProgramItem[],
  school: SchoolProfile,
  teacher: TeacherProfile,
  subjectName: string
) {
  const totalJP = items.reduce((acc, curr) => acc + curr.allocatedHours, 0);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          ...createKopSurat(school),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'PROGRAM TAHUNAN (PROTA)',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Mata Pelajaran: ${subjectName} | Kelas: ${teacher.assignedClassLabel} | Tahun Ajaran: ${school.academicYear}`,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, size: 20, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kode TP', bold: true, size: 20, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tujuan Pembelajaran & Materi Pokok', bold: true, size: 20, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Alokasi (JP)', bold: true, size: 20, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Semester', bold: true, size: 20, font: 'Times New Roman' })] })] }),
                ],
              }),
              ...items.map(
                (item) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.no), size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.tpCode, size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({
                        children: [
                          new Paragraph({ children: [new TextRun({ text: item.topic, bold: true, size: 18, font: 'Times New Roman' })] }),
                          new Paragraph({ children: [new TextRun({ text: item.learningObjective, size: 18, font: 'Times New Roman' })] }),
                        ],
                      }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.allocatedHours} JP`, size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.semester, size: 18, font: 'Times New Roman' })] })] }),
                    ],
                  })
              ),
              new TableRow({
                children: [
                  new TableCell({ columnSpan: 3, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Total Alokasi Jam Pelajaran (JP):', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${totalJP} JP`, bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '' })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 500 } }),
          createSignatureTable(school, teacher),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Program_Tahunan_Prota_${subjectName.replace(/[^a-zA-Z0-9]/g, '_')}_${school.academicYear.replace('/', '-')}.docx`);
}

/**
 * Export Jurnal Mengajar Harian to DOCX
 */
export async function exportTeachingLogDocx(logs: TeachingLog[], school: SchoolProfile, teacher: TeacherProfile) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          ...createKopSurat(school),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'JURNAL HARIAN PELAKSANAAN PEMBELAJARAN GURU',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Nama Guru: ${teacher.fullName} | Kelas: ${teacher.assignedClassLabel} | Semester: ${school.currentSemester} ${school.academicYear}`,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Prtm', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hari/Tanggal', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 32, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tujuan & Materi Pokok', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kehadiran', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Refleksi & Tindak Lanjut', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                ],
              }),
              ...logs.map(
                (log) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `#${log.meetingNo}`, size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: log.date, bold: true, size: 18, font: 'Times New Roman' }), new TextRun({ text: `\n${log.timeSlot}`, size: 16, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: log.learningObjective, bold: true, size: 18, font: 'Times New Roman' }), new TextRun({ text: `\n${log.topicSummary}`, size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${log.attendancePresent}/${log.attendanceTotal} Hadir\n(${log.absentNotes})`, size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Refleksi: ${log.reflection}\nTL: ${log.followUp}`, size: 18, font: 'Times New Roman' })] })] }),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 500 } }),
          createSignatureTable(school, teacher),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Jurnal_Mengajar_Guru_${teacher.assignedClassLabel}_${school.academicYear.replace('/', '-')}.docx`);
}

/**
 * Export Rekap Nilai Siswa to DOCX
 */
export async function exportGradebookDocx(
  grades: GradeRecord[],
  school: SchoolProfile,
  teacher: TeacherProfile,
  subject: string
) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          ...createKopSurat(school),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'DAFTAR REKAPITULASI NILAI PESERTA DIDIK',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Mata Pelajaran: ${subject} | Kelas: ${teacher.assignedClassLabel} | Semester ${school.currentSemester} TP ${school.academicYear}`,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nama Peserta Didik', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'F-1', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'F-2', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sum LM', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sum SAS', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Akhir', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Status', bold: true, size: 18, font: 'Times New Roman' })] })] }),
                ],
              }),
              ...grades.map(
                (item, idx) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.studentName, size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.formatif1), size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.formatif2), size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.sumatifLM), size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.sumatifAkhir), size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.finalScore), bold: true, size: 18, font: 'Times New Roman' })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.status, size: 18, font: 'Times New Roman' })] })] }),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 500 } }),
          createSignatureTable(school, teacher),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Rekap_Nilai_${subject.replace(/[^a-zA-Z0-9]/g, '_')}_${teacher.assignedClassLabel}.docx`);
}
