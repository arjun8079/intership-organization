import React, { useState, useEffect } from 'react';
import { Internship, Application } from '../types';
import { StorageService } from '../utils/storage';
import { DEFAULT_VALID_GOOGLE_FORM_URL } from '../data/initialData';
import { 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  UploadCloud, 
  FileText, 
  ArrowRight, 
  ShieldCheck,
  AlertCircle,
  Edit2,
  Check
} from 'lucide-react';

interface ApplyPageProps {
  internships: Internship[];
  preselectedInternshipId?: string;
  onNavigate: (page: string, param?: string) => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({
  internships,
  preselectedInternshipId,
  onNavigate,
}) => {
  const [selectedInternshipId, setSelectedInternshipId] = useState(preselectedInternshipId || '');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech / B.E.');
  const [year, setYear] = useState('3rd Year');
  const [skills, setSkills] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFilename, setResumeFilename] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [whyApply, setWhyApply] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);

  useEffect(() => {
    if (preselectedInternshipId) {
      setSelectedInternshipId(preselectedInternshipId);
    } else if (internships.length > 0 && !selectedInternshipId) {
      setSelectedInternshipId(internships[0].id);
    }
  }, [preselectedInternshipId, internships]);

  const [isEditingFormUrl, setIsEditingFormUrl] = useState(false);
  const [customFormUrlInput, setCustomFormUrlInput] = useState('');
  const [formUrlSavedNotice, setFormUrlSavedNotice] = useState(false);

  const selectedInternship = internships.find((i) => i.id === selectedInternshipId);
  const activeGoogleFormUrl = selectedInternship?.googleFormUrl || DEFAULT_VALID_GOOGLE_FORM_URL;

  const handleSaveCustomGoogleForm = () => {
    if (!customFormUrlInput.trim()) return;
    StorageService.updateAllGoogleFormUrls(customFormUrlInput.trim());
    setFormUrlSavedNotice(true);
    setIsEditingFormUrl(false);
    setTimeout(() => setFormUrlSavedNotice(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFilename(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !college.trim() || !skills.trim() || !whyApply.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, College, Skills, and Statement).');
      return;
    }

    if (!consentAccepted) {
      setErrorMsg('You must agree to the data submission consent checkbox to proceed.');
      return;
    }

    const newApp: Application = {
      id: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || 'N/A',
      college: college.trim(),
      degree,
      year,
      skills: skills.trim(),
      githubUrl: githubUrl.trim() || 'https://github.com',
      linkedinUrl: linkedinUrl.trim() || 'https://linkedin.com',
      resumeUrlOrFilename: resumeFilename || resumeUrl.trim() || 'Resume_Attached.pdf',
      internshipId: selectedInternshipId,
      internshipTitle: selectedInternship ? selectedInternship.title : 'General Tech Internship',
      whyApply: whyApply.trim(),
      consentAccepted: true,
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0]
    };

    StorageService.addApplication(newApp);
    setSubmittedApp(newApp);
  };

  if (submittedApp) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Application Submitted Successfully!
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Thank you, <strong className="text-slate-800 dark:text-slate-200">{submittedApp.studentName}</strong>. Your application for{' '}
            <strong className="text-slate-800 dark:text-slate-200">{submittedApp.internshipTitle}</strong> has been logged.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Application Reference ID:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{submittedApp.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Date Received:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{submittedApp.appliedAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Status:</span>
            <span className="font-medium px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              Under Review (3-5 business days)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          We will review your GitHub and technical background. If accepted, you will receive an acceptance notice and project assignments.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('internships')}
            className="px-4 py-2 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            Explore Other Internships
          </button>
          <button
            onClick={() => onNavigate('submit')}
            className="px-4 py-2 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
          >
            Go to Project Submission Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Apply for an Internship
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Join our project-based cohorts. No fees, practical code reviews, and authenticated credentials upon project completion.
        </p>
      </div>

      {/* Alternative Google Form Box (as requested in prompt) */}
      <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                Google Form Option
              </span>
              <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                Prefer applying via official Google Forms?
              </h3>
            </div>
            <p className="text-xs text-indigo-800 dark:text-indigo-300">
              You can fill out our official intake Google Form directly using your Google account to upload your resume and portfolio.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={activeGoogleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs transition-colors"
            >
              <span>Open Google Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                setCustomFormUrlInput(activeGoogleFormUrl);
                setIsEditingFormUrl(!isEditingFormUrl);
              }}
              className="px-2.5 py-2 rounded-lg text-xs font-medium border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer"
              title="Edit or provide your own custom Google Form URL"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Inline Custom Google Form Link Editor */}
        {isEditingFormUrl && (
          <div className="p-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs space-y-2 mt-2">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Customize Google Form Link for this Organization:
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={customFormUrlInput}
                onChange={(e) => setCustomFormUrlInput(e.target.value)}
                placeholder="https://docs.google.com/forms/d/e/.../viewform or https://forms.gle/..."
                className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleSaveCustomGoogleForm}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingFormUrl(false)}
                className="px-2 py-1.5 text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Changes apply across all program cards and direct intake links immediately.
            </p>
          </div>
        )}

        {formUrlSavedNotice && (
          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Google Form link updated successfully!</span>
          </div>
        )}
      </div>

      {/* Main Application Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Internship Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Internship Program <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedInternshipId}
              onChange={(e) => setSelectedInternshipId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              required
            >
              {internships.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title} ({i.domain} - {i.duration}, {i.rewardType})
                </option>
              ))}
            </select>
            {selectedInternship && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-4 gap-y-1">
                <span>Duration: <strong className="text-slate-800 dark:text-slate-200">{selectedInternship.duration}</strong></span>
                <span>Mode: <strong className="text-slate-800 dark:text-slate-200">{selectedInternship.mode}</strong></span>
                <span>Reward: <strong className="text-slate-800 dark:text-slate-200">{selectedInternship.rewardType}</strong></span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4"></div>

          {/* Section 2: Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. aarav@student.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                College / University <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Delhi Technological University"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Degree Program <span className="text-red-500">*</span>
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              >
                <option value="B.Tech / B.E.">B.Tech / B.E. (Computer Science, IT, Electronics)</option>
                <option value="B.Sc / BS">B.Sc / BS in CS or Data Science</option>
                <option value="BCA">BCA (Computer Applications)</option>
                <option value="M.Tech / MS">M.Tech / MS / MCA</option>
                <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                <option value="Other">Other / Self-Taught</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4"></div>

          {/* Section 3: Technical Skills & Profiles */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Relevant Skills & Technologies <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Python, Git, PyTorch, React, SQL, FastAPI"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Comma-separated list of frameworks and tools you have practiced.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  GitHub Profile URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Resume Upload / Link */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resume (File Upload or Public Link) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File Upload input */}
                <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-3 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <UploadCloud className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <label className="cursor-pointer text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline block">
                    <span>{resumeFilename ? resumeFilename : 'Select PDF file'}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400">PDF or DOCX (up to 5MB)</span>
                </div>

                {/* URL input fallback */}
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">Or provide Google Drive / Dropbox link:</span>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/.../resume.pdf"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Why do you want this internship */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Why do you want this internship? <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Briefly explain what projects you hope to build and how this program supports your career goals..."
                value={whyApply}
                onChange={(e) => setWhyApply(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4"></div>

          {/* Consent Checkbox */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                I hereby consent to submitting my personal, educational, and technical profile information to CodeNova for the purpose of internship evaluation and credential verification. I understand that CodeNova is an independent organization and does not charge any application or hidden placement fees.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('internships')}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
