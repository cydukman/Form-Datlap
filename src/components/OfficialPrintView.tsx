import React, { useState } from 'react';
import { DatlapDocument } from '../types/datlap';
import { Printer, ArrowLeft, Download, FileDown, Loader2, CheckCircle2, Info, FileSpreadsheet, Layers } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF, triggerPrintDialog } from '../utils/exportUtils';
import { formatPhValue } from '../utils/phUtils';

interface OfficialPrintViewProps {
  doc: DatlapDocument;
  onBackToEditor: () => void;
}

const SAMPLES_PER_FORM = 12;

export const OfficialPrintView: React.FC<OfficialPrintViewProps> = ({
  doc,
  onBackToEditor,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // 1 Form = 12 Samples limitation
  const totalPages = Math.max(1, Math.ceil(doc.rows.length / SAMPLES_PER_FORM));

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfSuccess(false);
    try {
      const success = await exportToPDF(doc, 'official-form-page');
      if (success) {
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-900 overflow-y-auto p-4 md:p-6 text-slate-900 flex flex-col items-center">
      {/* Top action bar when in preview screen (Hidden when printing) */}
      <div className="w-full max-w-5xl mb-3 bg-slate-800 text-white p-3 rounded-lg border border-slate-700 shadow-md flex flex-wrap justify-between items-center gap-3 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToEditor}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Editor</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-300 font-medium">
              Pratinjau Format Resmi ANKAL (AKL-FO-7.3-36)
            </span>
            <span className="text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {totalPages} Formulir ({doc.rows.length} Sampel • 12/Form)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportToExcel(doc)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Download formulir resmi lengkap dalam format Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => exportToCSV(doc)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download data tabel dalam format spreadsheet CSV"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={triggerPrintDialog}
            className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-600 cursor-pointer"
            title="Cetak langsung ke mesin printer fisik atau gunakan dialog cetak browser"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cetak Printer</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white rounded-md text-xs font-bold shadow-md flex items-center gap-2 transition-colors cursor-pointer"
            title="Download dokumen formulir ini sebagai file .PDF resmi langsung ke perangkat"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Membuat File PDF...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>PDF Terunduh!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-white" />
                <span>Unduh File PDF Resmi (.pdf)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helper Banner */}
      <div className="w-full max-w-5xl mb-4 bg-sky-950/70 border border-sky-600/40 text-sky-200 text-xs px-3 py-2 rounded flex items-center justify-between no-print gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong>Standar Formulir ANKAL:</strong> Kapasitas 1 formulir adalah <strong>12 sampel</strong>. Dokumen Anda otomatis diatur menjadi <strong>{totalPages} formulir/halaman</strong> ({doc.rows.length} total sampel).
          </span>
        </div>
      </div>

      {/* Render Each Form Page (1 Form = 12 Samples) */}
      {Array.from({ length: totalPages }).map((_, pageIdx) => {
        const pageStart = pageIdx * SAMPLES_PER_FORM;
        const pageEnd = pageStart + SAMPLES_PER_FORM;
        const pageRows = doc.rows.slice(pageStart, pageEnd);

        // Always ensure exactly 12 row slots per printed page
        const slotsToDisplay = Array.from({ length: SAMPLES_PER_FORM }).map((_, slotIdx) => {
          const actualRow = pageRows[slotIdx];
          const globalNumber = pageStart + slotIdx + 1;
          return {
            actualRow,
            globalNumber,
            isFilled: Boolean(actualRow),
          };
        });

        return (
          <div
            key={`page-${pageIdx}`}
            id={pageIdx === 0 ? 'official-form-sheet' : `official-form-sheet-${pageIdx}`}
            className="official-form-page w-full max-w-5xl bg-white p-4 md:p-6 rounded shadow-xl border border-slate-300 print-container font-sans text-[11px] leading-tight mb-8 last:mb-0 page-break"
            style={{ minHeight: '680px' }}
          >
            {/* Page Header Indicator (screen only) */}
            {totalPages > 1 && (
              <div className="mb-2 pb-1 border-b border-slate-200 flex justify-between items-center text-[11px] text-slate-500 font-semibold no-print">
                <span>Formulir Halaman {pageIdx + 1} dari {totalPages}</span>
                <span>Sampel No. {pageStart + 1} - {Math.min(pageEnd, Math.max(pageStart + 12, doc.rows.length))}</span>
              </div>
            )}

            {/* DOCUMENT HEADER BOX (Matching exact ANKAL 3-Column Header) */}
            <div className="border border-black flex mb-2">
              {/* Logo ANKAL Box */}
              <div className="w-[18%] border-r border-black p-2 flex items-center justify-center bg-white">
                <span className="text-2xl font-black tracking-tighter text-emerald-600 font-sans">
                  ANKAL
                </span>
              </div>

              {/* Center Title & Rev Box */}
              <div className="w-[57%] border-r border-black flex flex-col">
                <div className="border-b border-black text-center py-1 font-bold text-xs">
                  FORMULIR
                </div>
                <div className="border-b border-black text-center py-1.5 font-bold text-[11px] uppercase tracking-wide">
                  PENGAMBILAN CONTOH UJI AIR OLEH PELANGGAN
                </div>
                <div className="grid grid-cols-2 text-[9px] flex-1">
                  <div className="border-r border-black px-2 py-0.5 text-center">
                    <span className="font-semibold">Tanggal Terbit</span><br />
                    <span>{doc.tanggalTerbit || '-'}</span>
                  </div>
                  <div className="px-2 py-0.5 text-center">
                    <span className="font-semibold">Terbit/Revisi</span><br />
                    <span>{doc.terbitRevisi || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Right Doc Code Box */}
              <div className="w-[25%] p-1.5 flex flex-col justify-between text-[9px]">
                <div className="text-right italic">
                  Halaman {pageIdx + 1} dari {totalPages}
                </div>
                <div className="my-0.5">
                  <span className="font-semibold">No:</span><br />
                  <span className="font-bold text-[10px] font-mono">{doc.docCode || 'AKL-FO-7.3-36'}</span>
                </div>
                <div>
                  <span className="font-semibold">Tanggal Berlaku</span><br />
                  <span>{doc.tanggalBerlaku || '-'}</span>
                </div>
              </div>
            </div>

            {/* CUSTOMER IDENTIFICATION & CATATAN BOX */}
            <div className="flex gap-2 mb-2 items-stretch">
              {/* Left: Customer Metadata */}
              <div className="w-[65%] border border-black text-[10px]">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-40 px-2 py-0.5 font-bold uppercase bg-slate-50 text-slate-900 border-r border-black">
                        NAMA PELANGGAN
                      </td>
                      <td className="px-2 py-0.5 font-bold">
                        {doc.header.namaPelanggan || '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="px-2 py-0.5 font-bold uppercase bg-slate-50 text-slate-900 border-r border-black">
                        ALAMAT
                      </td>
                      <td className="px-2 py-0.5 font-medium">
                        {doc.header.alamat || '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="px-2 py-0.5 font-bold uppercase bg-slate-50 text-slate-900 border-r border-black">
                        NARAHUBUNG
                      </td>
                      <td className="px-2 py-0.5 font-medium">
                        {doc.header.narahubung || '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="px-2 py-0.5 font-bold uppercase bg-slate-50 text-slate-900 border-r border-black">
                        TANGGAL SAMPLING
                      </td>
                      <td className="px-2 py-0.5 font-medium">
                        {doc.header.tanggal || '-'}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-0.5 font-bold uppercase bg-slate-50 text-slate-900 border-r border-black">
                        METODE
                      </td>
                      <td className="px-2 py-0.5 font-medium">
                        {doc.header.metode || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right: Catatan Box */}
              <div className="w-[35%] border border-black p-1.5 flex flex-col justify-between text-[10px]">
                <div>
                  <span className="font-bold">Catatan:</span>
                  <p className="mt-1 text-slate-800 whitespace-pre-wrap leading-tight text-[9.5px]">
                    {doc.header.catatan || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* MAIN DATA LAPANGAN TABLE (Exactly 12 Rows per Form) */}
            <div className="mb-2 overflow-hidden">
              <table className="w-full border-collapse border border-black text-center text-[9px] official-form-table">
                <thead>
                  {/* Main Column Headers */}
                  <tr className="font-bold bg-slate-50">
                    <th rowSpan={2} className="border border-black px-1 py-1 w-6 text-center">
                      No
                    </th>
                    <th rowSpan={2} className="border border-black px-1 py-1 font-bold w-16 bg-slate-50 text-slate-900 text-center">
                      LAB ID
                    </th>
                    <th rowSpan={2} className="border border-black px-1.5 py-1 font-bold w-40 bg-slate-50 text-slate-900">
                      Titik Sampling
                    </th>
                    <th rowSpan={2} className="border border-black px-1 py-1 font-bold w-14 bg-slate-50 text-slate-900">
                      Jam
                    </th>
                    <th colSpan={2} className="border border-black px-1 py-0.5 font-bold bg-slate-50 text-slate-900">
                      Titik Koordinat
                    </th>
                    <th className="border border-black px-1 py-0.5 w-14 font-semibold">
                      Temperatur
                    </th>
                    <th className="border border-black px-1 py-0.5 w-12 font-semibold">
                      pH
                    </th>
                    <th className="border border-black px-1 py-0.5 w-14 font-semibold">
                      Klorin Bebas
                    </th>
                    <th className="border border-black px-1 py-0.5 w-12 font-semibold">
                      DO
                    </th>
                    <th className="border border-black px-1 py-0.5 w-12 font-semibold">
                      Kecerahan
                    </th>
                    <th className="border border-black px-1 py-0.5 w-14 font-semibold">
                      DHL
                    </th>
                    <th className="border border-black px-1 py-0.5 w-16 font-semibold">
                      Lapisan Minyak
                    </th>
                    <th className="border border-black px-1 py-0.5 w-14 font-semibold">
                      Kekeruhan
                    </th>
                    <th rowSpan={2} className="border border-black px-1 py-1 w-20 font-semibold">
                      Teknik Sampling
                    </th>
                  </tr>

                  {/* Units Row */}
                  <tr className="font-normal text-[8.5px] bg-slate-50">
                    <th className="border border-black px-1 py-0.5 font-bold w-18 bg-slate-50 text-slate-900">
                      N/S
                    </th>
                    <th className="border border-black px-1 py-0.5 font-bold w-18 bg-slate-50 text-slate-900">
                      E
                    </th>
                    <th className="border border-black px-0.5 py-0.5">( °c )</th>
                    <th className="border border-black px-0.5 py-0.5">-</th>
                    <th className="border border-black px-0.5 py-0.5">(abs)</th>
                    <th className="border border-black px-0.5 py-0.5">(mg/L)</th>
                    <th className="border border-black px-0.5 py-0.5">( m)</th>
                    <th className="border border-black px-0.5 py-0.5">({doc.paramsConfig?.dhlUnit || 'mS/cm'})</th>
                    <th className="border border-black px-0.5 py-0.5">-</th>
                    <th className="border border-black px-0.5 py-0.5">(NTU)</th>
                  </tr>
                </thead>

                <tbody>
                  {slotsToDisplay.map(({ actualRow, globalNumber }) => {
                    return (
                      <tr key={`row-${globalNumber}`} className="h-5">
                        <td className="border border-black px-1 py-0.5 text-center font-mono text-[8.5px]">
                          {globalNumber}
                        </td>
                        <td className="border border-black px-1 py-0.5 text-center font-mono text-[8.5px] truncate">
                          {actualRow?.labId || ''}
                        </td>
                        <td className="border border-black px-1.5 py-0.5 text-left font-medium leading-tight break-words whitespace-normal max-w-[150px]">
                          {actualRow?.titikSampling || ''}
                        </td>
                        <td className="border border-black px-1 py-0.5 font-mono text-[8.5px] text-center whitespace-nowrap">
                          {actualRow?.jam || ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 font-mono text-[7px] leading-tight text-center break-words whitespace-normal max-w-[75px]">
                          {actualRow?.koordinatNS || ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 font-mono text-[7px] leading-tight text-center break-words whitespace-normal max-w-[75px]">
                          {actualRow?.koordinatE || ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 font-mono text-[8.5px]">
                          {actualRow?.temperatur || ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 font-mono text-[8.5px] font-bold">
                          {actualRow?.pH ? formatPhValue(actualRow.pH) : ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 font-mono text-[8.5px]">
                          {actualRow?.klorinBebas || ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 font-mono text-[8.5px]">
                          {actualRow?.doVal || ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 font-mono text-[8.5px]">
                          {actualRow?.kecerahan || ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 font-mono text-[8.5px]">
                          {actualRow?.dhl || ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 text-[8px] truncate max-w-[60px]">
                          {actualRow?.lapisanMinyak || ''}
                        </td>
                        <td className="border border-black px-0.5 py-0.5 font-mono text-[8.5px]">
                          {actualRow?.kekeruhan || ''}
                        </td>
                        <td className="border border-black px-1 py-0.5 text-[8px] text-left truncate max-w-[75px]">
                          {actualRow?.teknikSampling || ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* BOTTOM 3 BOXES (Matching Form: Denah Lokasi, Kondisi Lingkungan/Cuaca, Diverifikasi Oleh) */}
            <div className="grid grid-cols-12 gap-2 text-[9.5px]">
              {/* Box 1: Denah Lokasi dan Titik Pengambilan Contoh Uji */}
              <div className="col-span-5 border border-black p-1.5 flex flex-col min-h-[95px]">
                <span className="font-bold text-[9px]">Denah Lokasi dan Titik Pengambilan Contoh Uji:</span>
                <div className="flex-1 flex items-center justify-center mt-1 overflow-hidden">
                  {doc.footer.denahType === 'sketch' && doc.footer.denahDataUrl ? (
                    <img
                      src={doc.footer.denahDataUrl}
                      alt="Denah Lokasi"
                      className="max-h-[75px] max-w-full object-contain"
                    />
                  ) : doc.footer.denahType === 'upload' && doc.footer.denahDataUrl ? (
                    <img
                      src={doc.footer.denahDataUrl}
                      alt="Denah Foto"
                      className="max-h-[75px] max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-[8.5px] text-slate-700 italic leading-tight p-1">
                      {doc.footer.denahText || '(Sketsa titik sampling terlampir / diplot sesuai koordinat GPS)'}
                    </p>
                  )}
                </div>
              </div>

              {/* Box 2: Kondisi Lingkungan/Cuaca */}
              <div className="col-span-4 border border-black p-1.5 flex flex-col min-h-[95px]">
                <span className="font-bold text-[9px]">Kondisi Lingkungan/Cuaca:</span>
                <p className="flex-1 text-[9px] text-slate-800 mt-1 whitespace-pre-wrap leading-tight">
                  {doc.footer.kondisiLingkunganCuaca || '-'}
                </p>
              </div>

              {/* Box 3: Diverifikasi oleh */}
              <div className="col-span-3 border border-black p-1.5 flex flex-col justify-between min-h-[95px] text-center">
                <span className="font-bold text-[9px] text-left">Diverifikasi oleh,</span>
                
                <div className="flex items-center justify-center my-0.5 h-9">
                  {doc.footer.diverifikasiOleh.signatureDataUrl ? (
                    <img
                      src={doc.footer.diverifikasiOleh.signatureDataUrl}
                      alt="Signature"
                      className="max-h-9 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-[8px] text-slate-400 italic">(Tanda Tangan)</span>
                  )}
                </div>

                <div className="border-t border-dotted border-black pt-0.5 text-[8.5px]">
                  <span className="font-bold underline block">
                    {doc.footer.diverifikasiOleh.nama || '(Nama Jelas & Cap)'}
                  </span>
                  <span className="text-[8px] text-slate-600 block">
                    {doc.footer.diverifikasiOleh.jabatan || 'Pengambil Sampel'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
