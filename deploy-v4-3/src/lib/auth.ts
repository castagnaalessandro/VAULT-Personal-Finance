// ─── Tipi ─────────────────────────────────────────────────────────────────────

export interface AccountRecord {
  displayName: string;
  pinHash: string;
}

const ACCOUNTS_KEY = 'vault_accounts';
const SESSION_KEY  = 'vault_session';

// ─── Hashing PIN (Web Crypto — nativa nel browser) ────────────────────────────

export async function hashPin(userId: string, pin: string): Promise<string> {
  const data   = new TextEncoder().encode(`${userId}:${pin}`);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── ID utente normalizzato dal nome ─────────────────────────────────────────

export function toUserId(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '_');
}

// ─── Gestione account ────────────────────────────────────────────────────────

function getAccounts(): Record<string, AccountRecord> {
  try   { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}'); }
  catch { return {}; }
}

function saveAccounts(accounts: Record<string, AccountRecord>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function userExists(name: string): boolean {
  return toUserId(name) in getAccounts();
}

export async function registerUser(name: string, pin: string): Promise<string> {
  const userId  = toUserId(name);
  const accounts = getAccounts();
  if (accounts[userId]) throw new Error('Utente già esistente');
  const pinHash = await hashPin(userId, pin);
  accounts[userId] = { displayName: name.trim(), pinHash };
  saveAccounts(accounts);
  return userId;
}

export async function loginUser(name: string, pin: string): Promise<string> {
  const userId   = toUserId(name);
  const accounts = getAccounts();
  if (!accounts[userId]) throw new Error('Utente non trovato');
  const pinHash = await hashPin(userId, pin);
  if (pinHash !== accounts[userId].pinHash) throw new Error('PIN non corretto');
  return userId;
}

// ─── Sessione ────────────────────────────────────────────────────────────────

export function saveSession(userId: string)   { localStorage.setItem(SESSION_KEY, userId); }
export function getSession(): string | null   { return localStorage.getItem(SESSION_KEY); }
export function clearSession()                { localStorage.removeItem(SESSION_KEY); }

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getDisplayName(userId: string): string {
  return getAccounts()[userId]?.displayName ?? userId;
}

// Le iniziali del bottone avatar sono SEMPRE "AC" (Alessandro Castagna)
// indipendentemente da chi ha effettuato l'accesso.
export function getInitials(_userId: string): string {
  return 'AC';
}

// ─── Dati utente ─────────────────────────────────────────────────────────────

export function getUserDataKey(userId: string): string {
  return `vault_data_${userId}`;
}

export function loadUserData(userId: string): any {
  try   { return JSON.parse(localStorage.getItem(getUserDataKey(userId)) || 'null'); }
  catch { return null; }
}

export function saveUserData(userId: string, data: any) {
  localStorage.setItem(getUserDataKey(userId), JSON.stringify(data));
}
