import React from 'react';
import {
  LayoutGrid,
  Building2,
  Compass,
  BookOpen,
  CalendarDays,
  FileCheck2,
  Files,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'master_data'
  | 'curriculum_planning'
  | 'lesson_plan'
  | 'teaching_delivery'
  | 'assessment'
  | 'document_center'
  | 'regulation_engine';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  uncompletedCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  uncompletedCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard & Progres',
      icon: LayoutGrid,
      badge: null,
      badgeColor: null,
    },
    {
      id: 'master_data' as ActiveTab,
      label: 'Data Master',
      icon: Building2,
      badge: 'Sekolah & Guru',
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'curriculum_planning' as ActiveTab,
      label: 'Kurikulum & Prota/Promes',
      icon: Compass,
      badge: null,
      badgeColor: null,
    },
    {
      id: 'lesson_plan' as ActiveTab,
      label: 'Modul Ajar / RPP',
      icon: BookOpen,
      hasAi: true,
      badge: null,
      badgeColor: null,
    },
    {
      id: 'teaching_delivery' as ActiveTab,
      label: 'Jurnal Mengajar Harian',
      icon: CalendarDays,
      badge: null,
      badgeColor: null,
    },
    {
      id: 'assessment' as ActiveTab,
      label: 'Asesmen & Rekap Nilai',
      icon: FileCheck2,
      badge: null,
      badgeColor: null,
    },
    {
      id: 'document_center' as ActiveTab,
      label: 'Pusat Dokumen & Ekspor',
      icon: Files,
      badge: 'DOCX / PDF',
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'regulation_engine' as ActiveTab,
      label: 'Regulasi & Validasi',
      icon: ShieldCheck,
      badge: uncompletedCount > 0 ? `${uncompletedCount} Wajib` : 'Lengkap',
      badgeColor: uncompletedCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800',
    },
  ];

  const handleItemClick = (id: ActiveTab) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs transition-all">
      {/* Sidebar Header Title */}
      <div className="px-3 pt-1 pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
        Menu Administrasi Guru
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-[13.5px] font-medium transition-all ${
                isActive
                  ? 'bg-[#0b1329] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.hasAi && (
                  <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200/60 shrink-0">
                    <Sparkles className="w-2.5 h-2.5 text-teal-500 mr-0.5" />
                    <span>AI</span>
                  </span>
                )}
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ml-2 ${
                    isActive
                      ? 'bg-slate-800 text-slate-300'
                      : item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Divider & Regulation Badge Card */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 text-xs transition-colors hover:border-slate-300">
          <div className="flex items-center space-x-2 text-slate-900 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs">Standar Resmi 2026</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Format teruji sesuai Permendikdasmen No. 1/2026, Permendikdasmen No. 12 & 13/2025, serta perlindungan privasi siswa (UU PDP).
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 no-print">
        <div className="sticky top-20">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs lg:hidden flex no-print"
          onClick={onCloseMobile}
        >
          <div
            className="w-80 max-w-[85vw] p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
