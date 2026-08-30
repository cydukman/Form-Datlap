import React, { useState } from 'react';
import { 
  Save, 
  Sliders, 
  Sparkles, 
  FolderOpen, 
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DatlapDocument } from '../types/datlap';

interface HeaderMetadataProps {
  doc: DatlapDocument;
  viewMode: 'editor' | 'printPreview';
  setViewMode: (mode: 'editor' | 'printPreview') => void;
  onOpenParamConfig: () => void;
  onOpenTemplates: () => void;
  onOpenDrafts: () => void;
  onSaveDraft: () => void;
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
  auditPass?: boolean;
  totalErrors?: number;
}

export const HeaderMetadata: React.FC<HeaderMetadataProps> = ({
  doc,
  onOpenParamConfig,
  onOpenTemplates,
  onOpenDrafts,
  onSaveDraft,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);

  return (
    <header className="bg-[#1e293b] text-white border-b border-slate-700 shadow-md select-none shrink-0 no-print sticky top-0 z-40">
      {/* Top Banner with ANKAL Brand and Document Info */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-base tracking-tighter shadow-inner shrink-0">
            A
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-extrabold tracking-tight text-white text-sm sm:text-base font-sans shrink-0">
                ANKAL
              </span>
              <h1 className="text-[11px] sm:text-xs font-bold tracking-wide text-emerald-400 uppercase truncate">
                FORMULIR PENGAMBILAN CONTOH UJI AIR
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">
              Sistem Digitalisasi Form Datlap Sampling Lapangan Laboratorium Lingkungan
            </p>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Doc Code Badge */}
          <div className="hidden sm:block border border-emerald-700/70 bg-emerald-950/50 text-emerald-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded text-right leading-tight">
            <div>NO: {doc.docCode}</div>
            <div className="text-[9px] text-emerald-400/90">REV: {doc.terbitRevisi}</div>
          </div>

          {/* Quick Save button on mobile */}
          <button
            onClick={onSaveDraft}
            className="md:hidden px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
            title="Simpan Draft"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xs:inline">Draft</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors flex items-center gap-1 text-xs cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-slate-200" />
            ) : (
              <>
                <Menu className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-slate-300 font-semibold pr-0.5">Menu</span>
              </>
            )}
          </button>

          {/* Desktop Toolbar Collapse Toggle */}
          <button
            onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700/80 transition-colors cursor-pointer"
            title={isToolbarCollapsed ? "Buka Toolbar" : "Sembunyikan Toolbar"}
          >
            {isToolbarCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>Buka Toolbar</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                <span>Ringkas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Action Toolbar */}
      {!isToolbarCollapsed && (
        <div className="hidden md:flex px-4 py-1.5 bg-[#162032] justify-between items-center gap-2 text-xs border-t border-slate-800">
          {/* Left Toolbar controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Preset Templates */}
            <button
              onClick={onOpenTemplates}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Muat contoh sampling (Air Limbah IPAL, Air Sumur, Sungai, dll)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Template Contoh</span>
            </button>

            {/* In-Situ Parameter Config */}
            <button
              onClick={onOpenParamConfig}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sesuaikan kolom parameter insitu sesuai permintaan pengujian customer"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kustom Parameter</span>
            </button>

            {/* Drafts Manager */}
            <button
              onClick={onOpenDrafts}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Kelola arsip draft dan riwayat formulir tersimpan di browser"
            >
              <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Arsip Draft</span>
            </button>
          </div>

          {/* Right Action button: Simpan Draft */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onSaveDraft}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md flex items-center gap-1.5 font-medium shadow-xs transition-colors cursor-pointer"
              title="Simpan formulir saat ini ke penyimpanan draft browser"
            >
              <Save className="w-3.5 h-3.5 text-white" />
              <span>Simpan Draft</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Collapsible Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#162032] border-t border-slate-700 px-3 py-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Tools & Config */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Alat & Pengaturan:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  onOpenTemplates();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center border border-slate-700 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Template</span>
              </button>

              <button
                onClick={() => {
                  onOpenParamConfig();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center border border-slate-700 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Parameter</span>
              </button>

              <button
                onClick={() => {
                  onOpenDrafts();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center border border-slate-700 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-sky-400" />
                <span>Arsip Draft</span>
              </button>
            </div>
          </div>

          {/* Save Draft Action */}
          <div>
            <button
              onClick={() => {
                onSaveDraft();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Draft Formulir</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
