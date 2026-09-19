import React, { useState, useMemo } from 'react';
import { Internship, DomainType } from '../types';
import { DEFAULT_VALID_GOOGLE_FORM_URL } from '../data/initialData';
import { 
  Clock, 
  MapPin, 
  FileCode, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Send, 
  Search, 
  Filter, 
  Info,
  Gift,
  FileCheck2
} from 'lucide-react';

interface InternshipsPageProps {
  internships: Internship[];
  onNavigate: (page: string, param?: string) => void;
  onSelectInternship: (internship: Internship) => void;
}

export const InternshipsPage: React.FC<InternshipsPageProps> = ({
  internships,
  onNavigate,
  onSelectInternship,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedReward, setSelectedReward] = useState<string>('All');

  const domains: string[] = ['All', 'Artificial Intelligence', 'Machine Learning', 'Web Development', 'Python Development', 'Data Science'];

  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      if (!item.isActive) return false;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDomain = selectedDomain === 'All' || item.domain === selectedDomain;
      const matchesReward = selectedReward === 'All' || item.rewardType === selectedReward;

      return matchesSearch && matchesDomain && matchesReward;
    });
  }, [internships, searchQuery, selectedDomain, selectedReward]);

  const getRewardBadge = (type: string) => {
    switch (type) {
      case 'Stipend':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Gift className="w-3 h-3" />
            Stipend: Available
          </span>
        );
      case 'Performance-Based Reward':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <Award className="w-3 h-3" />
            Performance Reward: Available
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Unpaid Internship
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Available Internship Programs
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Hands-on, project-based internships in AI, Machine Learning, Python, Web Development, and Data Science. Work remotely, submit evaluated GitHub milestones, and obtain verifiable certificates.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="sm:col-span-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, domain, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Domain Filter */}
          <div>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  Domain: {d}
                </option>
              ))}
            </select>
          </div>

          {/* Compensation / Reward filter */}
          <div>
            <select
              value={selectedReward}
              onChange={(e) => setSelectedReward(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            >
              <option value="All">Compensation: All Policies</option>
              <option value="Unpaid Internship">Unpaid Internships</option>
              <option value="Performance-Based Reward">Performance-Based Reward</option>
              <option value="Stipend">Stipend Available</option>
            </select>
          </div>
        </div>

        {/* Active counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>Showing {filteredInternships.length} active programs</span>
          {(searchQuery || selectedDomain !== 'All' || selectedReward !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDomain('All');
                setSelectedReward('All');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Official Google Form Fast-Track Banner */}
      <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              Official Google Form Application Available
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Students can apply either on CodeNova or through our direct verified Google Form with automatic document collection.
            </span>
          </div>
        </div>
        <a
          href={DEFAULT_VALID_GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 shrink-0 self-start sm:self-auto transition-colors"
        >
          <span>Open Google Form</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Cards Grid */}
      {filteredInternships.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No internship matches your selected filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('All');
              setSelectedReward('All');
            }}
            className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => (
            <div
              key={internship.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                    {internship.domain}
                  </span>
                  {getRewardBadge(internship.rewardType)}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {internship.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {internship.about}
                </p>

                {/* Card Specific Metadata */}
                <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Duration:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{internship.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Mode:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{internship.mode}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5 text-slate-400" />
                      Projects / Tasks:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{internship.projectsCount} Tasks</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Certificate:
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Yes (Verified)</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Eligibility:</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                      {internship.eligibility}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions & Google Form Link Section */}
              <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectInternship(internship)}
                    className="w-full py-2 px-2.5 rounded-md text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onNavigate('apply', internship.id)}
                    className="w-full py-2 px-2.5 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-2xs text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>

                {/* Google Form Link Section */}
                <div className="pt-1">
                  <a
                    href={internship.googleFormUrl || DEFAULT_VALID_GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Open official Google Form for this internship"
                  >
                    <span>Apply via Google Form</span>
                    <ExternalLink className="w-3 h-3 text-indigo-500" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compensation Policy Explanatory Note */}
      <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          CodeNova Compensation & Integrity Policy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div>
            <strong className="text-slate-800 dark:text-slate-200">Unpaid Internships:</strong> Focus purely on portfolio building, mentor code reviews, and authenticated certificates. No fee is ever charged.
          </div>
          <div>
            <strong className="text-slate-800 dark:text-slate-200">Performance-Based Reward:</strong> Top 10% highest-scoring submissions evaluated on code architecture and test benchmarks receive financial honorariums.
          </div>
          <div>
            <strong className="text-slate-800 dark:text-slate-200">Stipend:</strong> Fixed payment upon verified completion of all assigned client-simulated deliverables.
          </div>
        </div>
      </div>
    </div>
  );
};
