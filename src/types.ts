export type DomainType = 
  | 'Artificial Intelligence'
  | 'Machine Learning'
  | 'Python Development'
  | 'Web Development'
  | 'Data Science'
  | 'Cloud & DevOps'
  | 'Mobile App Development'
  | 'Cybersecurity'
  | 'Software Engineering';

export type RewardType = 'Unpaid Internship' | 'Performance-Based Reward' | 'Stipend';

export interface Internship {
  id: string;
  title: string;
  domain: DomainType;
  duration: string;
  mode: 'Remote';
  eligibility: string;
  projectsCount: number;
  rewardType: RewardType;
  rewardDetails: string;
  certificate: boolean;
  about: string;
  learningOutcomes: string[];
  projectDescription: string;
  selectionProcess: string;
  completionCriteria: string;
  certificateCriteria: string;
  paymentPolicy: string;
  googleFormUrl: string;
  isActive: boolean;
  createdDate: string;
}

export interface Application {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  year: string;
  skills: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrlOrFilename: string;
  internshipId: string;
  internshipTitle: string;
  whyApply: string;
  consentAccepted: boolean;
  status: 'Pending' | 'Accepted' | 'Rejected';
  assignedProjectId?: string;
  appliedAt: string;
  notes?: string;
}

export interface ProjectSubmission {
  id: string;
  studentName: string;
  email: string;
  internshipId: string;
  internshipTitle: string;
  projectId: string;
  githubUrl: string;
  liveDemoUrl: string;
  projectDescription: string;
  fileOrLinkSubmission: string;
  submittedAt: string;
  status: 'Under Review' | 'Approved' | 'Revision Required';
  feedback?: string;
}

export interface Certificate {
  id: string; // e.g. CERT-2026-00001
  studentName: string;
  internshipTitle: string;
  domain: string;
  organizationName: string; // "CodeNova"
  duration: string;
  completionDate: string;
  status: 'Valid' | 'Invalid';
  issueDate: string;
  verificationUrl: string;
  signatoryTitle?: string;
}

export interface OfferLetter {
  id: string; // e.g. OL-2026-PY-01
  applicationId?: string;
  studentName: string;
  email: string;
  college?: string;
  internshipId: string;
  internshipTitle: string;
  domain: string;
  duration: string;
  mode: 'Remote';
  startDate: string;
  endDate: string;
  stipendOrReward: string;
  rolesAndResponsibilities: string[];
  issueDate: string;
  signatoryName: string;
  signatoryTitle: string;
  organizationName: string;
  verificationCode: string;
}
