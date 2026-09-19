/**
 * Utility for generating and parsing accessible verification URLs
 * for CodeNova student certificates and official offer letters.
 */

// Public shared preview URL provided by Google AI Studio Cloud Run infrastructure.
// Unlike private development URLs ('ais-dev-*.run.app' or 'aistudio.google.com/*') which
// demand developer session authentication and result in "403 Forbidden" on outside phones,
// this public shared URL allows any smartphone or third-party camera scanner to verify records!
export const PUBLIC_SHARED_APP_URL = 'https://ais-pre-5utnmlbgxr3x3da4gipf7u-894274403966.asia-east1.run.app';

export function getCustomQrDomain(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('codenova_custom_qr_domain') || '';
  } catch {
    return '';
  }
}

export function setCustomQrDomain(domain: string): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = domain.trim();
    if (!trimmed) {
      localStorage.removeItem('codenova_custom_qr_domain');
    } else {
      let clean = trimmed;
      if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        clean = `https://${clean}`;
      }
      localStorage.setItem('codenova_custom_qr_domain', clean.replace(/\/+$/, ''));
    }
  } catch {}
}

export function getAppBaseUrl(): string {
  // 1. If user set an explicit custom domain (e.g. https://codenova.org or custom deployment)
  const custom = getCustomQrDomain();
  if (custom) {
    return custom;
  }

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    const hostname = window.location.hostname;

    // CRITICAL FIX FOR MOBILE 403 ERROR:
    // When running inside the AI Studio dev container, origin is 'https://ais-dev-...run.app'.
    // External mobile phones hitting 'ais-dev-' get redirected to 'aistudio.google.com/applet-auth-b'
    // which gives "403. That's an error. We're sorry, but you do not have access to this page."
    // Converting 'ais-dev-' to 'ais-pre-' allows public unauthenticated access from any smartphone!
    if (hostname.includes('ais-dev-')) {
      return origin.replace('ais-dev-', 'ais-pre-').replace(/\/+$/, '');
    }

    if (hostname.includes('aistudio.google.com') || hostname === 'localhost' || hostname === '127.0.0.1') {
      return PUBLIC_SHARED_APP_URL;
    }

    // Standard public domain or preview deployment
    const pathname = window.location.pathname.replace(/\/+$/, '');
    return `${origin}${pathname}`;
  }

  return PUBLIC_SHARED_APP_URL;
}

/**
 * Generates the full live URL to verify a certificate.
 * Points to the active public app domain with ?page=verify&cert=...
 * Ensures that any phone scanning the QR code loads the live certificate verification page!
 */
export function getCertificateVerifyUrl(certId: string): string {
  const base = getAppBaseUrl();
  const cleanId = certId.trim().toUpperCase();
  return `${base}/?page=verify&cert=${encodeURIComponent(cleanId)}`;
}

/**
 * Generates the full live URL to verify an offer letter.
 * Points to the active public app domain with ?page=offers&offer=...
 * Ensures that scanning the QR code loads the live offer letter portal!
 */
export function getOfferVerifyUrl(offerIdOrCode: string): string {
  const base = getAppBaseUrl();
  const cleanId = offerIdOrCode.trim();
  return `${base}/?page=offers&offer=${encodeURIComponent(cleanId)}`;
}

/**
 * Intelligently extracts a certificate ID from either:
 * - A bare ID (e.g. "CERT-2026-00001")
 * - A full scanned URL (e.g. "https://domain.com/?page=verify&cert=CERT-2026-00001")
 * - A hash URL or encoded string
 */
export function extractCertificateIdFromInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Case 1: Full URL with ?cert= or &cert=
  if (trimmed.includes('cert=')) {
    try {
      const urlToParse = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const url = new URL(urlToParse);
      const val = url.searchParams.get('cert');
      if (val) return val.trim().toUpperCase();
    } catch {
      const match = trimmed.match(/[?&]cert=([^&#\s]+)/i);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).trim().toUpperCase();
      }
    }
  }

  // Case 2: Clean bare ID
  return trimmed.toUpperCase();
}

/**
 * Intelligently extracts an offer letter ID / query from either a bare ID or a scanned URL.
 */
export function extractOfferIdFromInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  if (trimmed.includes('offer=') || trimmed.includes('id=')) {
    try {
      const urlToParse = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const url = new URL(urlToParse);
      const val = url.searchParams.get('offer') || url.searchParams.get('id');
      if (val) return val.trim();
    } catch {
      const match = trimmed.match(/[?&](?:offer|id)=([^&#\s]+)/i);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).trim();
      }
    }
  }

  return trimmed;
}
