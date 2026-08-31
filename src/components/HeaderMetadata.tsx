import React, { useState } from 'react';
import { 
  Save, 
  Sliders, 
  Sparkles, 
  FolderOpen, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp,
  Globe
} from 'lucide-react';
import { DatlapDocument } from '../types/datlap';
import { Language, LANGUAGE_OPTIONS, getTranslation } from '../utils/i18n';

interface HeaderMetadataProps {
  doc: DatlapDocument;
  viewMode: 'editor' | 'printPreview';
  setViewMode: (mode: 'editor' | 'printPreview') => void;
  onOpenParamConfig: () => void;
  onOpenTemplates: () => void;
  onOpenDrafts: () => void;
  onSaveDraft: () => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
  auditPass?: boolean;
  totalErrors?: number;
}

export const HeaderMetadata: React.FC<HeaderMetadataProps> = ({
  doc,
  onOpenParamConfig,
  onOpenTemplates,
  onOpenDrafts,
  onSaveDraft,
  lang,
  onSelectLang,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const t = getTranslation(lang);
  const currentLangObj = LANGUAGE_OPTIONS.find(l => l.code === lang) || LANGUAGE_OPTIONS[0];

  return (
    <header className="bg-[#1e293b] text-white border-b border-slate-700 shadow-md select-none shrink-0 no-print sticky top-0 z-40">
      {/* Top Banner with ANKAL Brand and Document Info */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-base tracking-tighter shadow-inner shrink-0">
            A
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-extrabold tracking-tight text-white text-sm sm:text-base font-sans shrink-0">
                ANKAL
              </span>
              <h1 className="text-[11px] sm:text-xs font-bold tracking-wide text-emerald-400 uppercase truncate">
                {t.appTitle}
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Selector Dropdown (Desktop & Tablet) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              title={t.langSelect}
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden sm:inline font-semibold">{currentLangObj.nativeName}</span>
              <span className="sm:hidden font-bold">{currentLangObj.shortLabel}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>{t.langSelect}</span>
                  </div>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => {
                        onSelectLang(option.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                        lang === option.code ? 'bg-emerald-950/60 text-emerald-400 font-bold' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{option.flag}</span>
                        <span>{option.nativeName}</span>
                      </div>
                      {lang === option.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      )}
                    </button>
                  ))}
                  <div className="px-3 py-1.5 border-t border-slate-800 text-[9px] text-slate-400 leading-tight">
                    {t.formLanguageNotice}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Doc Code Badge */}
          <div className="hidden sm:block border border-emerald-700/70 bg-emerald-950/50 text-emerald-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded text-right leading-tight">
            <div>{t.docNo}: {doc.docCode}</div>
            <div className="text-[9px] text-emerald-400/90">{t.docRev}: {doc.terbitRevisi}</div>
          </div>

          {/* Quick Save button on mobile */}
          <button
            onClick={onSaveDraft}
            className="md:hidden px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
            title={t.saveDraftTooltip}
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xs:inline">{t.saveDraftBtn}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors flex items-center gap-1 text-xs cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-slate-200" />
            ) : (
              <>
                <Menu className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-slate-300 font-semibold pr-0.5">{t.menu}</span>
              </>
            )}
          </button>

          {/* Desktop Toolbar Collapse Toggle */}
          <button
            onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700/80 transition-colors cursor-pointer"
            title={isToolbarCollapsed ? t.expandToolbar : t.collapseToolbar}
          >
            {isToolbarCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.expandToolbar}</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.collapseToolbar}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Action Toolbar */}
      {!isToolbarCollapsed && (
        <div className="hidden md:flex px-4 py-1.5 bg-[#162032] justify-between items-center gap-2 text-xs border-t border-slate-800">
          {/* Left Toolbar controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Preset Templates */}
            <button
              onClick={onOpenTemplates}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
              title={t.templateTooltip}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.templateBtn}</span>
            </button>

            {/* In-Situ Parameter Config */}
            <button
              onClick={onOpenParamConfig}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
              title={t.paramTooltip}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.paramBtn}</span>
            </button>

            {/* Drafts Manager */}
            <button
              onClick={onOpenDrafts}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
              title={t.draftsTooltip}
            >
              <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.draftsBtn}</span>
            </button>
          </div>

          {/* Right Action button: Simpan Draft */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onSaveDraft}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md flex items-center gap-1.5 font-medium shadow-xs transition-colors cursor-pointer"
              title={t.saveDraftTooltip}
            >
              <Save className="w-3.5 h-3.5 text-white" />
              <span>{t.saveDraftBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Collapsible Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#162032] border-t border-slate-700 px-3 py-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Language Selector Mobile */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {t.langSelect}:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    onSelectLang(opt.code);
                  }}
                  className={`py-1.5 px-2 rounded text-center border flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer ${
                    lang === opt.code
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-2xs'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-sm">{opt.flag}</span>
                  <span>{opt.shortLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tools & Config */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {t.toolsAndSettings}:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  onOpenTemplates();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center border border-slate-700 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.templateBtn}</span>
              </button>

              <button
                onClick={() => {
                  onOpenParamConfig();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center border border-slate-700 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>{t.paramBtn}</span>
              </button>

              <button
                onClick={() => {
                  onOpenDrafts();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center border border-slate-700 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-sky-400" />
                <span>{t.draftsBtn}</span>
              </button>
            </div>
          </div>

          {/* Save Draft Action */}
          <div>
            <button
              onClick={() => {
                onSaveDraft();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveDraftBtn}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

