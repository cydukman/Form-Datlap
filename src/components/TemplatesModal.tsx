import React from 'react';
import { X, Sparkles, Droplets, Factory, Waves, RefreshCw } from 'lucide-react';
import { DatlapDocument } from '../types/datlap';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (templateDoc: Partial<DatlapDocument>) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  if (!isOpen) return null;

  const templates = [
    {
      id: 'ipal-industri',
      title: 'Air Limbah Industri (IPAL / WWTP)',
      icon: Factory,
      color: 'text-amber-600 bg-amber-100',
      description: 'Sampling titik inlet IPAL, aerasi, sedimentasi, dan outlet pembuangan menuju badan air.',
      data: {
        header: {
          namaPelanggan: 'PT. Indo Chemical Synthetic Tbk',
          alamat: 'Kawasan Industri EJIP Plot 5C, Cikarang Selatan, Bekasi',
          narahubung: 'Bpk. Dimas Pratama (0813-8899-1122)',
          tanggal: new Date().toISOString().split('T')[0],
          metode: 'SNI 6989.59:2008 (Metode Pengambilan Contoh Air Limbah)',
          catatan: 'Permintaan pengujian baku mutu PerMenLH No. 5 Tahun 2014 Lampiran XLVII.',
        },
        rows: [
          {
            id: 'row-1',
            titikSampling: 'Inlet IPAL (Equalization Basin)',
            jam: '08:30 WIB',
            koordinatNS: `S 06° 19' 42.1"`,
            koordinatE: `E 107° 07' 15.4"`,
            temperatur: '29.4',
            pH: '6.85',
            klorinBebas: '0.00',
            doVal: '1.2',
            kecerahan: '0.15',
            dhl: '1240',
            lapisanMinyak: 'Lapisan Tipis / Pelangi',
            kekeruhan: '48.5',
            teknikSampling: 'Composite Waktu',
          },
          {
            id: 'row-2',
            titikSampling: 'Bak Aerasi (Aeration Tank)',
            jam: '09:00 WIB',
            koordinatNS: `S 06° 19' 43.5"`,
            koordinatE: `E 107° 07' 17.2"`,
            temperatur: '30.1',
            pH: '7.12',
            klorinBebas: '0.00',
            doVal: '3.8',
            kecerahan: '0.35',
            dhl: '980',
            lapisanMinyak: 'Tidak Ada',
            kekeruhan: '25.0',
            teknikSampling: 'Grab Sample (Sesaat)',
          },
          {
            id: 'row-3',
            titikSampling: 'Outlet WWTP (Final Effluent)',
            jam: '09:45 WIB',
            koordinatNS: `S 06° 19' 45.8"`,
            koordinatE: `E 107° 07' 21.0"`,
            temperatur: '28.2',
            pH: '7.45',
            klorinBebas: '0.02',
            doVal: '5.9',
            kecerahan: '0.90',
            dhl: '450',
            lapisanMinyak: 'Negatif',
            kekeruhan: '3.4',
            teknikSampling: 'Grab Sample (Sesaat)',
          },
        ],
        footer: {
          denahType: 'text' as const,
          denahDataUrl: '',
          denahText: 'Titik 1: Inlet bak equalisasi depan kantor utility. Titik 2: Bak aerasi tengah blower 2. Titik 3: Outfall weir saluran pembuangan akhir dekat gerbang timur.',
          kondisiLingkunganCuaca: 'Cuaca cerah berawan, suhu udara sekitar 31.5°C, debit air outlet normal mengalir stabil.',
          diverifikasiOleh: {
            nama: 'Hendra Gunawan, S.T.',
            jabatan: 'HSE & Environmental Engineer',
            tanggal: new Date().toISOString().split('T')[0],
            signatureDataUrl: '',
          },
        },
      },
    },
    {
      id: 'air-sungai',
      title: 'Air Permukaan / Sungai (Baku Mutu PP 22/2021)',
      icon: Waves,
      color: 'text-sky-600 bg-sky-100',
      description: 'Pengambilan contoh uji sungai upstream, point source mixing zone, dan downstream.',
      data: {
        header: {
          namaPelanggan: 'PT. Agro Nusantara Perkasa',
          alamat: 'Jl. Raya Sungai Citarum KM 22, Karawang Barat',
          narahubung: 'Ibu Ratna Kumalasari (0856-7788-9900)',
          tanggal: new Date().toISOString().split('T')[0],
          metode: 'SNI 6989.57:2008 (Metode Pengambilan Contoh Air Permukaan)',
          catatan: 'Pemantauan RKL-RPL Semester II Tahun 2026.',
        },
        rows: [
          {
            id: 'row-1',
            titikSampling: 'Sungai Hulu (Upstream 100m)',
            jam: '08:15 WIB',
            koordinatNS: `S 06° 15' 12.0"`,
            koordinatE: `E 107° 18' 45.2"`,
            temperatur: '27.5',
            pH: '7.30',
            klorinBebas: '0.00',
            doVal: '6.8',
            kecerahan: '1.20',
            dhl: '180',
            lapisanMinyak: 'Tidak Ada',
            kekeruhan: '8.5',
            teknikSampling: 'Integrated Sample',
          },
          {
            id: 'row-2',
            titikSampling: 'Sungai Hilir (Downstream 200m)',
            jam: '09:00 WIB',
            koordinatNS: `S 06° 15' 28.5"`,
            koordinatE: `E 107° 18' 58.0"`,
            temperatur: '27.8',
            pH: '7.15',
            klorinBebas: '0.00',
            doVal: '6.2',
            kecerahan: '1.05',
            dhl: '210',
            lapisanMinyak: 'Tidak Ada',
            kekeruhan: '11.2',
            teknikSampling: 'Integrated Sample',
          },
        ],
        footer: {
          denahType: 'text' as const,
          denahDataUrl: '',
          denahText: 'Lokasi Upstream jembatan intake pabrik; Downstream setelah batas outfall drainase 200m ke arah muara.',
          kondisiLingkunganCuaca: 'Cuaca cerah, tidak ada hujan 3 hari terakhir, arus air tenang sedang.',
          diverifikasiOleh: {
            nama: 'Budi Santoso',
            jabatan: 'Koordinator Lingkungan',
            tanggal: new Date().toISOString().split('T')[0],
            signatureDataUrl: '',
          },
        },
      },
    },
    {
      id: 'air-minum',
      title: 'Air Minum & Air Bersih Higiene Sanitasi',
      icon: Droplets,
      color: 'text-emerald-600 bg-emerald-100',
      description: 'Sampling air minum galon/depot, dispenser kantin, dan kran sumber air bersih karyawan.',
      data: {
        header: {
          namaPelanggan: 'PT. Mega Food & Beverage Manufacturing',
          alamat: 'Kawasan Industri MM2100 Blok DD-3, Cikarang Barat',
          narahubung: 'Dr. Anita Wijaya - Klinik Perusahaan (0811-2233-4455)',
          tanggal: new Date().toISOString().split('T')[0],
          metode: 'Permenkes No. 2 Tahun 2023 (Pengambilan Contoh Uji Air Minum)',
          catatan: 'Pemeriksaan rutin kualitas air konsumsi karyawan sesuai regulasi K3 & Hygiene.',
        },
        rows: [
          {
            id: 'row-1',
            titikSampling: 'Kran Pengolahan Filter RO Utama',
            jam: '07:45 WIB',
            koordinatNS: `S 06° 17' 05.2"`,
            koordinatE: `E 107° 06' 11.8"`,
            temperatur: '26.0',
            pH: '7.05',
            klorinBebas: '0.00',
            doVal: '7.1',
            kecerahan: '2.50',
            dhl: '45',
            lapisanMinyak: 'Negatif',
            kekeruhan: '0.25',
            teknikSampling: 'Grab Sample (Sesaat)',
          },
          {
            id: 'row-2',
            titikSampling: 'Dispenser Kantin Karyawan Lt. 1',
            jam: '08:10 WIB',
            koordinatNS: `S 06° 17' 06.0"`,
            koordinatE: `E 107° 06' 13.5"`,
            temperatur: '25.8',
            pH: '7.10',
            klorinBebas: '0.00',
            doVal: '7.0',
            kecerahan: '2.50',
            dhl: '48',
            lapisanMinyak: 'Negatif',
            kekeruhan: '0.30',
            teknikSampling: 'Grab Sample (Sesaat)',
          },
        ],
        footer: {
          denahType: 'text' as const,
          denahDataUrl: '',
          denahText: 'Kran filter RO di ruang utility water treatment; Dispenser di gedung utama kantin staff.',
          kondisiLingkunganCuaca: 'Ruangan tertutup ber-AC, higienis, suhu ruangan 24°C.',
          diverifikasiOleh: {
            nama: 'Siti Nurhaliza, A.Md.KL',
            jabatan: 'Sanitarian & K3 Officer',
            tanggal: new Date().toISOString().split('T')[0],
            signatureDataUrl: '',
          },
        },
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs no-print">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Pilih Template Sampling Contoh</h3>
              <p className="text-[11px] text-slate-400">
                Muat template form dengan parameter in-situ dan metadata siap pakai
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

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {templates.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:shadow-sm bg-slate-50/50 hover:bg-white transition-all group cursor-pointer"
                onClick={() => {
                  onApplyTemplate(t.data);
                  onClose();
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${t.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {t.title}
                      </h4>
                      <span className="text-[10px] bg-slate-200 group-hover:bg-emerald-100 group-hover:text-emerald-800 px-2 py-0.5 rounded font-bold transition-colors">
                        Gunakan
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{t.description}</p>
                    <div className="mt-2 text-[10px] text-slate-400 font-mono">
                      Metode: {t.data.header.metode.split('(')[0]} | {t.data.rows.length} Titik
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
