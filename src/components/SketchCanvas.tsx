import React, { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, RotateCcw, Upload, Image as ImageIcon, FileText, Check, MapPin } from 'lucide-react';

interface SketchCanvasProps {
  denahType: 'sketch' | 'upload' | 'text';
  denahDataUrl: string;
  denahText: string;
  onChangeType: (type: 'sketch' | 'upload' | 'text') => void;
  onChangeDataUrl: (url: string) => void;
  onChangeText: (text: string) => void;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({
  denahType,
  denahDataUrl,
  denahText,
  onChangeType,
  onChangeDataUrl,
  onChangeText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#1e293b');
  const [penWidth, setPenWidth] = useState(2);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize canvas with existing dataUrl if present
  useEffect(() => {
    if (denahType === 'sketch' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Setup initial background
        if (denahDataUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = denahDataUrl;
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Draw subtle grid lines
          ctx.strokeStyle = '#f1f5f9';
          ctx.lineWidth = 1;
          for (let x = 20; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          for (let y = 20; y < canvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
        }
      }
    }
  }, [denahType]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      onChangeDataUrl(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // redraw grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 20; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 20; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    onChangeDataUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangeDataUrl(event.target.result as string);
          onChangeType('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs h-full flex flex-col overflow-hidden text-slate-800">
      {/* Box Header & Mode Toggles */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
        <label className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Denah Lokasi & Titik Sampling</span>
        </label>
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => onChangeType('sketch')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              denahType === 'sketch' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Pen className="w-3 h-3" />
            <span>Gambar Sketsa</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeType('upload')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              denahType === 'upload' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload Foto</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeType('text')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              denahType === 'text' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Teks Deskripsi</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex-1 flex flex-col min-h-[160px]">
        {denahType === 'sketch' && (
          <div className="flex flex-col flex-1">
            {/* Toolbar for Sketch */}
            <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-semibold">Warna:</span>
                {['#1e293b', '#2563eb', '#dc2626', '#16a34a'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPenColor(c)}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      penColor === c ? 'ring-2 ring-emerald-500 scale-110' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <span className="text-slate-300 text-xs ml-1">|</span>
                <button
                  type="button"
                  onClick={() => setPenWidth(penWidth === 2 ? 4 : 2)}
                  className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
                >
                  Tebal: {penWidth}px
                </button>
              </div>
              <button
                type="button"
                onClick={clearCanvas}
                className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-red-600 hover:bg-red-50 flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Bersihkan</span>
              </button>
            </div>

            {/* Canvas Element */}
            <div className="flex-1 bg-white rounded border border-slate-300 overflow-hidden flex items-center justify-center relative touch-none">
              <canvas
                ref={canvasRef}
                width={480}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair"
              />
              <span className="absolute bottom-1 right-2 text-[9px] text-slate-400 select-none pointer-events-none">
                Gambarkan sketsa titik sampling di sini
              </span>
            </div>
          </div>
        )}

        {denahType === 'upload' && (
          <div className="flex flex-1 flex-col items-center justify-center p-3 bg-white rounded border border-dashed border-slate-300">
            {denahDataUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={denahDataUrl}
                  alt="Denah Lokasi Sampling"
                  className="max-h-[140px] max-w-full object-contain rounded border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => onChangeDataUrl('')}
                  className="mt-2 text-[10px] text-red-600 hover:underline"
                >
                  Hapus Foto Denah
                </button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600">Unggah foto denah lokasi / layout pabrik / peta sampling</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih Gambar Denah</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        )}

        {denahType === 'text' && (
          <textarea
            value={denahText}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Deskripsikan letak titik pengambilan contoh uji secara rinci (Contoh: Titik 1 berada di bak equalisasi 10m dari gerbang timur; Titik 2 di saluran drainase outlet WWTP setelah clarifier)..."
            className="w-full flex-1 p-2 text-xs bg-white rounded border border-slate-300 focus:border-emerald-500 resize-none"
          />
        )}
      </div>
    </div>
  );
};
