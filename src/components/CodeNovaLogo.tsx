import React from 'react';
import codenovaLogoImg from '../assets/images/codenova_logo_1789801813750.jpg';

interface CodeNovaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showStudentBadge?: boolean;
  className?: string;
  inverted?: boolean;
}

export const CodeNovaLogo: React.FC<CodeNovaLogoProps> = ({
  size = 'md',
  showText = true,
  showStudentBadge = true,
  className = '',
  inverted = false,
}) => {
  const sizeMap = {
    sm: {
      img: 'w-7 h-7',
      text: 'text-base',
      badge: 'text-[9px] px-1 py-0.2',
      tagline: 'text-[9px]',
    },
    md: {
      img: 'w-9 h-9',
      text: 'text-xl',
      badge: 'text-[10px] px-1.5 py-0.5',
      tagline: 'text-[10px]',
    },
    lg: {
      img: 'w-12 h-12',
      text: 'text-2xl',
      badge: 'text-xs px-2 py-0.5',
      tagline: 'text-xs',
    },
    xl: {
      img: 'w-16 h-16',
      text: 'text-3xl',
      badge: 'text-xs px-2.5 py-1',
      tagline: 'text-sm',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo Emblem Icon */}
      <div className={`relative ${currentSize.img} rounded-xl overflow-hidden shadow-xs ring-1 ring-slate-900/10 dark:ring-white/10 shrink-0 group`}>
        <img
          src={codenovaLogoImg}
          alt="CodeNova Logo for Students"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-xl pointer-events-none" />
      </div>

      {/* Brand Typography & Student Badge */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${currentSize.text} ${
                inverted
                  ? 'text-white'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              Code<span className="text-indigo-600 dark:text-indigo-400">Nova</span>
            </span>

            {showStudentBadge && (
              <span
                className={`font-bold uppercase tracking-wider rounded-md font-mono ${currentSize.badge} ${
                  inverted
                    ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                }`}
              >
                for Students
              </span>
            )}
          </div>
          <span
            className={`font-medium tracking-normal ${currentSize.tagline} ${
              inverted
                ? 'text-slate-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Student Tech Internships
          </span>
        </div>
      )}
    </div>
  );
};
