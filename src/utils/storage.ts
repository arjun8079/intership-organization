import { Internship, Application, ProjectSubmission, Certificate, OfferLetter } from '../types';
import { 
  INITIAL_INTERNSHIPS, 
  INITIAL_APPLICATIONS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_CERTIFICATES,
  INITIAL_OFFER_LETTERS,
  DEFAULT_VALID_GOOGLE_FORM_URL
} from '../data/initialData';
import { getCertificateVerifyUrl, getOfferVerifyUrl } from './verificationUrls';

const STORAGE_KEYS = {
  INTERNSHIPS: 'codenova_internships_v1',
  APPLICATIONS: 'codenova_applications_v1',
  SUBMISSIONS: 'codenova_submissions_v1',
  CERTIFICATES: 'codenova_certificates_v1',
  OFFER_LETTERS: 'codenova_offer_letters_v1',
  CUSTOM_GOOGLE_FORM: 'codenova_global_google_form_url',
};

// Legacy keys for migration
const LEGACY_STORAGE_KEYS = {
  INTERNSHIPS: 'internza_internships_v1',
  APPLICATIONS: 'internza_applications_v1',
  SUBMISSIONS: 'internza_submissions_v1',
  CERTIFICATES: 'internza_certificates_v1',
  OFFER_LETTERS: 'internza_offer_letters_v1',
  CUSTOM_GOOGLE_FORM: 'internza_global_google_form_url',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    let data = localStorage.getItem(key);
    if (!data) {
      // Check legacy key if migrating
      const legacyKey = (LEGACY_STORAGE_KEYS as Record<string, string>)[
        Object.keys(STORAGE_KEYS).find(k => (STORAGE_KEYS as Record<string, string>)[k] === key) || ''
      ];
      if (legacyKey) {
        data = localStorage.getItem(legacyKey);
        if (data) {
          // Replace legacy brand name in migrated data
          data = data
            .replace(/Internza/g, 'CodeNova')
            .replace(/internza\.org/g, 'codenova.org')
            .replace(/internza-/g, 'codenova-')
            .replace(/INTZ-/g, 'CN-');
          localStorage.setItem(key, data);
          localStorage.removeItem(legacyKey);
        }
      }
    } else {
      // Clean existing data in localStorage if it contains legacy strings
      if (data.includes('Internza') || data.includes('internza') || data.includes('INTZ-')) {
        data = data
          .replace(/Internza/g, 'CodeNova')
          .replace(/internza\.org/g, 'codenova.org')
          .replace(/internza-/g, 'codenova-')
          .replace(/INTZ-/g, 'CN-');
        localStorage.setItem(key, data);
      }
    }
    if (!data) return fallback;
    return JSON.parse(data) as T;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage key "${key}":`, e);
  }
}

export const StorageService = {
  // Internships
  getInternships: (): Internship[] => {
    const stored = safeGet<Internship[]>(STORAGE_KEYS.INTERNSHIPS, INITIAL_INTERNSHIPS);
    let hasMigration = false;
    const internshipsMap = new Map<string, Internship>();

    stored.forEach((item) => {
      let changed = false;
      let newItem = { ...item };

      if (!item.googleFormUrl || item.googleFormUrl.includes('forms.gle/internza-')) {
        newItem.googleFormUrl = DEFAULT_VALID_GOOGLE_FORM_URL;
        changed = true;
      }
      if (item.id === 'INT-PYTHON-04' && item.title !== 'Python Programming Internship') {
        newItem.title = 'Python Programming Internship';
        changed = true;
      }

      if (changed) hasMigration = true;
      internshipsMap.set(newItem.id, newItem);
    });

    INITIAL_INTERNSHIPS.forEach(initialItem => {
      if (!internshipsMap.has(initialItem.id)) {
        internshipsMap.set(initialItem.id, initialItem);
        hasMigration = true;
      }
    });

    const migrated = Array.from(internshipsMap.values());
    if (hasMigration) {
      safeSet(STORAGE_KEYS.INTERNSHIPS, migrated);
    }
    return migrated;
  },
  saveInternships: (internships: Internship[]) => {
    safeSet(STORAGE_KEYS.INTERNSHIPS, internships);
  },
  updateAllGoogleFormUrls: (newUrl: string): Internship[] => {
    const list = StorageService.getInternships();
    const updated = list.map(item => ({ ...item, googleFormUrl: newUrl }));
    StorageService.saveInternships(updated);
    safeSet(STORAGE_KEYS.CUSTOM_GOOGLE_FORM, newUrl);
    return updated;
  },
  getGlobalGoogleFormUrl: (): string => {
    return safeGet<string>(STORAGE_KEYS.CUSTOM_GOOGLE_FORM, DEFAULT_VALID_GOOGLE_FORM_URL);
  },
  addInternship: (internship: Internship) => {
    const list = StorageService.getInternships();
    const updated = [internship, ...list];
    StorageService.saveInternships(updated);
    return updated;
  },
  updateInternship: (internship: Internship) => {
    const list = StorageService.getInternships();
    const updated = list.map(item => item.id === internship.id ? internship : item);
    StorageService.saveInternships(updated);
    return updated;
  },

  // Applications
  getApplications: (): Application[] => {
    return safeGet<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },
  saveApplications: (applications: Application[]) => {
    safeSet(STORAGE_KEYS.APPLICATIONS, applications);
  },
  addApplication: (application: Application) => {
    const list = StorageService.getApplications();
    const updated = [application, ...list];
    StorageService.saveApplications(updated);
    return updated;
  },
  updateApplicationStatus: (id: string, status: 'Pending' | 'Accepted' | 'Rejected', assignedProjectId?: string, notes?: string) => {
    const list = StorageService.getApplications();
    const updated = list.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status,
          assignedProjectId: assignedProjectId !== undefined ? assignedProjectId : app.assignedProjectId,
          notes: notes !== undefined ? notes : app.notes
        };
      }
      return app;
    });
    StorageService.saveApplications(updated);
    return updated;
  },

  // Project Submissions
  getSubmissions: (): ProjectSubmission[] => {
    return safeGet<ProjectSubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  },
  saveSubmissions: (submissions: ProjectSubmission[]) => {
    safeSet(STORAGE_KEYS.SUBMISSIONS, submissions);
  },
  addSubmission: (submission: ProjectSubmission) => {
    const list = StorageService.getSubmissions();
    const updated = [submission, ...list];
    StorageService.saveSubmissions(updated);
    return updated;
  },
  updateSubmissionStatus: (id: string, status: 'Under Review' | 'Approved' | 'Revision Required', feedback?: string) => {
    const list = StorageService.getSubmissions();
    const updated = list.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          status,
          feedback: feedback !== undefined ? feedback : sub.feedback
        };
      }
      return sub;
    });
    StorageService.saveSubmissions(updated);
    return updated;
  },

  // Certificates
  getCertificates: (): Certificate[] => {
    const stored = safeGet<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    let hasMigration = false;
    const certsMap = new Map<string, Certificate>();

    stored.forEach(c => {
      const isLegacyOrg = !c.organizationName || c.organizationName.toLowerCase() === 'internza';
      const hasLegacySignatory = c.signatoryTitle && c.signatoryTitle.toLowerCase().includes('internza');
      const hasLegacyUrl = c.verificationUrl && c.verificationUrl.toLowerCase().includes('internza.org');

      if (isLegacyOrg || hasLegacySignatory || hasLegacyUrl) {
        hasMigration = true;
      }

      const sanitized: Certificate = {
        ...c,
        organizationName: 'CodeNova',
        signatoryTitle: c.signatoryTitle ? c.signatoryTitle.replace(/Internza/gi, 'CodeNova') : 'Technical Evaluation Director, CodeNova',
        verificationUrl: getCertificateVerifyUrl(c.id)
      };
      certsMap.set(sanitized.id.toUpperCase(), sanitized);
    });

    INITIAL_CERTIFICATES.forEach(initialCert => {
      if (!certsMap.has(initialCert.id.toUpperCase())) {
        certsMap.set(initialCert.id.toUpperCase(), {
          ...initialCert,
          verificationUrl: getCertificateVerifyUrl(initialCert.id)
        });
        hasMigration = true;
      }
    });

    const result = Array.from(certsMap.values());
    if (hasMigration) {
      safeSet(STORAGE_KEYS.CERTIFICATES, result);
    }
    return result;
  },
  saveCertificates: (certificates: Certificate[]) => {
    safeSet(STORAGE_KEYS.CERTIFICATES, certificates);
  },
  addCertificate: (cert: Certificate) => {
    const list = StorageService.getCertificates();
    // check if already exists by id
    const existingIndex = list.findIndex(c => c.id.toLowerCase() === cert.id.toLowerCase());
    let updated: Certificate[];
    const sanitizedCert: Certificate = {
      ...cert,
      organizationName: 'CodeNova',
      signatoryTitle: cert.signatoryTitle ? cert.signatoryTitle.replace(/Internza/gi, 'CodeNova') : 'Technical Evaluation Director, CodeNova',
      verificationUrl: getCertificateVerifyUrl(cert.id)
    };
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = sanitizedCert;
    } else {
      updated = [sanitizedCert, ...list];
    }
    StorageService.saveCertificates(updated);
    return updated;
  },
  findCertificateById: (id: string): Certificate | undefined => {
    const cleanId = id.trim().toUpperCase();
    const list = StorageService.getCertificates();
    const cert = list.find(c => c.id.toUpperCase() === cleanId);
    if (!cert) return undefined;
    return {
      ...cert,
      organizationName: 'CodeNova',
      signatoryTitle: cert.signatoryTitle ? cert.signatoryTitle.replace(/Internza/gi, 'CodeNova') : 'Technical Evaluation Director, CodeNova',
      verificationUrl: getCertificateVerifyUrl(cert.id)
    };
  },

  // Offer Letters
  getOfferLetters: (): OfferLetter[] => {
    const stored = safeGet<OfferLetter[]>(STORAGE_KEYS.OFFER_LETTERS, INITIAL_OFFER_LETTERS);
    let hasMigration = false;
    const map = new Map<string, OfferLetter>();

    stored.forEach(o => {
      const isLegacyOrg = !o.organizationName || o.organizationName.toLowerCase() === 'internza';
      const hasLegacySignatory = o.signatoryTitle && o.signatoryTitle.toLowerCase().includes('internza');
      const hasLegacyCode = o.verificationCode && o.verificationCode.startsWith('INTZ-');

      if (isLegacyOrg || hasLegacySignatory || hasLegacyCode) {
        hasMigration = true;
      }

      const sanitized: OfferLetter = {
        ...o,
        organizationName: 'CodeNova',
        signatoryTitle: o.signatoryTitle ? o.signatoryTitle.replace(/Internza/gi, 'CodeNova') : 'Director of Technical Evaluation',
        verificationCode: o.verificationCode ? o.verificationCode.replace(/INTZ-/gi, 'CN-') : o.verificationCode,
        rolesAndResponsibilities: o.rolesAndResponsibilities?.map(r => r.replace(/Internza/gi, 'CodeNova'))
      };
      map.set(sanitized.id.toUpperCase(), sanitized);
    });

    INITIAL_OFFER_LETTERS.forEach(initialOffer => {
      if (!map.has(initialOffer.id.toUpperCase())) {
        map.set(initialOffer.id.toUpperCase(), initialOffer);
        hasMigration = true;
      }
    });

    const result = Array.from(map.values());
    if (hasMigration) {
      safeSet(STORAGE_KEYS.OFFER_LETTERS, result);
    }
    return result;
  },
  saveOfferLetters: (letters: OfferLetter[]) => {
    safeSet(STORAGE_KEYS.OFFER_LETTERS, letters);
  },
  addOfferLetter: (letter: OfferLetter) => {
    const list = StorageService.getOfferLetters();
    const existingIndex = list.findIndex(l => l.id.toUpperCase() === letter.id.toUpperCase());
    let updated: OfferLetter[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = letter;
    } else {
      updated = [letter, ...list];
    }
    StorageService.saveOfferLetters(updated);
    return updated;
  },
  findOfferLetterById: (id: string): OfferLetter | undefined => {
    const cleanId = id.trim().toUpperCase();
    const list = StorageService.getOfferLetters();
    return list.find(l => l.id.toUpperCase() === cleanId);
  },
  findOfferLetterByQuery: (query: string): OfferLetter | undefined => {
    const clean = query.trim().toLowerCase();
    if (!clean) return undefined;
    const list = StorageService.getOfferLetters();
    return list.find(l => 
      l.id.toLowerCase() === clean ||
      (l.applicationId && l.applicationId.toLowerCase() === clean) ||
      l.email.toLowerCase() === clean ||
      l.studentName.toLowerCase().includes(clean)
    );
  },
  generateOfferLetterForApplication: (app: Application, internship?: Internship): OfferLetter => {
    const internships = StorageService.getInternships();
    const int = internship || internships.find(i => i.id === app.internshipId);
    
    // Check if offer letter already exists for this application
    const existingList = StorageService.getOfferLetters();
    const found = existingList.find(l => l.applicationId === app.id);
    if (found) return found;

    const shortDomain = (int?.domain || 'TECH').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const id = `OL-2026-${shortDomain}-${randomNum}`;
    const today = new Date().toISOString().split('T')[0];
    
    // Start date 3 days from now, end date 33 days from now (1 month)
    const startDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const roles = int?.learningOutcomes && int.learningOutcomes.length > 0 
      ? int.learningOutcomes.map(item => `Milestone: ${item}`)
      : [
          'Complete assigned coding milestone repositories and publish clean commits to GitHub.',
          'Implement required algorithms, user interfaces, or automated data extraction pipelines.',
          'Ensure modular codebase, test passing, and clear README deployment instructions.'
        ];

    const newOffer: OfferLetter = {
      id,
      applicationId: app.id,
      studentName: app.studentName,
      email: app.email,
      college: app.college || 'Engineering & Technology Institute',
      internshipId: int?.id || app.internshipId,
      internshipTitle: int?.title || app.internshipTitle,
      domain: int?.domain || 'Software Development',
      duration: int?.duration || '1 Month',
      mode: 'Remote',
      startDate,
      endDate,
      stipendOrReward: int?.rewardDetails || 'Transparent educational internship. Zero registration or fee charged.',
      rolesAndResponsibilities: roles,
      issueDate: today,
      signatoryName: 'Dr. Vikramaditya Rao',
      signatoryTitle: 'Director of Technical Evaluation',
      organizationName: 'CodeNova',
      verificationCode: `CN-${shortDomain}-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`
    };

    StorageService.addOfferLetter(newOffer);
    return newOffer;
  },
  generateSampleOfferLetterForInternship: (internship: Internship): OfferLetter => {
    const shortDomain = (internship.domain || 'TECH').substring(0, 3).toUpperCase();
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const roles = internship.learningOutcomes && internship.learningOutcomes.length > 0
      ? internship.learningOutcomes.map(o => `Milestone Deliverable: ${o}`)
      : [
          'Complete assigned programming repositories with git commit logs.',
          'Develop modular architecture, error handling, and test suites.',
          'Submit GitHub repository and live demonstration link for code review.'
        ];

    return {
      id: `OL-SAMPLE-${shortDomain}-01`,
      studentName: 'Selected Candidate',
      email: 'candidate@university.edu',
      college: 'Selected University / College',
      internshipId: internship.id,
      internshipTitle: internship.title,
      domain: internship.domain,
      duration: internship.duration,
      mode: 'Remote',
      startDate,
      endDate,
      stipendOrReward: internship.rewardDetails || 'Transparent learning milestone program. No fees charged.',
      rolesAndResponsibilities: roles,
      issueDate: today,
      signatoryName: 'Dr. Vikramaditya Rao',
      signatoryTitle: 'Director of Technical Evaluation',
      organizationName: 'CodeNova',
      verificationCode: `CN-${shortDomain}-SAMPLE-VERIFIED`
    };
  },

  // Reset to initial (helper for demo/testing)
  resetToDefault: () => {
    safeSet(STORAGE_KEYS.INTERNSHIPS, INITIAL_INTERNSHIPS);
    safeSet(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    safeSet(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    safeSet(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    safeSet(STORAGE_KEYS.OFFER_LETTERS, INITIAL_OFFER_LETTERS);
  }
};

