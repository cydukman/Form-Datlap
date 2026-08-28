import React, { useState, useEffect } from 'react';
import { HeaderMetadata } from './components/HeaderMetadata';
import { FormHeaderFields } from './components/FormHeaderFields';
import { DatlapGrid } from './components/DatlapGrid';
import { SketchCanvas } from './components/SketchCanvas';
import { SignaturePad } from './components/SignaturePad';
import { ParamConfigModal } from './components/ParamConfigModal';
import { TemplatesModal } from './components/TemplatesModal';
import { DraftsModal } from './components/DraftsModal';
import { OfficialPrintView } from './components/OfficialPrintView';
import { 
  DatlapDocument, 
  DatlapRow, 
  DEFAULT_IN_SITU_CONFIG, 
  INITIAL_HEADER_DATA, 
  createEmptyRow 
} from './types/datlap';
import { exportToCSV, exportToJSON, exportToPDF, triggerPrintDialog } from './utils/exportUtils';
import { 
  FileSpreadsheet, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  CloudSun,
  Save,
  FileDown,
  Printer,
  Eye
} from 'lucide-react';

const INITIAL_DOC: DatlapDocument = {
  id: 'doc-initial',
  docCode: 'AKL-FO-7.3-36',
  docTitle: 'PENGAMBILAN CONTOH UJI AIR OLEH PELANGGAN',
  tanggalTerbit: '24 November 2025',
  terbitRevisi: '3/0',
  tanggalBerlaku: '24 November 2025',
  halaman: '1 dari 1',
  header: {
    namaPelanggan: '',
    alamat: '',
    narahubung: '',
    tanggal: new Date().toISOString().split('T')[0],
    metode: '',
    catatan: '',
  },
  rows: [
    {
      id: 'row-1',
      titikSampling: '',
      jam: '',
      koordinatNS: '',
      koordinatE: '',
      temperatur: '',
      pH: '',
      klorinBebas: '',
      doVal: '',
      kecerahan: '',
      dhl: '',
      lapisanMinyak: '',
      kekeruhan: '',
      teknikSampling: '',
    },
  ],
  paramsConfig: DEFAULT_IN_SITU_CONFIG,
  footer: {
    denahType: 'sketch',
    denahDataUrl: '',
    denahText: '',
    kondisiLingkunganCuaca: '',
    diverifikasiOleh: {
      nama: '',
      jabatan: '',
      tanggal: new Date().toISOString().split('T')[0],
      signatureDataUrl: '',
    },
  },
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  status: 'draft',
};

const AUTOSAVE_STORAGE_KEY = 'ankal_datlap_autosave_v3_clean';

