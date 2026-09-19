import React from 'react';
import { Code2, Github, Linkedin, Mail, ShieldCheck, ExternalLink, ArrowUpRight } from 'lucide-react';
import { CodeNovaLogo } from './CodeNovaLogo';

interface FooterProps {
  onNavigate: (page: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Disclaimer Banner */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-3 text-center text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-300">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Independent Organization Notice:
        </span>{' '}
        CodeNova is a private, independent technology initiative. Our certificates certify completion of internal project tasks and practical code reviews; we make no claim to government accreditation or university degrees.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="cursor-pointer"
            >
              <CodeNovaLogo size="md" inverted={true} showStudentBadge={true} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Learn. Build. Prove Your Skills." Practical, project-based internships in AI, Machine Learning, Web Development, and Python.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com/codenova-tech" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="CodeNova GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/company/codenova-tech" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="CodeNova LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="mailto:contact@codenova.tech" 
                className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('internships')} className="hover:text-white transition-colors">
                  Explore Internships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('apply')} className="hover:text-white transition-colors">
                  Apply Online
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('submit')} className="hover:text-white transition-colors">
                  Submit Project Work
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="hover:text-white transition-colors">
                  Offer Letter Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verify')} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Verify Certificate</span>
                  <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Internship Domains */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Focus Domains</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Artificial Intelligence & Generative AI</li>
              <li>Machine Learning & Predictive Modeling</li>
              <li>Full Stack Web Development</li>
              <li>Python Automation & Backend Engineering</li>
              <li>Data Science & Business Analytics</li>
            </ul>
          </div>

          {/* Organization & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Verification & Contact</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Employers or institutions can authenticate any certificate using our public registry.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('verify')}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verify by Certificate ID</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Official Contact: <a href="mailto:contact@codenova.tech" className="text-indigo-400 hover:underline">contact@codenova.tech</a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CodeNova. All rights reserved. Built for student skill acceleration.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300">About CodeNova</button>
            <span>•</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300">Contact Us</button>
            <span>•</span>
            <button onClick={() => onNavigate('verify')} className="hover:text-slate-300">Certificate Portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
