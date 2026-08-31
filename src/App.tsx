import React, { useState, useEffect } from 'react';
import { HeaderMetadata } from './components/HeaderMetadata';
import { FormHeaderFields } from './components/FormHeaderFields';
import { DatlapGrid } from './components/DatlapGrid';
import { SketchCanvas } from './components/SketchCanvas';
import { SignaturePad } from './components/SignaturePad';
import { ParamConfigModal } from './components/ParamConfigModal';
import { TemplatesModal } from './components/TemplatesModal';
import { DraftsModal } from './components/DraftsModal';
import { OfficialPrintView, OfficialFormPages } from './components/OfficialPrintView';
import { 
  DatlapDocument, 
  DatlapRow, 
  DEFAULT_IN_SITU_CONFIG, 
  INITIAL_HEADER_DATA, 
  createEmptyRow 
} from './types/datlap';
import { Language, getTranslation } from './utils/i18n';
import { 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  CloudSun, 
  Save, 
  Eye, 
  Layers,
  FileText,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const STORAGE_KEY_CURRENT_FORM = 'ankal_datlap_current_form_v2';
const STORAGE_KEY_LANG = 'ankal_datlap_language_v1';

const createDefaultDocument = (): DatlapDocument => {
  const initialRows: DatlapRow[] = [
    {
      id: 'row-1',
      labId: '',
      titikSampling: 'Inlet IPAL (Sebelum Pengolahan)',
      jam: '09:15 WIB',
      koordinatNS: 'S 06°15\'22.4"',
      koordinatE: 'E 106°48\'35.1"',
      temperatur: '28.4',
      pH: '7.15',
      klorinBebas: '0.02',
      doVal: '5.8',
      kecerahan: '1.2',
      dhl: '450',
      lapisanMinyak: 'Tidak Ada',
      kekeruhan: '4.5',
      teknikSampling: 'Grab Sample (Sesaat)',
    },
    {
      id: 'row-2',
      labId: '',
      titikSampling: 'Outlet WWTP / IPAL (Effluent)',
      jam: '09:45 WIB',
      koordinatNS: 'S 06°15\'28.1"',
      koordinatE: 'E 106°48\'39.0"',
      temperatur: '27.8',
      pH: '7.42',
      klorinBebas: '0.01',
      doVal: '6.4',
      kecerahan: '2.5',
      dhl: '380',
      lapisanMinyak: 'Tidak Ada',
      kekeruhan: '2.1',
      teknikSampling: 'Grab Sample (Sesaat)',
    },
    {
      id: 'row-3',
      labId: '',
      titikSampling: 'Sumur Pantau 1 (Up-gradient)',
      jam: '10:30 WIB',
      koordinatNS: 'S 06°15\'10.5"',
      koordinatE: 'E 106°48\'20.2"',
      temperatur: '26.5',
      pH: '6.85',
      klorinBebas: '',
      doVal: '4.2',
      kecerahan: '',
      dhl: '290',
      lapisanMinyak: 'Tidak Ada',
      kekeruhan: '1.2',
      teknikSampling: 'Grab Sample (Sesaat)',
    },
  ];

  return {
    id: `doc-${Date.now()}`,
    userId: 'default-user',
    userEmail: 'pelanggan@ankal.co.id',
    userNamaPelanggan: 'PT. Contoh Industri Lestari (Dummy)',
    docCode: 'AKL-FO-7.3-36',
    docTitle: 'PENGAMBILAN CONTOH UJI AIR OLEH PELANGGAN',
    tanggalTerbit: '24 November 2025',
    terbitRevisi: '3/0',
    tanggalBerlaku: '24 November 2025',
    halaman: '1 dari 1',
    header: {
      ...INITIAL_HEADER_DATA,
      namaPelanggan: 'PT. Contoh Industri Lestari (Dummy)',
      alamat: 'Kawasan Industri Fiktif Blok A-1 No. 8, Cikarang, Jawa Barat',
      narahubung: 'Bpk. Fajar Pratama (0812-0000-1111)',
      tanggal: new Date().toISOString().split('T')[0],
      metode: 'SNI 6989.57:2008 (Metode Pengambilan Contoh Air Permukaan)',
      catatan: 'Pengambilan sampel rutin bulanan outlet IPAL dan sumur pantau pabrik.',
    },
    rows: initialRows,
    paramsConfig: { ...DEFAULT_IN_SITU_CONFIG },
    footer: {
      denahType: 'text',
      denahDataUrl: '',
      denahText: 'Lokasi inlet dan outlet IPAL berada di area barat pabrik dekat bak stabilisasi.',
      kondisiLingkunganCuaca: 'Cuaca Cerah Berawan, Suhu Udara 31°C, Kelembaban 68%, Aliran debit air normal stabil.',
      diverifikasiOleh: {
        nama: 'Ahmad Fauzi, S.T.',
        jabatan: 'Penanggung Jawab Lingkungan / Petugas Sampling',
        tanggal: new Date().toISOString().split('T')[0],
        signatureDataUrl: '',
      },
    },
    status: 'draft',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
};

export default function App() {
  // UI Language Selection
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
      if (savedLang === 'id' || savedLang === 'en' || savedLang === 'zh') {
        return savedLang;
      }
    } catch {
      // fallback
    }
    return 'id';
  });

  const t = getTranslation(lang);

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, newLang);
    } catch {
      // ignore
    }
  };

  // Active Editing Document
  const [doc, setDoc] = useState<DatlapDocument>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_FORM);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return createDefaultDocument();
  });

  // View Mode: 'editor' | 'printPreview'
  const [viewMode, setViewMode] = useState<'editor' | 'printPreview'>('editor');

  // UI Modals State
  const [highlightWajibOnly, setHighlightWajibOnly] = useState<boolean>(false);
  const [isParamConfigOpen, setIsParamConfigOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // Auto-save current form state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_FORM, JSON.stringify(doc));
    } catch (e) {
      console.error('Error saving current form to localStorage:', e);
    }
  }, [doc]);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Header Handlers
  const handleHeaderChange = (field: keyof typeof doc.header, value: string) => {
    setDoc(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  };

  // Row Management
  const handleRowChange = (index: number, field: keyof DatlapRow, value: string) => {
    setDoc(prev => {
      const newRows = [...prev.rows];
      newRows[index] = {
        ...newRows[index],
        [field]: value,
      };
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        rows: newRows,
      };
    });
  };

  const handleAddRow = () => {
    setDoc(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      rows: [...prev.rows, createEmptyRow(prev.rows.length + 1)],
    }));
  };

  const handleAddMultipleRows = (count: number) => {
    setDoc(prev => {
      const newRows = [...prev.rows];
      for (let i = 0; i < count; i++) {
        newRows.push(createEmptyRow(newRows.length + 1));
      }
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        rows: newRows,
      };
    });
    showToast(`Berhasil menambahkan ${count} baris sampel baru!`, 'success');
  };

  const handleRemoveRow = (index: number) => {
    if (doc.rows.length <= 1) {
      alert('Tabel minimal harus memiliki 1 baris data.');
      return;
    }
    setDoc(prev => {
      const newRows = prev.rows.filter((_, i) => i !== index);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        rows: newRows,
      };
    });
  };

  const handleDuplicateRow = (index: number) => {
    setDoc(prev => {
      const target = prev.rows[index];
      const newRow: DatlapRow = {
        ...target,
        id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        titikSampling: `${target.titikSampling} (Duplikat)`,
      };
      const newRows = [...prev.rows];
      newRows.splice(index + 1, 0, newRow);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        rows: newRows,
      };
    });
  };

  const handleClearEmptyRows = () => {
    const filled = doc.rows.filter(r => r.titikSampling.trim() || r.koordinatNS.trim() || r.koordinatE.trim() || r.jam.trim());
    if (filled.length === 0) {
      setDoc(prev => ({
        ...prev,
        rows: [createEmptyRow(1)],
      }));
    } else {
      setDoc(prev => ({
        ...prev,
        rows: filled,
      }));
    }
    showToast('Baris kosong berhasil dibersihkan.', 'info');
  };

  // Footer Handlers
  const handleFooterChange = (field: keyof typeof doc.footer, value: any) => {
    setDoc(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      footer: {
        ...prev.footer,
        [field]: value,
      },
    }));
  };

  const handleVerifierChange = (field: keyof typeof doc.footer.diverifikasiOleh, value: string) => {
    setDoc(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      footer: {
        ...prev.footer,
        diverifikasiOleh: {
          ...prev.footer.diverifikasiOleh,
          [field]: value,
        },
      },
    }));
  };

  const handleResetForm = () => {
    if (confirm('Yakin ingin mereset formulir ini ke format awal? Data yang belum disimpan ke draft akan hilang.')) {
      setDoc(createDefaultDocument());
      showToast('Formulir berhasil direset.', 'info');
    }
  };

  const handleLoadDoc = (loaded: DatlapDocument) => {
    setDoc(loaded);
    showToast('Dokumen berhasil dimuat!', 'success');
  };

  const handleSaveCurrentDraft = () => {
    setIsDraftsOpen(true);
  };

  // Audit Data Completeness
  const headerMissingCount = 
    (!doc.header.namaPelanggan.trim() ? 1 : 0) +
    (!doc.header.alamat.trim() ? 1 : 0) +
    (!doc.header.narahubung.trim() ? 1 : 0) +
    (!doc.header.tanggal.trim() ? 1 : 0) +
    (!doc.header.metode.trim() ? 1 : 0);

  const rowsMissingCount = doc.rows.filter(
    r => !r.titikSampling.trim() || !r.jam.trim() || !r.koordinatNS.trim() || !r.koordinatE.trim()
  ).length;

  const verifierMissing = !doc.footer.diverifikasiOleh.nama.trim() || !doc.footer.diverifikasiOleh.jabatan.trim();
  const totalAuditErrors = headerMissingCount + rowsMissingCount + (verifierMissing ? 1 : 0);

  const totalForms = Math.max(1, Math.ceil(doc.rows.length / 12));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className={`px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border ${
            toastMessage.type === 'success' 
              ? 'bg-slate-900 text-emerald-400 border-emerald-500/50'
              : toastMessage.type === 'warn'
              ? 'bg-slate-900 text-amber-400 border-amber-500/50'
              : 'bg-slate-900 text-sky-400 border-sky-500/50'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Official Header & Navigation Bar */}
      <HeaderMetadata
        doc={doc}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenParamConfig={() => setIsParamConfigOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenDrafts={() => setIsDraftsOpen(true)}
        onSaveDraft={handleSaveCurrentDraft}
        auditPass={totalAuditErrors === 0}
        totalErrors={totalAuditErrors}
        lang={lang}
        onSelectLang={handleLangChange}
      />

      {/* Main Content Area */}
      {viewMode === 'printPreview' ? (
        <OfficialPrintView
          doc={doc}
          onBackToEditor={() => setViewMode('editor')}
          lang={lang}
        />
      ) : (
        <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 space-y-4 bg-slate-50 no-print">
          {/* Form Top Control Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
                    {t.appTitle}
                  </h2>
                  <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-bold">
                    {doc.docCode}
                  </span>
                  <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-600" />
                    {totalForms} {lang === 'zh' ? '张表单' : lang === 'en' ? 'Forms' : 'Formulir'} ({doc.rows.length} {t.samplesCountBadge} • 12/Form)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            {/* Quick Actions & Audit indicator */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                type="button"
                onClick={() => setHighlightWajibOnly(!highlightWajibOnly)}
                className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  highlightWajibOnly
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                title="Tandai kolom-kolom wajib yang masih kosong"
              >
                {totalAuditErrors === 0 ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.auditComplete}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{totalAuditErrors} {t.auditIncomplete}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setViewMode('printPreview')}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title={t.doneBtnTooltip}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.doneBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                title={t.resetFormBtn}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section 1: Form Header Metadata Fields */}
          <FormHeaderFields
            header={doc.header}
            onChange={handleHeaderChange}
            highlightWajibOnly={highlightWajibOnly}
            lang={lang}
          />

          {/* Section 2: Sampling Points & In-situ Measurements Grid */}
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
            lang={lang}
          />

          {/* Section 3: Bottom 3 Cards (Denah Lokasi, Kondisi Lingkungan/Cuaca, Diverifikasi Oleh) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {/* Column 1: Sketch / Map Card */}
            <div className="h-full">
              <SketchCanvas
                denahType={doc.footer.denahType}
                denahDataUrl={doc.footer.denahDataUrl}
                denahText={doc.footer.denahText}
                onChangeType={(type) => handleFooterChange('denahType', type)}
                onChangeDataUrl={(url) => handleFooterChange('denahDataUrl', url)}
                onChangeText={(txt) => handleFooterChange('denahText', txt)}
                lang={lang}
              />
            </div>

            {/* Column 2: Kondisi Lingkungan / Cuaca */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden h-full flex flex-col justify-between text-slate-800">
              <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-amber-600" />
                <label className="text-[11px] font-bold text-slate-800 uppercase">
                  {t.weatherTitle}
                </label>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <textarea
                  rows={6}
                  value={doc.footer.kondisiLingkunganCuaca}
                  onChange={(e) => handleFooterChange('kondisiLingkunganCuaca', e.target.value)}
                  placeholder={t.weatherPlaceholder}
                  className="w-full flex-1 min-h-[140px] p-2.5 text-xs bg-slate-50/40 rounded border border-slate-300 focus:border-emerald-500 focus:bg-white resize-none font-medium text-slate-800 leading-relaxed"
                />
                <p className="text-[10px] text-slate-500 mt-2 italic">
                  {t.weatherNote}
                </p>
              </div>
            </div>

            {/* Column 3: Diverifikasi Oleh */}
            <div className="h-full">
              <SignaturePad
                data={doc.footer.diverifikasiOleh}
                onChange={handleVerifierChange}
                lang={lang}
              />
            </div>
          </div>

          {/* Bottom Fast Toolbar & Action Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-3 py-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-300 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title={t.resetFormBtn}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.resetFormBtn}</span>
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                {t.lastUpdated}: {new Date(doc.updatedAt || Date.now()).toLocaleTimeString(lang === 'zh' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap text-xs">
              <button
                type="button"
                onClick={() => setViewMode('printPreview')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-xs transition-colors text-xs sm:text-sm cursor-pointer"
                title={t.doneBtnTooltip}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.doneBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Off-screen / Print Container for direct PDF generation and printing from Homepage */}
      <div
        id="print-offscreen-container"
        className={`offscreen-printable-sheet ${viewMode === 'printPreview' ? 'hidden' : ''}`}
        aria-hidden="true"
      >
        <OfficialFormPages doc={doc} />
      </div>

      {/* Footer copyright */}
      <footer className="bg-[#0f172a] text-slate-400 text-xs py-2.5 px-4 flex flex-wrap justify-between items-center gap-2 border-t border-slate-800 no-print mt-auto">
        <div className="flex items-center gap-2">
          <span>© 2026 Laboratorium Pengujian ANKAL</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-slate-300">Dokumen Form: {doc.docCode}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Status Sistem: Aktif</span>
          <span className="text-slate-600">•</span>
          <span>Laboratorium Pengujian Lingkungan ANKAL</span>
        </div>
      </footer>

      {/* Parameter In-Situ Configuration Modal */}
      <ParamConfigModal
        isOpen={isParamConfigOpen}
        onClose={() => setIsParamConfigOpen(false)}
        config={doc.paramsConfig}
        onChangeConfig={(newCfg) => setDoc(prev => ({ ...prev, paramsConfig: newCfg }))}
        lang={lang}
      />

      {/* Preset Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onApplyTemplate={(tmpl) => {
          setDoc(prev => ({
            ...prev,
            ...tmpl,
            header: { ...prev.header, ...(tmpl.header || {}) },
            footer: { ...prev.footer, ...(tmpl.footer || {}) },
            rows: tmpl.rows ? tmpl.rows as DatlapRow[] : prev.rows,
            paramsConfig: tmpl.paramsConfig ? { ...prev.paramsConfig, ...tmpl.paramsConfig } : prev.paramsConfig,
            updatedAt: new Date().toISOString(),
          }));
          showToast(t.toastTemplateApplied, 'success');
        }}
        lang={lang}
      />

      {/* Drafts Manager Modal */}
      <DraftsModal
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
        currentDoc={doc}
        onLoadDoc={handleLoadDoc}
        onSaveCurrentAsNew={(name) => {
          showToast(`Draft "${name}" berhasil disimpan ke arsip!`, 'success');
        }}
        lang={lang}
      />
    </div>
  );
}
