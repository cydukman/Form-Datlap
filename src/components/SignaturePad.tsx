import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, UserCheck } from 'lucide-react';
import { FooterData } from '../types/datlap';
import { Language, getTranslation } from '../utils/i18n';

interface SignaturePadProps {
  data: FooterData['diverifikasiOleh'];
  onChange: (field: keyof FooterData['diverifikasiOleh'], value: string) => void;
  lang: Language;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ data, onChange, lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!data.signatureDataUrl);
  const t = getTranslation(lang);

  useEffect(() => {
    if (canvasRef.current && data.signatureDataUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = data.signatureDataUrl;
      }
    }
  }, []);

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
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasSignature(true);
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
      onChange('signatureDataUrl', canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange('signatureDataUrl', '');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs h-full flex flex-col overflow-hidden text-slate-800">
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
        <label className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.sigTitle}</span>
        </label>
        {hasSignature && (
          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>{t.sigSavedBadge}</span>
          </span>
        )}
      </div>

      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
            {t.sigNameLabel}:
          </label>
          <input
            type="text"
            value={data.nama}
            onChange={(e) => onChange('nama', e.target.value)}
            placeholder={t.sigNamePlaceholder}
            className="w-full px-2 py-1 text-xs bg-white rounded border border-slate-300 focus:border-emerald-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
            {t.sigPositionLabel}:
          </label>
          <input
            type="text"
            value={data.jabatan}
            onChange={(e) => onChange('jabatan', e.target.value)}
            placeholder={t.sigPositionPlaceholder}
            className="w-full px-2 py-1 text-xs bg-white rounded border border-slate-300 focus:border-emerald-500"
          />
        </div>

        {/* Signature Pad */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">
              {t.sigCanvasLabel}:
            </span>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-[10px] text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>{t.sigClearBtn}</span>
            </button>
          </div>

          <div className="flex-1 min-h-[90px] bg-white rounded border border-slate-300 relative overflow-hidden flex items-center justify-center touch-none">
            <canvas
              ref={canvasRef}
              width={260}
              height={90}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair"
            />
            {!hasSignature && (
              <span className="absolute text-[10px] text-slate-300 select-none pointer-events-none italic">
                {t.sigPlaceholder}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
