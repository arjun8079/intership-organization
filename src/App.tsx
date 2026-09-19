/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { InternshipsPage } from './pages/InternshipsPage';
import { ApplyPage } from './pages/ApplyPage';
import { ProjectSubmissionPage } from './pages/ProjectSubmissionPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OfferLettersPage } from './pages/OfferLettersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { InternshipDetailsModal } from './components/InternshipDetailsModal';
import { OfferLetterModal } from './components/OfferLetterModal';
import { Internship, OfferLetter } from './types';
import { StorageService } from './utils/storage';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParam, setPageParam] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [internships, setInternships] = useState<Internship[]>(() => StorageService.getInternships());
  const [selectedInternshipForModal, setSelectedInternshipForModal] = useState<Internship | null>(null);
  const [selectedOfferLetterForModal, setSelectedOfferLetterForModal] = useState<OfferLetter | null>(null);

  // Check URL query parameters on initial load (e.g. ?cert=CERT-2026-00001 or ?page=verify&cert=... or ?offer=OFF-2026-00001)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      const cert = urlParams.get('cert') || urlParams.get('certId') || (page === 'verify' ? urlParams.get('id') : null);
      const offer = urlParams.get('offer') || urlParams.get('offerId') || (page === 'offers' ? urlParams.get('id') : null);
      
      const path = window.location.pathname.toLowerCase();
      if (cert) {
        setCurrentPage('verify');
        setPageParam(cert);
      } else if (offer) {
        setCurrentPage('offers');
        setPageParam(offer);
      } else if (page) {
        setCurrentPage(page);
        if (urlParams.get('id')) {
          setPageParam(urlParams.get('id')!);
        }
      } else if (path.includes('/verify')) {
        setCurrentPage('verify');
        if (urlParams.get('id')) setPageParam(urlParams.get('id')!);
      } else if (path.includes('/offers')) {
        setCurrentPage('offers');
        if (urlParams.get('id')) setPageParam(urlParams.get('id')!);
      }
    } catch (e) {
      console.warn('URL param parse error:', e);
    }
  }, []);

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page);
    setPageParam(param);
    setIsAdminOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFromModal = (internshipId: string) => {
    setSelectedInternshipForModal(null);
    handleNavigate('apply', internshipId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-950 dark:selection:text-indigo-200 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentPage={isAdminOpen ? 'admin' : currentPage}
        onNavigate={handleNavigate}
        isAdmin={isAdminOpen}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isAdminOpen ? (
          <AdminDashboard
            internships={internships}
            onUpdateInternships={setInternships}
            onNavigate={(page, param) => {
              setIsAdminOpen(false);
              handleNavigate(page, param);
            }}
          />
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage
                internships={internships}
                onNavigate={handleNavigate}
                onSelectInternship={setSelectedInternshipForModal}
              />
            )}

            {currentPage === 'internships' && (
              <InternshipsPage
                internships={internships}
                onNavigate={handleNavigate}
                onSelectInternship={setSelectedInternshipForModal}
              />
            )}

            {currentPage === 'apply' && (
              <ApplyPage
                internships={internships}
                preselectedInternshipId={pageParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'submit' && (
              <ProjectSubmissionPage
                internships={internships}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'offers' && (
              <OfferLettersPage
                internships={internships}
                onNavigate={handleNavigate}
                initialOfferId={pageParam}
              />
            )}

            {currentPage === 'verify' && (
              <VerifyCertificatePage
                initialCertId={pageParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'contact' && (
              <ContactPage />
            )}
          </>
        )}
      </main>

      {/* Internship Details Modal */}
      {selectedInternshipForModal && (
        <InternshipDetailsModal
          internship={selectedInternshipForModal}
          onClose={() => setSelectedInternshipForModal(null)}
          onApply={handleApplyFromModal}
          onViewOfferLetter={(internship) => {
            setSelectedInternshipForModal(null);
            setSelectedOfferLetterForModal(StorageService.generateSampleOfferLetterForInternship(internship));
          }}
        />
      )}

      {/* Offer Letter View/Download Modal */}
      {selectedOfferLetterForModal && (
        <OfferLetterModal
          offerLetter={selectedOfferLetterForModal}
          onClose={() => setSelectedOfferLetterForModal(null)}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

