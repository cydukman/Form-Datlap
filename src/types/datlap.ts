export interface HeaderData {
  noSuratPengantar: string; // Green marker - Wajib
  namaPelanggan: string;    // Green marker - Wajib
  alamat: string;           // Green marker - Wajib
  narahubung: string;       // Green marker - Wajib
  tanggal: string;          // Green marker - Wajib
  metode: string;           // Green marker - Wajib
  catatan: string;          // Box kanan
}

export interface InSituParamsConfig {
  showTemperatur: boolean;
  showPh: boolean;
  showKlorinBebas: boolean;
  showDo: boolean;
  showKecerahan: boolean;
  showDhl: boolean;
  showLapisanMinyak: boolean;
  showKekeruhan: boolean;
  showTeknikSampling: boolean;
  dhlUnit: 'mS/cm' | 'μS/cm';
}

export interface DatlapRow {
  id: string;
  labId: string;
  titikSampling: string;     // Green marker - Wajib
  jam: string;               // Green marker - Wajib
  koordinatNS: string;       // Green marker - Wajib (e.g. S 06°12'34.5" or -6.2088)
  koordinatE: string;        // Green marker - Wajib (e.g. E 106°49'12.3" or 106.8200)
  // Parameter In-situ (Menyesuaikan permintaan pengujian customer)
  temperatur: string;        // °C
  pH: string;
  klorinBebas: string;       // abs / mg/L
  doVal: string;             // mg/L
  kecerahan: string;         // m
  dhl: string;               // mS/cm / μS/cm
  lapisanMinyak: string;     // Ada / Tidak Ada / Negatif
  kekeruhan: string;         // NTU
  teknikSampling: string;    // Grab / Composite Waktu / Composite Tempat / dll
}

export interface FooterData {
  denahType: 'sketch' | 'upload' | 'text';
  denahDataUrl: string;
  denahText: string;
  kondisiLingkunganCuaca: string;
  diverifikasiOleh: {
    nama: string;
    jabatan: string;
    tanggal: string;
    signatureDataUrl: string;
  };
}

export interface DatlapDocument {
  id: string;
  docCode: string;           // AKL-FO-7.3-36
  docTitle: string;          // PENGAMBILAN CONTOH UJI AIR OLEH PELANGGAN
  tanggalTerbit: string;     // 24 November 2025
  terbitRevisi: string;      // 3/0
  tanggalBerlaku: string;    // 24 November 2025
  halaman: string;           // 1 dari 1
  header: HeaderData;
  rows: DatlapRow[];
  paramsConfig: InSituParamsConfig;
  footer: FooterData;
  updatedAt: string;
  createdAt: string;
  status: 'draft' | 'verified' | 'submitted';
}

export const DEFAULT_IN_SITU_CONFIG: InSituParamsConfig = {
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
};

export const INITIAL_HEADER_DATA: HeaderData = {
  noSuratPengantar: '',
  namaPelanggan: '',
  alamat: '',
  narahubung: '',
  tanggal: new Date().toISOString().split('T')[0],
  metode: 'SNI 6989.57:2008 (Metode Pengambilan Contoh Air Permukaan)',
  catatan: '',
};

export const createEmptyRow = (index: number): DatlapRow => ({
  id: `row-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
  labId: '',
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
  lapisanMinyak: 'Tidak Ada',
  kekeruhan: '',
  teknikSampling: 'Grab Sample',
});
