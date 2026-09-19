import React from 'react';
import { Internship } from '../types';
import { DEFAULT_VALID_GOOGLE_FORM_URL } from '../data/initialData';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Award, 
  Gift, 
  FileText, 
  GraduationCap, 
  ExternalLink, 
  Send,
  AlertCircle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

interface InternshipDetailsModalProps {
  internship: Internship | null;
  onClose: () => void;
  onApply: (internshipId: string) => void;
  onViewOfferLetter?: (internship: Internship) => void;
}

export const InternshipDetailsModal: React.FC<InternshipDetailsModalProps> = ({
  internship,
  onClose,
  onApply,
  onViewOfferLetter,
}) => {
  if (!internship) return null;

  const getRewardBadge = (type: string) => {
    switch (type) {
      case 'Stipend':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Gift className="w-3.5 h-3.5" />
            Fixed Stipend Available
          </span>
        );
      case 'Performance-Based Reward':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Award className="w-3.5 h-3.5" />
            Performance-Based Reward
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Unpaid Project Internship
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70">
          <div className="space-y-1 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                {internship.domain}
              </span>
              {getRewardBadge(internship.rewardType)}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {internship.title}
            </h2>
            <p className="text-xs text-slate-500">Program Code: {internship.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Duration</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {internship.duration}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Mode</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                {internship.mode} (100% Online)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Practical Projects</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                {internship.projectsCount} Tasks / Deliverables
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Certificate</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Verified upon completion
              </span>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              About the Internship
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {internship.about}
            </p>
          </div>

          {/* What student will learn */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              What You Will Learn & Practice
            </h3>
            <ul className="space-y-2">
              {internship.learningOutcomes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Project / Task Description */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              Project / Task Description
            </h3>
            <div className="text-slate-700 whitespace-pre-line text-xs sm:text-sm font-mono bg-white p-3 rounded border border-slate-200">
              {internship.projectDescription}
            </div>
          </div>

          {/* Two-column Criteria Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Eligibility */}
            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Eligibility
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {internship.eligibility}
              </p>
            </div>

            {/* Selection Process */}
            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                Selection Process
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {internship.selectionProcess}
              </p>
            </div>

            {/* Completion Criteria */}
            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                Completion Criteria
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {internship.completionCriteria}
              </p>
            </div>

            {/* Certificate Criteria */}
            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                Certificate Criteria
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {internship.certificateCriteria}
              </p>
            </div>
          </div>

          {/* Transparent Payment / Reward Policy Box */}
          <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/60 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-amber-900 uppercase tracking-wide">
                  Transparent Payment & Reward Policy
                </h4>
                <p className="text-amber-800 leading-relaxed">
                  {internship.rewardDetails}
                </p>
                <p className="text-slate-600 text-[11px] pt-1">
                  Policy note: {internship.paymentPolicy} We do not ask for any deposit or registration fees.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions (Direct Apply + Google Form Link) */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Choose your preferred application method below:
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Offer Letter Sample Option */}
            {onViewOfferLetter && (
              <button
                onClick={() => onViewOfferLetter(internship)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 transition-colors w-full sm:w-auto"
                title="View official offer letter format for this internship"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Offer Letter Sample</span>
              </button>
            )}

            {/* Google Form Link option as specifically requested */}
            <a
              href={internship.googleFormUrl || DEFAULT_VALID_GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors w-full sm:w-auto"
              title="Open Official Application via Google Form"
            >
              <span>Apply via Google Form</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
            </a>

            {/* Direct On-Site Application */}
            <button
              onClick={() => {
                onClose();
                onApply(internship.id);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs w-full sm:w-auto cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply Directly on CodeNova</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
