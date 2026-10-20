/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { DashboardView } from './components/modules/DashboardView';
import { MasterDataView } from './components/modules/MasterDataView';
import { CurriculumPlanView } from './components/modules/CurriculumPlanView';
import { LessonPlanView } from './components/modules/LessonPlanView';
import { TeachingLogView } from './components/modules/TeachingLogView';
import { AssessmentView } from './components/modules/AssessmentView';
import { DocumentCenterView } from './components/modules/DocumentCenterView';
import { RegulationView } from './components/modules/RegulationView';
import { AdminPortalLayout } from './components/admin/AdminPortalLayout';
import { AuthScreen } from './components/auth/AuthScreen';
import { ActivationPendingScreen } from './components/auth/ActivationPendingScreen';
import { authService } from './services/authService';
import { validateFirestoreConnection } from './lib/firebase';
import { User } from './types/auth';
import {
  OfficialDocumentPreview,
  PreviewDocType,
} from './components/common/OfficialDocumentPreview';

import {
  initialSchoolProfile,
  sampleMiProfile,
  initialTeacherProfile,
  initialStudents,
  initialSubjects,
  initialLearningOutcomes,
  initialLearningObjectives,
  initialLessonPlans,
  initialAnnualProgram,
  initialSemesterProgram,
  initialTeachingLogs,
  initialAssessments,
  initialGradeRecords,
  initialRegulations,
  initialComplianceChecks,
} from './data/initialData';

import {
  SchoolProfile,
  TeacherProfile,
  Student,
  SubjectItem,
  LessonPlan,
  AnnualProgramItem,
  TeachingLog,
  AssessmentItem,
  GradeRecord,
  ComplianceCheck,
} from './types';

