import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Check, 
  Smartphone, 
  ShieldCheck, 
  ExternalLink, 
  Info, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  PUBLIC_SHARED_APP_URL, 
  getAppBaseUrl, 
  getCustomQrDomain, 
  setCustomQrDomain 
} from '../utils/verificationUrls';

interface QrDomainSettingsModalProps {
  onClose: () => void;
  onSaved?: () => void;
}

export const QrDomainSettingsModal: React.FC<QrDomainSettingsModalProps> = ({
  onClose,
  onSaved
}) => {
  const currentBase = getAppBaseUrl();
  const currentCustom = getCustomQrDomain();
  
  const [selectedType, setSelectedType] = useState<'public' | 'custom'>(
    currentCustom ? 'custom' : 'public'
  );
  const [customInput, setCustomInput] = useState(currentCustom || 'https://codenova.org');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (selectedType === 'public') {
      setCustomQrDomain('');
    } else {
      setCustomQrDomain(customInput);
    }
    setSavedSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefault = () => {
    setCustomQrDomain('');
    setSelectedType('public');
    setCustomInput('https://codenova.org');
    if (onSaved) onSaved();
  };

  const activeUrl = selectedType === 'public' ? PUBLIC_SHARED_APP_URL : (customInput || 'https://codenova.org');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                QR Verification Domain Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fix 403 errors and configure mobile QR scanner destinations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Explanation Alert */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Why external phones show Google 403 Forbidden:</span>
            </div>
            <p className="leading-relaxed text-amber-800 dark:text-amber-300">
              Private development container URLs (<code className="font-mono text-[11px] bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">ais-dev-*.run.app</code>) require Google developer account authentication. When an outside phone scans them, Google blocks access with a 403 error. 
            </p>
            <p className="leading-relaxed text-amber-800 dark:text-amber-300 font-medium">
              We route all QR codes to the <strong>Public Shared URL</strong> (<code className="font-mono text-[11px] bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">ais-pre-*.run.app</code>) so any smartphone or camera scans and verifies without errors.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* Option 1: Public Shared URL (Recommended) */}
            <label 
              onClick={() => setSelectedType('public')}
              className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedType === 'public'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <input 
                  type="radio" 
                  name="domainType" 
                  checked={selectedType === 'public'} 
                  onChange={() => setSelectedType('public')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Public Shared Preview URL (Recommended)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Active & Tested
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono break-all">
                    {PUBLIC_SHARED_APP_URL}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                    Directly accessible by all smartphones (Brave, Chrome, Safari, Android, iOS) without any Google sign-in requirement.
                  </p>
                </div>
              </div>
            </label>

            {/* Option 2: Custom / Production Domain */}
            <label 
              onClick={() => setSelectedType('custom')}
              className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedType === 'custom'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <input 
                  type="radio" 
                  name="domainType" 
                  checked={selectedType === 'custom'} 
                  onChange={() => setSelectedType('custom')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Custom Production Domain
                    </span>
                    <span className="text-xs text-slate-500">e.g. codenova.org</span>
                  </div>
                  
                  {selectedType === 'custom' && (
                    <div className="pt-1">
                      <input 
                        type="url" 
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="https://your-custom-domain.com"
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>

          {/* Test Link Action */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block">Current destination:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-xs block">
                {activeUrl}/?page=verify&cert=CERT-2026-00001
              </span>
            </div>
            <a 
              href={`${activeUrl}/?page=verify&cert=CERT-2026-00001`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-indigo-600 font-medium transition-colors"
            >
              <span>Test Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save QR Domain</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
