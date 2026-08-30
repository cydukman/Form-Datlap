import React from 'react';
import { Calendar, User, MapPin, Phone, Hash, BookOpen, AlertCircle, FileEdit } from 'lucide-react';
import { HeaderData } from '../types/datlap';

interface FormHeaderFieldsProps {
  header: HeaderData;
  onChange: (field: keyof HeaderData, value: string) => void;
  highlightWajibOnly: boolean;
}

const COMMON_METHODS = [
  'SNI 6989.57:2008 (Metode Pengambilan Contoh Air Permukaan)',
  'SNI 6989.58:2008 (Metode Pengambilan Contoh Air Tanah / Sumur Pantau)',
  'SNI 6989.59:2008 (Metode Pengambilan Contoh Air Limbah IPAL)',
  'SNI 8995:2021 (Metode Pengambilan Contoh Uji Air untuk Analisis Fisika dan Kimia)',
  'Permenkes No. 2 Tahun 2023 (Pengambilan Contoh Uji Air Minum & Sanitasi)',
  'Standard Methods for Examination of Water and Wastewater (APHA 1060)',
];

export const FormHeaderFields: React.FC<FormHeaderFieldsProps> = ({
  header,
  onChange,
  highlightWajibOnly,
}) => {
  const isMissing = (val: string) => !val.trim();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-slate-800">
      {/* Section Header */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Identitas Pelanggan & Informasi Pengambilan Uji
          </h2>
        </div>
        <span className="text-[11px] text-slate-600 font-medium bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
          Bagian Atas Formulir
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Mandatory Rows replicating the ANKAL Form Header */}
        <div className="lg:col-span-8 space-y-2.5">
          {/* Row 1: Nama Pelanggan */}
          <div className={`p-1 rounded-lg transition-all ${
            highlightWajibOnly ? 'bg-amber-50/60 ring-1 ring-amber-300' : ''
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label 
                htmlFor="namaPelanggan"
                className="sm:col-span-4 text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5 border-l-2 border-emerald-600 pl-2.5 bg-slate-50 py-1.5 rounded-r"
              >
                <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NAMA PELANGGAN</span>
                <span className="text-emerald-700 font-extrabold">*</span>
              </label>
              <div className="sm:col-span-8 relative">
                <input
                  id="namaPelanggan"
                  type="text"
                  value={header.namaPelanggan}
                  onChange={(e) => onChange('namaPelanggan', e.target.value)}
                  placeholder="Contoh: PT. Sumber Tirta Lestari / Bapak Hendra"
                  className={`w-full px-2.5 py-1.5 text-xs rounded border transition-colors font-medium ${
                    isMissing(header.namaPelanggan)
                      ? 'border-amber-400 bg-amber-50/30 focus:border-emerald-500 focus:bg-white'
                      : 'border-slate-300 bg-white focus:border-emerald-500'
                  }`}
                />
                {isMissing(header.namaPelanggan) && (
                  <span className="text-[10px] text-amber-700 font-medium absolute right-2 top-2">
                    Wajib diisi
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Alamat */}
          <div className={`p-1 rounded-lg transition-all ${
            highlightWajibOnly ? 'bg-amber-50/60 ring-1 ring-amber-300' : ''
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label 
                htmlFor="alamat"
                className="sm:col-span-4 text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5 border-l-2 border-emerald-600 pl-2.5 bg-slate-50 py-1.5 rounded-r"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ALAMAT</span>
                <span className="text-emerald-700 font-extrabold">*</span>
              </label>
              <div className="sm:col-span-8 relative">
                <input
                  id="alamat"
                  type="text"
                  value={header.alamat}
                  onChange={(e) => onChange('alamat', e.target.value)}
                  placeholder="Contoh: Jl. Industri Raya No. 45, Kawasan Industri Jababeka, Cikarang"
                  className={`w-full px-2.5 py-1.5 text-xs rounded border transition-colors ${
                    isMissing(header.alamat)
                      ? 'border-amber-400 bg-amber-50/30 focus:border-emerald-500 focus:bg-white'
                      : 'border-slate-300 bg-white focus:border-emerald-500'
                  }`}
                />
                {isMissing(header.alamat) && (
                  <span className="text-[10px] text-amber-700 font-medium absolute right-2 top-2">
                    Wajib diisi
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Narahubung */}
          <div className={`p-1 rounded-lg transition-all ${
            highlightWajibOnly ? 'bg-amber-50/60 ring-1 ring-amber-300' : ''
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label 
                htmlFor="narahubung"
                className="sm:col-span-4 text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5 border-l-2 border-emerald-600 pl-2.5 bg-slate-50 py-1.5 rounded-r"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NARAHUBUNG</span>
                <span className="text-emerald-700 font-extrabold">*</span>
              </label>
              <div className="sm:col-span-8 relative">
                <input
                  id="narahubung"
                  type="text"
                  value={header.narahubung}
                  onChange={(e) => onChange('narahubung', e.target.value)}
                  placeholder="Contoh: Ibu Rina - HSE Officer (0812-3456-7890)"
                  className={`w-full px-2.5 py-1.5 text-xs rounded border transition-colors ${
                    isMissing(header.narahubung)
                      ? 'border-amber-400 bg-amber-50/30 focus:border-emerald-500 focus:bg-white'
                      : 'border-slate-300 bg-white focus:border-emerald-500'
                  }`}
                />
                {isMissing(header.narahubung) && (
                  <span className="text-[10px] text-amber-700 font-medium absolute right-2 top-2">
                    Wajib diisi
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Tanggal Sampling */}
          <div className={`p-1 rounded-lg transition-all ${
            highlightWajibOnly ? 'bg-amber-50/60 ring-1 ring-amber-300' : ''
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label 
                htmlFor="tanggal"
                className="sm:col-span-4 text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5 border-l-2 border-emerald-600 pl-2.5 bg-slate-50 py-1.5 rounded-r"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>TANGGAL SAMPLING</span>
                <span className="text-emerald-700 font-extrabold">*</span>
              </label>
              <div className="sm:col-span-8 flex items-center gap-2">
                <input
                  id="tanggal"
                  type="date"
                  value={header.tanggal}
                  onChange={(e) => onChange('tanggal', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white focus:border-emerald-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => onChange('tanggal', new Date().toISOString().split('T')[0])}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold shrink-0 border border-slate-300"
                  title="Gunakan tanggal hari ini"
                >
                  Hari Ini
                </button>
              </div>
            </div>
          </div>

          {/* Row 5: Metode Sampling */}
          <div className={`p-1 rounded-lg transition-all ${
            highlightWajibOnly ? 'bg-amber-50/60 ring-1 ring-amber-300' : ''
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label 
                htmlFor="metode"
                className="sm:col-span-4 text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5 border-l-2 border-emerald-600 pl-2.5 bg-slate-50 py-1.5 rounded-r"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>METODE</span>
                <span className="text-emerald-700 font-extrabold">*</span>
              </label>
              <div className="sm:col-span-8 space-y-1">
                <input
                  id="metode"
                  type="text"
                  value={header.metode}
                  onChange={(e) => onChange('metode', e.target.value)}
                  placeholder="Pilih metode atau ketik manual..."
                  className={`w-full px-2.5 py-1.5 text-xs rounded border transition-colors ${
                    isMissing(header.metode)
                      ? 'border-amber-400 bg-amber-50/30 focus:border-emerald-500 focus:bg-white'
                      : 'border-slate-300 bg-white focus:border-emerald-500'
                  }`}
                />
                {/* Quick Presets for Methods */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {COMMON_METHODS.slice(0, 3).map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChange('metode', m)}
                      className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                        header.metode === m
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {m.split(' ')[0]} {m.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Catatan Box (Matching ANKAL Box Layout) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-slate-50/70 rounded-lg border border-slate-200 p-3 h-full flex flex-col justify-between">
            <div>
              <label 
                htmlFor="catatanHeader"
                className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200"
              >
                <span>Catatan Tambahan:</span>
                <span className="text-[10px] font-normal text-slate-500">(Opsional)</span>
              </label>
              <textarea
                id="catatanHeader"
                value={header.catatan}
                onChange={(e) => onChange('catatan', e.target.value)}
                placeholder="Catatan tambahan dari pelanggan / petunjuk pengiriman sampel / permintaan pengawetan khusus..."
                className="w-full min-h-[140px] text-xs p-2.5 bg-white rounded border border-slate-300 focus:border-emerald-500 resize-none font-medium text-slate-800"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 leading-relaxed italic">
              * Formulir ini merupakan dokumen resmi pendukung Laporan Hasil Uji (LHU) laboratorium ANKAL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
