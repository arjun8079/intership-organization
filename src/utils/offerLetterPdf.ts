import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { OfferLetter } from '../types';
import { getOfferVerifyUrl } from './verificationUrls';

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 240,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code generation error:', err);
    return '';
  }
}

export async function downloadOfferLetterPdf(letter: OfferLetter): Promise<void> {
  // Enforce single-page A4 portrait document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // ==========================================
  // SINGLE-PAGE FORMAL APPOINTMENT LETTER
  // ==========================================

  // 1. Pristine Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Modern Top Geometric Accent Stripes
  doc.setFillColor(79, 70, 229); // Indigo #4f46e5
  doc.rect(0, 0, pageWidth, 5, 'F');
  doc.setFillColor(15, 23, 42); // Slate #0f172a
  doc.rect(0, 5, pageWidth, 1.5, 'F');

  // 3. Header Letterhead - Brand & Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('C O D E N O V A', margin, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text('TECHNOLOGIES & TALENT PLATFORM', margin + 62, 17.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Autonomous Project-Based Software Engineering & Applied Technology Internship Initiative', margin, 23);
  doc.text('Accreditation Ref: CN-TECH-9001-A • Verification Registry: https://codenova.org/verify', margin, 27);

  // 4. Reference Block (Top-Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`REF NO: ${letter.id}`, pageWidth - margin, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Date of Issue: ${letter.issueDate}`, pageWidth - margin, 22.5, { align: 'right' });
  doc.text(`Auth Code: ${letter.verificationCode}`, pageWidth - margin, 26.8, { align: 'right' });

  // 5. Clean Divider Line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(margin, 31, pageWidth - margin, 31);

  let curY = 38;

  // 6. Recipient Block (ONLY Candidate Name — strictly no university or email id)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('TO / APPOINTEE:', margin, curY);

  curY += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(letter.studentName, margin, curY);

  // 7. Formal Subject Banner
  curY += 7.5;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, curY - 3.5, contentWidth, 8, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.rect(margin, curY - 3.5, contentWidth, 8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `SUBJECT: FORMAL APPOINTMENT AND OFFER OF INTERNSHIP — ${letter.internshipTitle.toUpperCase()}`,
    margin + 3.5,
    curY + 1.8
  );

  // 8. Formal Congratulatory Opening
  curY += 10.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Dear ${letter.studentName},`, margin, curY);

  curY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.3);
  doc.setTextColor(51, 65, 85);
  const openingText = `On behalf of CodeNova Technologies, we are delighted to congratulate you on your selection for the project-based Virtual Internship Program in ${letter.internshipTitle}. Following our technical evaluation of your background and programming proficiency, our Technical Admissions Board has approved your appointment.`;
  const splitOpening = doc.splitTextToSize(openingText, contentWidth);
  doc.text(splitOpening, margin, curY);
  curY += splitOpening.length * 3.8 + 2;

  const missionText = `At CodeNova, our foundational principle is "Learn. Build. Prove Your Skills." This internship is designed to reflect modern production engineering environments. Rather than passive observation, you will develop practical software, adhere to professional Git workflows, and build an independently verifiable software portfolio.`;
  const splitMission = doc.splitTextToSize(missionText, contentWidth);
  doc.text(splitMission, margin, curY);
  curY += splitMission.length * 3.8 + 3;

  // 9. Key Terms & Specifications Grid Table
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, curY, contentWidth, 31, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(margin, curY, contentWidth, 31, 'S');

  const c1 = margin + 4;
  const c2 = margin + 64;
  const c3 = margin + 128;
  let tY = curY + 5;

  // Table Row 1
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('POSITION / TITLE', c1, tY);
  doc.text('DOMAIN / SPECIALIZATION', c2, tY);
  doc.text('INTERNSHIP MODE', c3, tY);

  tY += 4.2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.3);
  doc.setTextColor(15, 23, 42);
  doc.text(letter.internshipTitle, c1, tY);
  doc.text(letter.domain, c2, tY);
  doc.text(`${letter.mode} (100% Virtual)`, c3, tY);

  // Table Row 2
  tY += 7.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('PROGRAM DURATION', c1, tY);
  doc.text('COHORT SCHEDULE', c2, tY);
  doc.text('COMPENSATION / REWARD', c3, tY);

  tY += 4.2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.3);
  doc.setTextColor(15, 23, 42);
  doc.text(letter.duration, c1, tY);
  doc.text(`${letter.startDate}  to  ${letter.endDate}`, c2, tY);
  doc.text(letter.stipendOrReward || 'Zero-Fee Educational Engagement', c3, tY);

  curY += 35;

  // 10. Clause 1: Scope of Engagement & Milestones
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(15, 23, 42);
  doc.text('1. SCOPE OF ENGAGEMENT & ENGINEERING DELIVERABLES:', margin, curY);

  curY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const bullets = letter.rolesAndResponsibilities && letter.rolesAndResponsibilities.length > 0
    ? letter.rolesAndResponsibilities
    : [
        'Build and deliver production-grade software solutions corresponding to your domain milestones.',
        'Implement clean architecture, version-controlled GitHub repositories, and comprehensive documentation.',
        'Demonstrate authentic problem solving under CodeNova\'s Zero-Tolerance Plagiarism & AI Integrity Policy.',
        'Submit completed deliverables on the CodeNova student portal prior to the cohort deadline.'
      ];

  bullets.slice(0, 4).forEach((b) => {
    doc.setFillColor(79, 70, 229);
    doc.circle(margin + 2, curY - 0.9, 0.8, 'F');
    const bulletText = doc.splitTextToSize(b, contentWidth - 7);
    doc.text(bulletText, margin + 5.5, curY);
    curY += bulletText.length * 3.5 + 1;
  });

  // 11. Clause 2: Mentorship, Evaluation & Certification
  curY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(15, 23, 42);
  doc.text('2. MENTORSHIP, CODE REVIEW & VERIFIABLE CREDENTIAL:', margin, curY);

  curY += 4.2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const certText = `Your milestone submissions will be evaluated by our technical review team. Upon satisfactory completion and approval of all required project deliverables, CodeNova Technologies will issue an official, tamper-proof Certificate of Completion with a unique verification code and public QR verification link. Top 10% exceptional performers are eligible for merit-based rewards and Letters of Recommendation.`;
  const splitCert = doc.splitTextToSize(certText, contentWidth);
  doc.text(splitCert, margin, curY);

  // 12. Signatures, Seal & QR Verification Section (Fixed Position at bottom of page)
  const signY = 240;

  // QR Code for Tamper-Proof Verification
  const qrUrl = getOfferVerifyUrl(letter.id);
  const qrDataUrl = await generateQrDataUrl(qrUrl);
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', margin, signY, 23, 23);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Scan to verify offer letter', margin + 11.5, signY + 26, { align: 'center' });
  }

  // Official Seal
  const sealX = margin + 50;
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.6);
  doc.circle(sealX + 16, signY + 11, 11.5, 'S');
  doc.setLineWidth(0.3);
  doc.circle(sealX + 16, signY + 11, 10, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(79, 70, 229);
  doc.text('CODENOVA TECHNOLOGIES', sealX + 16, signY + 9, { align: 'center' });
  doc.text('OFFICIAL SEAL', sealX + 16, signY + 12, { align: 'center' });
  doc.text('VERIFIED CREDENTIAL', sealX + 16, signY + 15, { align: 'center' });

  // Dual Authorized Signatories
  const sig1X = pageWidth - margin - 42;
  const sig2X = pageWidth - margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(letter.signatoryName || 'Dr. Vikramaditya Rao', sig2X, signY + 8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(letter.signatoryTitle || 'Director of Technical Evaluation', sig2X, signY + 12.5, { align: 'right' });
  doc.text('CodeNova Technologies', sig2X, signY + 16.5, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Ananya Deshmukh', sig1X, signY + 8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Head of Talent & Outreach', sig1X, signY + 12.5, { align: 'right' });
  doc.text('Academic Programs Board', sig1X, signY + 16.5, { align: 'right' });

  // Official Footer & Disclaimer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, 283, pageWidth - margin, 283);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text('CodeNova Technologies • Independent Practical Technology Internship • Verified credential', margin, 287);
  doc.text('Official Appointment Letter • Page 1 of 1', pageWidth - margin, 287, { align: 'right' });

  doc.setFillColor(79, 70, 229);
  doc.rect(0, pageHeight - 3, pageWidth, 3, 'F');

  // Trigger Save with clean naming
  const cleanName = letter.studentName.replace(/\s+/g, '_');
  const filename = `CodeNova_Offer_Letter_${cleanName}_${letter.id}.pdf`;
  doc.save(filename);
}
