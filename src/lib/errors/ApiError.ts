/**
 * Standardized API Error for Climatify platform (REST & Supabase).
 */

const RAW_DB_ERROR_PATTERNS =
  /row-level security|violates .* constraint|syntax error|relation ".*"|PGRST\d+|permission denied|invalid input syntax|duplicate key value|schema cache|stack depth/i;

function isSafeUserFacingMessage(msg: string): boolean {
  const trimmed = msg.trim();
  if (!trimmed || trimmed.length > 240) return false;
  return !RAW_DB_ERROR_PATTERNS.test(trimmed);
}

export class ApiError extends Error {
  readonly status: number;
  readonly endpoint: string;
  readonly body: unknown;

  constructor(message: string, status: number, endpoint: string, body: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
    this.body = body;
  }

  /** True when the failure is a connectivity/timeout problem rather than an HTTP status. */
  get isNetworkError(): boolean {
    return this.status === 0 || this.status === 408;
  }

  /** A message safe to show to an end user, in the requested language. */
  localizedMessage(language: string): string {
    const ar = language === "ar";
    if (this.isNetworkError) {
      return ar
        ? "تعذّر الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى."
        : "Could not reach the server. Check your connection and try again.";
    }
    if (this.status === 401 || this.status === 403) {
      return ar
        ? "انتهت صلاحية الجلسة أو لا تملك صلاحية لهذا الإجراء."
        : "Your session expired or you are not allowed to do this.";
    }
    if (this.status === 404) {
      return ar ? "العنصر المطلوب غير موجود." : "The requested item was not found.";
    }
    if (this.status === 409) {
      const serverMsg = extractServerMessage(this.body);
      if (serverMsg && isSafeUserFacingMessage(serverMsg)) return serverMsg;
      if (this.message && isSafeUserFacingMessage(this.message)) {
        // Translate common Arabic conflict strings when viewing in English
        if (!ar && this.message.includes("مسجل بالفعل")) {
          return "This email is already registered for this event.";
        }
        return this.message;
      }
      return ar ? "هذا السجل موجود بالفعل." : "This record already exists.";
    }
    if (this.status === 429) {
      return ar
        ? "تم إرسال طلبات كثيرة في وقت قصير. يرجى الانتظار قليلاً ثم المحاولة."
        : "Too many requests in a short time. Please wait a moment and try again.";
    }
    if (this.status === 422 || this.status === 400) {
      const serverMsg = extractServerMessage(this.body);
      if (serverMsg) {
        if (/duplicate key|23505/i.test(serverMsg)) {
          return ar ? "هذا السجل مسجّل بالفعل." : "This record is already registered.";
        }
        if (/row-level security|permission denied|42501/i.test(serverMsg)) {
          return ar
            ? "لا تملك صلاحية لتنفيذ هذا الإجراء."
            : "You do not have permission to perform this action.";
        }
        if (isSafeUserFacingMessage(serverMsg)) {
          return serverMsg;
        }
      }
      if (this.message && isSafeUserFacingMessage(this.message) && !this.message.startsWith("Request to ")) {
        return this.message;
      }
      return ar
        ? "البيانات المُرسلة غير صحيحة. راجع الحقول وحاول مرة أخرى."
        : "The submitted data is invalid. Please review the fields.";
    }
    return ar
      ? "حدث خطأ في الخادم. برجاء المحاولة لاحقاً."
      : "A server error occurred. Please try again later.";
  }
}

/** Pull a human message out of whatever error envelope the backend chose to send. */
export function extractServerMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  for (const key of ["message", "error", "detail"]) {
    if (typeof b[key] === "string" && b[key]) return b[key] as string;
  }
  return null;
}
