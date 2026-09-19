import React, { useState, useEffect } from 'react';
import { Internship, OfferLetter, Application } from '../types';
import { StorageService } from '../utils/storage';
import { downloadOfferLetterPdf } from '../utils/offerLetterPdf';
import { extractOfferIdFromInput } from '../utils/verificationUrls';
import { OfferLetterModal } from '../components/OfferLetterModal';
import { 
  FileText, 
  Search, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Building, 
  ArrowRight,
  ExternalLink,
  Award,
  Sparkles,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface OfferLettersPageProps {
  internships: Internship[];
  onNavigate: (page: string, param?: string) => void;
  initialOfferId?: string;
}

export const OfferLettersPage: React.FC<OfferLettersPageProps> = ({
  internships,
  onNavigate,
  initialOfferId
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOfferId || '');
  const [hasSearched, setHasSearched] = useState(false);
  const [foundOffer, setFoundOffer] = useState<OfferLetter | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedOfferModal, setSelectedOfferModal] = useState<OfferLetter | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const offerLetters = StorageService.getOfferLetters();

  useEffect(() => {
    if (initialOfferId) {
      setSearchQuery(initialOfferId);
      handleSearch(initialOfferId);
    }
  }, [initialOfferId]);

  const handleSearch = (queryOverride?: string) => {
    const raw = (queryOverride !== undefined ? queryOverride : searchQuery).trim();
    if (!raw) return;

    const q = extractOfferIdFromInput(raw);
    setHasSearched(true);
    const result = StorageService.findOfferLetterByQuery(q);
    if (result) {
      setFoundOffer(result);
      setNotFound(false);
    } else {
      setFoundOffer(null);
      setNotFound(true);
    }
  };

  const handleDownloadPdf = async (offer: OfferLetter) => {
    try {
      setDownloadingId(offer.id);
      await downloadOfferLetterPdf(offer);
    } catch (err) {
      console.error('Download offer letter error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreviewSampleForInternship = (internship: Internship) => {
    const sample = StorageService.generateSampleOfferLetterForInternship(internship);
    setSelectedOfferModal(sample);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Official Credentials & Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Internship Offer Letters
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Every admitted student across all CodeNova internships receives an official, tamper-proof Offer Letter specifying the role, milestones, dates, and code of conduct.
        </p>
      </div>

      {/* Search by Application ID or Email Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Look Up Your Official Offer Letter</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your Application ID (e.g. <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">APP-2026-104</span>) or registered email address to view and download your signed offer letter PDF.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            placeholder="e.g. APP-2026-104 or aryan.verma@example.com"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Search Letter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Test Demo Links */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">Quick Demo Candidates:</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('APP-2026-105');
              handleSearch('APP-2026-105');
            }}
            className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono text-[11px] transition-colors cursor-pointer"
          >
            Rohan Gupta (1 Mo - App)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('APP-2026-106');
              handleSearch('APP-2026-106');
            }}
            className="px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-mono text-[11px] transition-colors cursor-pointer"
          >
            Sneha Kulkarni (2 Mo - Cyber)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('APP-2026-107');
              handleSearch('APP-2026-107');
            }}
            className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono text-[11px] transition-colors cursor-pointer"
          >
            Aditya Nair (3 Mo - Full Stack)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('APP-2026-104');
              handleSearch('APP-2026-104');
            }}
            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-[11px] transition-colors cursor-pointer"
          >
            Aryan Verma (Python)
          </button>
        </div>

        {/* Search Result */}
        {hasSearched && foundOffer && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300 tracking-wider">
                  Offer Letter Verified & Found
                </span>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{foundOffer.id}</span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-emerald-100 dark:border-emerald-900/50 text-xs space-y-1 text-slate-700 dark:text-slate-300">
              <p><strong className="text-slate-900 dark:text-white">Candidate:</strong> {foundOffer.studentName}</p>
              <p><strong className="text-slate-900 dark:text-white">Position:</strong> {foundOffer.internshipTitle}</p>
              <p><strong className="text-slate-900 dark:text-white">Dates:</strong> {foundOffer.startDate} to {foundOffer.endDate}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setSelectedOfferModal(foundOffer)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Preview Offer Letter</span>
              </button>
              <button
                onClick={() => handleDownloadPdf(foundOffer)}
                disabled={downloadingId === foundOffer.id}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{downloadingId === foundOffer.id ? 'Downloading...' : 'Download Official PDF'}</span>
              </button>
            </div>
          </div>
        )}

        {hasSearched && notFound && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>No Offer Letter Found for "{searchQuery}"</span>
            </div>
            <p className="text-amber-800 dark:text-amber-300">
              Offer letters are issued automatically when your application status is approved. Please check if your application ID or email address was entered correctly, or browse sample offer letters below.
            </p>
          </div>
        )}
      </div>

      {/* Explore Offer Letters for All Internships */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Official Offer Letters by Internship Program
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preview and download the exact formal offer letter structure for any of our technology internship tracks.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {internships.length} Programs Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {internships.map((internship) => (
            <div
              key={internship.id}
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                internship.id === 'INT-PYTHON-04' 
                  ? 'border-indigo-300 dark:border-indigo-500/50 ring-2 ring-indigo-500/20' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                    {internship.domain}
                  </span>
                  {internship.id === 'INT-PYTHON-04' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {internship.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {internship.about}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Duration:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{internship.duration} (Remote)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Reward:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{internship.rewardType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Official Letter:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Guaranteed on Acceptance
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handlePreviewSampleForInternship(internship)}
                    className="py-2 px-2.5 rounded-lg text-xs font-semibold border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Offer</span>
                  </button>

                  <button
                    onClick={async () => {
                      const sample = StorageService.generateSampleOfferLetterForInternship(internship);
                      await handleDownloadPdf(sample);
                    }}
                    disabled={downloadingId === `OL-SAMPLE-${(internship.domain || 'TECH').substring(0, 3).toUpperCase()}-01`}
                    className="py-2 px-2.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Download PDF</span>
                  </button>
                </div>

                <button
                  onClick={() => onNavigate('apply', internship.id)}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Apply for this Program</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Letter Details Modal */}
      {selectedOfferModal && (
        <OfferLetterModal
          offerLetter={selectedOfferModal}
          onClose={() => setSelectedOfferModal(null)}
        />
      )}
    </div>
  );
};