export default function App() {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Master state
  const [currentSchool, setCurrentSchool] = useState<SchoolProfile>(initialSchoolProfile);
  const [teacher, setTeacher] = useState<TeacherProfile>(initialTeacherProfile);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [subjects, setSubjects] = useState<SubjectItem[]>(initialSubjects);

  // Curriculum & Planning state
  const [learningOutcomes] = useState(initialLearningOutcomes);
  const [learningObjectives] = useState(initialLearningObjectives);
  const [annualProgram, setAnnualProgram] = useState<AnnualProgramItem[]>(initialAnnualProgram);
  const [semesterProgram] = useState(initialSemesterProgram);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(initialLessonPlans);

  // Delivery & Assessment state
  const [teachingLogs, setTeachingLogs] = useState<TeachingLog[]>(initialTeachingLogs);
  const [assessments, setAssessments] = useState<AssessmentItem[]>(initialAssessments);
  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>(initialGradeRecords);

  // Regulations & Compliance
  const [regulations] = useState(initialRegulations);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>(initialComplianceChecks);

  // UI state for Teacher Portal
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDocType, setPreviewDocType] = useState<PreviewDocType>('modul');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Synchronize registered user profile with application state
  const applyUserData = (user: User) => {
    if (user.role === 'teacher') {
      setTeacher((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        nip: user.nip || prev.nip,
      }));
      setCurrentSchool((prev) => ({
        ...(user.schoolType === 'MI' ? sampleMiProfile : initialSchoolProfile),
        name: user.schoolName || prev.name,
        type: user.schoolType || prev.type,
      }));
    }
  };

  // Restore authenticated session on mount
  useEffect(() => {
    const saved = authService.getCurrentUser();
    if (saved) {
      setCurrentUser(saved);
      applyUserData(saved);
    }
    setIsAuthLoading(false);
    validateFirestoreConnection().catch((err) => {
      console.warn('Initial Firestore ping note:', err);
    });
  }, []);

  // Handle switching between SD and MI
  const handleSwitchSchool = (type: 'SD' | 'MI') => {
    if (type === 'SD') {
      setCurrentSchool(initialSchoolProfile);
    } else {
      setCurrentSchool(sampleMiProfile);
    }
  };

  // Preview opener
  const handleOpenPreview = (type: PreviewDocType) => {
    setPreviewDocType(type);
    setPreviewOpen(true);
  };

  // Logout handler
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // Loading state
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-300">Memuat Sistem Administrasi Guru...</p>
        </div>
      </div>
    );
  }

  // 1. NOT LOGGED IN -> Show Clean Login & Register Screen
  if (!currentUser) {
    return (
      <AuthScreen
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          applyUserData(user);
        }}
      />
    );
  }

  // 2. LOGGED IN AS TEACHER BUT PENDING ACTIVATION -> Show Activation Lock Screen
  if (currentUser.status === 'pending_activation') {
    return (
      <ActivationPendingScreen
        user={currentUser}
        onActivated={(activatedUser) => {
          setCurrentUser(activatedUser);
          applyUserData(activatedUser);
        }}
        onLogout={handleLogout}
      />
    );
  }

  // 3. ROLE: ADMIN -> DEDICATED ADMIN PORTAL (COMPLETELY ISOLATED FROM TEACHER ADMINISTRATION)
  if (currentUser.role === 'admin') {
    return (
      <AdminPortalLayout
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // 4. ROLE: TEACHER -> DEDICATED TEACHER ADMINISTRATION PORTAL (SD & MI)
  const uncompletedCount = complianceChecks.filter((c) => c.status !== 'Lengkap').length;
  const completionRate = Math.round(
    ((complianceChecks.length - uncompletedCount) / complianceChecks.length) * 100
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navbar Guru */}
      <Navbar
        currentSchool={currentSchool}
        teacher={teacher}
        currentUser={currentUser}
        onSwitchSchool={handleSwitchSchool}
        onOpenQuickPrint={() => handleOpenPreview('modul')}
        onLogout={handleLogout}
        completionRate={completionRate}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Container Guru */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Menu Guru */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            uncompletedCount={uncompletedCount}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Module Content Guru */}
          <section className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardView
                school={currentSchool}
                teacher={teacher}
                lessonPlans={lessonPlans}
                annualProgram={annualProgram}
                teachingLogs={teachingLogs}
                gradeRecords={gradeRecords}
                complianceChecks={complianceChecks}
                onNavigate={setActiveTab}
                onOpenPreview={handleOpenPreview}
              />
            )}

            {activeTab === 'master_data' && (
              <MasterDataView
                school={currentSchool}
                teacher={teacher}
                students={students}
                subjects={subjects}
                onUpdateSchool={setCurrentSchool}
                onUpdateTeacher={setTeacher}
                onAddStudent={(newStd) => setStudents((prev) => [...prev, newStd])}
                onDeleteStudent={(id) => setStudents((prev) => prev.filter((s) => s.id !== id))}
                onAddSubject={(newSbj) => setSubjects((prev) => [...prev, newSbj])}
                onDeleteSubject={(id) => setSubjects((prev) => prev.filter((s) => s.id !== id))}
              />
            )}

            {activeTab === 'curriculum_planning' && (
              <CurriculumPlanView
                school={currentSchool}
                teacher={teacher}
                learningOutcomes={learningOutcomes}
                learningObjectives={learningObjectives}
                annualProgram={annualProgram}
                semesterProgram={semesterProgram}
                onAddAnnualItem={(item) => setAnnualProgram((prev) => [...prev, item])}
                onDeleteAnnualItem={(no) => setAnnualProgram((prev) => prev.filter((a) => a.no !== no))}
                onOpenPreview={() => handleOpenPreview('prota')}
              />
            )}

            {activeTab === 'lesson_plan' && (
              <LessonPlanView
                school={currentSchool}
                teacher={teacher}
                lessonPlans={lessonPlans}
                onAddLessonPlan={(plan) => setLessonPlans((prev) => [plan, ...prev])}
                onUpdateLessonPlan={(updated) =>
                  setLessonPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                }
                onDeleteLessonPlan={(id) => setLessonPlans((prev) => prev.filter((p) => p.id !== id))}
                onOpenPreview={() => handleOpenPreview('modul')}
              />
            )}

            {activeTab === 'teaching_delivery' && (
              <TeachingLogView
                school={currentSchool}
                teacher={teacher}
                students={students}
                teachingLogs={teachingLogs}
                onAddLog={(log) => setTeachingLogs((prev) => [log, ...prev])}
                onDeleteLog={(id) => setTeachingLogs((prev) => prev.filter((l) => l.id !== id))}
                onToggleVerify={(id) =>
                  setTeachingLogs((prev) =>
                    prev.map((l) =>
                      l.id === id ? { ...l, verifiedByPrincipal: !l.verifiedByPrincipal } : l
                    )
                  )
                }
                onOpenPreview={() => handleOpenPreview('jurnal')}
              />
            )}

            {activeTab === 'assessment' && (
              <AssessmentView
                school={currentSchool}
                teacher={teacher}
                students={students}
                assessments={assessments}
                gradeRecords={gradeRecords}
                onUpdateGrade={(studentId, updated) =>
                  setGradeRecords((prev) =>
                    prev.map((r) => (r.studentId === studentId ? { ...r, ...updated } : r))
                  )
                }
                onAddAssessment={(newAsm) => setAssessments((prev) => [newAsm, ...prev])}
                onOpenPreview={handleOpenPreview}
              />
            )}

            {activeTab === 'document_center' && (
              <DocumentCenterView
                school={currentSchool}
                teacher={teacher}
                lessonPlans={lessonPlans}
                annualProgram={annualProgram}
                teachingLogs={teachingLogs}
                gradeRecords={gradeRecords}
                onOpenPreview={handleOpenPreview}
              />
            )}

            {activeTab === 'regulation_engine' && (
              <RegulationView
                regulations={regulations}
                complianceChecks={complianceChecks}
                onToggleStatus={(id) =>
                  setComplianceChecks((prev) =>
                    prev.map((c) =>
                      c.id === id
                        ? { ...c, status: c.status === 'Lengkap' ? 'Perhatian' : 'Lengkap' }
                        : c
                    )
                  )
                }
              />
            )}
          </section>
        </div>
      </main>

      {/* Official Printable Document Preview Modal */}
      <OfficialDocumentPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        docType={previewDocType}
        school={currentSchool}
        teacher={teacher}
        activePlan={lessonPlans[0]}
        annualItems={annualProgram}
        teachingLogs={teachingLogs}
        gradeRecords={gradeRecords}
        assessment={assessments[0]}
      />
    </div>
  );
}
