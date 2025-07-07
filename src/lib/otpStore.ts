// src/lib/otp-store.ts
type OTPEntry = {
  code: string;
  expiresAt: number;
};

const store = new Map<string, OTPEntry>();
const TTL_MS = 5 * 60 * 1000; // 5분

/**
 * 이메일에 대한 OTP 코드 저장
 */
export function setCode(email: string, code: string) {
  const expiresAt = Date.now() + TTL_MS;
  store.set(email, { code, expiresAt });
}

/**
 * 이메일에 저장된 OTP 코드 조회
 */
export function getCode(email: string): string | null {
  const entry = store.get(email);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return null;
  }
  return entry.code;
}

/**
 * 인증 후 코드 삭제
 */
export function deleteCode(email: string) {
  store.delete(email);
}
