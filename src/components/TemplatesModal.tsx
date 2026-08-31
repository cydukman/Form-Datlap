import React from 'react';
import { X, Factory, Waves, Droplets } from 'lucide-react';
import { DatlapDocument } from '../types/datlap';
import { Language, getTranslation } from '../utils/i18n';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (templateDoc: Partial<DatlapDocument>) => void;
  lang?: Language;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  lang = 'id',
}) => {
  if (!isOpen) return null;
  const t = getTranslation(lang);

  const templates = [
    {
      id: 'ipal-industri',
      title: lang === 'zh' ? '工业废水排放检测 (IPAL / WWTP)' : lang === 'en' ? 'Industrial Wastewater (WWTP / IPAL)' : 'Air Limbah Industri (IPAL / WWTP)',
      icon: Factory,
      color: 'text-amber-600 bg-amber-100',
      description: lang === 'zh'
        ? '采样点包括进水口、曝气池、沉淀池以及排放至受纳水体的总出水口。'
        : lang === 'en'
        ? 'Sampling inlet, aeration, sedimentation, and final discharge outfall.'
        : 'Sampling titik inlet IPAL, aerasi, sedimentasi, dan outlet pembuangan menuju badan air.',
      data: {
        header: {
          namaPelanggan: 'PT. Multi Industri Sentosa (Contoh)',
          alamat: 'Kawasan Industri GIIC Blok C-12, Cikarang Pusat, Kab. Bekasi',
          narahubung: 'Bpk. Fajar Pratama - HSE Dept (0812-3456-7890)',
          tanggal: new Date().toISOString().split('T')[0],
          metode: 'SNI 6989.59:2008 (Metode Pengambilan Contoh Air Limbah)',
          catatan: 'Permintaan pengujian baku mutu PerMenLH No. 5 Tahun 2014 Lampiran XLVII.',
        },
        rows: [
          {
            id: 'row-1',
            labId: '',
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
            labId: '',
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
            labId: '',
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
            nama: 'Bpk. Fajar Pratama, S.T.',
            jabatan: 'HSE & Environmental Engineer',
            tanggal: new Date().toISOString().split('T')[0],
            signatureDataUrl: '',
          },
        },
      },
    },
    {
      id: 'air-sungai',
      title: lang === 'zh' ? '地表水 / 河流水质监测 (PP 22/2021)' : lang === 'en' ? 'Surface / River Water Monitoring' : 'Air Permukaan / Sungai (Baku Mutu PP 22/2021)',
      icon: Waves,
      color: 'text-sky-600 bg-sky-100',
      description: lang === 'zh'
        ? '河流上游对照断面、排污口混合区以及下游衰减断面取样。'
        : lang === 'en'
        ? 'River upstream baseline, mixing zone, and downstream compliance points.'
        : 'Pengambilan contoh uji sungai upstream, point source mixing zone, dan downstream.',
      data: {
        header: {
          namaPelanggan: 'PT. Tirta Nusantara Sentosa (Contoh)',
          alamat: 'Jl. Arteri Inspeksi Saluran Contoh KM 15, Jawa Barat',
          narahubung: 'Ibu Ratna Dewi - Tim K3L (0813-9876-5432)',
          tanggal: new Date().toISOString().split('T')[0],
          metode: 'SNI 6989.57:2008 (Metode Pengambilan Contoh Air Permukaan)',
          catatan: 'Pemantauan RKL-RPL Semester II Tahun 2026.',
        },
        rows: [
          {
            id: 'row-1',
            labId: '',
            titikSampling: 'Sungai Hulu (Upstream 100m)',
            jam: '10:15 WIB',
            koordinatNS: `S 06° 21' 11.2"`,
            koordinatE: `E 107° 09' 04.5"`,
            temperatur: '27.5',
            pH: '7.20',
            klorinBebas: '0.00',
            doVal: '6.5',
            kecerahan: '1.20',
            dhl: '210',
            lapisanMinyak: 'Tidak Ada',
            kekeruhan: '8.2',
            teknikSampling: 'Grab Sample (Sesaat)',
          },
          {
            id: 'row-2',
            labId: '',
            titikSampling: 'Titik Pencampuran (Point Source Mixing)',
            jam: '10:45 WIB',
            koordinatNS: `S 06° 21' 14.8"`,
            koordinatE: `E 107° 09' 08.1"`,
            temperatur: '28.1',
            pH: '7.35',
            klorinBebas: '0.01',
            doVal: '5.4',
            kecerahan: '0.80',
            dhl: '320',
            lapisanMinyak: 'Negatif',
            kekeruhan: '14.5',
            teknikSampling: 'Grab Sample (Sesaat)',
          },
          {
            id: 'row-3',
            labId: '',
            titikSampling: 'Sungai Hilir (Downstream 200m)',
            jam: '11:20 WIB',
            koordinatNS: `S 06° 21' 22.0"`,
            koordinatE: `E 107° 09' 16.3"`,
            temperatur: '27.8',
            pH: '7.25',
            klorinBebas: '0.00',
            doVal: '6.1',
            kecerahan: '1.05',
            dhl: '240',
            lapisanMinyak: 'Tidak Ada',
            kekeruhan: '9.8',
            teknikSampling: 'Grab Sample (Sesaat)',
          },
        ],
        footer: {
          denahType: 'text' as const,
          denahDataUrl: '',
          denahText: 'Sampling pada badan sungai lebar 12 meter kedalaman 1.8 meter. Menggunakan water sampler vertikal.',
          kondisiLingkunganCuaca: 'Cuaca terik cerah, kecepatan arus sungai sedang (0.45 m/s), tidak turun hujan dalam 48 jam terakhir.',
          diverifikasiOleh: {
            nama: 'Ibu Ratna Dewi, S.Si.',
            jabatan: 'Koordinator Lingkungan',
            tanggal: new Date().toISOString().split('T')[0],
            signatureDataUrl: '',
          },
        },
      },
    },
    {
      id: 'air-minum-bersih',
      title: lang === 'zh' ? '饮用水与深井水 (Permenkes 2/2023)' : lang === 'en' ? 'Drinking & Deep Well Water' : 'Air Minum & Air Bersih (Permenkes No. 2/2023)',
      icon: Droplets,
      color: 'text-emerald-600 bg-emerald-100',
      description: lang === 'zh'
        ? '深水井、储水箱、过滤净化系统及员工饮水点检测。'
        : lang === 'en'
        ? 'Deep groundwater well, storage reservoir, and drinking water taps.'
        : 'Sampling sumur bor dalam, tandon reservoir, dan keran air minum kantin.',
      data: {
        header: {
          namaPelanggan: 'PT. Agro Sehat Prima (Contoh)',
          alamat: 'Jl. Raya Pergudangan No. 88, Karawang, Jawa Barat',
          narahubung: 'Bpk. Dani Hermawan (0856-1122-3344)',
          tanggal: new Date().toISOString().split('T')[0],
          metode: 'SNI 6989.58:2008 (Metode Pengambilan Contoh Air Tanah / Air Bersih)',
          catatan: 'Pengujian higienitas air minum karyawan standar Permenkes No. 2 Tahun 2023.',
        },
        rows: [
          {
            id: 'row-1',
            labId: '',
            titikSampling: 'Deep Well / Sumur Bor Utama (Kedalaman 80m)',
            jam: '08:15 WIB',
            koordinatNS: `S 06° 18' 05.0"`,
            koordinatE: `E 107° 18' 40.2"`,
            temperatur: '26.8',
            pH: '7.10',
            klorinBebas: '0.00',
            doVal: '5.2',
            kecerahan: '1.50',
            dhl: '185',
            lapisanMinyak: 'Tidak Ada',
            kekeruhan: '0.8',
            teknikSampling: 'Grab Sample (Sesaat)',
          },
          {
            id: 'row-2',
            labId: '',
            titikSampling: 'Tandon Utama / Storage Tank 10.000L',
            jam: '08:45 WIB',
            koordinatNS: `S 06° 18' 06.2"`,
            koordinatE: `E 107° 18' 41.5"`,
            temperatur: '27.1',
            pH: '7.15',
            klorinBebas: '0.25',
            doVal: '5.0',
            kecerahan: '1.50',
            dhl: '190',
            lapisanMinyak: 'Tidak Ada',
            kekeruhan: '0.5',
            teknikSampling: 'Grab Sample (Sesaat)',
          },
        ],
        footer: {
          denahType: 'text' as const,
          denahDataUrl: '',
          denahText: 'Sampel diambil langsung dari kran sampling setelah dialirkan (flushing) selama 5 menit.',
          kondisiLingkunganCuaca: 'Cuaca cerah, suhu ruang 27°C.',
          diverifikasiOleh: {
            nama: 'Bpk. Dani Hermawan',
            jabatan: 'Facility & GA Manager',
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
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{t.templatesModalTitle}</h3>
              <p className="text-[11px] text-slate-400">
                {t.templatesModalSubtitle}
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
          {templates.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.id}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:shadow-xs bg-slate-50/50 hover:bg-white transition-all group cursor-pointer"
                onClick={() => {
                  onApplyTemplate(tmpl.data);
                  onClose();
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tmpl.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {tmpl.title}
                      </h4>
                      <span className="text-[10px] bg-slate-200 group-hover:bg-emerald-100 group-hover:text-emerald-800 px-2 py-0.5 rounded font-bold transition-colors">
                        {lang === 'zh' ? '使用此模板' : lang === 'en' ? 'Apply' : 'Gunakan'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{tmpl.description}</p>
                    <div className="mt-2 text-[10px] text-slate-400 font-mono">
                      Metode: {tmpl.data.header.metode.split('(')[0]} | {tmpl.data.rows.length} {t.samplesCountBadge}
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
            className="px-4 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            {t.cancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
