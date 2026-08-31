import React from 'react';
import { X, Check, Sliders, Sparkles } from 'lucide-react';
import { InSituParamsConfig } from '../types/datlap';
import { Language, getTranslation } from '../utils/i18n';

interface ParamConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: InSituParamsConfig;
  onChangeConfig: (newConfig: InSituParamsConfig) => void;
  lang?: Language;
}

export const ParamConfigModal: React.FC<ParamConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  lang = 'id',
}) => {
  if (!isOpen) return null;
  const t = getTranslation(lang);

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
    { key: 'showTemperatur', label: lang === 'zh' ? '水温 (Temperatur Air)' : lang === 'en' ? 'Water Temperature' : 'Temperatur Air', unit: '°C', desc: lang === 'zh' ? '现场采集时的水样温度' : lang === 'en' ? 'Sample water temperature during field collection' : 'Suhu sampel air saat pengambilan di lapangan' },
    { key: 'showPh', label: lang === 'zh' ? '现场 pH' : lang === 'en' ? 'Field pH' : 'pH (Derajat Keasaman)', unit: 'std', desc: lang === 'zh' ? '水质酸碱度 (0 - 14)' : lang === 'en' ? 'Hydrogen potential index (0 - 14)' : 'Potensi hidrogen (0 - 14)' },
    { key: 'showKlorinBebas', label: lang === 'zh' ? '游离余氯 (Klorin Bebas)' : lang === 'en' ? 'Free Chlorine' : 'Klorin Bebas', unit: 'abs / mg/L', desc: lang === 'zh' ? '饮用水或泳池余氯' : lang === 'en' ? 'Residual chlorine for potable water & pools' : 'Sisa klorin untuk air minum & kolam' },
    { key: 'showDo', label: lang === 'zh' ? '溶解氧 (DO)' : lang === 'en' ? 'DO (Dissolved Oxygen)' : 'DO (Dissolved Oxygen)', unit: 'mg/L', desc: lang === 'zh' ? '水中溶解氧含量' : lang === 'en' ? 'Dissolved oxygen saturation in water' : 'Kelarutan oksigen terlarut dalam air' },
    { key: 'showKecerahan', label: lang === 'zh' ? '透明度 (Kecerahan Secchi)' : lang === 'en' ? 'Transparency (Secchi)' : 'Kecerahan', unit: 'm', desc: lang === 'zh' ? '塞氏盘透明度深度' : lang === 'en' ? 'Secchi disc visual transparency depth' : 'Kedalaman piringan Secchi disc di air permukaan' },
    { key: 'showDhl', label: lang === 'zh' ? '电导率 (DHL / EC)' : lang === 'en' ? 'EC / Conductivity (DHL)' : 'DHL (Daya Hantar Listrik / EC)', unit: config.dhlUnit, desc: lang === 'zh' ? '液体离子导电率' : lang === 'en' ? 'Ionic conductivity of fluid' : 'Konduktivitas ionik cairan' },
    { key: 'showLapisanMinyak', label: lang === 'zh' ? '油膜情况 (Lapisan Minyak)' : lang === 'en' ? 'Oil Film / Layer' : 'Lapisan Minyak', unit: 'Kualitatif', desc: lang === 'zh' ? '水面油膜目视观察' : lang === 'en' ? 'Visual surface oil observation' : 'Pengamatan visual lapisan minyak di permukaan' },
    { key: 'showKekeruhan', label: lang === 'zh' ? '浊度 (Turbidity)' : lang === 'en' ? 'Turbidity (Kekeruhan)' : 'Kekeruhan (Turbidity)', unit: 'NTU', desc: lang === 'zh' ? '水体悬浮颗粒浑浊程度' : lang === 'en' ? 'Suspended particle turbidity level' : 'Tingkat kekeruhan partikel tersuspensi' },
    { key: 'showTeknikSampling', label: lang === 'zh' ? '采样技术 (Teknik Sampling)' : lang === 'en' ? 'Sampling Technique' : 'Teknik Sampling', unit: 'Metode', desc: lang === 'zh' ? '瞬时采样 (Grab) 或 混合采样 (Composite)' : lang === 'en' ? 'Grab Sample, Time Composite, etc.' : 'Grab Sample, Composite Waktu, dll' },
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
              <h3 className="font-bold text-sm">{t.paramModalTitle}</h3>
              <p className="text-[11px] text-slate-400">
                {t.paramModalSubtitle}
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
              <span className="font-bold">{lang === 'zh' ? '提示：' : lang === 'en' ? 'Tip:' : 'Panduan:'}</span>{' '}
              {lang === 'zh'
                ? '勾选的参数列将显示在输入表与官方打印版中。未测试的参数可取消勾选，以保持表格整洁。'
                : lang === 'en'
                ? 'Checked columns will appear on the editor grid and official print format. Inactive parameters can be hidden to keep the form clean.'
                : 'Kolom yang dicentang akan aktif di tabel input dan pratinjau formulir resmi. Parameter yang tidak diuji dapat dinonaktifkan agar form tetap rapi.'}
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
              {lang === 'zh' ? '快速预设方案：' : lang === 'en' ? 'Quick Scenario Presets:' : 'Pilihan Preset Cepat:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('all')}
                className="p-2 text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800">{lang === 'zh' ? '全部参数 (完整)' : lang === 'en' ? 'All Parameters (Full)' : 'Semua Parameter (Lengkap)'}</div>
                <div className="text-[10px] text-slate-500">{lang === 'zh' ? '显示全部8个现场测试参数' : lang === 'en' ? 'Display all 8 field parameters' : 'Tampilkan seluruh 8 parameter in-situ'}</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('limbah')}
                className="p-2 text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800">{lang === 'zh' ? '工业污水 (IPAL / WWTP)' : lang === 'en' ? 'Industrial Wastewater' : 'Air Limbah IPAL'}</div>
                <div className="text-[10px] text-slate-500">Suhu, pH, DO, DHL, Minyak</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('minum')}
                className="p-2 text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800">{lang === 'zh' ? '饮用水 / 清洁水' : lang === 'en' ? 'Drinking / Clean Water' : 'Air Minum / Bersih'}</div>
                <div className="text-[10px] text-slate-500">Suhu, pH, Klorin, Kekeruhan, DHL</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('sungai')}
                className="p-2 text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800">{lang === 'zh' ? '地表水 / 河流' : lang === 'en' ? 'Surface / River Water' : 'Air Sungai / Permukaan'}</div>
                <div className="text-[10px] text-slate-500">Suhu, pH, DO, Kecerahan, Kekeruhan</div>
              </button>
            </div>
          </div>

          {/* Unit DHL selector */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700">{lang === 'zh' ? '电导率单位 (DHL):' : lang === 'en' ? 'Conductivity Unit (EC / DHL):' : 'Satuan Daya Hantar Listrik (DHL):'}</span>
              <p className="text-[10px] text-slate-500">{lang === 'zh' ? '选择现场仪器的测量量程单位' : lang === 'en' ? 'Select instrument measurement unit' : 'Pilih skala unit konduktivitas pada alat lapangan'}</p>
            </div>
            <div className="flex bg-white p-0.5 rounded border border-slate-300 text-xs">
              <button
                type="button"
                onClick={() => onChangeConfig({ ...config, dhlUnit: 'mS/cm' })}
                className={`px-2.5 py-1 rounded font-mono font-semibold transition-colors cursor-pointer ${
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
                className={`px-2.5 py-1 rounded font-mono font-semibold transition-colors cursor-pointer ${
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
              {lang === 'zh' ? '现场参数项目列表：' : lang === 'en' ? 'In-Situ Field Parameters List:' : 'Daftar Kolom Pengujian In-Situ:'}
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
            className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            {t.saveParamsBtn || 'Terapkan & Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
};
