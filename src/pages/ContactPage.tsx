import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send, CheckCircle2, MessageSquare, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact CodeNova
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Have questions about internship programs, project submissions, or certificate verification? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Col */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Official Channels
            </h2>

            {/* Official Email from prompt */}
            <div className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Official Inquiries</span>
                <a
                  href="mailto:contact@codenova.tech"
                  className="font-semibold text-slate-900 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 break-all"
                >
                  contact@codenova.tech
                </a>
              </div>
            </div>

            {/* LinkedIn from prompt */}
            <div className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Linkedin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">LinkedIn Community</span>
                <a
                  href="https://linkedin.com/company/codenova-tech"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-900 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  linkedin.com/company/codenova-tech
                </a>
              </div>
            </div>

            {/* GitHub from prompt */}
            <div className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Github className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">GitHub Organization</span>
                <a
                  href="https://github.com/codenova-tech"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-900 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  github.com/codenova-tech
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Support Hours</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Monday to Friday: 9:00 AM – 6:00 PM IST.<br />
              Typical email response within 24–48 hours.
            </p>
          </div>
        </div>

        {/* Contact Form Col */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 md:col-span-2 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Send a Direct Message
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">Message Sent Successfully</h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto">
                Thank you for contacting CodeNova. Our mentoring and evaluations coordinator will follow up at your provided email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-3 py-1.5 rounded text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Roy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priyanshu@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Topic / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Question regarding Generative AI tasks or certificate status"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
