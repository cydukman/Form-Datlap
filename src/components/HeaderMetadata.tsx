import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Save, 
  Sliders, 
  Sparkles, 
  Eye, 
  FolderOpen, 
  FileDown,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet
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
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  auditPass?: boolean;
  totalErrors?: number;
}

export const HeaderMetadata: React.FC<HeaderMetadataProps> = ({
  doc,
  viewMode,
  setViewMode,
  onOpenParamConfig,
  onOpenTemplates,
  onOpenDrafts,
  onSaveDraft,
  onExportCSV,
  onExportExcel,
  onExportPDF,
  onPrint,
}) => {
  // Mobile / compact collapse state (collapsed by default on mobile screens to save screen real estate)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);

  return (
    <header className="bg-[#1e293b] text-white border-b border-slate-700 shadow-md select-none shrink-0 no-print sticky top-0 z-40">
      {/* Top Banner with ANKAL Brand and Official Document Code */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-lg sm:text-xl tracking-tighter shadow-inner shrink-0">
            A
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold tracking-tight text-white text-sm sm:text-base font-sans shrink-0">
                ANKAL
              </span>
              <span className="text-slate-500 text-xs hidden xs:inline">|</span>
              <h1 className="text-[10px] sm:text-xs font-bold tracking-wide sm:tracking-wider text-emerald-400 uppercase truncate">
                FORMULIR PENGAMBILAN CONTOH UJI AIR
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate hidden sm:block">
              Sistem Digitalisasi Form Datlap Sampling Lapangan Laboratorium Lingkungan
            </p>
          </div>
        </div>

        {/* Right Info & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Document Code Info */}
          <div className="text-right bg-slate-800/90 px-2 py-0.5 sm:py-1 rounded border border-slate-700 font-mono text-[9px] sm:text-[10px]">
            <p className="text-emerald-400 font-bold leading-tight">NO: {doc.docCode}</p>
            <p className="text-slate-300 leading-tight">REV: {doc.terbitRevisi}</p>
          </div>

          {/* Quick PDF button on mobile */}
          <button
            onClick={onExportPDF}
            className="md:hidden px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs"
            title="Unduh PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">PDF</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors flex items-center gap-1 text-xs"
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
            className="hidden md:flex items-center gap-1 px-2 py-1 text-[11px] text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded border border-slate-700/60 transition-colors"
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

      {/* Desktop Action Toolbar (Can be collapsed by user) */}
      {!isToolbarCollapsed && (
        <div className="hidden md:flex px-4 py-1.5 bg-[#162032] justify-between items-center gap-2 text-xs border-t border-slate-800">
          {/* Left Toolbar controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex items-center">
              <button
                onClick={() => setViewMode('editor')}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === 'editor'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Input Form Datlap</span>
              </button>
              <button
                onClick={() => setViewMode('printPreview')}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === 'printPreview'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Cetak Resmi</span>
              </button>
            </div>

            {/* Preset Templates */}
            <button
              onClick={onOpenTemplates}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors"
              title="Muat contoh sampling (Air Limbah IPAL, Air Sumur, Sungai, dll)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Template Contoh</span>
            </button>

            {/* In-Situ Parameter Config */}
            <button
              onClick={onOpenParamConfig}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors"
              title="Sesuaikan kolom parameter insitu sesuai permintaan pengujian customer"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kustom Parameter</span>
            </button>

            {/* Drafts Manager */}
            <button
              onClick={onOpenDrafts}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors"
              title="Kelola arsip draft dan riwayat formulir tersimpan"
            >
              <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Arsip Draft</span>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onSaveDraft}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 font-medium transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>Simpan Draft</span>
            </button>

            <button
              onClick={onExportExcel}
              className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/60 rounded-md flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              title="Unduh seluruh formulir resmi dalam format Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={onExportCSV}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 font-medium transition-colors"
              title="Unduh data dalam format CSV"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 font-medium transition-colors"
              title="Cetak langsung ke mesin printer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cetak</span>
            </button>

            <button
              onClick={onExportPDF}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center gap-1.5 font-bold shadow-sm transition-colors cursor-pointer"
              title="Unduh dokumen formulir resmi ini langsung sebagai file PDF (.pdf)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Unduh PDF Resmi</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Collapsible Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#162032] border-t border-slate-700 px-3 py-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* View Mode Toggle */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Mode Tampilan:
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  setViewMode('editor');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  viewMode === 'editor'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Input Data</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('printPreview');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  viewMode === 'printPreview'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Resmi</span>
              </button>
            </div>
          </div>

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
                className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg flex flex-col items-center justify-center text-center gap-1 text-[11px]"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Template</span>
              </button>

              <button
                onClick={() => {
                  onOpenParamConfig();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg flex flex-col items-center justify-center text-center gap-1 text-[11px]"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Kustom Kolom</span>
              </button>

              <button
                onClick={() => {
                  onOpenDrafts();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg flex flex-col items-center justify-center text-center gap-1 text-[11px]"
              >
                <FolderOpen className="w-4 h-4 text-sky-400" />
                <span>Arsip Draft</span>
              </button>
            </div>
          </div>

          {/* Save & Export Actions */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Simpan & Cetak:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  onSaveDraft();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium"
              >
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>Simpan Draft</span>
              </button>

              <button
                onClick={() => {
                  onExportExcel();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/70 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={() => {
                  onExportCSV();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => {
                  onPrint();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cetak Printer</span>
              </button>

              <button
                onClick={() => {
                  onExportPDF();
                  setIsMobileMenuOpen(false);
                }}
                className="col-span-2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold shadow-xs"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Unduh PDF Resmi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


