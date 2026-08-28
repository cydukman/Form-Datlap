/**
 * Helper utilities for formatting and analyzing pH values in compliance with
 * Indonesian Environmental & Drinking Water Standards (PP No. 22/2021 & Permenkes)
 */

export interface PhAnalysisResult {
  formatted: string;
  numValue: number | null;
  status: 'asam' | 'netral' | 'basa' | 'invalid' | 'empty';
  label: string;
  shortLabel: string;
  badgeClass: string;
  keterangan: string;
}

/**
 * Automatically formats a pH input string to exactly 2 decimal places with comma (or dot)
 * e.g., "7" -> "7,00", "7.2" -> "7,20", "6,85" -> "6,85"
 */
export function formatPhValue(val: string): string {
  if (!val) return '';
  const trimmed = val.trim();
  if (!trimmed || trimmed === '-') return trimmed;

  // Replace comma with dot to parse float
  const normalized = trimmed.replace(',', '.');
  const num = parseFloat(normalized);
  
  if (isNaN(num)) return trimmed;
  
  // Return formatted with comma as per Indonesian standard format (e.g. 7,00)
  return num.toFixed(2).replace('.', ',');
}

/**
 * Returns detailed analysis and contextual description (keterangan) for a pH value
 */
export function analyzePh(val: string): PhAnalysisResult {
  if (!val) {
    return {
      formatted: '',
      numValue: null,
      status: 'empty',
      label: 'Belum diisi',
      shortLabel: '-',
      badgeClass: 'text-slate-400 bg-slate-50 border-slate-200',
      keterangan: 'Belum ada data pH',
    };
  }

  const trimmed = val.trim();
  if (!trimmed || trimmed === '-') {
    return {
      formatted: trimmed,
      numValue: null,
      status: 'empty',
      label: 'N/A',
      shortLabel: '-',
      badgeClass: 'text-slate-400 bg-slate-50 border-slate-200',
      keterangan: 'Tidak dilakukan pengukuran',
    };
  }

  const normalized = trimmed.replace(',', '.');
  const num = parseFloat(normalized);

  if (isNaN(num)) {
    return {
      formatted: trimmed,
      numValue: null,
      status: 'invalid',
      label: 'Format Tidak Valid',
      shortLabel: 'Error',
      badgeClass: 'text-rose-700 bg-rose-50 border-rose-200',
      keterangan: 'Masukkan angka desimal (contoh: 7,00)',
    };
  }

  const formatted = num.toFixed(2).replace('.', ',');

  if (num < 0 || num > 14) {
    return {
      formatted,
      numValue: num,
      status: 'invalid',
      label: 'Di Luar Skala pH (0 - 14)',
      shortLabel: 'Di Luar Skala',
      badgeClass: 'text-rose-700 bg-rose-50 border-rose-300 font-bold',
      keterangan: 'Nilai pH harus berada pada rentang 0,00 - 14,00',
    };
  }

  if (num < 6.5) {
    return {
      formatted,
      numValue: num,
      status: 'asam',
      label: 'Asam (Di Bawah Baku Mutu Air)',
      shortLabel: 'Asam',
      badgeClass: 'text-amber-800 bg-amber-100 border-amber-300 font-semibold',
      keterangan: 'pH < 6,50 (Kondisi Asam / Perlu Perlakuan Netralisasi)',
    };
  }

  if (num <= 8.5) {
    return {
      formatted,
      numValue: num,
      status: 'netral',
      label: 'Netral / Sesuai Baku Mutu',
      shortLabel: 'Netral (Baku Mutu)',
      badgeClass: 'text-emerald-800 bg-emerald-100 border-emerald-300 font-semibold',
      keterangan: 'pH 6,50 - 8,50 (Memenuhi Standar Baku Mutu Air Lingkungan/Minum)',
    };
  }

  return {
    formatted,
    numValue: num,
    status: 'basa',
    label: 'Basa (Di Atas Baku Mutu Air)',
    shortLabel: 'Basa',
    badgeClass: 'text-blue-800 bg-blue-100 border-blue-300 font-semibold',
    keterangan: 'pH > 8,50 (Kondisi Basa / Alkalin)',
  };
}
