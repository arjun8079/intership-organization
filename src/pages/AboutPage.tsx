import React from 'react';
import { 
  Code2, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  Target, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <span>About CodeNova</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Practical, Project-Based Tech Learning
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          CodeNova was founded to bridge the gap between textbook programming theory and actual software engineering execution through hands-on project milestones.
        </p>
      </div>

      {/* 4 Key Pillars from prompt:
          1. Who we are
          2. What we do
          3. Why we provide project-based internships
          4. Our focus on practical learning */}
      <div className="space-y-8">
        {/* 1. Who We Are */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
            <Code2 className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Who We Are</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            CodeNova is an early-stage, independent technology initiative run by practicing software developers, AI practitioners, and tech educators. We are not a venture-backed gig marketplace, a social network, or an academic university. We are a focused developer workspace dedicated to guiding students through their first real-world technical deliverables.
          </p>
        </section>

        {/* 2. What We Do */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
            <Terminal className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">What We Do</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We curate structured, remote internship cohorts across high-demand domains:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-1">Generative AI & LLMs</strong>
              Prompt engineering, structured outputs, vector embeddings, and RAG architectures.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-1">Machine Learning</strong>
              Predictive models, exploratory data analysis, and scikit-learn/PyTorch pipelines.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-1">Full-Stack Web Development</strong>
              React, modern CSS utility architecture, Express APIs, and cloud deployments.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-1">Python Automation & Data Science</strong>
              Web scrapers, backend CLI utilities, SQL querying, and executive dashboards.
            </div>
          </div>
        </section>

        {/* 3. Why We Provide Project-Based Internships */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
            <Target className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Why We Provide Project-Based Internships</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Traditional internships often relegate early-year students to mundane observation or generic slide creation. Conversely, pure tutorial courses leave learners with tutorial paralysis—unable to write code without step-by-step videos.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            By assigning structured project milestones with explicit evaluation criteria, we enable students to simulate an authentic engineering sprint: drafting architecture, pushing Git commits, handling edge cases, and defending their code through live reviews.
          </p>
        </section>

        {/* 4. Focus on Practical Learning */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
            <Compass className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Our Focus on Practical Learning</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span><strong className="text-slate-800 dark:text-slate-200">Git & Version Control:</strong> Every line of code must be pushed to a public GitHub repository with clear commit histories.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span><strong className="text-slate-800 dark:text-slate-200">Deployed Artifacts:</strong> Interns learn to host frontends, wrap scripts in APIs, or publish interactive dashboards.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span><strong className="text-slate-800 dark:text-slate-200">Verifiable Credentials:</strong> Every completed internship produces an authenticated, tamper-evident certificate with public verification URL and QR code.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Clear Transparency & Independence Statement */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Transparency & Non-Accreditation Notice
        </h3>
        <p className="leading-relaxed">
          CodeNova operates as an independent platform. We do not claim any government affiliation, university degree equivalence, or official academic accreditation. We do not make false placement promises or claim fake corporate partnerships.
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
          Our goal is simple: helping students build tangible code repositories and verifiable project track records.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 text-center">
        <button
          onClick={() => onNavigate('internships')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <span>Explore Open Cohorts</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
