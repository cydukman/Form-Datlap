import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Check, 
  Layers, 
  Sparkles,
  Sliders,
  ChevronDown,
  Navigation
} from 'lucide-react';
import { DatlapRow, InSituParamsConfig, createEmptyRow } from '../types/datlap';
import { getCurrentGpsPosition } from '../utils/geoUtils';

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

  const handleSetCurrentTime = (index: number) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    onChangeRow(index, 'jam', `${hours}:${minutes} WIB`);
  };

  const isRowWajibMissing = (row: DatlapRow) => {
    const hasAnyContent = Object.values(row).some(v => typeof v === 'string' && v.trim().length > 0 && v !== 'Grab Sample' && v !== 'Tidak Ada');
    if (!hasAnyContent) return false; // purely blank row
    return !row.titikSampling.trim() || !row.jam.trim() || !row.koordinatNS.trim() || !row.koordinatE.trim();
  };

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
            {rows.length} Titik Sampling
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
            className="px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1 text-xs font-medium transition-colors"
            title="Sembunyikan/Tampilkan kolom in-situ yang tidak diuji"
          >
            <Sliders className="w-3 h-3 text-emerald-600" />
            <span>Kustom Kolom In-Situ</span>
          </button>

          <button
            onClick={() => onAddMultipleRows(3)}
            className="px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1 text-xs font-medium transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>+3 Baris</span>
          </button>

          <button
            onClick={onAddRow}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Titik</span>
          </button>
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
                className="border border-slate-300 px-2 py-2 w-28 bg-emerald-100/90 text-emerald-900 border-b-2 border-b-emerald-600"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>JAM</span>
                  <span className="text-emerald-700 font-extrabold">*</span>
                </div>
              </th>
              {/* Titik Koordinat Group (Marker Hijau) */}
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
                colSpan={
                  (paramsConfig.showTemperatur ? 1 : 0) +
                  (paramsConfig.showPh ? 1 : 0) +
                  (paramsConfig.showKlorinBebas ? 1 : 0) +
                  (paramsConfig.showDo ? 1 : 0) +
                  (paramsConfig.showKecerahan ? 1 : 0) +
                  (paramsConfig.showDhl ? 1 : 0) +
                  (paramsConfig.showLapisanMinyak ? 1 : 0) +
                  (paramsConfig.showKekeruhan ? 1 : 0)
                } 
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
                <th className="border border-slate-300 px-2 py-1.5 w-18 text-center">
                  pH<br /><span className="text-slate-400 font-normal">(std)</span>
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
            {rows.map((row, idx) => {
              const isMissing = isRowWajibMissing(row);
              return (
                <tr 
                  key={row.id || idx}
                  className={`hover:bg-slate-50 transition-colors ${
                    isMissing && highlightWajibOnly ? 'bg-amber-50/40' : idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                  }`}
                >
                  {/* Row Number */}
                  <td className="border border-slate-200 px-1 py-1 text-center font-mono text-[11px] text-slate-500 font-bold bg-slate-50">
                    {idx + 1}
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

                  {/* Jam (Wajib - Green) */}
                  <td className={`border border-slate-200 p-1 ${
                    !row.jam.trim() && highlightWajibOnly ? 'bg-amber-100/50' : 'bg-emerald-50/20'
                  }`}>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={row.jam}
                        onChange={(e) => onChangeRow(idx, 'jam', e.target.value)}
                        placeholder="09:00 WIB"
                        className={`w-full px-1.5 py-1 text-xs rounded border font-mono ${
                          !row.jam.trim()
                            ? 'border-amber-400 focus:border-emerald-500'
                            : 'border-slate-300 focus:border-emerald-500 bg-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleSetCurrentTime(idx)}
                        className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded shrink-0 border border-slate-300"
                        title="Isi jam sekarang"
                      >
                        <Clock className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Koordinat N/S (Wajib - Green) */}
                  <td className={`border border-slate-200 p-1 ${
                    !row.koordinatNS.trim() && highlightWajibOnly ? 'bg-amber-100/50' : 'bg-emerald-50/20'
                  }`}>
                    <input
                      type="text"
                      value={row.koordinatNS}
                      onChange={(e) => onChangeRow(idx, 'koordinatNS', e.target.value)}
                      placeholder="S 06° 12' 34.5&quot;"
                      className={`w-full px-1.5 py-1 text-xs rounded border font-mono text-[11px] ${
                        !row.koordinatNS.trim()
                          ? 'border-amber-400 focus:border-emerald-500'
                          : 'border-slate-300 focus:border-emerald-500 bg-white'
                      }`}
                    />
                  </td>

                  {/* Koordinat E (Wajib - Green) */}
                  <td className={`border border-slate-200 p-1 ${
                    !row.koordinatE.trim() && highlightWajibOnly ? 'bg-amber-100/50' : 'bg-emerald-50/20'
                  }`}>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={row.koordinatE}
                        onChange={(e) => onChangeRow(idx, 'koordinatE', e.target.value)}
                        placeholder="E 106° 49' 12.3&quot;"
                        className={`w-full px-1.5 py-1 text-xs rounded border font-mono text-[11px] ${
                          !row.koordinatE.trim()
                            ? 'border-amber-400 focus:border-emerald-500'
                            : 'border-slate-300 focus:border-emerald-500 bg-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleFetchGps(idx)}
                        disabled={gpsLoadingRow === idx}
                        className={`p-1 rounded shrink-0 border transition-all ${
                          gpsLoadingRow === idx
                            ? 'bg-emerald-500 text-white animate-spin'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                        title="Ambil Titik Koordinat GPS Otomatis"
                      >
                        <Navigation className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Parameter In-Situ Columns */}
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

                  {paramsConfig.showPh && (
                    <td className="border border-slate-200 p-1">
                      <input
                        type="text"
                        value={row.pH}
                        onChange={(e) => onChangeRow(idx, 'pH', e.target.value)}
                        placeholder="7.24"
                        className="w-full px-1 py-1 text-xs text-center border border-slate-200 rounded focus:border-emerald-500 font-mono"
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
                        placeholder="6.4"
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Toolbar */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-600 gap-2">
        <div className="text-[11px] text-slate-500 font-medium">
          Total Baris Sampel: <span className="font-bold text-slate-700">{rows.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearEmptyRows}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
          >
            Bersihkan Baris Kosong
          </button>
          <button
            onClick={onAddRow}
            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded text-xs transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah Baris</span>
          </button>
        </div>
      </div>
    </div>
  );
};
