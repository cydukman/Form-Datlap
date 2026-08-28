import { DatlapDocument } from '../types/datlap';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export function exportToCSV(doc: DatlapDocument): void {
  const headers = [
    'No',
    'LAB ID',
    'Titik Sampling (Wajib)',
    'Jam (Wajib)',
    'Titik Koordinat N/S (Wajib)',
    'Titik Koordinat E (Wajib)',
    'Temperatur (°C)',
    'pH',
    'Klorin Bebas (abs/mg/L)',
    'DO (mg/L)',
    'Kecerahan (m)',
    `DHL (${doc.paramsConfig.dhlUnit})`,
    'Lapisan Minyak',
    'Kekeruhan (NTU)',
    'Teknik Sampling',
  ];

  const metadataRows = [
    ['FORMULIR PENGAMBILAN CONTOH UJI AIR OLEH PELANGGAN'],
    ['No. Dokumen', doc.docCode, 'Tgl Terbit', doc.tanggalTerbit, 'Revisi', doc.terbitRevisi],
    [''],
    ['NO. SURAT PENGANTAR', doc.header.noSuratPengantar],
    ['NAMA PELANGGAN', doc.header.namaPelanggan],
    ['ALAMAT', doc.header.alamat],
    ['NARAHUBUNG', doc.header.narahubung],
    ['TANGGAL SAMPLING', doc.header.tanggal],
    ['METODE', doc.header.metode],
    ['CATATAN', doc.header.catatan],
    ['KONDISI CUACA / LINGKUNGAN', doc.footer.kondisiLingkunganCuaca],
    ['VERIFIKATOR', doc.footer.diverifikasiOleh.nama || '-'],
    [''],
  ];

  const tableRows = doc.rows.map((row, idx) => [
    (idx + 1).toString(),
    `"${row.labId || ''}"`,
    `"${row.titikSampling || ''}"`,
    `"${row.jam || ''}"`,
    `"${row.koordinatNS || ''}"`,
    `"${row.koordinatE || ''}"`,
    `"${row.temperatur || ''}"`,
    `"${row.pH || ''}"`,
    `"${row.klorinBebas || ''}"`,
    `"${row.doVal || ''}"`,
    `"${row.kecerahan || ''}"`,
    `"${row.dhl || ''}"`,
    `"${row.lapisanMinyak || ''}"`,
    `"${row.kekeruhan || ''}"`,
    `"${row.teknikSampling || ''}"`,
  ]);

  const csvContent = [
    ...metadataRows.map(r => r.join(',')),
    headers.join(','),
    ...tableRows.map(r => r.join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeCustomerName = (doc.header.namaPelanggan || 'Pelanggan').replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `DATLAP_ANKAL_${safeCustomerName}_${doc.header.tanggal || 'sample'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(doc: DatlapDocument): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(doc, null, 2));
  const downloadAnchor = document.createElement('a');
  const safeCustomerName = (doc.header.namaPelanggan || 'Pelanggan').replace(/[^a-zA-Z0-9]/g, '_');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `DATLAP_BACKUP_${safeCustomerName}_${doc.header.tanggal || 'sample'}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Generate and download high-resolution A4 Landscape PDF directly from DOM sheet
 */
export async function exportToPDF(
  doc: DatlapDocument,
  elementId: string = 'official-form-sheet'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // Generate high-resolution PNG using html-to-image (browser-native rendering, fully supporting all CSS colors)
    const imgData = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2.5, // Crisp high-DPI rendering for fine borders and text
      backgroundColor: '#ffffff',
      cacheBust: true,
    });
    
    // A4 Landscape dimensions in mm: 297 x 210
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add margin (6mm)
    const margin = 6;
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    const imgProps = pdf.getImageProperties(imgData);
    const aspect = imgProps.width / imgProps.height;

    let finalWidth = availableWidth;
    let finalHeight = availableWidth / aspect;

    if (finalHeight > availableHeight) {
      finalHeight = availableHeight;
      finalWidth = availableHeight * aspect;
    }

    const posX = margin + (availableWidth - finalWidth) / 2;
    const posY = margin + (availableHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'PNG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');

    const safeCustomerName = (doc.header.namaPelanggan || 'Pelanggan').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `DATLAP_ANKAL_${safeCustomerName}_${doc.header.tanggal || 'sample'}.pdf`;
    
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF via html-to-image/jsPDF:', error);
    // Fallback to window.print if needed
    window.print();
    return false;
  }
}

export function triggerPrintDialog(): void {
  try {
    window.print();
  } catch (e) {
    console.error('Error invoking window.print:', e);
  }
}

