import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Layers, 
  Sliders
} from 'lucide-react';
import { DatlapRow, InSituParamsConfig } from '../types/datlap';
import { getCurrentGpsPosition } from '../utils/geoUtils';
import { formatPhValue } from '../utils/phUtils';
import { Language, getTranslation } from '../utils/i18n';

interface DatlapGridProps {
  rows: DatlapRow[];
  onChangeRow: (index: number, field: keyof DatlapRow, value: string) => void;
  onAddRow: () => void;
  onAddMultipleRows: (count: number) => void;
  onRemoveRow: (index: number) => void;
  onDuplicateRow: (index: number) => void;
  onClearEmptyRows: () => void;
  paramsConfig: InSituParamsConfig;
  onOpenParamConfig: () => void;
  highlightWajibOnly: boolean;
  lang: Language;
}

const SAMPLES_PER_FORM = 12;

const TEKNIK_OPTIONS = [
  'Grab Sample (Sesaat)',
  'Composite Waktu',
  'Composite Tempat',
  'Integrated Sample',
];

const LAPISAN_MINYAK_OPTIONS = [
  'Tidak Ada',
  'Ada',
  'Negatif',
  'Lapisan Tipis / Pelangi',
];

export const DatlapGrid: React.FC<DatlapGridProps> = ({
  rows,
  onChangeRow,
  onAddRow,
  onAddMultipleRows,
  onRemoveRow,
  onDuplicateRow,
  onClearEmptyRows,
  paramsConfig,
  onOpenParamConfig,
  highlightWajibOnly,
  lang,
}) => {
  const [gpsLoadingRow, setGpsLoadingRow] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [activePageTab, setActivePageTab] = useState<'all' | number>('all');

  const t = getTranslation(lang);
  const totalForms = Math.max(1, Math.ceil(rows.length / SAMPLES_PER_FORM));

  // Compute displayed rows based on active tab
  const displayedIndices = React.useMemo(() => {
    if (activePageTab === 'all') {
      return rows.map((_, i) => i);
    }
    const start = (activePageTab - 1) * SAMPLES_PER_FORM;
    const end = Math.min(start + SAMPLES_PER_FORM, rows.length);
    const indices: number[] = [];
    for (let i = start; i < end; i++) {
      indices.push(i);
    }
    return indices;
  }, [rows, activePageTab]);

  const handleFetchGps = async (index: number) => {
    try {
      setGpsLoadingRow(index);
      setGpsError(null);
      const coords = await getCurrentGpsPosition();
      onChangeRow(index, 'koordinatNS', coords.nsString);
      onChangeRow(index, 'koordinatE', coords.eString);
    } catch (err: any) {
      setGpsError(err.message || (lang === 'zh' ? '获取GPS定位失败' : lang === 'en' ? 'Failed to acquire GPS' : 'Gagal mengambil GPS'));
      setTimeout(() => setGpsError(null), 5000);
    } finally {
      setGpsLoadingRow(null);
    }
  };

  const extractTimezone = (jamStr: string): 'WIB' | 'WITA' | 'WIT' => {
    if (/WITA/i.test(jamStr)) return 'WITA';
    if (/WIT/i.test(jamStr)) return 'WIT';
    return 'WIB';
  };

  const updateJamTimezone = (currentJam: string, newTz: 'WIB' | 'WITA' | 'WIT'): string => {
    if (!currentJam || !currentJam.trim()) {
      return `08:00 ${newTz}`;
    }
    const cleanTime = currentJam.replace(/\s*(WIB|WITA|WIT)\s*/gi, '').trim();
    return cleanTime ? `${cleanTime} ${newTz}` : ` ${newTz}`.trim();
  };

  const handleSetCurrentTime = (index: number) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const existingTz = extractTimezone(rows[index]?.jam || 'WIB');
    onChangeRow(index, 'jam', `${hours}:${minutes} ${existingTz}`);
  };

  const isRowWajibMissing = (row: DatlapRow) => {
    const hasAnyContent = Object.values(row).some(v => typeof v === 'string' && v.trim().length > 0 && v !== 'Grab Sample (Sesaat)' && v !== 'Tidak Ada');
    if (!hasAnyContent) return false;
    return !row.titikSampling.trim() || !row.jam.trim() || !row.koordinatNS.trim() || !row.koordinatE.trim();
  };

  // Calculate total columns for divider span
  const inSituColsCount = 
    (paramsConfig.showTemperatur ? 1 : 0) +
    (paramsConfig.showPh ? 1 : 0) +
    (paramsConfig.showKlorinBebas ? 1 : 0) +
    (paramsConfig.showDo ? 1 : 0) +
    (paramsConfig.showKecerahan ? 1 : 0) +
    (paramsConfig.showDhl ? 1 : 0) +
    (paramsConfig.showLapisanMinyak ? 1 : 0) +
    (paramsConfig.showKekeruhan ? 1 : 0);

  const totalCols = 4 + 2 + inSituColsCount + (paramsConfig.showTeknikSampling ? 1 : 0) + 1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden text-slate-800">
      {/* Table Header Bar */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {t.gridSectionTitle}
          </h3>
          <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded text-slate-700 font-semibold border border-slate-200 shadow-2xs">
            {rows.length} {t.samplesCountBadge}
          </span>
          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
            <Layers className="w-3 h-3 text-emerald-600" />
            {totalForms} {lang === 'zh' ? '张表单 (每页12条)' : lang === 'en' ? 'Forms (Max 12/Form)' : 'Formulir (Maks. 12/Form)'}
          </span>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {gpsError && (
            <span className="text-[11px] text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {gpsError}
            </span>
          )}

          <button
            type="button"
            onClick={onOpenParamConfig}
            className="px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
            title={t.paramTooltip}
          >
            <Sliders className="w-3 h-3 text-emerald-600" />
            <span>{t.paramBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => onAddMultipleRows(3)}
            className="px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
            title={lang === 'zh' ? '添加3个新行' : lang === 'en' ? 'Add 3 new sample rows' : 'Tambah 3 baris sampel baru sekaligus'}
          >
            <Plus className="w-3 h-3 text-emerald-600" />
            <span>+3 {lang === 'zh' ? '行' : lang === 'en' ? 'Rows' : 'Baris'}</span>
          </button>

          <button
            type="button"
            onClick={onAddRow}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addSampleBtn}</span>
          </button>
        </div>
      </div>

      {/* MULTI-FORM PAGINATION TABS (1 Form = 12 Samples limitation) */}
      {totalForms > 1 && (
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              {lang === 'zh' ? '表单页面导航：' : lang === 'en' ? 'Form Page Navigation:' : 'Navigasi Halaman Formulir:'}
            </span>
            <span className="text-[11px] text-slate-500">
              ({lang === 'zh' ? `共 ${rows.length} 个采样点，分为 ${totalForms} 页` : lang === 'en' ? `Total ${rows.length} samples divided into ${totalForms} pages @ 12 samples` : `Total ${rows.length} sampel dibagi menjadi ${totalForms} formulir @ 12 sampel`})
            </span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => setActivePageTab('all')}
              className={`px-2.5 py-1 text-xs rounded font-semibold transition-colors cursor-pointer ${
                activePageTab === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              {t.pageTabAll} ({rows.length})
            </button>

            {Array.from({ length: totalForms }).map((_, pIdx) => {
              const fNum = pIdx + 1;
              const startSampel = pIdx * SAMPLES_PER_FORM + 1;
              const endSampel = Math.min((pIdx + 1) * SAMPLES_PER_FORM, rows.length);
              const isCurrent = activePageTab === fNum;

              return (
                <button
                  key={fNum}
                  type="button"
                  onClick={() => setActivePageTab(fNum)}
                  className={`px-2.5 py-1 text-xs rounded font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  <span>{t.pageTabPrefix} {fNum}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${
                    isCurrent ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {startSampel}-{endSampel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Scrollable Grid Container */}
      <div className="overflow-x-auto w-full max-h-[600px] select-text">
        <table className="w-full text-xs text-left border-collapse border border-slate-300">
          {/* Harmonious Main Table Head */}
          <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-20 shadow-2xs">
            {/* Top Level Columns */}
            <tr className="border-b border-slate-300">
              <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center w-12 bg-slate-100 text-slate-700">
                {t.colNo}.
              </th>
              <th rowSpan={2} className="border border-slate-300 px-2 py-2 w-32 text-center bg-slate-100 text-slate-700">
                <div>LAB ID</div>
                <span className="text-[9px] font-normal text-slate-500 block">({t.colLabId})</span>
              </th>
              <th 
                rowSpan={2} 
                className="border border-slate-300 px-3 py-2 w-52 bg-slate-100 text-slate-800"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span className="truncate">{t.colSamplingPoint}</span>
                  <span className="text-emerald-700 font-extrabold">*</span>
                </div>
              </th>
              <th 
                rowSpan={2} 
                className="border border-slate-300 px-2 py-2 w-36 bg-slate-100 text-slate-800"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>{t.colTime}</span>
                  <span className="text-emerald-700 font-extrabold">*</span>
                </div>
              </th>
              {/* Titik Koordinat Group */}
              <th 
                colSpan={2} 
                className="border border-slate-300 px-2 py-1.5 text-center bg-slate-100 text-slate-800"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>{lang === 'zh' ? 'GPS经纬度坐标' : lang === 'en' ? 'GPS COORDINATES' : 'TITIK KOORDINAT'}</span>
                  <span className="text-emerald-700 font-extrabold">*</span>
                </div>
              </th>
              {/* Parameter In-Situ Group */}
              <th 
                colSpan={inSituColsCount} 
                className="border border-slate-300 px-2 py-1.5 text-center bg-slate-100 text-slate-800"
              >
                {t.colInSituHeader}
              </th>
              {paramsConfig.showTeknikSampling && (
                <th rowSpan={2} className="border border-slate-300 px-2 py-2 w-36 bg-slate-100 text-slate-700">
                  {t.colTechnique}
                </th>
              )}
              <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center w-16 bg-slate-100 text-slate-700">
                {t.colAction}
              </th>
            </tr>

            {/* Sub-Header Columns */}
            <tr className="text-[10px] bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
              <th className="border border-slate-300 px-2 py-1.5 w-32 text-slate-700 text-center">
                {t.colCoordNS}
              </th>
              <th className="border border-slate-300 px-2 py-1.5 w-32 text-slate-700 text-center">
                {t.colCoordE}
              </th>

              {/* In-situ sub headers with units */}
              {paramsConfig.showTemperatur && (
                <th className="border border-slate-300 px-2 py-1.5 w-20 text-center">
                  {t.colTemp}<br /><span className="text-slate-500 font-normal">(°C)</span>
                </th>
              )}
              {paramsConfig.showPh && (
                <th className="border border-slate-300 px-2 py-1.5 w-28 text-center bg-slate-50">
                  <span className="text-slate-800 font-bold">{t.colPh} *</span><br />
                  <span className="text-[9px] text-slate-500 font-medium">({lang === 'zh' ? '两位小数' : lang === 'en' ? '2 decimals' : '2 Desimal'})</span>
                </th>
              )}
              {paramsConfig.showKlorinBebas && (
                <th className="border border-slate-300 px-2 py-1.5 w-24 text-center">
                  {t.colFreeChlorine}<br /><span className="text-slate-500 font-normal">(mg/L)</span>
                </th>
              )}
              {paramsConfig.showDo && (
                <th className="border border-slate-300 px-2 py-1.5 w-20 text-center">
                  {t.colDo}<br /><span className="text-slate-500 font-normal">(mg/L)</span>
                </th>
              )}
              {paramsConfig.showKecerahan && (
                <th className="border border-slate-300 px-2 py-1.5 w-20 text-center">
                  {t.colTransparency}<br /><span className="text-slate-500 font-normal">(m)</span>
                </th>
              )}
              {paramsConfig.showDhl && (
                <th className="border border-slate-300 px-2 py-1.5 w-24 text-center">
                  {t.colDhl}<br /><span className="text-slate-500 font-normal">({paramsConfig.dhlUnit})</span>
                </th>
              )}
              {paramsConfig.showLapisanMinyak && (
                <th className="border border-slate-300 px-2 py-1.5 w-28 text-center">
                  {t.colOilLayer}
                </th>
              )}
              {paramsConfig.showKekeruhan && (
                <th className="border border-slate-300 px-2 py-1.5 w-22 text-center">
                  {t.colTurbidity}<br /><span className="text-slate-500 font-normal">(NTU)</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200">
            {displayedIndices.map((idx) => {
              const row = rows[idx];
              const isMissing = isRowWajibMissing(row);
              const formNumber = Math.floor(idx / SAMPLES_PER_FORM) + 1;
              const isFirstInPage = idx > 0 && idx % SAMPLES_PER_FORM === 0 && activePageTab === 'all';

              return (
                <React.Fragment key={row.id || idx}>
                  {/* Multi-Form Page Break Divider (when viewing all samples) */}
                  {isFirstInPage && (
                    <tr className="bg-emerald-800 text-white font-bold">
                      <td colSpan={totalCols} className="px-4 py-2 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-800 text-white border-y-2 border-emerald-500 shadow-inner">
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="bg-white text-emerald-900 px-2 py-0.5 rounded font-black text-[11px] uppercase tracking-wider">
                              {t.pageTabPrefix} {formNumber}
                            </span>
                            <span className="text-emerald-100 font-medium">
                              {lang === 'zh' ? '已达到单页12个采样点容量限制 • 新一页表单从下方开始' : lang === 'en' ? '12 Samples Capacity Reached • New Page Starts Below' : 'Batas Kapasitas 12 Sampel Tercapai • Formulir Baru Dimulai di Bawah Ini'}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-200 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-600/50">
                            {lang === 'zh' ? `第 ${idx + 1} 至 ${Math.min(idx + 12, rows.length)} 点位` : lang === 'en' ? `Samples No. ${idx + 1} - ${Math.min(idx + 12, rows.length)}` : `Sampel No. ${idx + 1} s/d ${Math.min(idx + 12, rows.length)}`}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr 
                    className={`hover:bg-slate-50 transition-colors ${
                      isMissing && highlightWajibOnly ? 'bg-amber-50/40' : idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                    }`}
                  >
                    {/* Row Number + Form Page Indicator */}
                    <td className="border border-slate-200 px-1 py-1 text-center font-mono text-[11px] text-slate-500 font-bold bg-slate-50">
                      <div>{idx + 1}</div>
                      {totalForms > 1 && (
                        <div className="text-[9px] font-normal text-emerald-700 font-sans">
                          F{formNumber}
                        </div>
                      )}
                    </td>

                    {/* LAB ID - Read Only / Disabled / Not Clickable / Blank */}
                    <td className="border border-slate-200 p-1 bg-slate-50/50">
                      <input
                        type="text"
                        disabled
                        readOnly
                        tabIndex={-1}
                        value={row.labId || ''}
                        placeholder=""
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono text-slate-500 text-center bg-slate-100/80 cursor-not-allowed select-none pointer-events-none font-medium"
                        title={lang === 'zh' ? '实验室编号由实验室检测人员分配填写' : lang === 'en' ? 'Lab ID is filled by the laboratory testing team' : 'Kolom LAB ID dikosongkan (diisi khusus oleh pihak laboratorium)'}
                      />
                    </td>

                    {/* Titik Sampling (Wajib - Green) */}
                    <td className={`border border-slate-200 p-1 ${
                      !row.titikSampling.trim() && highlightWajibOnly ? 'bg-amber-100/50' : 'bg-emerald-50/20'
                    }`}>
                      <input
                        type="text"
                        value={row.titikSampling}
                        onChange={(e) => onChangeRow(idx, 'titikSampling', e.target.value)}
                        placeholder="e.g. Inlet IPAL / Outlet WWTP"
                        className={`w-full px-2 py-1 text-xs rounded border font-medium ${
                          !row.titikSampling.trim()
                            ? 'border-amber-400 focus:border-emerald-500'
                            : 'border-slate-300 focus:border-emerald-500 bg-white'
                        }`}
                      />
                    </td>

                    {/* Jam (Wajib - Green) with Timezone Selection */}
                    <td className={`border border-slate-200 p-1 ${
                      !row.jam.trim() && highlightWajibOnly ? 'bg-amber-100/50' : 'bg-emerald-50/20'
                    }`}>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={row.jam.replace(/\s*(WIB|WITA|WIT)\s*/gi, '').trim()}
                          onChange={(e) => {
                            const tz = extractTimezone(row.jam);
                            const timePart = e.target.value;
                            onChangeRow(idx, 'jam', timePart ? `${timePart} ${tz}` : '');
                          }}
                          placeholder="09:00"
                          className={`w-full min-w-[50px] px-1.5 py-1 text-xs rounded border font-mono text-center ${
                            !row.jam.trim()
                              ? 'border-amber-400 focus:border-emerald-500'
                              : 'border-slate-300 focus:border-emerald-500 bg-white'
                          }`}
                          title={t.setTimeNowBtn}
                        />
                        <select
                          value={extractTimezone(row.jam)}
                          onChange={(e) => {
                            const newTz = e.target.value as 'WIB' | 'WITA' | 'WIT';
                            onChangeRow(idx, 'jam', updateJamTimezone(row.jam, newTz));
                          }}
                          className="px-1 py-1 text-[10px] font-bold border border-slate-300 rounded bg-white text-slate-700 focus:border-emerald-500 shrink-0 cursor-pointer"
                          title="Zona Waktu (WIB, WITA, WIT)"
                        >
                          <option value="WIB">WIB</option>
                          <option value="WITA">WITA</option>
                          <option value="WIT">WIT</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleSetCurrentTime(idx)}
                          className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors shrink-0 cursor-pointer"
                          title={t.setTimeNowBtn}
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Koordinat N/S */}
                    <td className={`border border-slate-200 p-1 ${
                      !row.koordinatNS.trim() && highlightWajibOnly ? 'bg-amber-100/50' : 'bg-emerald-50/20'
                    }`}>
                      <div className="relative flex items-center">
                        <textarea
                          rows={2}
                          value={row.koordinatNS}
                          onChange={(e) => onChangeRow(idx, 'koordinatNS', e.target.value)}
                          placeholder="S 06°12'34.5&quot;"
                          className={`w-full pl-1.5 pr-6 py-1 text-xs rounded border font-mono text-[11px] resize-none leading-tight whitespace-normal break-words ${
                            !row.koordinatNS.trim()
                              ? 'border-amber-400 focus:border-emerald-500'
                              : 'border-slate-300 focus:border-emerald-500 bg-white'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleFetchGps(idx)}
                          disabled={gpsLoadingRow === idx}
                          className="absolute right-1 text-slate-400 hover:text-emerald-600 p-1 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50 cursor-pointer"
                          title={t.getGpsBtn}
                        >
                          <MapPin className={`w-3.5 h-3.5 ${gpsLoadingRow === idx ? 'animate-bounce text-emerald-600' : ''}`} />
                        </button>
                      </div>
                    </td>

                    {/* Koordinat E */}
                    <td className={`border border-slate-200 p-1 ${
                      !row.koordinatE.trim() && highlightWajibOnly ? 'bg-amber-100/50' : 'bg-emerald-50/20'
                    }`}>
                      <textarea
                        rows={2}
                        value={row.koordinatE}
                        onChange={(e) => onChangeRow(idx, 'koordinatE', e.target.value)}
                        placeholder="E 106°49'12.3&quot;"
                        className={`w-full px-1.5 py-1 text-xs rounded border font-mono text-[11px] resize-none leading-tight whitespace-normal break-words ${
                          !row.koordinatE.trim()
                            ? 'border-amber-400 focus:border-emerald-500'
                            : 'border-slate-300 focus:border-emerald-500 bg-white'
                        }`}
                      />
                    </td>

                    {/* Parameter In-situ inputs */}
                    {paramsConfig.showTemperatur && (
                      <td className="border border-slate-200 p-1">
                        <input
                          type="text"
                          value={row.temperatur}
                          onChange={(e) => onChangeRow(idx, 'temperatur', e.target.value)}
                          placeholder="28.5"
                          className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono"
                        />
                      </td>
                    )}

                    {/* pH (Otomatis format 2 desimal saat blur) */}
                    {paramsConfig.showPh && (
                      <td className="border border-slate-200 p-1 bg-emerald-50/10">
                        <input
                          type="text"
                          value={row.pH}
                          onChange={(e) => onChangeRow(idx, 'pH', e.target.value)}
                          onBlur={(e) => {
                            const formatted = formatPhValue(e.target.value);
                            if (formatted && formatted !== e.target.value) {
                              onChangeRow(idx, 'pH', formatted);
                            }
                          }}
                          placeholder="7.00"
                          className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono font-semibold text-emerald-900"
                          title="pH (2 decimals)"
                        />
                      </td>
                    )}

                    {paramsConfig.showKlorinBebas && (
                      <td className="border border-slate-200 p-1">
                        <input
                          type="text"
                          value={row.klorinBebas}
                          onChange={(e) => onChangeRow(idx, 'klorinBebas', e.target.value)}
                          placeholder="0.02"
                          className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono"
                        />
                      </td>
                    )}

                    {paramsConfig.showDo && (
                      <td className="border border-slate-200 p-1">
                        <input
                          type="text"
                          value={row.doVal}
                          onChange={(e) => onChangeRow(idx, 'doVal', e.target.value)}
                          placeholder="6.2"
                          className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono"
                        />
                      </td>
                    )}

                    {paramsConfig.showKecerahan && (
                      <td className="border border-slate-200 p-1">
                        <input
                          type="text"
                          value={row.kecerahan}
                          onChange={(e) => onChangeRow(idx, 'kecerahan', e.target.value)}
                          placeholder="1.5"
                          className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono"
                        />
                      </td>
                    )}

                    {paramsConfig.showDhl && (
                      <td className="border border-slate-200 p-1">
                        <input
                          type="text"
                          value={row.dhl}
                          onChange={(e) => onChangeRow(idx, 'dhl', e.target.value)}
                          placeholder="450"
                          className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono"
                        />
                      </td>
                    )}

                    {paramsConfig.showLapisanMinyak && (
                      <td className="border border-slate-200 p-1">
                        <select
                          value={row.lapisanMinyak || 'Tidak Ada'}
                          onChange={(e) => onChangeRow(idx, 'lapisanMinyak', e.target.value)}
                          className="w-full px-1 py-1 text-[11px] border border-slate-200 rounded focus:border-emerald-500 bg-white cursor-pointer"
                        >
                          {LAPISAN_MINYAK_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {paramsConfig.showKekeruhan && (
                      <td className="border border-slate-200 p-1">
                        <input
                          type="text"
                          value={row.kekeruhan}
                          onChange={(e) => onChangeRow(idx, 'kekeruhan', e.target.value)}
                          placeholder="5.4"
                          className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono"
                        />
                      </td>
                    )}

                    {paramsConfig.showTeknikSampling && (
                      <td className="border border-slate-200 p-1">
                        <select
                          value={row.teknikSampling || 'Grab Sample (Sesaat)'}
                          onChange={(e) => onChangeRow(idx, 'teknikSampling', e.target.value)}
                          className="w-full px-1 py-1 text-[11px] border border-slate-200 rounded focus:border-emerald-500 bg-white cursor-pointer"
                        >
                          {TEKNIK_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Actions: Duplicate & Delete */}
                    <td className="border border-slate-200 px-1 py-1 text-center bg-slate-50/50">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onDuplicateRow(idx)}
                          className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                          title={t.duplicateRowBtn}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onRemoveRow(idx)}
                          disabled={rows.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title={t.deleteRowBtn}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Controls */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <span>
            {t.totalSamples}: <strong className="text-slate-800">{rows.length}</strong>
          </span>
          <span>•</span>
          <span>
            {t.estimatedPages}: <strong className="text-emerald-700">{totalForms} {lang === 'zh' ? '页' : lang === 'en' ? 'Pages' : 'Halaman'}</strong> (1 Form = 12 {t.samplesCountBadge})
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onClearEmptyRows}
            className="text-slate-600 hover:text-red-700 text-xs hover:underline cursor-pointer transition-colors"
            title={t.clearEmptyBtn}
          >
            {t.clearEmptyBtn}
          </button>

          <button
            type="button"
            onClick={onAddRow}
            className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-600" />
            <span>{t.addSampleBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

