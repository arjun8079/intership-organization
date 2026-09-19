import React, { useState, useEffect } from 'react';
import { OfferLetter } from '../types';
import { downloadOfferLetterPdf, generateQrDataUrl } from '../utils/offerLetterPdf';
import { getOfferVerifyUrl } from '../utils/verificationUrls';
import { QrDomainSettingsModal } from './QrDomainSettingsModal';
import { 
  X, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Building, 
  Mail, 
  FileText,
  Clock,
  Sparkles,
  Award,
  CheckCircle,
  ExternalLink,
  Printer,
  QrCode,
  Shield,
  Layers,
  Code2,
  BookOpen,
  UserCheck,
  Copy,
  Check,
  Globe
} from 'lucide-react';
import codenovaLogoImg from '../assets/images/codenova_logo_1789801813750.jpg';

interface OfferLetterModalProps {
  offerLetter: OfferLetter;
  onClose: () => void;
}

export const OfferLetterModal: React.FC<OfferLetterModalProps> = ({
  offerLetter,
  onClose
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [qrSrc, setQrSrc] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [version, setVersion] = useState(0);

  const verificationUrl = getOfferVerifyUrl(offerLetter.id);

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
    try {
      setDownloading(true);
      await downloadOfferLetterPdf(offerLetter);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 4000);
    } catch (err) {
      console.error('Download offer letter error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Floating Control Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Official Internship Offer Letter
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Credential</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Reference: <strong className="text-slate-200 font-mono">{offerLetter.id}</strong> • {offerLetter.internshipTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDomainModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Configure QR Verification Domain (Fix mobile 403 error)"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>QR Domain</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors cursor-pointer"
              title="Download Official PDF Letter"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Generating PDF...' : 'Download Official PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloaded && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official Offer Letter PDF has been generated and saved to your device!</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-mono">Verified Credential with Official Stamp</span>
          </div>
        )}

        {/* Scrollable Letter Document Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-100/60 text-slate-800 print:p-0 print:bg-white">
          <div className="bg-white rounded-xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6 max-w-3xl mx-auto">
            
            {/* 1. Official Corporate Letterhead */}
            <div className="border-b border-slate-200 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs ring-1 ring-slate-900/10 shrink-0 mt-0.5">
                    <img
                      src={codenovaLogoImg}
                      alt="CodeNova Logo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl sm:text-3xl font-black tracking-widest text-slate-950">
                        CODENOVA
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        for Students
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mt-1">
                      Autonomous Project-Based Software Engineering & Applied Technology Internship Initiative
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Accreditation Ref: <strong className="font-mono text-slate-600">CN-TECH-9001-A</strong> • Portal: <a href="https://codenova.org" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">https://codenova.org</a>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Evaluation & Verification Desk: <span className="font-mono">evaluation@codenova.org</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 sm:bg-transparent sm:p-0 sm:border-0">
                  <p className="font-bold text-slate-900 text-xs">
                    REF NO: <span className="font-mono text-indigo-700">{offerLetter.id}</span>
                  </p>
                  <p className="text-slate-500">
                    Date of Issue: <strong className="text-slate-700">{offerLetter.issueDate}</strong>
                  </p>
                  <p className="text-indigo-600 font-semibold font-mono text-[11px]">
                    Auth Code: {offerLetter.verificationCode}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Active Appointment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Recipient Addressee Block */}
            <div className="space-y-1 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                TO / RECIPIENT:
              </span>
              <h3 className="text-lg font-bold text-slate-950">
                {offerLetter.studentName}
              </h3>
            </div>

            {/* 3. Formal Subject Banner */}
            <div className="bg-indigo-50/80 border border-indigo-200 rounded-lg px-4 py-3 text-xs">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                Official Subject:
              </span>
              <span className="font-bold text-indigo-950 text-sm">
                FORMAL APPOINTMENT AND OFFER OF INTERNSHIP — {offerLetter.internshipTitle.toUpperCase()}
              </span>
              <span className="text-[11px] text-indigo-700 block mt-0.5">
                Cohort Term: {offerLetter.startDate} to {offerLetter.endDate} • 100% Virtual Project-Based Track
              </span>
            </div>

            {/* 4. Formal Congratulatory Opening Body */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900">
                Dear {offerLetter.studentName},
              </p>

              <p>
                On behalf of <strong>CodeNova Technologies</strong>, we are thrilled to congratulate you on your selection for the project-based Virtual Internship Program in <strong className="text-indigo-700">{offerLetter.internshipTitle}</strong>. Following a comprehensive review of your technical background, programming proficiency, and application portfolio by our Technical Evaluation Board, your demonstrated problem-solving abilities and passion for software engineering stood out as exemplary.
              </p>

              <p>
                At CodeNova, our core philosophy is <em>"Learn. Build. Prove Your Skills."</em> Our internship tracks are engineered to reflect modern production engineering environments. Rather than passive lectures, you will build and push real software solutions, master version control workflows, write clean documentation, and earn verifiable industry credentials.
              </p>
            </div>

            {/* 5. Key Terms of Engagement Specification Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Key Terms of Engagement & Program Details:
              </span>

              <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Position / Role</span>
                  <span className="font-bold text-slate-900 text-sm">{offerLetter.internshipTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Domain / Discipline</span>
                  <span className="font-semibold text-slate-800">{offerLetter.domain}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Internship Mode</span>
                  <span className="font-semibold text-slate-800">{offerLetter.mode} (100% Virtual / Remote)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Program Duration</span>
                  <span className="font-semibold text-slate-800">{offerLetter.duration} (4 Weeks Intensive)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Program Timeline</span>
                  <span className="font-semibold text-slate-800">{offerLetter.startDate} to {offerLetter.endDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Weekly Commitment</span>
                  <span className="font-semibold text-slate-800">8–10 Hours / Week (Self-Paced)</span>
                </div>
              </div>
            </div>

            {/* 6. Substantive Articles & Clauses */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              
              {/* Clause 1 */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <span>Scope of Assignment & Project Deliverables</span>
                </h4>
                <p className="text-slate-600 leading-relaxed pl-7">
                  During the course of your internship, you will be assigned structured industry-aligned project briefs. You are required to complete these milestones in accordance with professional engineering practices:
                </p>
                <ul className="space-y-1.5 pl-7 text-slate-700">
                  {offerLetter.rolesAndResponsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span>Maintain an active GitHub repository with clear, descriptive commit messages documenting your development process.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span>Provide a comprehensive <code className="text-indigo-700 font-bold bg-slate-100 px-1 rounded">README.md</code> with architecture overview, installation instructions, and live demonstration links.</span>
                  </li>
                </ul>
              </div>

              {/* Clause 2 */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <span>Mentorship, Evaluation & Certification</span>
                </h4>
                <p className="text-slate-600 leading-relaxed pl-7">
                  Your project submissions will be reviewed by assigned technical mentors. Upon successful evaluation of all required deliverables, you will be awarded an official, tamper-proof <strong>Certificate of Completion</strong> with a unique verification code and scannable QR link. Top performers will also receive an authorized <strong>Letter of Recommendation (LOR)</strong>.
                </p>
              </div>
            </div>

            {/* 7. Signatures, Digital Seal & Official Verification Block */}
            <div className="border-t-2 border-slate-200 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                
                {/* Left: Scannable Verification Block */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center text-center shrink-0 shadow-xs">
                    {qrSrc ? (
                      <img src={qrSrc} alt="Verification QR Code" className="w-14 h-14 object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <QrCode className="w-6 h-6 text-indigo-500" />
                        <span className="text-[7px] font-mono tracking-tighter text-slate-500">QR CODE</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Official Verification Hash</span>
                    <span className="font-mono text-[11px] text-indigo-700 font-semibold block">{offerLetter.verificationCode}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[10px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                        title="Test scanned QR link"
                      >
                        <span>Test QR Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-slate-300">•</span>
                      <button
                        onClick={handleCopyLink}
                        className="text-[10px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                      >
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Center: Official Seal Badge */}
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-500 flex flex-col items-center justify-center text-center p-1 bg-indigo-50/50 shadow-2xs">
                    <span className="text-[7px] font-black tracking-wider text-indigo-900 uppercase">CODENOVA</span>
                    <span className="text-[6px] font-bold text-indigo-700 uppercase">OFFICIAL SEAL</span>
                    <span className="text-[7px] font-extrabold text-emerald-700 uppercase">VERIFIED</span>
                  </div>
                </div>

                {/* Right: Dual Authorized Signatures */}
                <div className="text-right space-y-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{offerLetter.signatoryName || 'Dr. Vikramaditya Rao'}</p>
                    <p className="text-[11px] text-slate-600">{offerLetter.signatoryTitle || 'Director of Technical Evaluation'}</p>
                    <p className="text-[10px] font-semibold text-indigo-600">CodeNova Technologies Programs Board</p>
                  </div>

                  <div className="border-t border-slate-200 pt-1 text-[11px]">
                    <p className="font-semibold text-slate-800">Ananya Deshmukh</p>
                    <p className="text-[10px] text-slate-500">Head of Academic Outreach & Talent Programs</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
                This offer letter is a legally valid, digitally signed document issued by CodeNova Technologies. Any tampering or unauthorized replication will result in immediate invalidation of the credential.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Modal Actions Bar */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official appointment document with digital seal & QR verification</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Downloading...' : 'Download Official PDF'}</span>
            </button>
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
