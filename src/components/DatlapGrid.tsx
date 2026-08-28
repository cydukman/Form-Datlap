import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Layers, 
  Sliders, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { DatlapRow, InSituParamsConfig } from '../types/datlap';
import { getCurrentGpsPosition } from '../utils/geoUtils';
import { formatPhValue } from '../utils/phUtils';

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
}) => {
  const [gpsLoadingRow, setGpsLoadingRow] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [activePageTab, setActivePageTab] = useState<'all' | number>('all');

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
      setGpsError(err.message || 'Gagal mengambil GPS');
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
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden text-slate-800">
      {/* Table Header Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Tabel Data Lapangan & Pengukuran In-Situ
          </h3>
          <span className="text-[11px] font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold">
            {rows.length} Titik Sampel
          </span>
          <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
            <Layers className="w-3 h-3 text-emerald-600" />
            {totalForms} Formulir (Maks. 12/Form)
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
            onClick={onOpenParamConfig}
            className="px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
            title="Sembunyikan/Tampilkan kolom in-situ yang tidak diuji"
          >
            <Sliders className="w-3 h-3 text-emerald-600" />
            <span>Kustom Kolom In-Situ</span>
          </button>

          <button
            onClick={() => onAddMultipleRows(3)}
            className="px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
            title="Tambah 3 baris sampel baru sekaligus"
          >
            <Plus className="w-3 h-3 text-emerald-600" />
            <span>+3 Baris</span>
          </button>

          <button
            onClick={onAddRow}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Titik</span>
          </button>
        </div>
      </div>

      {/* Form Page Tabs (1 Form = 12 Samples) */}
      <div className="px-3 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 font-semibold text-[11px] mr-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Pilih Tampilan Formulir:
          </span>

          <button
            type="button"
            onClick={() => setActivePageTab('all')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activePageTab === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            Semua Sampel ({rows.length})
          </button>

          {Array.from({ length: totalForms }).map((_, formIdx) => {
            const formNumber = formIdx + 1;
            const startNo = formIdx * SAMPLES_PER_FORM + 1;
            const endNo = Math.min((formIdx + 1) * SAMPLES_PER_FORM, rows.length);
            const sampleCountInForm = Math.max(0, endNo - startNo + 1);
            const isFull = sampleCountInForm >= 12;

            return (
              <button
                key={formNumber}
                type="button"
                onClick={() => setActivePageTab(formNumber)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  activePageTab === formNumber
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <span>Formulir {formNumber}</span>
                <span className={`text-[10px] px-1 rounded font-mono ${
                  activePageTab === formNumber ? 'bg-emerald-700 text-emerald-100' : isFull ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {sampleCountInForm}/12
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          {activePageTab === 'all' ? (
            <span>Menampilkan semua <strong>{rows.length}</strong> titik sampel (terbagi dalam {totalForms} formulir)</span>
          ) : (
            <span>Menampilkan <strong>Formulir {activePageTab}</strong> (Sampel {(activePageTab - 1) * SAMPLES_PER_FORM + 1} - {Math.min(activePageTab * SAMPLES_PER_FORM, rows.length)})</span>
          )}
        </div>
      </div>

      {/* Grid Table with Horizontal Scroll for High Density */}
      <div className="overflow-x-auto max-h-[580px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <table className="w-full text-left text-xs border-collapse border border-slate-200 min-w-[1100px]">
          {/* Main Table Head */}
          <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10 border-b-2 border-slate-300 shadow-sm text-[11px]">
            {/* Top Super-Header */}
            <tr>
              <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center w-10 bg-slate-100">
                NO
              </th>
              <th rowSpan={2} className="border border-slate-300 px-2 py-2 w-28 bg-slate-100 text-slate-800 text-center font-bold">
                LAB ID
              </th>
              <th 
                rowSpan={2} 
                className="border border-slate-300 px-3 py-2 w-52 bg-emerald-100/90 text-emerald-900 border-b-2 border-b-emerald-600"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>TITIK SAMPLING</span>
                  <span className="text-emerald-700 font-extrabold">*</span>
                </div>
              </th>
              <th 
                rowSpan={2} 
                className="border border-slate-300 px-2 py-2 w-36 bg-emerald-100/90 text-emerald-900 border-b-2 border-b-emerald-600"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>JAM</span>
                  <span className="text-emerald-700 font-extrabold">*</span>
                </div>
              </th>
              {/* Titik Koordinat Group */}
              <th 
                colSpan={2} 
                className="border border-slate-300 px-2 py-1.5 text-center bg-emerald-100/90 text-emerald-900 border-b-2 border-b-emerald-600"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>TITIK KOORDINAT</span>
                  <span className="text-emerald-700 font-extrabold">*</span>
                </div>
              </th>
              {/* Parameter In-Situ Group */}
              <th 
                colSpan={inSituColsCount} 
                className="border border-slate-300 px-2 py-1.5 text-center bg-slate-200 text-slate-800"
              >
                PARAMETER IN-SITU (SESUAI PERMINTAAN PENGUJIAN)
              </th>
              {paramsConfig.showTeknikSampling && (
                <th rowSpan={2} className="border border-slate-300 px-2 py-2 w-36 bg-slate-100">
                  TEKNIK SAMPLING
                </th>
              )}
              <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center w-16 bg-slate-100">
                AKSI
              </th>
            </tr>

            {/* Sub-Header Columns */}
            <tr className="text-[10px] bg-slate-50 text-slate-600 font-semibold">
              <th className="border border-slate-300 px-2 py-1.5 w-32 bg-emerald-50 text-emerald-900">
                N / S
              </th>
              <th className="border border-slate-300 px-2 py-1.5 w-32 bg-emerald-50 text-emerald-900">
                E
              </th>

              {/* In-situ sub headers with units */}
              {paramsConfig.showTemperatur && (
                <th className="border border-slate-300 px-2 py-1.5 w-20 text-center">
                  Temperatur<br /><span className="text-slate-400 font-normal">(°C)</span>
                </th>
              )}
              {paramsConfig.showPh && (
                <th className="border border-slate-300 px-2 py-1.5 w-28 text-center bg-emerald-50/40">
                  <span className="text-emerald-900 font-bold">pH *</span><br />
                  <span className="text-[9px] text-emerald-700 font-medium">(2 Desimal)</span>
                </th>
              )}
              {paramsConfig.showKlorinBebas && (
                <th className="border border-slate-300 px-2 py-1.5 w-24 text-center">
                  Klorin Bebas<br /><span className="text-slate-400 font-normal">(abs/mg/L)</span>
                </th>
              )}
              {paramsConfig.showDo && (
                <th className="border border-slate-300 px-2 py-1.5 w-20 text-center">
                  DO<br /><span className="text-slate-400 font-normal">(mg/L)</span>
                </th>
              )}
              {paramsConfig.showKecerahan && (
                <th className="border border-slate-300 px-2 py-1.5 w-20 text-center">
                  Kecerahan<br /><span className="text-slate-400 font-normal">(m)</span>
                </th>
              )}
              {paramsConfig.showDhl && (
                <th className="border border-slate-300 px-2 py-1.5 w-24 text-center">
                  DHL<br /><span className="text-slate-400 font-normal">({paramsConfig.dhlUnit})</span>
                </th>
              )}
              {paramsConfig.showLapisanMinyak && (
                <th className="border border-slate-300 px-2 py-1.5 w-28 text-center">
                  Lapisan Minyak
                </th>
              )}
              {paramsConfig.showKekeruhan && (
                <th className="border border-slate-300 px-2 py-1.5 w-22 text-center">
                  Kekeruhan<br /><span className="text-slate-400 font-normal">(NTU)</span>
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
                              Formulir Halaman {formNumber}
                            </span>
                            <span className="text-emerald-100 font-medium">
                              Batas Kapasitas 12 Sampel Tercapai • Formulir Baru Dimulai di Bawah Ini
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-200 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-600/50">
                            Sampel No. {idx + 1} s/d {Math.min(idx + 12, rows.length)}
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

                    {/* LAB ID */}
                    <td className="border border-slate-200 p-1">
                      <input
                        type="text"
                        value={row.labId || ''}
                        onChange={(e) => onChangeRow(idx, 'labId', e.target.value)}
                        placeholder={`AKL-26-${String(idx + 1).padStart(4, '0')}`}
                        className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded focus:border-emerald-500 font-mono text-slate-700 bg-white"
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
                          title="Isi jam pengambilan sample"
                        />
                        <select
                          value={extractTimezone(row.jam)}
                          onChange={(e) => {
                            const newTz = e.target.value as 'WIB' | 'WITA' | 'WIT';
                            onChangeRow(idx, 'jam', updateJamTimezone(row.jam, newTz));
                          }}
                          className="px-1 py-1 text-[10px] font-bold border border-slate-300 rounded bg-white text-slate-700 focus:border-emerald-500 shrink-0 cursor-pointer"
                          title="Pilih Zona Waktu (WIB, WITA, WIT)"
                        >
                          <option value="WIB">WIB</option>
                          <option value="WITA">WITA</option>
                          <option value="WIT">WIT</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleSetCurrentTime(idx)}
                          className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors shrink-0"
                          title="Gunakan Jam Sekarang"
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
                          className="absolute right-1 text-slate-400 hover:text-emerald-600 p-1 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                          title="Ambil GPS Otomatis dari Perangkat"
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

                    {/* pH (Otomatis format 2 desimal saat blur/perubahan) */}
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
                          className="w-full px-1 py-1 text-xs text-center font-bold border border-slate-200 rounded focus:border-emerald-500 font-mono text-emerald-950 bg-white"
                          title="pH otomatis diformat 2 desimal (contoh: 7 menjadi 7.00)"
                        />
                      </td>
                    )}

                    {paramsConfig.showKlorinBebas && (
                      <td className="border border-slate-200 p-1">
                        <input
                          type="text"
                          value={row.klorinBebas}
                          onChange={(e) => onChangeRow(idx, 'klorinBebas', e.target.value)}
                          placeholder="0.05"
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
                          placeholder="5.6"
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
                          placeholder="0.8"
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
                          placeholder="350"
                          className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono"
                        />
                      </td>
                    )}

                    {paramsConfig.showLapisanMinyak && (
                      <td className="border border-slate-200 p-1">
                        <select
                          value={row.lapisanMinyak}
                          onChange={(e) => onChangeRow(idx, 'lapisanMinyak', e.target.value)}
                          className="w-full px-1 py-1 text-xs border border-slate-200 rounded focus:border-emerald-500 bg-white"
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
                          placeholder="1.2"
                          className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono"
                        />
                      </td>
                    )}

                    {/* Teknik Sampling */}
                    {paramsConfig.showTeknikSampling && (
                      <td className="border border-slate-200 p-1">
                        <select
                          value={row.teknikSampling}
                          onChange={(e) => onChangeRow(idx, 'teknikSampling', e.target.value)}
                          className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded focus:border-emerald-500 bg-white"
                        >
                          {TEKNIK_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Actions Column */}
                    <td className="border border-slate-200 p-1 text-center bg-slate-50">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onDuplicateRow(idx)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
                          title="Duplikasi Baris"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveRow(idx)}
                          disabled={rows.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30"
                          title="Hapus Baris"
                        >
                          <Trash2 className="w-3 h-3" />
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

      {/* Table Footer Toolbar */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-600 gap-2">
        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-3">
          <span>Total Baris Sampel: <strong className="text-slate-800">{rows.length}</strong></span>
          <span>•</span>
          <span>Formulir Terbentuk: <strong className="text-emerald-700">{totalForms} Halaman</strong> (1 Form = 12 Sampel)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearEmptyRows}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1 cursor-pointer"
          >
            Bersihkan Baris Kosong
          </button>
          <button
            onClick={onAddRow}
            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah Baris</span>
          </button>
          {rows.length % SAMPLES_PER_FORM === 0 && (
            <button
              onClick={onAddRow}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              title="Mulai form baru (halaman berikutnya)"
            >
              <Plus className="w-3 h-3" />
              <span>Mulai Form Baru (+ Sampel 13+)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
