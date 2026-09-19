import React, { useState } from 'react';
import { Internship, ProjectSubmission } from '../types';
import { StorageService } from '../utils/storage';
import { 
  FileCode, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Github, 
  Globe, 
  HelpCircle,
  FileText
} from 'lucide-react';

interface ProjectSubmissionPageProps {
  internships: Internship[];
  onNavigate: (page: string, param?: string) => void;
}

export const ProjectSubmissionPage: React.FC<ProjectSubmissionPageProps> = ({
  internships,
  onNavigate,
}) => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [internshipId, setInternshipId] = useState(internships[0]?.id || '');
  const [projectId, setProjectId] = useState('PRJ-01');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [fileOrLinkSubmission, setFileOrLinkSubmission] = useState('');
  
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submissionsList, setSubmissionsList] = useState<ProjectSubmission[]>(() => StorageService.getSubmissions());

  const selectedInternship = internships.find((i) => i.id === internshipId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!studentName.trim() || !email.trim() || !projectId.trim() || !githubUrl.trim() || !projectDescription.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please complete all required fields (Student Name, Email, Project ID, GitHub Repo URL, and Project Description).'
      });
      return;
    }

    const newSub: ProjectSubmission = {
      id: `SUB-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName: studentName.trim(),
      email: email.trim(),
      internshipId,
      internshipTitle: selectedInternship ? selectedInternship.title : 'Technology Internship',
      projectId: projectId.trim(),
      githubUrl: githubUrl.trim(),
      liveDemoUrl: liveDemoUrl.trim() || 'N/A',
      projectDescription: projectDescription.trim(),
      fileOrLinkSubmission: fileOrLinkSubmission.trim() || githubUrl.trim(),
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      feedback: 'Submission logged into evaluation queue. Evaluation typically takes 48–72 hours.'
    };

    const updated = StorageService.addSubmission(newSub);
    setSubmissionsList(updated);

    setStatusMessage({
      type: 'success',
      text: `Your project (${newSub.id}) has been submitted successfully! Mentors will review your GitHub repository.`
    });

    // Reset some inputs
    setProjectId('');
    setProjectDescription('');
    setLiveDemoUrl('');
    setFileOrLinkSubmission('');
  };

  const getStatusBadge = (status: ProjectSubmission['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Approved
          </span>
        );
      case 'Revision Required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Revision Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
            <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Under Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Project Submission Portal
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Selected interns can submit their milestone project repositories, live preview links, and documentation for technical evaluation and certificate eligibility.
        </p>
      </div>

      {/* Submission Instructions Box */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-xs text-slate-700 dark:text-slate-300 space-y-2">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Submission Requirements Checklist
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 pt-1">
          <li className="flex items-start gap-1.5">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            Public GitHub repository with descriptive README and setup instructions.
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            Working live deployment URL (e.g. Vercel, Render, or Colab/HuggingFace).
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            Independent source code; all external libraries must be documented.
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            Include your assigned Project ID (e.g. PRJ-GENAI-A1, Task 1, or Task 2).
          </li>
        </ul>
      </div>

      {/* Submission Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {statusMessage && (
            <div
              className={`p-4 rounded-lg text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-semibold block">{statusMessage.text}</span>
                {statusMessage.type === 'success' && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Once marked as Approved by the mentor team in the Admin Portal, an official certificate can be generated.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Full name matching your application"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Registered Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            {/* Internship ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Internship Program <span className="text-red-500">*</span>
              </label>
              <select
                value={internshipId}
                onChange={(e) => setInternshipId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              >
                {internships.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title} ({i.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Project ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Project ID / Milestone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PRJ-GENAI-A1 or Task 1"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-2"></div>

          {/* URLs & Deliverables */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                <span>GitHub Repository URL <span className="text-red-500">*</span></span>
              </label>
              <input
                type="url"
                required
                placeholder="https://github.com/your-username/your-project-repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Ensure the repository is public or access is granted to mentors.</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                <span>Live Demo URL (Optional if CLI/Backend tool)</span>
              </label>
              <input
                type="url"
                placeholder="https://your-app.vercel.app or demo recording link"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                File / Additional Link Submission (Documentation, Drive Folder, or Video Walkthrough)
              </label>
              <input
                type="text"
                placeholder="e.g. https://drive.google.com/drive/folders/... or link to Loom demo"
                value={fileOrLinkSubmission}
                onChange={(e) => setFileOrLinkSubmission(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Project Description & Architecture Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe your tech stack, key technical challenges overcome, and instructions on how to test your project..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Project for Review</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submissions Log (Student Tracker) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Evaluation Activity & Recent Submissions
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track the evaluation status of project deliverables submitted across cohorts.
        </p>

        <div className="space-y-3">
          {submissionsList.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500 font-medium">{sub.id}</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {sub.studentName} — <span className="text-indigo-600 dark:text-indigo-400">{sub.internshipTitle}</span>
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 dark:text-slate-500">{sub.submittedAt}</span>
                  {getStatusBadge(sub.status)}
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
                  <span>Project ID: <strong className="text-slate-800 dark:text-slate-200">{sub.projectId}</strong></span>
                  {sub.githubUrl && (
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Github className="w-3 h-3" />
                      <span>Repo</span>
                    </a>
                  )}
                  {sub.liveDemoUrl && sub.liveDemoUrl !== 'N/A' && (
                    <a
                      href={sub.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
                <p className="pt-1 text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{sub.projectDescription}</p>
              </div>

              {sub.feedback && (
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-indigo-50/40 dark:bg-indigo-950/40 p-2.5 rounded border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Mentor Evaluation Feedback: </span>
                    <span>{sub.feedback}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
