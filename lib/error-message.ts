/**
 * Turn anything thrown (Error, Supabase PostgrestError, string) into text that
 * can be shown to an admin. Supabase rejections are plain objects with a
 * `message`, not Error instances, so `error.message` alone is not enough.
 */
export function toErrorMessage(error: unknown, fallback = "უცნობი შეცდომა"): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === "string" && message.trim()) return message
  }
  return fallback
}
