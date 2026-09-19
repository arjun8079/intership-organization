import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Certificate } from '../types';
import { getCertificateVerifyUrl } from './verificationUrls';

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

export async function downloadCertificatePdf(cert: Certificate): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;

  const orgName = (!cert.organizationName || cert.organizationName.toLowerCase() === 'internza')
    ? 'CodeNova Technology'
    : cert.organizationName.replace(/internza/gi, 'CodeNova');

  const verificationUrl = getCertificateVerifyUrl(cert.id);

  // Background clean ivory/white
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Border (Navy Charcoal)
  doc.setDrawColor(15, 23, 42); // #0f172a
  doc.setLineWidth(2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Inner Border (Accent Slate / Indigo)
  doc.setDrawColor(79, 70, 229); // Indigo #4f46e5
  doc.setLineWidth(0.6);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Corner decorative marks
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1.2);
  const cornerSize = 8;
  // Top-left
  doc.line(15, 15 + cornerSize, 15 + cornerSize, 15);
  // Top-right
  doc.line(pageWidth - 15 - cornerSize, 15, pageWidth - 15, 15 + cornerSize);
  // Bottom-left
  doc.line(15, pageHeight - 15 - cornerSize, 15 + cornerSize, pageHeight - 15);
  // Bottom-right
  doc.line(pageWidth - 15 - cornerSize, pageHeight - 15, pageWidth - 15, pageHeight - 15 - cornerSize);

  // Header: Organization Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text('C O D E N O V A', pageWidth / 2, 32, { align: 'center' });

  // Organization tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('LEARN. BUILD. PROVE YOUR SKILLS. • INDEPENDENT TECHNOLOGY INTERNSHIP PLATFORM', pageWidth / 2, 38, { align: 'center' });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 50, 42, pageWidth / 2 + 50, 42);

  // Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(79, 70, 229); // Indigo
  doc.text('CERTIFICATE OF INTERNSHIP COMPLETION', pageWidth / 2, 53, { align: 'center' });

  // "This is proudly presented to"
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('This is to certify that', pageWidth / 2, 63, { align: 'center' });

  // Student Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text(cert.studentName, pageWidth / 2, 75, { align: 'center' });

  // Underline for student name
  const nameWidth = doc.getTextWidth(cert.studentName);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - Math.max(nameWidth / 2 + 10, 40), 78, pageWidth / 2 + Math.max(nameWidth / 2 + 10, 40), 78);

  // Description text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.text('has successfully completed all project milestones, code reviews, and practical evaluations for the', pageWidth / 2, 88, { align: 'center' });

  // Internship Title & Domain
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(cert.internshipTitle, pageWidth / 2, 98, { align: 'center' });

  // Program details (Duration & Completion Date)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Mode: Remote   |   Duration: ${cert.duration}   |   Completion Date: ${cert.completionDate}`,
    pageWidth / 2,
    106,
    { align: 'center' }
  );

  // Statement
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const statement = 'During this program, the intern demonstrated practical technical competence, active version control on GitHub, and fulfilled organizational review criteria.';
  doc.text(statement, pageWidth / 2, 116, { align: 'center', maxWidth: 220 });

  // Bottom section: Signatory, QR Code, and Certificate Metadata
  const qrDataUrl = await generateQrDataUrl(verificationUrl);

  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, 'PNG', pageWidth / 2 - 13, 132, 26, 26);
    } catch (e) {
      console.warn('Could not render QR code in PDF', e);
    }
  }

  // Verification caption under QR
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('SCAN TO VERIFY', pageWidth / 2, 162, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('codenova.org/verify', pageWidth / 2, 166, { align: 'center' });

  // Left side: Signature & Organization
  const leftX = 40;
  // Decorative signature line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(leftX, 150, leftX + 55, 150);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Evaluation Director', leftX + 27.5, 156, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(orgName, leftX + 27.5, 161, { align: 'center' });

  // Right side: Certificate ID & Issuance
  const rightX = pageWidth - 40 - 55;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(rightX, 150, rightX + 55, 150);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`ID: ${cert.id}`, rightX + 27.5, 156, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Issued: ${cert.issueDate || cert.completionDate}`, rightX + 27.5, 161, { align: 'center' });

  // Disclaimer at very bottom inside border
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Official Organization-Issued Credential • Not affiliated with any university or government accreditation authority.',
    pageWidth / 2,
    188,
    { align: 'center' }
  );

  // Save the document
  const fileName = `CodeNova_Certificate_${cert.id.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(fileName);
}
