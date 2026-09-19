import React, { useState } from 'react';
import { Internship, Application, ProjectSubmission, Certificate, DomainType, RewardType, OfferLetter } from '../types';
import { StorageService } from '../utils/storage';
import { DEFAULT_VALID_GOOGLE_FORM_URL } from '../data/initialData';
import { downloadCertificatePdf } from '../utils/certificatePdf';
import { downloadOfferLetterPdf } from '../utils/offerLetterPdf';
import { getCertificateVerifyUrl } from '../utils/verificationUrls';
import { CertificateDisplay } from '../components/CertificateDisplay';
import { OfferLetterModal } from '../components/OfferLetterModal';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  FileText, 
  Download, 
  ExternalLink, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle,
  Github,
  Globe,
  Search,
  Filter,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  RefreshCw,
  Mail,
  Send
} from 'lucide-react';

interface AdminDashboardProps {
  internships: Internship[];
  onUpdateInternships: (updated: Internship[]) => void;
  onNavigate: (page: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  internships,
  onUpdateInternships,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'internships' | 'applications' | 'submissions' | 'certificates' | 'generate' | 'offer-letters'>('applications');

  // State loaded from StorageService
  const [applications, setApplications] = useState<Application[]>(() => StorageService.getApplications());
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(() => StorageService.getSubmissions());
  const [certificates, setCertificates] = useState<Certificate[]>(() => StorageService.getCertificates());
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>(() => StorageService.getOfferLetters());

  // Offer Letter preview & download state
  const [previewOfferLetter, setPreviewOfferLetter] = useState<OfferLetter | null>(null);
  const [downloadingOfferId, setDownloadingOfferId] = useState<string | null>(null);

  // Custom offer letter generator state
  const [offerStudentName, setOfferStudentName] = useState('');
  const [offerEmail, setOfferEmail] = useState('');
  const [offerCollege, setOfferCollege] = useState('National Institute of Technology');
  const [offerInternshipId, setOfferInternshipId] = useState(internships[0]?.id || 'INT-PYTHON-04');
  const [offerStartDate, setOfferStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [offerDuration, setOfferDuration] = useState('1 Month');

  // Internship Edit/Add Modal State
  const [isEditingInternship, setIsEditingInternship] = useState(false);
  const [currentInternship, setCurrentInternship] = useState<Partial<Internship>>({
    domain: 'Artificial Intelligence',
    rewardType: 'Performance-Based Reward',
    mode: 'Remote',
    projectsCount: 2,
    certificate: true,
    isActive: true,
    duration: '1 Month',
    learningOutcomes: ['Milestone 1 execution', 'Milestone 2 integration']
  });

  // Assign Project Modal / Input State
  const [assigningAppId, setAssigningAppId] = useState<string | null>(null);
  const [assignedProjectInput, setAssignedProjectInput] = useState('');

  // Certificate Generator Form State
  const [certStudentName, setCertStudentName] = useState('');
  const [certInternshipTitle, setCertInternshipTitle] = useState(internships[0]?.title || 'Generative AI Internship');
  const [certDomain, setCertDomain] = useState('Artificial Intelligence');
  const [certDuration, setCertDuration] = useState('1 Month');
  const [certCompletionDate, setCertCompletionDate] = useState(new Date().toISOString().split('T')[0]);
  const [customCertId, setCustomCertId] = useState(() => `CERT-2026-0000${StorageService.getCertificates().length + 1}`);
  const [generatedPreviewCert, setGeneratedPreviewCert] = useState<Certificate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Preview Certificate Modal in Records tab
  const [previewingCert, setPreviewingCert] = useState<Certificate | null>(null);

  // Global Google Form Link Configuration
  const [globalGoogleFormInput, setGlobalGoogleFormInput] = useState(() => StorageService.getGlobalGoogleFormUrl());
  const [formSavedFeedback, setFormSavedFeedback] = useState(false);

  const handleUpdateGlobalGoogleForm = (newUrl: string) => {
    const trimmed = newUrl.trim() || DEFAULT_VALID_GOOGLE_FORM_URL;
    const updated = StorageService.updateAllGoogleFormUrls(trimmed);
    onUpdateInternships(updated);
    setGlobalGoogleFormInput(trimmed);
    setFormSavedFeedback(true);
    setTimeout(() => setFormSavedFeedback(false), 3000);
  };

  // Handlers for Applications
  const handleAppStatus = (id: string, status: 'Accepted' | 'Rejected') => {
    const updated = StorageService.updateApplicationStatus(id, status);
    setApplications(updated);
    if (status === 'Accepted') {
      const app = updated.find(a => a.id === id);
      if (app) {
        StorageService.generateOfferLetterForApplication(app);
        setOfferLetters(StorageService.getOfferLetters());
      }
    }
  };

  const handleViewOfferForApp = (app: Application) => {
    const offer = StorageService.generateOfferLetterForApplication(app);
    setOfferLetters(StorageService.getOfferLetters());
    setPreviewOfferLetter(offer);
  };

  const handleDownloadOfferForApp = async (app: Application) => {
    try {
      setDownloadingOfferId(app.id);
      const offer = StorageService.generateOfferLetterForApplication(app);
      setOfferLetters(StorageService.getOfferLetters());
      await downloadOfferLetterPdf(offer);
    } catch (err) {
      console.error('Download offer error:', err);
    } finally {
      setDownloadingOfferId(null);
    }
  };

  const handleGenerateCustomOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerStudentName.trim() || !offerEmail.trim()) {
      alert('Please enter student name and email address.');
      return;
    }
    const targetInt = internships.find(i => i.id === offerInternshipId) || internships[0];
    const shortDomain = (targetInt?.domain || 'TECH').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const id = `OL-2026-${shortDomain}-${randomNum}`;
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date(new Date(offerStartDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const roles = targetInt?.learningOutcomes && targetInt.learningOutcomes.length > 0 
      ? targetInt.learningOutcomes.map(item => `Milestone Deliverable: ${item}`)
      : [
          'Complete assigned project coding tasks and submit clean commits to GitHub.',
          'Implement required algorithms, data structures, or web user interfaces.',
          'Ensure code maintainability, error handling, and documentation README.'
        ];

    const newOffer: OfferLetter = {
      id,
      studentName: offerStudentName.trim(),
      email: offerEmail.trim(),
      college: offerCollege.trim(),
      internshipId: targetInt.id,
      internshipTitle: targetInt.title,
      domain: targetInt.domain,
      duration: offerDuration,
      mode: 'Remote',
      startDate: offerStartDate,
      endDate,
      stipendOrReward: targetInt.rewardDetails || 'Structured project internship. No fee charged.',
      rolesAndResponsibilities: roles,
      issueDate: today,
      signatoryName: 'Dr. Vikramaditya Rao',
      signatoryTitle: 'Director of Technical Evaluation',
      organizationName: 'CodeNova',
      verificationCode: `CN-${shortDomain}-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`
    };

    const updated = StorageService.addOfferLetter(newOffer);
    setOfferLetters(updated);
    setPreviewOfferLetter(newOffer);
    setOfferStudentName('');
    setOfferEmail('');
    try {
      await downloadOfferLetterPdf(newOffer);
    } catch (err) {
      console.error('Auto download offer error:', err);
    }
  };

  const handleSaveAssignedProject = (id: string) => {
    if (!assignedProjectInput.trim()) return;
    const updated = StorageService.updateApplicationStatus(id, 'Accepted', assignedProjectInput.trim());
    setApplications(updated);
    setAssigningAppId(null);
    setAssignedProjectInput('');
  };

  // Handlers for Submissions
  const handleSubmissionStatus = (id: string, status: 'Approved' | 'Revision Required') => {
    const promptFeedback = prompt(
      `Enter mentor evaluation feedback for ${status}:`,
      status === 'Approved' ? 'Project deliverables verified and meets all requirements.' : 'Please add unit tests and ensure live demo URL is accessible.'
    );
    const updated = StorageService.updateSubmissionStatus(id, status, promptFeedback || undefined);
    setSubmissions(updated);
  };

  // Prefill generator from an approved submission or applicant
  const handlePrefillCert = (studentName: string, internshipTitle: string, domain?: string) => {
    setCertStudentName(studentName);
    setCertInternshipTitle(internshipTitle);
    if (domain) setCertDomain(domain);
    const nextId = `CERT-2026-0000${certificates.length + 1}`;
    setCustomCertId(nextId);
    setActiveTab('generate');
  };

  // Generate Certificate action
  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certStudentName.trim() || !customCertId.trim()) {
      alert('Please provide student name and Certificate ID.');
      return;
    }

    const verificationUrl = getCertificateVerifyUrl(customCertId.trim());

    const newCert: Certificate = {
      id: customCertId.trim().toUpperCase(),
      studentName: certStudentName.trim(),
      internshipTitle: certInternshipTitle.trim(),
      domain: certDomain,
      organizationName: 'CodeNova',
      duration: certDuration,
      completionDate: certCompletionDate,
      status: 'Valid',
      issueDate: new Date().toISOString().split('T')[0],
      verificationUrl,
      signatoryTitle: 'Technical Evaluation Director, CodeNova'
    };

    const updated = StorageService.addCertificate(newCert);
    setCertificates(updated);
    setGeneratedPreviewCert(newCert);

    // Auto-trigger PDF download as requested in technical requirements
    try {
      await downloadCertificatePdf(newCert);
    } catch (err) {
      console.error('Auto download PDF error:', err);
    }
  };

