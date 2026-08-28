import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Trash2, Clock, Upload, Download, Check, AlertCircle, FilePlus } from 'lucide-react';
import { DatlapDocument } from '../types/datlap';
import { exportToJSON } from '../utils/exportUtils';

interface DraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc: DatlapDocument;
  onLoadDoc: (doc: DatlapDocument) => void;
  onSaveCurrentAsNew: (customName: string) => void;
}

const STORAGE_KEY = 'ankal_datlap_saved_drafts_v1';

export const DraftsModal: React.FC<DraftsModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onLoadDoc,
  onSaveCurrentAsNew,
}) => {
  const [savedDrafts, setSavedDrafts] = useState<DatlapDocument[]>([]);
  const [newDraftTitle, setNewDraftTitle] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const loadDraftsFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedDrafts(JSON.parse(raw));
      } else {
        setSavedDrafts([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDraftsFromStorage();
      setNewDraftTitle(currentDoc.header.namaPelanggan || 'Draft Datlap ' + new Date().toLocaleDateString('id-ID'));
    }
  }, [isOpen, currentDoc]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedDraft: DatlapDocument = {
      ...currentDoc,
      id: `draft-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };

    const currentList = [...savedDrafts];
    const existingIdx = currentList.findIndex(d => d.id === currentDoc.id);
    if (existingIdx >= 0) {
      currentList[existingIdx] = updatedDraft;
    } else {
      currentList.unshift(updatedDraft);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
    setSavedDrafts(currentList);
    setSaveSuccessMsg('Draft berhasil disimpan!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus arsip draft ini?')) {
      const filtered = savedDrafts.filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setSavedDrafts(filtered);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string) as DatlapDocument;
          if (parsed.header && parsed.rows) {
            onLoadDoc(parsed);
            onClose();
          } else {
            alert('Format file JSON tidak valid sebagai formulir Datlap.');
          }
        } catch {
          alert('Gagal membaca file JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs no-print">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 font-bold">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Arsip Draft & Riwayat Formulir</h3>
              <p className="text-[11px] text-slate-400">
                Penyimpanan lokal di browser & cadangan file
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Quick Save Current */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-900">Simpan Status Formulir Saat Ini:</span>
              <p className="text-[11px] text-emerald-700">
                {currentDoc.header.namaPelanggan || 'Tanpa Nama Pelanggan'} ({currentDoc.rows.length} Titik Sampling)
              </p>
            </div>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-colors shrink-0"
            >
              Simpan Sekarang
            </button>
          </div>

          {saveSuccessMsg && (
            <div className="p-2 bg-emerald-100 text-emerald-800 text-xs rounded border border-emerald-300 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Backup Buttons */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-700">File Cadangan (JSON):</span>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Import JSON</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
              <button
                onClick={() => exportToJSON(currentDoc)}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Backup JSON</span>
              </button>
            </div>
          </div>

          {/* Saved Drafts List */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2">
              Daftar Draft Tersimpan ({savedDrafts.length}):
            </label>
            {savedDrafts.length === 0 ? (
              <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Clock className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <p className="text-xs">Belum ada draft tersimpan.</p>
                <p className="text-[10px]">Klik "Simpan Sekarang" untuk mengarsipkan formulir saat ini.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedDrafts.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-800 truncate">
                        {d.header.namaPelanggan || 'Pelanggan Tanpa Nama'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>No. SP: {d.header.noSuratPengantar || '-'}</span>
                        <span>•</span>
                        <span>{d.rows.length} Titik</span>
                        <span>•</span>
                        <span>{new Date(d.updatedAt || d.createdAt).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onLoadDoc(d);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs"
                      >
                        Buka
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-white"
                        title="Hapus draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
