export interface EmailValidationResult {
  valid: boolean;
  disposable: boolean;
  reason: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function validateEmail(email: string): Promise<EmailValidationResult> {
  // Step 1: Regex format check
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, disposable: false, reason: "INVALID_FORMAT" };
  }

  // Step 2: Call Disify API to check disposable
  try {
    const res = await fetch(`https://disify.com/api/email/${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.disposable) {
        return { valid: false, disposable: true, reason: "DISPOSABLE" };
      }
      if (data.format === false) {
        return { valid: false, disposable: false, reason: "INVALID_FORMAT" };
      }
    }
    // If API fails or returns non-ok, we still allow the email (fail open)
  } catch {
    // Network error — fail open, don't block user
  }

  return { valid: true, disposable: false, reason: "OK" };
}
