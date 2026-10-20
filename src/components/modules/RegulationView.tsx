import React, { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  BookCheck,
  Scale,
  Lock,
} from 'lucide-react';
import { RegulationReference, ComplianceCheck } from '../../types';

interface RegulationViewProps {
  regulations: RegulationReference[];
  complianceChecks: ComplianceCheck[];
  onToggleStatus: (id: string) => void;
}

export const RegulationView: React.FC<RegulationViewProps> = ({
  regulations,
  complianceChecks,
  onToggleStatus,
}) => {
  const completedCount = complianceChecks.filter((c) => c.status === 'Lengkap').length;
  const scorePercent = Math.round((completedCount / complianceChecks.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Regulasi Resmi & Validasi Kepatuhan
          </h2>
          <p className="text-xs text-slate-500">
            Landasan hukum penyusunan administrasi guru SD/MI serta audit kelengkapan dokumen pembelajaran.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Skor Kepatuhan: {scorePercent}% ({completedCount}/{complianceChecks.length} Lengkap)</span>
          </div>
        </div>
      </div>

      {/* Compliance Checklist Audit */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Instrumen Audit Kesiapan Dokumen Guru
            </h3>
            <p className="text-xs text-slate-500">
              Klik status untuk memvalidasi pemenuhan standar proses dan kelengkapan dokumen.
            </p>
          </div>
          <span className="text-xs text-slate-400">Verifikasi Mandiri & Pengawas</span>
        </div>

        <div className="divide-y divide-slate-100">
          {complianceChecks.map((item) => (
            <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  onClick={() => onToggleStatus(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                  title="Ubah status kelengkapan"
                >
                  {item.status === 'Lengkap' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.notes}</p>
                  <span className="inline-block mt-1 text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                    Rujukan: {item.regulationSource}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pl-8 sm:pl-0">
                <button
                  type="button"
                  onClick={() => onToggleStatus(item.id)}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    item.status === 'Lengkap'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {item.status} (Klik Ubah)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Regulations Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Daftar Regulasi dan Ketentuan Resmi yang Berlaku
          </h3>
          <p className="text-xs text-slate-500">
            Disinkronisasi dengan JDIH Kemendikdasmen dan Lembaran Negara Republik Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regulations.map((reg) => (
            <div key={reg.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {reg.status}
                  </span>
                  <span className="text-[11px] text-slate-400">Berlaku: {reg.effectiveDate}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">{reg.code}</h4>
                <p className="text-xs text-slate-600 font-medium">{reg.title}</p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-700 block">Poin Kunci untuk Guru:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    {reg.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{reg.topic}</span>
                <a
                  href={reg.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                >
                  <span>Sumber BPK / JDIH</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
