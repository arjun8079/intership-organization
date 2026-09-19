import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { StorageService } from '../utils/storage';
import { CertificateDisplay } from '../components/CertificateDisplay';
import { extractCertificateIdFromInput, getAppBaseUrl } from '../utils/verificationUrls';
import { QrCodeScannerModal } from '../components/QrCodeScannerModal';
import { QrDomainSettingsModal } from '../components/QrDomainSettingsModal';
import { 
  ShieldCheck, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  HelpCircle,
  Award,
  QrCode,
  Globe,
  Camera,
  Upload
} from 'lucide-react';

interface VerifyCertificatePageProps {
  initialCertId?: string;
  onNavigate: (page: string, param?: string) => void;
}

export const VerifyCertificatePage: React.FC<VerifyCertificatePageProps> = ({
  initialCertId,
  onNavigate,
}) => {
  const [certIdInput, setCertIdInput] = useState(initialCertId || '');
  const [searchedId, setSearchedId] = useState(initialCertId || '');
  const [foundCert, setFoundCert] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);

  useEffect(() => {
    if (initialCertId) {
      setCertIdInput(initialCertId);
      handleSearch(initialCertId);
    }
  }, [initialCertId]);

  const handleSearch = (idToSearch?: string) => {
    const raw = (idToSearch !== undefined ? idToSearch : certIdInput).trim();
    if (!raw) return;

    const target = extractCertificateIdFromInput(raw);
    setSearchedId(target);
    setHasSearched(true);
    const result = StorageService.findCertificateById(target);
    setFoundCert(result || null);
  };

  const handleQuickTest = (id: string) => {
    setCertIdInput(id);
    handleSearch(id);
  };

  const handleQrDecoded = (decodedId: string) => {
    setCertIdInput(decodedId);
    handleSearch(decodedId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Public Certificate Verification
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Verify the authenticity of internship completion certificates issued by CodeNova. Enter the unique Certificate ID printed on the credential or scan the QR code.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-4">
        
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Official Verification Registry
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
              title="Scan QR with webcam or upload QR image / screenshot"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan / Upload QR</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDomainModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Configure QR Verification Domain (Fix mobile 403 error)"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>QR Domain</span>
            </button>
          </div>
        </div>

        {/* Mobile 403 Bypass Note */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Smartphone Camera Scannable:</strong> QR codes are routed through our public shared verification gateway to prevent Google login 403 errors on external phones.
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Enter Certificate ID or Scanned URL <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder="e.g. CERT-2026-00001 or paste scanned link"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                className="w-full pl-4 pr-32 py-3 text-sm font-mono uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowScannerModal(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Scan or upload QR image"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>

          {/* Quick Test Samples */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Quick test valid records:</span>
            <button
              type="button"
              onClick={() => handleQuickTest('CERT-2026-00001')}
              className="px-2 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              CERT-2026-00001 (Gen AI)
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest('CERT-2026-00004')}
              className="px-2 py-0.5 rounded font-mono bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium cursor-pointer"
            >
              CERT-2026-00004 (1 Mo - App)
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest('CERT-2026-00005')}
              className="px-2 py-0.5 rounded font-mono bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-medium cursor-pointer"
            >
              CERT-2026-00005 (2 Mo - Cyber)
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest('CERT-2026-00006')}
              className="px-2 py-0.5 rounded font-mono bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium cursor-pointer"
            >
              CERT-2026-00006 (3 Mo - Full Stack)
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest('CERT-INVALID-SAMPLE')}
              className="px-2 py-0.5 rounded font-mono bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 cursor-pointer"
            >
              Invalid ID Test
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Looking for your Offer Letter instead?</span>
            <button
              type="button"
              onClick={() => onNavigate('offers')}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Offer Letter Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Verification Result Area */}
      {hasSearched && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {foundCert ? (
            <div className="space-y-6">
              {/* Summary Banner */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                      Authentic Certificate Verified
                    </h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Issued to <strong className="font-semibold">{foundCert.studentName}</strong> for completing <strong className="font-semibold">{foundCert.internshipTitle}</strong>.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 px-2 py-1 bg-white dark:bg-slate-800 rounded border border-emerald-200 dark:border-emerald-800">
                  Status: {foundCert.status}
                </span>
              </div>

              {/* Render Full Certificate View */}
              <CertificateDisplay certificate={foundCert} />
            </div>
          ) : (
            /* Not Found Screen */
            <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-xl p-8 text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Certificate Record Not Found
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  No certificate matching ID <strong className="font-mono text-red-600 dark:text-red-400">"{searchedId}"</strong> was found in the official CodeNova registry.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg text-left text-xs text-slate-600 dark:text-slate-300 space-y-1.5 border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Please verify the following:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li>Ensure the Certificate ID format matches (e.g. CERT-YYYY-XXXXX).</li>
                  <li>Check for potential typographical errors in the alphanumeric code.</li>
                  <li>Only certificates issued directly by CodeNova are stored in this registry.</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setCertIdInput('');
                  setHasSearched(false);
                }}
                className="px-4 py-2 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Try Another ID
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mandatory Disclaimer Box */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
          <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Accreditation & Registry Notice
        </h4>
        <p className="leading-relaxed">
          CodeNova is an independent technology learning organization. All certificates listed in this registry represent verified project milestone completions, technical evaluations, and source code reviews conducted by our team.
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          * We do not claim university degree equivalence, government agency accreditation, or third-party academic certification. These credentials serve as verifiable proof of practical software engineering project work.
        </p>
      </div>

      {showScannerModal && (
        <QrCodeScannerModal
          onClose={() => setShowScannerModal(false)}
          onDecoded={handleQrDecoded}
        />
      )}

      {showDomainModal && (
        <QrDomainSettingsModal
          onClose={() => setShowDomainModal(false)}
        />
      )}
    </div>
  );
};
