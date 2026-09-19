import React, { useEffect, useState } from 'react';
import { Certificate } from '../types';
import { downloadCertificatePdf, generateQrDataUrl } from '../utils/certificatePdf';
import { getCertificateVerifyUrl } from '../utils/verificationUrls';
import { QrDomainSettingsModal } from './QrDomainSettingsModal';
import { 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Award, 
  AlertTriangle, 
  QrCode,
  Globe,
  Settings
} from 'lucide-react';
import codenovaLogoImg from '../assets/images/codenova_logo_1789801813750.jpg';

interface CertificateDisplayProps {
  certificate: Certificate;
}

export const CertificateDisplay: React.FC<CertificateDisplayProps> = ({ certificate }) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [version, setVersion] = useState(0);

  const verificationUrl = getCertificateVerifyUrl(certificate.id);

  const orgName = (!certificate.organizationName || certificate.organizationName.toUpperCase() === 'INTERNZA')
    ? 'CODENOVA'
    : certificate.organizationName.replace(/internza/gi, 'CodeNova').toUpperCase();

  const signatoryTitle = (certificate.signatoryTitle || 'Technical Evaluation Director')
    .replace(/internza/gi, 'CodeNova');

  useEffect(() => {
    let isMounted = true;
    generateQrDataUrl(verificationUrl).then((url) => {
      if (isMounted) setQrSrc(url);
    });
    return () => {
      isMounted = false;
    };
  }, [verificationUrl, version]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadCertificatePdf(certificate);
    } catch (e) {
      console.error('Failed to download PDF', e);
    } finally {
      setDownloading(false);
    }
  };

  const isValid = certificate.status === 'Valid';

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
        <div className="flex items-center gap-2">
          {isValid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Verified & Authentic Record
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              Invalid / Revoked
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">ID: {certificate.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDomainModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            title="Configure QR verification domain and fix mobile 403 error"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>QR Domain</span>
          </button>

          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 transition-colors"
            title="Test verification link that mobile QR scanners open"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Test QR Link</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            title="Copy verification URL"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Preparing...' : 'Download Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* Scannable Domain Callout Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="text-slate-500">Mobile Scanner Destination:</span>
          <span className="font-mono text-indigo-700 dark:text-indigo-300 font-semibold truncate">{verificationUrl}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="w-3 h-3" />
          <span>Mobile Phone 403 Bypass Ready</span>
        </span>
      </div>

      {/* Visual Certificate Frame */}
      <div className="bg-white border-4 border-slate-900 dark:border-slate-700 shadow-xl rounded-xl p-6 sm:p-10 relative overflow-hidden text-center select-text">
        {/* Subtle decorative double inner border */}
        <div className="border border-indigo-200 p-6 sm:p-8 rounded-lg relative bg-linear-to-b from-slate-50/50 to-white">
          
          {/* Top Brand Watermark & Tagline */}
          <div className="flex flex-col items-center justify-center space-y-1 mb-6">
            <div className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-slate-900/10 shadow-xs">
                <img
                  src={codenovaLogoImg}
                  alt="CodeNova Student Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl sm:text-3xl font-black tracking-widest text-slate-900 uppercase">
                {orgName}
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-widest uppercase text-slate-400">
              Learn. Build. Prove Your Skills. • Independent Technology Platform
            </p>
            <div className="w-24 h-0.5 bg-indigo-500 mt-2"></div>
          </div>

          {/* Certificate Main Title */}
          <div className="my-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-indigo-700 uppercase">
              Certificate of Internship Completion
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 italic font-serif">
              This is to certify that
            </p>
          </div>

          {/* Student Name */}
          <div className="my-4 sm:my-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {certificate.studentName}
            </h3>
            <div className="w-48 sm:w-64 h-0.5 bg-slate-300 mx-auto mt-2"></div>
          </div>

          {/* Achievement Description */}
          <div className="max-w-2xl mx-auto my-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              has successfully completed all assigned project milestones, technical deliverables, and source code evaluations for the remote program:
            </p>
            <p className="text-base sm:text-lg font-bold text-slate-900 mt-2">
              {certificate.internshipTitle}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Field of Focus: <span className="font-semibold text-slate-700">{certificate.domain}</span>
            </p>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 my-6 text-xs text-slate-600 py-3 border-y border-slate-200/80 bg-white/70">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mode</span>
              <span className="font-semibold text-slate-800">Remote Internship</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
              <span className="font-semibold text-slate-800">{certificate.duration}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Completion Date</span>
              <span className="font-semibold text-slate-800">{certificate.completionDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Certificate ID</span>
              <span className="font-mono font-bold text-indigo-600">{certificate.id}</span>
            </div>
          </div>

          {/* Bottom Row: Signatory, QR Code, Verification Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center pt-4 mt-4">
            {/* Left: Signatory */}
            <div className="text-center sm:text-left order-2 sm:order-1">
              <div className="w-36 h-0.5 bg-slate-400 mx-auto sm:mx-0 mb-2"></div>
              <p className="text-xs font-bold text-slate-800">
                {signatoryTitle}
              </p>
              <p className="text-[11px] text-slate-500">CodeNova Technology</p>
            </div>

            {/* Center: QR Code */}
            <div className="flex flex-col items-center justify-center order-1 sm:order-2">
              {qrSrc ? (
                <div className="p-1.5 bg-white border border-slate-300 rounded shadow-2xs">
                  <img src={qrSrc} alt="Verification QR Code" className="w-20 h-20" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-xs text-slate-400 border border-slate-200">
                  QR Code
                </div>
              )}
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1.5">
                Scan to Verify
              </span>
            </div>

            {/* Right: Security & URL */}
            <div className="text-center sm:text-right order-3">
              <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Online Record</span>
              </div>
              <p className="text-[10px] text-slate-500 break-all font-mono">
                {verificationUrl.replace(/^https?:\/\//, '')}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Issued: {certificate.issueDate || certificate.completionDate}
              </p>
            </div>
          </div>

          {/* Footnote statement */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            * This certificate is issued independently by CodeNova upon completion of internal project milestones and code reviews. It is not affiliated with any government or university accreditation body.
          </div>
        </div>
      </div>

      {showDomainModal && (
        <QrDomainSettingsModal
          onClose={() => setShowDomainModal(false)}
          onSaved={() => setVersion((v) => v + 1)}
        />
      )}
    </div>
  );
};
