import React from 'react';
import { X, Check, Sliders, Sparkles, HelpCircle } from 'lucide-react';
import { InSituParamsConfig } from '../types/datlap';

interface ParamConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: InSituParamsConfig;
  onChangeConfig: (newConfig: InSituParamsConfig) => void;
}

export const ParamConfigModal: React.FC<ParamConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  if (!isOpen) return null;

  const toggleParam = (key: keyof InSituParamsConfig) => {
    onChangeConfig({
      ...config,
      [key]: !config[key],
    });
  };

  const applyPreset = (preset: 'all' | 'limbah' | 'minum' | 'sungai') => {
    if (preset === 'all') {
      onChangeConfig({
        showTemperatur: true,
        showPh: true,
        showKlorinBebas: true,
        showDo: true,
        showKecerahan: true,
        showDhl: true,
        showLapisanMinyak: true,
        showKekeruhan: true,
        showTeknikSampling: true,
        dhlUnit: 'mS/cm',
      });
    } else if (preset === 'limbah') {
      onChangeConfig({
        showTemperatur: true,
        showPh: true,
        showKlorinBebas: false,
        showDo: true,
        showKecerahan: false,
        showDhl: true,
        showLapisanMinyak: true,
        showKekeruhan: false,
        showTeknikSampling: true,
        dhlUnit: 'mS/cm',
      });
    } else if (preset === 'minum') {
      onChangeConfig({
        showTemperatur: true,
        showPh: true,
        showKlorinBebas: true,
        showDo: false,
        showKecerahan: false,
        showDhl: true,
        showLapisanMinyak: false,
        showKekeruhan: true,
        showTeknikSampling: true,
        dhlUnit: 'μS/cm',
      });
    } else if (preset === 'sungai') {
      onChangeConfig({
        showTemperatur: true,
        showPh: true,
        showKlorinBebas: false,
        showDo: true,
        showKecerahan: true,
        showDhl: true,
        showLapisanMinyak: true,
        showKekeruhan: true,
        showTeknikSampling: true,
        dhlUnit: 'μS/cm',
      });
    }
  };

  const paramsList = [
    { key: 'showTemperatur', label: 'Temperatur Air', unit: '°C', desc: 'Suhu sampel air saat pengambilan di lapangan' },
    { key: 'showPh', label: 'pH (Derajat Keasaman)', unit: 'std', desc: 'Potensi hidrogen (0 - 14)' },
    { key: 'showKlorinBebas', label: 'Klorin Bebas', unit: 'abs / mg/L', desc: 'Sisa klorin untuk air minum & kolam' },
    { key: 'showDo', label: 'DO (Dissolved Oxygen)', unit: 'mg/L', desc: 'Kelarutan oksigen terlarut dalam air' },
    { key: 'showKecerahan', label: 'Kecerahan', unit: 'm', desc: 'Kedalaman piringan Secchi disc di air permukaan' },
    { key: 'showDhl', label: 'DHL (Daya Hantar Listrik / EC)', unit: config.dhlUnit, desc: 'Konduktivitas ionik cairan' },
    { key: 'showLapisanMinyak', label: 'Lapisan Minyak', unit: 'Kualitatif', desc: 'Pengamatan visual lapisan minyak di permukaan' },
    { key: 'showKekeruhan', label: 'Kekeruhan (Turbidity)', unit: 'NTU', desc: 'Tingkat kekeruhan partikel tersuspensi' },
    { key: 'showTeknikSampling', label: 'Teknik Sampling', unit: 'Metode', desc: 'Grab Sample, Composite Waktu, dll' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs no-print">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Sesuaikan Parameter In-Situ</h3>
              <p className="text-[11px] text-slate-400">
                Pilih kolom pengujian sesuai permintaan order pelanggan
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
          {/* Config Note */}
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-xs text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Panduan:</span> Kolom yang dicentang akan aktif di tabel input dan pratinjau formulir resmi. Parameter yang tidak diuji dapat dinonaktifkan agar form tetap rapi.
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
              Pilihan Preset Cepat:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('all')}
                className="p-2 text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors"
              >
                <div className="font-bold text-slate-800">Semua Parameter (Lengkap)</div>
                <div className="text-[10px] text-slate-500">Tampilkan seluruh 8 parameter in-situ</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('limbah')}
                className="p-2 text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors"
              >
                <div className="font-bold text-slate-800">Air Limbah IPAL</div>
                <div className="text-[10px] text-slate-500">Suhu, pH, DO, DHL, Minyak</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('minum')}
                className="p-2 text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors"
              >
                <div className="font-bold text-slate-800">Air Minum / Bersih</div>
                <div className="text-[10px] text-slate-500">Suhu, pH, Klorin, Kekeruhan, DHL</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('sungai')}
                className="p-2 text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors"
              >
                <div className="font-bold text-slate-800">Air Sungai / Permukaan</div>
                <div className="text-[10px] text-slate-500">Suhu, pH, DO, Kecerahan, Kekeruhan</div>
              </button>
            </div>
          </div>

          {/* Unit DHL selector */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700">Satuan Daya Hantar Listrik (DHL):</span>
              <p className="text-[10px] text-slate-500">Pilih skala unit konduktivitas pada alat lapangan</p>
            </div>
            <div className="flex bg-white p-0.5 rounded border border-slate-300 text-xs">
              <button
                type="button"
                onClick={() => onChangeConfig({ ...config, dhlUnit: 'mS/cm' })}
                className={`px-2.5 py-1 rounded font-mono font-semibold transition-colors ${
                  config.dhlUnit === 'mS/cm'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                mS/cm
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ ...config, dhlUnit: 'μS/cm' })}
                className={`px-2.5 py-1 rounded font-mono font-semibold transition-colors ${
                  config.dhlUnit === 'μS/cm'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                μS/cm
              </button>
            </div>
          </div>

          {/* Parameter Checkboxes List */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">
              Daftar Kolom Pengujian In-Situ:
            </label>
            {paramsList.map((p) => {
              const isChecked = !!config[p.key as keyof InSituParamsConfig];
              return (
                <div
                  key={p.key}
                  onClick={() => toggleParam(p.key as keyof InSituParamsConfig)}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center text-xs transition-colors ${
                        isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-3" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{p.label}</span>
                        <span className="text-[10px] font-mono font-normal text-slate-500 bg-slate-100 px-1 rounded">
                          {p.unit}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{p.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            Terapkan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
