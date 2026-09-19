import React from 'react';
import { Internship } from '../types';
import { DEFAULT_VALID_GOOGLE_FORM_URL } from '../data/initialData';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  FileCode, 
  Award, 
  Code2, 
  Clock, 
  ExternalLink,
  Laptop,
  Layers,
  ChevronRight,
  GitBranch,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { CodeNovaLogo } from '../components/CodeNovaLogo';

interface HomePageProps {
  internships: Internship[];
  onNavigate: (page: string, param?: string) => void;
  onSelectInternship: (internship: Internship) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  internships,
  onNavigate,
  onSelectInternship,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Apply',
      desc: 'Submit your profile with your GitHub and technical background.'
    },
    {
      num: '02',
      title: 'Get Selected',
      desc: 'Screened applicants receive an acceptance notification and onboarding packet.'
    },
    {
      num: '03',
      title: 'Receive Project',
      desc: 'Assigned 2–3 structured tasks with real-world technical requirements.'
    },
    {
      num: '04',
      title: 'Submit Work',
      desc: 'Push your source code to GitHub and provide a working demo or recording.'
    },
    {
      num: '05',
      title: 'Evaluation',
      desc: 'Mentors evaluate code quality, structure, and execution against milestones.'
    },
    {
      num: '06',
      title: 'Completion Certificate',
      desc: 'Receive an authenticated, organization-issued verifiable certificate.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-14 pb-6 text-center max-w-4xl mx-auto px-4 sm:px-6">
        {/* Brand Tagline Badge & Student Logo */}
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <div className="p-1.5 pl-2 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm inline-flex items-center gap-3">
            <CodeNovaLogo size="md" showStudentBadge={true} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Dedicated Tech Internship Platform for College & University Students</span>
          </div>
        </div>

        {/* Main Title & Tagline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          CodeNova
        </h1>
        <p className="text-xl sm:text-2xl font-medium text-indigo-600 dark:text-indigo-400 mt-2 tracking-tight">
          "Learn. Build. Prove Your Skills."
        </p>

        {/* Short Explanation */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We offer structured, remote, project-based internships in Artificial Intelligence, Machine Learning, Python Development, Web Development, and Data Science. Build real deliverables for your portfolio, receive code feedback, and earn a verified completion credential.
        </p>

        {/* 3 Main Action Buttons from prompt */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            id="hero-explore-btn"
            onClick={() => onNavigate('internships')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
          >
            <span>Explore Internships</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-apply-btn"
            onClick={() => onNavigate('apply')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Apply Now</span>
          </button>

          <button
            id="hero-verify-btn"
            onClick={() => onNavigate('verify')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Verify Certificate</span>
          </button>
        </div>

        {/* Independent Status Note */}
        <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Independent technology learning initiative. No fees required. Open to university & polytechnic students worldwide.
        </div>
      </section>

      {/* How It Works Section: Apply → Get Selected → Receive Project → Submit Work → Evaluation → Completion Certificate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Structured Methodology
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              How the Internship Works
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              A transparent, self-paced, milestone-driven pathway designed to give you verifiable engineering work.
            </p>
          </div>

          {/* Workflow Sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {step.num}
                    </span>
                    {idx < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 hidden lg:block" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Apply → Get Selected → Receive Project → Submit Work → Evaluation → Completion Certificate
            </span>
            <button
              onClick={() => onNavigate('apply')}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Get started today</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Available Internship Programs Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Open Cohorts
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Featured Internship Programs
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Select a domain to view syllabus, tasks, eligibility, and application routes.
            </p>
          </div>
          <button
            onClick={() => onNavigate('internships')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
          >
            <span>View all programs ({internships.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.domain}
                  </span>
                  <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.duration}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                  {item.about}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Mode:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Remote</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Tasks:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.projectsCount} Projects</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Reward:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.rewardType}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectInternship(item)}
                    className="w-full py-2 px-3 rounded text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-center cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onNavigate('apply', item.id)}
                    className="w-full py-2 px-3 rounded text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 text-center cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>

                {/* Google Form option in internship link section */}
                <a
                  href={item.googleFormUrl || DEFAULT_VALID_GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-1"
                >
                  Or apply via Google Form ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Honest Platform Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Our Commitments to Students
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">100% Practical Proof</h4>
              <p className="leading-relaxed">
                No multiple-choice tests. You will build and deploy concrete repositories on GitHub that you can showcase on your resume and in job interviews.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Transparent Compensation</h4>
              <p className="leading-relaxed">
                We clearly label each program as unpaid, performance-reward, or stipend. We never make misleading claims or demand payment from applicants.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Verifiable Credentials</h4>
              <p className="leading-relaxed">
                Every certificate contains a unique cryptographic ID and public verification URL with QR code, enabling prospective employers to confirm your project completion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
