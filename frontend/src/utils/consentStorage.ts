/**
 * Consent and Authentication Storage Utilities for Sukoon AI
 * Ensures robust versioned consent tracking and returning-user state management.
 */

export const CURRENT_CONSENT_VERSION = '1.0';

const STORAGE_KEYS = {
  CONSENTS: 'sukoon_user_consents',
  AUTH_USER: 'sukoon_auth_email',
  SAVED_CONVERSATIONS: 'sukoon_saved_conversations',
  USER_PREFERENCES: 'sukoon_user_preferences',
  USER_PROFILE: 'sukoon_user_profile',
};

/**
 * Checks if a specific account email has accepted the specified consent version.
 */
export function hasAccountConsented(email: string, requiredVersion: string = CURRENT_CONSENT_VERSION): boolean {
  if (!email || typeof email !== 'string') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONSENTS);
    if (!raw) return false;
    const consents = JSON.parse(raw);
    const normalizedEmail = email.toLowerCase().trim();
    return consents[normalizedEmail] === requiredVersion;
  } catch {
    return false;
  }
}

/**
 * Stores the accepted consent version for an account email.
 */
export function setAccountConsent(email: string, version: string = CURRENT_CONSENT_VERSION): void {
  if (!email || typeof email !== 'string') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONSENTS);
    const consents = raw ? JSON.parse(raw) : {};
    const normalizedEmail = email.toLowerCase().trim();
    consents[normalizedEmail] = version;
    localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(consents));
  } catch {
    // Graceful fallback if localStorage is disabled or restricted
  }
}

/**
 * Removes consent record for an account (e.g. upon account deletion).
 */
export function removeAccountConsent(email: string): void {
  if (!email || typeof email !== 'string') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONSENTS);
    if (!raw) return;
    const consents = JSON.parse(raw);
    const normalizedEmail = email.toLowerCase().trim();
    delete consents[normalizedEmail];
    localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(consents));
  } catch {
    // Graceful fallback
  }
}

/**
 * Retrieves the currently saved authenticated user email, if any.
 */
export function getSavedAuthEmail(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  } catch {
    return null;
  }
}

/**
 * Saves the authenticated user email.
 */
export function saveAuthEmail(email: string): void {
  try {
    if (email) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, email.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Clears authentication and session credentials.
 */
export function clearAuthEmail(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  } catch {
    // Graceful fallback
  }
}
