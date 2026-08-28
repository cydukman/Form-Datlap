import { DatlapDocument } from '../types/datlap';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import ExcelJS from 'exceljs';
import { formatPhValue } from './phUtils';

/**
 * Export data to standard CSV spreadsheet with LAB ID and 2-decimal pH
 */
export function exportToCSV(doc: DatlapDocument): void {
  const headers = [
    'No',
    'LAB ID',
    'Titik Sampling (Wajib)',
    'Jam (Wajib)',
    'Titik Koordinat N/S (Wajib)',
    'Titik Koordinat E (Wajib)',
    'Temperatur (°C)',
    'pH (std)',
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
    `"${formatPhValue(row.pH) || ''}"`,
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

/**
 * Export data to Official Form Styled Excel (.xlsx) file
 * Replicates the complete official layout of ANKAL (AKL-FO-7.3-36) with full cell borders and exact table formatting
 * 1 Form = 12 Samples limitation: automatically creates a clean form sheet for every 12 samples
 */
export async function exportToExcel(doc: DatlapDocument): Promise<void> {
  const SAMPLES_PER_FORM = 12;
  const totalPages = Math.max(1, Math.ceil(doc.rows.length / SAMPLES_PER_FORM));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ANKAL';
  workbook.lastModifiedBy = 'ANKAL';
  workbook.created = new Date();

  // Define full black thin border
  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } },
  };

  const headerFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8FAFC' }
  };

  const tableHeaderFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF1F5F9' }
  };

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const sheetName = totalPages === 1 ? 'Formulir Datlap' : `Formulir Hal ${pageIdx + 1}`;
    const ws = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: true }],
      pageSetup: { orientation: 'landscape', paperSize: 9 }
    });

    // Helper to apply border, fill, font, and alignment to a 2D range of cells
    const formatCellRange = (
      startRow: number, startCol: number,
      endRow: number, endCol: number,
      options?: {
        border?: boolean;
        fill?: ExcelJS.Fill;
        font?: Partial<ExcelJS.Font>;
        alignment?: Partial<ExcelJS.Alignment>;
      }
    ) => {
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const cell = ws.getCell(r, c);
          if (options?.border !== false) cell.border = thinBorder;
          if (options?.fill) cell.fill = options.fill;
          if (options?.font) cell.font = { name: 'Arial', ...options.font };
          if (options?.alignment) cell.alignment = options.alignment;
        }
      }
    };

    // Set Column Widths (Cols A - O = 1 - 15)
    ws.columns = [
      { key: 'no', width: 5 },        // A
      { key: 'labId', width: 16 },     // B
      { key: 'titik', width: 30 },     // C
      { key: 'jam', width: 14 },       // D
      { key: 'ns', width: 18 },        // E
      { key: 'e', width: 18 },         // F
      { key: 'temp', width: 14 },      // G
      { key: 'ph', width: 12 },        // H
      { key: 'klorin', width: 15 },    // I
      { key: 'do', width: 12 },        // J
      { key: 'kecerahan', width: 13 }, // K
      { key: 'dhl', width: 15 },       // L
      { key: 'minyak', width: 15 },    // M
      { key: 'kekeruhan', width: 15 }, // N
      { key: 'teknik', width: 18 },    // O
    ];

    // 1. KOP FORMULIR (Matching exact 3-box Header: ANKAL, FORMULIR, NO DOC)
    // Left Box: ANKAL Logo
    ws.mergeCells('A1:B4');
    const cellA1 = ws.getCell('A1');
    cellA1.value = 'ANKAL';
    cellA1.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FF059669' } };
    cellA1.alignment = { horizontal: 'center', vertical: 'middle' };

    // Center Box: Title & Revision
    ws.mergeCells('C1:L1');
    const cellC1 = ws.getCell('C1');
    cellC1.value = 'FORMULIR';
    cellC1.font = { name: 'Arial', size: 11, bold: true };
    cellC1.alignment = { horizontal: 'center', vertical: 'middle' };

    ws.mergeCells('C2:L2');
    const cellC2 = ws.getCell('C2');
    cellC2.value = 'PENGAMBILAN CONTOH UJI AIR OLEH PELANGGAN';
    cellC2.font = { name: 'Arial', size: 10, bold: true };
    cellC2.alignment = { horizontal: 'center', vertical: 'middle' };

    ws.mergeCells('C3:G4');
    const cellC3 = ws.getCell('C3');
    cellC3.value = `Tanggal Terbit\n${doc.tanggalTerbit || '-'}`;
    cellC3.font = { name: 'Arial', size: 8.5 };
    cellC3.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    ws.mergeCells('H3:L4');
    const cellH3 = ws.getCell('H3');
    cellH3.value = `Terbit/Revisi\n${doc.terbitRevisi || '-'}`;
    cellH3.font = { name: 'Arial', size: 8.5 };
    cellH3.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Right Box: Halaman & Doc Code
    ws.mergeCells('M1:O1');
    const cellM1 = ws.getCell('M1');
    cellM1.value = `Halaman ${pageIdx + 1} dari ${totalPages}`;
    cellM1.font = { name: 'Arial', size: 8.5, italic: true };
    cellM1.alignment = { horizontal: 'right', vertical: 'middle' };

    ws.mergeCells('M2:O4');
    const cellM2 = ws.getCell('M2');
    cellM2.value = `No:\n${doc.docCode || 'AKL-FO-7.3-36'}`;
    cellM2.font = { name: 'Arial', size: 9.5, bold: true };
    cellM2.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Apply borders to Kop section (A1..O4)
    formatCellRange(1, 1, 4, 15, { border: true });

    // 2. CUSTOMER & SAMPLING METADATA (Rows 6 to 10)
    // Left column: Customer info (A..H)
    ws.mergeCells('A6:H6');
    const cellA6 = ws.getCell('A6');
    cellA6.value = `Nama Pelanggan  :  ${doc.header.namaPelanggan || '-'}`;
    cellA6.font = { name: 'Arial', size: 9.5, bold: true };
    cellA6.alignment = { horizontal: 'left', vertical: 'middle' };

    ws.mergeCells('A7:H7');
    const cellA7 = ws.getCell('A7');
    cellA7.value = `Alamat                 :  ${doc.header.alamat || '-'}`;
    cellA7.font = { name: 'Arial', size: 9 };
    cellA7.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

    ws.mergeCells('A8:H8');
    const cellA8 = ws.getCell('A8');
    cellA8.value = `Narahubung         :  ${doc.header.narahubung || '-'}`;
    cellA8.font = { name: 'Arial', size: 9 };
    cellA8.alignment = { horizontal: 'left', vertical: 'middle' };

    ws.mergeCells('A9:H9');
    const cellA9 = ws.getCell('A9');
    cellA9.value = `Tanggal Sampling :  ${doc.header.tanggal || '-'}`;
    cellA9.font = { name: 'Arial', size: 9 };
    cellA9.alignment = { horizontal: 'left', vertical: 'middle' };

    ws.mergeCells('A10:H10');
    const cellA10 = ws.getCell('A10');
    cellA10.value = `Metode                 :  ${doc.header.metode || '-'}`;
    cellA10.font = { name: 'Arial', size: 9 };
    cellA10.alignment = { horizontal: 'left', vertical: 'middle' };

    // Right column: Catatan Box (I..O, rows 6-10)
    ws.mergeCells('I6:O10');
    const cellI6 = ws.getCell('I6');
    cellI6.value = `Catatan:\n${doc.header.catatan || '-'}`;
    cellI6.font = { name: 'Arial', size: 9 };
    cellI6.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };

    formatCellRange(6, 1, 10, 15, { border: true, fill: headerFill });

    // 3. MAIN DATA TABLE (Rows 12 & 13 = Headers, Row 14 onwards = 12 Rows)
    // Super Header 1 (Row 12)
    ws.mergeCells('A12:A13');
    ws.getCell('A12').value = 'No';

    ws.mergeCells('B12:B13');
    ws.getCell('B12').value = 'LAB ID';

    ws.mergeCells('C12:C13');
    ws.getCell('C12').value = 'Titik Sampling';

    ws.mergeCells('D12:D13');
    ws.getCell('D12').value = 'Jam';

    ws.mergeCells('E12:F12');
    ws.getCell('E12').value = 'Titik Koordinat';

    ws.mergeCells('G12:N12');
    ws.getCell('G12').value = 'Parameter In-Situ (Sesuai Permintaan Pengujian)';

    ws.mergeCells('O12:O13');
    ws.getCell('O12').value = 'Teknik Sampling';

    // Sub Header 2 (Row 13)
    ws.getCell('E13').value = 'N / S';
    ws.getCell('F13').value = 'E';
    ws.getCell('G13').value = 'Temperatur\n( °C )';
    ws.getCell('H13').value = 'pH\n( - )';
    ws.getCell('I13').value = 'Klorin Bebas\n(abs)';
    ws.getCell('J13').value = 'DO\n(mg/L)';
    ws.getCell('K13').value = 'Kecerahan\n( m )';
    ws.getCell('L13').value = `DHL\n(${doc.paramsConfig.dhlUnit || 'mS/cm'})`;
    ws.getCell('M13').value = 'Lapisan Minyak\n( - )';
    ws.getCell('N13').value = 'Kekeruhan\n(NTU)';

    formatCellRange(12, 1, 13, 15, {
      border: true,
      fill: tableHeaderFill,
      font: { name: 'Arial', size: 8.5, bold: true },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }
    });

    ws.getRow(12).height = 20;
    ws.getRow(13).height = 26;

    // Exactly 12 Data Rows per form (Row 14 to 25)
    for (let slotIdx = 0; slotIdx < SAMPLES_PER_FORM; slotIdx++) {
      const rowNum = 14 + slotIdx;
      const globalIdx = pageIdx * SAMPLES_PER_FORM + slotIdx;
      const r = doc.rows[globalIdx];
      const globalNo = globalIdx + 1;

      ws.getCell(`A${rowNum}`).value = globalNo;
      ws.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`B${rowNum}`).value = r?.labId || '';
      ws.getCell(`B${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`C${rowNum}`).value = r?.titikSampling || '';
      ws.getCell(`C${rowNum}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

      ws.getCell(`D${rowNum}`).value = r?.jam || '';
      ws.getCell(`D${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`E${rowNum}`).value = r?.koordinatNS || '';
      ws.getCell(`E${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      ws.getCell(`E${rowNum}`).font = { name: 'Arial', size: 8 };

      ws.getCell(`F${rowNum}`).value = r?.koordinatE || '';
      ws.getCell(`F${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      ws.getCell(`F${rowNum}`).font = { name: 'Arial', size: 8 };

      ws.getCell(`G${rowNum}`).value = r?.temperatur || '';
      ws.getCell(`G${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`H${rowNum}`).value = r?.pH ? formatPhValue(r.pH) : '';
      ws.getCell(`H${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };
      ws.getCell(`H${rowNum}`).font = { name: 'Arial', size: 9, bold: true };

      ws.getCell(`I${rowNum}`).value = r?.klorinBebas || '';
      ws.getCell(`I${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`J${rowNum}`).value = r?.doVal || '';
      ws.getCell(`J${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`K${rowNum}`).value = r?.kecerahan || '';
      ws.getCell(`K${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`L${rowNum}`).value = r?.dhl || '';
      ws.getCell(`L${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`M${rowNum}`).value = r?.lapisanMinyak || '';
      ws.getCell(`M${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`N${rowNum}`).value = r?.kekeruhan || '';
      ws.getCell(`N${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };

      ws.getCell(`O${rowNum}`).value = r?.teknikSampling || '';
      ws.getCell(`O${rowNum}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

      formatCellRange(rowNum, 1, rowNum, 15, {
        border: true,
        font: { name: 'Arial', size: 9 },
      });

      ws.getRow(rowNum).height = 22;
    }

    // 4. FOOTER 3-BOXES (Denah Lokasi, Kondisi Lingkungan/Cuaca, Diverifikasi Oleh)
    const footStart = 14 + SAMPLES_PER_FORM + 1;
    const footEnd = footStart + 4;

    // Box 1: Denah Lokasi (Cols A..E)
    ws.mergeCells(`A${footStart}:E${footEnd}`);
    const cellFoot1 = ws.getCell(`A${footStart}`);
    cellFoot1.value = `Denah Lokasi dan Titik Pengambilan Contoh Uji:\n\n${doc.footer.denahText || '(Sketsa titik sampling terlampir / diplot sesuai koordinat GPS)'}`;
    cellFoot1.font = { name: 'Arial', size: 8.5 };
    cellFoot1.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };

    // Box 2: Kondisi Cuaca (Cols F..J)
    ws.mergeCells(`F${footStart}:J${footEnd}`);
    const cellFoot2 = ws.getCell(`F${footStart}`);
    cellFoot2.value = `Kondisi Lingkungan / Cuaca:\n\n${doc.footer.kondisiLingkunganCuaca || '-'}`;
    cellFoot2.font = { name: 'Arial', size: 8.5 };
    cellFoot2.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };

    // Box 3: Diverifikasi Oleh (Cols K..O)
    ws.mergeCells(`K${footStart}:O${footEnd}`);
    const cellFoot3 = ws.getCell(`K${footStart}`);
    cellFoot3.value = `Diverifikasi oleh,\n\n\n( ${doc.footer.diverifikasiOleh.nama || '................................'} )\n${doc.footer.diverifikasiOleh.jabatan || 'Pengambil Sampel'}`;
    cellFoot3.font = { name: 'Arial', size: 8.5 };
    cellFoot3.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };

    formatCellRange(footStart, 1, footEnd, 15, { border: true });
  }

  // Generate buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeCustomerName = (doc.header.namaPelanggan || 'Pelanggan').replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `DATLAP_ANKAL_${safeCustomerName}_${doc.header.tanggal || 'sample'}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(doc: DatlapDocument): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(doc, null, 2));
  const downloadAnchor = document.createElement('a');
  const safeCustomerName = (doc.header.namaPelanggan || 'Pelanggan').replace(/[^a-zA-Z0-9]/g, '_');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `DATLAP_BACKUP_${safeCustomerName}_${doc.header.tanggal || 'sample'}.json`);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Generate and download high-resolution A4 Landscape PDF directly from DOM sheet
 * Supports multi-page forms (1 form = 12 samples)
 */
export async function exportToPDF(
  doc: DatlapDocument,
  elementClassOrId: string = 'official-form-page'
): Promise<boolean> {
  let elements: HTMLElement[] = Array.from(document.querySelectorAll(`.${elementClassOrId}`));
  if (elements.length === 0) {
    const single = document.getElementById(elementClassOrId);
    if (single) {
      elements = [single];
    } else {
      const fallback = document.getElementById('official-form-sheet');
      if (fallback) elements = [fallback];
    }
  }

  if (elements.length === 0) {
    console.error(`No printable elements found for selector ${elementClassOrId}`);
    return false;
  }

  try {
    // A4 Landscape dimensions in mm: 297 x 210
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = 6;
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (i > 0) {
        pdf.addPage('a4', 'landscape');
      }

      const imgData = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2.5, // Crisp high-DPI rendering for fine borders and text
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

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
    }

    const safeCustomerName = (doc.header.namaPelanggan || 'Pelanggan').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `DATLAP_ANKAL_${safeCustomerName}_${doc.header.tanggal || 'sample'}.pdf`;
    
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF via html-to-image/jsPDF:', error);
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