export default function App() {
  const [doc, setDoc] = useState<DatlapDocument>(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          terbitRevisi: '3/0',
        };
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DOC;
  });

  const [viewMode, setViewMode] = useState<'editor' | 'printPreview'>('editor');
  const [highlightWajibOnly, setHighlightWajibOnly] = useState<boolean>(false);
  const [isParamConfigOpen, setIsParamConfigOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // Auto-save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(doc));
    } catch (e) {
      console.error(e);
    }
  }, [doc]);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Direct PDF Export Generator
  const handleDirectPDFExport = async () => {
    setIsGeneratingPDF(true);
    showToast('Sedang membuat file PDF resmi ANKAL...', 'info');

    // Ensure print preview is active so DOM sheet is mounted
    if (viewMode !== 'printPreview') {
      setViewMode('printPreview');
      // Give React a tick to mount the print preview sheet
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    try {
      const success = await exportToPDF(doc, 'official-form-sheet');
      if (success) {
        showToast('File PDF resmi berhasil diunduh ke perangkat!', 'success');
      } else {
        showToast('Gagal memproses PDF, membuka dialog cetak browser...', 'warn');
      }
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Terjadi kesalahan saat membuat PDF', 'warn');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Validation calculations
  const headerMandatoryKeys = ['namaPelanggan', 'alamat', 'narahubung', 'tanggal', 'metode'] as const;
  const missingHeaderFields = headerMandatoryKeys.filter(k => !doc.header[k]?.trim());
  const activeRows = doc.rows.filter(r => r.titikSampling.trim() || r.koordinatNS.trim() || r.jam.trim());
  const invalidRows = activeRows.filter(
    r => !r.titikSampling.trim() || !r.jam.trim() || !r.koordinatNS.trim() || !r.koordinatE.trim()
  );

  const totalErrors = missingHeaderFields.length + invalidRows.length;
  const auditPass = totalErrors === 0 && activeRows.length > 0;

  // Header handlers
  const handleHeaderChange = (field: keyof typeof doc.header, value: string) => {
    setDoc(prev => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Rows handlers
  const handleRowChange = (index: number, field: keyof DatlapRow, value: string) => {
    setDoc(prev => {
      const nextRows = [...prev.rows];
      nextRows[index] = {
        ...nextRows[index],
        [field]: value,
      };
      return {
        ...prev,
        rows: nextRows,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleAddRow = () => {
    setDoc(prev => ({
      ...prev,
      rows: [...prev.rows, createEmptyRow(prev.rows.length)],
      updatedAt: new Date().toISOString(),
    }));
    showToast('Baris titik sampling baru ditambahkan');
  };

  const handleAddMultipleRows = (count: number) => {
    setDoc(prev => {
      const newItems = Array.from({ length: count }, (_, i) => createEmptyRow(prev.rows.length + i));
      return {
        ...prev,
        rows: [...prev.rows, ...newItems],
        updatedAt: new Date().toISOString(),
      };
    });
    showToast(`+${count} baris baru ditambahkan`);
  };

  const handleRemoveRow = (index: number) => {
    if (doc.rows.length <= 1) return;
    setDoc(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleDuplicateRow = (index: number) => {
    setDoc(prev => {
      const target = prev.rows[index];
      const duplicated: DatlapRow = {
        ...target,
        id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        titikSampling: `${target.titikSampling} (Copy)`,
      };
      const nextRows = [...prev.rows];
      nextRows.splice(index + 1, 0, duplicated);
      return {
        ...prev,
        rows: nextRows,
        updatedAt: new Date().toISOString(),
      };
    });
    showToast('Baris berhasil diduplikasi');
  };

  const handleClearEmptyRows = () => {
    setDoc(prev => {
      const filtered = prev.rows.filter(r => 
        r.titikSampling.trim() || r.koordinatNS.trim() || r.jam.trim() || r.temperatur.trim() || r.pH.trim()
      );
      return {
        ...prev,
        rows: filtered.length > 0 ? filtered : [createEmptyRow(0)],
        updatedAt: new Date().toISOString(),
      };
    });
    showToast('Baris kosong telah dibersihkan');
  };

  // Footer handlers
  const handleFooterDenah = (field: 'denahType' | 'denahDataUrl' | 'denahText', value: any) => {
    setDoc(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleFooterCuaca = (value: string) => {
    setDoc(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        kondisiLingkunganCuaca: value,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleFooterVerifikasi = (field: keyof typeof doc.footer.diverifikasiOleh, value: string) => {
    setDoc(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        diverifikasiOleh: {
          ...prev.footer.diverifikasiOleh,
          [field]: value,
        },
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Template Loader
  const handleApplyTemplate = (templateData: Partial<DatlapDocument>) => {
    setDoc(prev => ({
      ...prev,
      ...templateData,
      header: {
        ...prev.header,
        ...(templateData.header || {}),
      },
      rows: (templateData.rows as DatlapRow[]) || prev.rows,
      footer: {
        ...prev.footer,
        ...(templateData.footer || {}),
      },
      updatedAt: new Date().toISOString(),
    }));
    showToast('Template berhasil dimuat');
  };

  // Reset Form Handler
  const handleResetForm = () => {
    if (confirm('Kosongkan semua data formulir untuk memulai pengisian baru?')) {
      setDoc({
        ...INITIAL_DOC,
        id: `doc-${Date.now()}`,
        header: {
          ...INITIAL_HEADER_DATA,
          tanggal: new Date().toISOString().split('T')[0],
        },
        rows: [createEmptyRow(0)],
        footer: {
          denahType: 'sketch',
          denahDataUrl: '',
          denahText: '',
          kondisiLingkunganCuaca: '',
          diverifikasiOleh: {
            nama: '',
            jabatan: '',
            tanggal: new Date().toISOString().split('T')[0],
            signatureDataUrl: '',
          },
        },
      });
      showToast('Formulir berhasil direset', 'info');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-800 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white border border-slate-700 shadow-xl rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-150">
          {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {toastMessage.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
          {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-sky-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* App Header & Action Toolbar */}
      <HeaderMetadata
        doc={doc}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenParamConfig={() => setIsParamConfigOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenDrafts={() => setIsDraftsOpen(true)}
        onSaveDraft={() => {
          setIsDraftsOpen(true);
        }}
        onExportCSV={() => {
          exportToCSV(doc);
          showToast('Data CSV berhasil diunduh');
        }}
        onExportPDF={handleDirectPDFExport}
        onPrint={() => {
          if (viewMode !== 'printPreview') {
            setViewMode('printPreview');
            setTimeout(() => triggerPrintDialog(), 300);
          } else {
            triggerPrintDialog();
          }
        }}
        auditPass={auditPass}
        totalErrors={totalErrors}
      />

      {/* Main Workspace: Either High-Density Interactive Editor OR Official Printable View */}
      {viewMode === 'printPreview' ? (
        <OfficialPrintView doc={doc} onBackToEditor={() => setViewMode('editor')} />
      ) : (
        <main className="flex-1 bg-[#f8fafc] overflow-y-auto p-4 space-y-4">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Quick Template Selector Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-lg p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-500 text-white rounded-md shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Pilih Contoh Isian Sampling (Template Preset)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Klik salah satu template di bawah untuk mengisi contoh data riil otomatis, atau isi langsung formulir kosong di bawah.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsTemplatesOpen(true)}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lihat Semua Template (3 Jenis)</span>
                </button>
              </div>
            </div>

            {/* 1. Header Metadata & Customer Identification Card */}
            <FormHeaderFields
              header={doc.header}
              onChange={handleHeaderChange}
              highlightWajibOnly={highlightWajibOnly}
            />

            {/* 2. High-Density Datlap Spreadsheet Grid */}
            <DatlapGrid
              rows={doc.rows}
              onChangeRow={handleRowChange}
              onAddRow={handleAddRow}
              onAddMultipleRows={handleAddMultipleRows}
              onRemoveRow={handleRemoveRow}
              onDuplicateRow={handleDuplicateRow}
              onClearEmptyRows={handleClearEmptyRows}
              paramsConfig={doc.paramsConfig}
              onOpenParamConfig={() => setIsParamConfigOpen(true)}
              highlightWajibOnly={highlightWajibOnly}
            />

            {/* 3. Bottom Sections Grid: Denah, Cuaca, & Verifikasi */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Denah Lokasi Sketsa / Upload / Teks (Col 5) */}
              <div className="md:col-span-5">
                <SketchCanvas
                  denahType={doc.footer.denahType}
                  denahDataUrl={doc.footer.denahDataUrl}
                  denahText={doc.footer.denahText}
                  onChangeType={(t) => handleFooterDenah('denahType', t)}
                  onChangeDataUrl={(url) => handleFooterDenah('denahDataUrl', url)}
                  onChangeText={(text) => handleFooterDenah('denahText', text)}
                />
              </div>

              {/* Kondisi Lingkungan / Cuaca (Col 4) */}
              <div className="md:col-span-4">
                <div className="bg-slate-50 rounded border border-slate-300 p-3 h-full flex flex-col">
                  <label 
                    htmlFor="kondisiLingkunganCuaca"
                    className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between pb-2 mb-2 border-b border-slate-200"
                  >
                    <span className="flex items-center gap-1.5">
                      <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Kondisi Lingkungan / Cuaca:</span>
                    </span>
                  </label>
                  <textarea
                    id="kondisiLingkunganCuaca"
                    value={doc.footer.kondisiLingkunganCuaca}
                    onChange={(e) => handleFooterCuaca(e.target.value)}
                    placeholder="Contoh: Cuaca cerah berawan, suhu udara 31°C, arah angin ke barat, debit air normal mengalir lancar, tidak ada anomali bau/warna..."
                    className="w-full flex-1 min-h-[140px] text-xs p-2.5 bg-white rounded border border-slate-300 focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              {/* Diverifikasi Oleh & Digital Signature Pad (Col 3) */}
              <div className="md:col-span-3">
                <SignaturePad
                  data={doc.footer.diverifikasiOleh}
                  onChange={handleFooterVerifikasi}
                />
              </div>
            </div>

            {/* Bottom Actions Banner */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded border border-slate-300 font-medium transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Form Kosong</span>
                </button>
                <span className="text-slate-400 text-xs hidden sm:inline">|</span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Terakhir diperbarui: {new Date(doc.updatedAt).toLocaleTimeString('id-ID')}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('printPreview');
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>Lihat Pratinjau Format</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('printPreview');
                    setTimeout(() => triggerPrintDialog(), 300);
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5 border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cetak Printer</span>
                </button>
                <button
                  type="button"
                  onClick={handleDirectPDFExport}
                  disabled={isGeneratingPDF}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded text-xs font-bold transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Unduh File PDF Resmi (.pdf)</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer System Info */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex justify-between items-center text-[10px] text-slate-400 shrink-0 no-print">
        <p>© 2026 Laboratorium Pengujian ANKAL | Dokumen Form: AKL-FO-7.3-36</p>
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Status Sistem: Aktif • Laboratorium Pengujian Lingkungan ANKAL</span>
        </p>
      </footer>

      {/* Modals */}
      <ParamConfigModal
        isOpen={isParamConfigOpen}
        onClose={() => setIsParamConfigOpen(false)}
        config={doc.paramsConfig}
        onChangeConfig={(newConfig) => setDoc(prev => ({ ...prev, paramsConfig: newConfig }))}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />

      <DraftsModal
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
        currentDoc={doc}
        onLoadDoc={(loaded) => {
          setDoc(loaded);
          showToast('Draft formulir dimuat');
        }}
        onSaveCurrentAsNew={(title) => {
          showToast('Draft berhasil disimpan');
        }}
      />
    </div>
  );
}