  // Save / Edit Internship
  const handleSaveInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInternship.title || !currentInternship.domain) return;

    if (currentInternship.id) {
      // Edit existing
      const updated = StorageService.updateInternship(currentInternship as Internship);
      onUpdateInternships(updated);
    } else {
      // Add new
      const newInt: Internship = {
        id: `INT-${currentInternship.domain?.substring(0, 4).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
        title: currentInternship.title || 'New Internship Program',
        domain: (currentInternship.domain as DomainType) || 'Artificial Intelligence',
        duration: currentInternship.duration || '1 Month',
        mode: 'Remote',
        eligibility: currentInternship.eligibility || 'Basic programming knowledge and curiosity.',
        projectsCount: Number(currentInternship.projectsCount) || 2,
        rewardType: (currentInternship.rewardType as RewardType) || 'Unpaid Internship',
        rewardDetails: currentInternship.rewardDetails || 'Transparent learning milestone program.',
        certificate: true,
        about: currentInternship.about || 'Hands-on practical training with verified project evaluation.',
        learningOutcomes: currentInternship.learningOutcomes || ['Milestone 1', 'Milestone 2'],
        projectDescription: currentInternship.projectDescription || 'Build and deploy two GitHub repositories.',
        selectionProcess: currentInternship.selectionProcess || 'Application review of GitHub profile.',
        completionCriteria: currentInternship.completionCriteria || 'Complete assigned milestone projects with documentation.',
        certificateCriteria: currentInternship.certificateCriteria || 'Approved project evaluation by technical mentor.',
        paymentPolicy: currentInternship.paymentPolicy || 'No fees charged.',
        googleFormUrl: currentInternship.googleFormUrl || '',
        isActive: true,
        createdDate: new Date().toISOString().split('T')[0]
      };
      const updated = StorageService.addInternship(newInt);
      onUpdateInternships(updated);
    }

    setIsEditingInternship(false);
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-500/30">
            <span>Organization Owner & Evaluator Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            CodeNova Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage internship cohorts, review student applications, evaluate GitHub submissions, and issue verifiable certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              StorageService.resetToDefault();
              setApplications(StorageService.getApplications());
              setSubmissions(StorageService.getSubmissions());
              setCertificates(StorageService.getCertificates());
              onUpdateInternships(StorageService.getInternships());
              alert('Storage reset to initial demo state!');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset to fresh demo data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            View Live Site
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-slate-800 dark:text-slate-200">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total Applications</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{applications.length}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              ({applications.filter(a => a.status === 'Pending').length} Pending)
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Project Submissions</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{submissions.length}</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              ({submissions.filter(s => s.status === 'Under Review').length} In Review)
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Offer Letters</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{offerLetters.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Issued</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Issued Certificates</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{certificates.length}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Verifiable</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Active Internships</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {internships.filter(i => i.isActive).length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Programs</span>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-1 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'applications'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Applications ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'submissions'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Project Submissions ({submissions.length})
          </button>

          <button
            onClick={() => setActiveTab('offer-letters')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'offer-letters'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Offer Letters ({offerLetters.length})
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'generate'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Generate Certificate
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'certificates'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Certificate Records ({certificates.length})
          </button>

          <button
            onClick={() => setActiveTab('internships')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'internships'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Manage Internships ({internships.length})
          </button>
        </nav>
      </div>

      {/* TAB 1: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Candidate Applications
            </h2>
            <span className="text-xs text-slate-500">
              Review profiles, verify GitHub links, and accept or reject candidates.
            </span>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400 font-medium">{app.id}</span>
                      <span className="text-xs text-slate-400">• Applied {app.appliedAt}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          app.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {app.studentName}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Applied for: <strong className="text-indigo-600">{app.internshipTitle}</strong>
                    </p>
                  </div>

                  {/* Actions (Accept, Reject, Assign Project) */}
                  <div className="flex flex-wrap items-center gap-2">
                    {app.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleAppStatus(app.id, 'Accepted')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleAppStatus(app.id, 'Rejected')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 text-red-600 hover:bg-red-50 border border-red-200"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {app.status === 'Accepted' && (
                      <button
                        onClick={() => {
                          setAssigningAppId(app.id);
                          setAssignedProjectInput(app.assignedProjectId || 'PRJ-GENAI-A1');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{app.assignedProjectId ? `Project: ${app.assignedProjectId}` : 'Assign Project'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handlePrefillCert(app.studentName, app.internshipTitle)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Issue Certificate</span>
                    </button>

                    <button
                      onClick={() => handleViewOfferForApp(app)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 shadow-2xs"
                      title="View Official Internship Offer Letter"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Offer Letter</span>
                    </button>

                    <button
                      onClick={() => handleDownloadOfferForApp(app)}
                      disabled={downloadingOfferId === app.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                      title="Download Offer Letter PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{downloadingOfferId === app.id ? 'PDF...' : 'PDF'}</span>
                    </button>
                  </div>
                </div>

                {/* Candidate Information Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 block">Education:</span>
                    <span className="font-medium text-slate-800">{app.college}</span>
                    <span className="text-slate-500 block text-[11px]">{app.degree} ({app.year})</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Contact:</span>
                    <span className="font-medium text-slate-800">{app.email}</span>
                    <span className="text-slate-500 block text-[11px]">{app.phone}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Links:</span>
                    <div className="flex items-center gap-3 pt-0.5">
                      {app.githubUrl && (
                        <a
                          href={app.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <Github className="w-3 h-3" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {app.linkedinUrl && (
                        <a
                          href={app.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          LinkedIn
                        </a>
                      )}
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-600">{app.resumeUrlOrFilename}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Skills: </span>
                  <span>{app.skills}</span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Applicant Statement: </span>
                  <span className="italic font-sans">"{app.whyApply}"</span>
                </div>

                {/* Assign Project Sub-form */}
                {assigningAppId === app.id && (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg flex items-center gap-3 text-xs">
                    <span className="font-semibold text-indigo-900">Assign Project ID:</span>
                    <input
                      type="text"
                      placeholder="e.g. PRJ-GENAI-A1"
                      value={assignedProjectInput}
                      onChange={(e) => setAssignedProjectInput(e.target.value)}
                      className="px-2.5 py-1 bg-white border border-indigo-300 rounded text-slate-800"
                    />
                    <button
                      onClick={() => handleSaveAssignedProject(app.id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
                    >
                      Save Assignment
                    </button>
                    <button
                      onClick={() => setAssigningAppId(null)}
                      className="px-2 py-1 text-slate-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Project Deliverables & Evaluations
            </h2>
            <span className="text-xs text-slate-500">
              Evaluate student repositories and approve for certificate generation.
            </span>
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400 font-medium">{sub.id}</span>
                      <span className="text-xs text-slate-400">• Submitted {sub.submittedAt}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          sub.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'Revision Required'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {sub.studentName} — <span className="text-indigo-600">{sub.internshipTitle}</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Target Project ID: <strong className="font-mono text-slate-700">{sub.projectId}</strong>
                    </p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleSubmissionStatus(sub.id, 'Approved')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Work</span>
                    </button>

                    <button
                      onClick={() => handleSubmissionStatus(sub.id, 'Revision Required')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Request Revision</span>
                    </button>

                    {sub.status === 'Approved' && (
                      <button
                        onClick={() => handlePrefillCert(sub.studentName, sub.internshipTitle)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Generate Certificate</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Deliverables Box */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    {sub.githubUrl && (
                      <a
                        href={sub.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:underline"
                      >
                        <Github className="w-4 h-4" />
                        <span>Inspect GitHub Repository</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {sub.liveDemoUrl && sub.liveDemoUrl !== 'N/A' && (
                      <a
                        href={sub.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:underline"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Open Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {sub.fileOrLinkSubmission && sub.fileOrLinkSubmission !== sub.githubUrl && (
                      <span className="text-slate-500">
                        Artifact Link: <a href={sub.fileOrLinkSubmission} target="_blank" rel="noreferrer" className="text-slate-700 underline">{sub.fileOrLinkSubmission}</a>
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed pt-1">
                    <strong>Description:</strong> {sub.projectDescription}
                  </p>
                </div>

                {sub.feedback && (
                  <div className="text-xs bg-slate-100/70 p-2.5 rounded border border-slate-200 text-slate-700">
                    <span className="font-semibold text-slate-900">Current Mentor Evaluation: </span>
                    <span>{sub.feedback}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OFFER LETTERS */}
      {activeTab === 'offer-letters' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Internship Offer Letters Management
              </h2>
              <p className="text-xs text-slate-500">
                Generate, preview, and download signed official offer letters for admitted students across all internship tracks.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {offerLetters.length} Letters Registered
            </span>
          </div>

          {/* Quick Create Offer Letter Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Issue New Offer Letter for Candidate</span>
            </h3>

            <form onSubmit={handleGenerateCustomOffer} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Verma"
                  value={offerStudentName}
                  onChange={(e) => setOfferStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aryan.verma@example.com"
                  value={offerEmail}
                  onChange={(e) => setOfferEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">College / University</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi Technological University"
                  value={offerCollege}
                  onChange={(e) => setOfferCollege(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Internship Program *</label>
                <select
                  value={offerInternshipId}
                  onChange={(e) => setOfferInternshipId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                >
                  {internships.map((int) => (
                    <option key={int.id} value={int.id}>
                      {int.title} ({int.domain})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Internship Start Date</label>
                <input
                  type="date"
                  value={offerStartDate}
                  onChange={(e) => setOfferStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate & Download PDF</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Issued Offer Letters */}
          <div className="space-y-3">
            {offerLetters.map((letter) => (
              <div
                key={letter.id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {letter.id}
                    </span>
                    <span className="text-xs text-slate-400">• Issued: {letter.issueDate}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {letter.mode} ({letter.duration})
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {letter.studentName}
                  </h4>

                  <p className="text-xs text-slate-600">
                    Role: <strong className="text-indigo-600">{letter.internshipTitle}</strong> • {letter.college}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Email: <strong className="text-slate-700">{letter.email}</strong></span>
                    <span>•</span>
                    <span>Term: <strong className="text-slate-700">{letter.startDate} to {letter.endDate}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">Ref: {letter.verificationCode}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPreviewOfferLetter(letter)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        setDownloadingOfferId(letter.id);
                        await downloadOfferLetterPdf(letter);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setDownloadingOfferId(null);
                      }
                    }}
                    disabled={downloadingOfferId === letter.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingOfferId === letter.id ? 'Generating...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GENERATE CERTIFICATE */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900">
              Certificate Generator Tool
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Issue an authenticated, organization-verified certificate. This will register the certificate ID in the public verification system and trigger a high-quality PDF download.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <form onSubmit={handleGenerateCertificate} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={certStudentName}
                    onChange={(e) => setCertStudentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Internship Program Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={certInternshipTitle}
                    onChange={(e) => {
                      setCertInternshipTitle(e.target.value);
                      const found = internships.find(i => i.title === e.target.value);
                      if (found) {
                        setCertDomain(found.domain);
                        setCertDuration(found.duration);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  >
                    {internships.map((i) => (
                      <option key={i.id} value={i.title}>
                        {i.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Domain
                    </label>
                    <input
                      type="text"
                      value={certDomain}
                      onChange={(e) => setCertDomain(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={certDuration}
                      onChange={(e) => setCertDuration(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      value={certCompletionDate}
                      onChange={(e) => setCertCompletionDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Unique Certificate ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customCertId}
                      onChange={(e) => setCustomCertId(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-white border border-slate-300 rounded-lg text-indigo-600"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
                  >
                    <Award className="w-4 h-4" />
                    <span>Generate Certificate & Download PDF</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview of Generated Certificate */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Live Credential Preview
              </h3>

              {generatedPreviewCert ? (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
                    <span>Certificate generated and logged to registry!</span>
                    <button
                      onClick={() => onNavigate('verify', generatedPreviewCert.id)}
                      className="text-indigo-600 hover:underline font-semibold"
                    >
                      Test in Public Verifier ↗
                    </button>
                  </div>
                  <CertificateDisplay certificate={generatedPreviewCert} />
                </div>
              ) : (
                <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-xs text-slate-400">
                  <Award className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  Fill out the form on the left and click "Generate Certificate" to generate and preview the official credential.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICATE RECORDS */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Official Certificate Records
              </h2>
              <p className="text-xs text-slate-500">
                All issued certificates can be validated via the public portal or downloaded as official PDFs.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('generate')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue New</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Certificate ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Internship Program</th>
                    <th className="py-3 px-4">Completion Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        {cert.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {cert.studentName}
                      </td>
                      <td className="py-3 px-4">
                        {cert.internshipTitle}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {cert.completionDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Valid
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setPreviewingCert(cert)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="View Preview"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => downloadCertificatePdf(cert)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold"
                          title="Download PDF"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>

                        <button
                          onClick={() => onNavigate('verify', cert.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Open in Public Verifier"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verify</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Preview */}
          {previewingCert && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Certificate Credential: {previewingCert.id}
                  </h3>
                  <button
                    onClick={() => setPreviewingCert(null)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>
                <CertificateDisplay certificate={previewingCert} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MANAGE INTERNSHIPS */}
      {activeTab === 'internships' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Manage Internship Programs
            </h2>
            <button
              onClick={() => {
                setCurrentInternship({
                  domain: 'Artificial Intelligence',
                  rewardType: 'Performance-Based Reward',
                  mode: 'Remote',
                  projectsCount: 2,
                  certificate: true,
                  isActive: true,
                  duration: '1 Month',
                  learningOutcomes: ['Milestone 1', 'Milestone 2']
                });
                setIsEditingInternship(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Internship</span>
            </button>
          </div>

          {/* Organization Google Form Intake Link Setting */}
          <div className="bg-gradient-to-r from-indigo-50/90 to-purple-50/60 border border-indigo-200/80 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                  Intake Integration
                </span>
                <h3 className="text-sm font-bold text-indigo-950">
                  Global Google Form Application Link
                </h3>
              </div>
              <a
                href={globalGoogleFormInput}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 self-start sm:self-auto underline"
              >
                <span>Test Live Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-indigo-900/80">
              All students can apply either via the on-site CodeNova application flow or via your official Google Form. Set your organization's Google Form link here to update all internship cards and application buttons at once.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={globalGoogleFormInput}
                onChange={(e) => setGlobalGoogleFormInput(e.target.value)}
                placeholder="https://docs.google.com/forms/d/e/.../viewform or https://forms.gle/..."
                className="flex-1 px-3 py-2 bg-white border border-indigo-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleUpdateGlobalGoogleForm(globalGoogleFormInput)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                >
                  Update All Programs
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateGlobalGoogleForm(DEFAULT_VALID_GOOGLE_FORM_URL)}
                  className="px-3 py-2 bg-white hover:bg-indigo-50 border border-indigo-300 text-indigo-700 rounded-lg text-xs font-medium transition-colors"
                  title="Reset to default valid form link"
                >
                  Reset Default
                </button>
              </div>
            </div>

            {formSavedFeedback && (
              <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Google Form URL successfully updated across all active internship programs!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internships.map((int) => (
              <div
                key={int.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400">{int.id}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {int.domain}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{int.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{int.about}</p>

                  <div className="grid grid-cols-2 gap-2 my-3 p-2 bg-slate-50 rounded text-xs text-slate-600">
                    <div>Duration: <strong>{int.duration}</strong></div>
                    <div>Tasks: <strong>{int.projectsCount}</strong></div>
                    <div className="col-span-2">Policy: <strong>{int.rewardType}</strong></div>
                  </div>

                  {int.googleFormUrl && (
                    <div className="text-[11px] text-slate-500 mb-2 truncate">
                      Google Form: <span className="text-indigo-600">{int.googleFormUrl}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Status: {int.isActive ? 'Active Cohort' : 'Archived'}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentInternship(int);
                      setIsEditingInternship(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Internship Modal */}
          {isEditingInternship && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-slate-900 text-base">
                    {currentInternship.id ? 'Edit Internship' : 'Add New Internship Program'}
                  </h3>
                  <button
                    onClick={() => setIsEditingInternship(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveInternship} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Internship Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cloud & DevOps Engineering"
                      value={currentInternship.title || ''}
                      onChange={(e) => setCurrentInternship({ ...currentInternship, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Domain</label>
                      <select
                        value={currentInternship.domain || 'Artificial Intelligence'}
                        onChange={(e) => setCurrentInternship({ ...currentInternship, domain: e.target.value as DomainType })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                      >
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Python Development">Python Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 1 Month or 2 Months"
                        value={currentInternship.duration || '1 Month'}
                        onChange={(e) => setCurrentInternship({ ...currentInternship, duration: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Compensation Policy</label>
                      <select
                        value={currentInternship.rewardType || 'Unpaid Internship'}
                        onChange={(e) => setCurrentInternship({ ...currentInternship, rewardType: e.target.value as RewardType })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                      >
                        <option value="Unpaid Internship">Unpaid Internship</option>
                        <option value="Performance-Based Reward">Performance-Based Reward</option>
                        <option value="Stipend">Stipend Available</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Number of Tasks / Projects</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={currentInternship.projectsCount || 2}
                        onChange={(e) => setCurrentInternship({ ...currentInternship, projectsCount: parseInt(e.target.value) || 2 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Google Form Link Setting */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Google Form URL (Optional intake link)</label>
                    <input
                      type="url"
                      placeholder="https://forms.gle/..."
                      value={currentInternship.googleFormUrl || ''}
                      onChange={(e) => setCurrentInternship({ ...currentInternship, googleFormUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">About the Internship</label>
                    <textarea
                      rows={2}
                      value={currentInternship.about || ''}
                      onChange={(e) => setCurrentInternship({ ...currentInternship, about: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Project / Task Descriptions</label>
                    <textarea
                      rows={2}
                      value={currentInternship.projectDescription || ''}
                      onChange={(e) => setCurrentInternship({ ...currentInternship, projectDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Eligibility Criteria</label>
                    <input
                      type="text"
                      value={currentInternship.eligibility || ''}
                      onChange={(e) => setCurrentInternship({ ...currentInternship, eligibility: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingInternship(false)}
                      className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
                    >
                      Save Internship
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offer Letter Preview Modal */}
      {previewOfferLetter && (
        <OfferLetterModal
          offerLetter={previewOfferLetter}
          onClose={() => setPreviewOfferLetter(null)}
        />
      )}
    </div>
  );
};
