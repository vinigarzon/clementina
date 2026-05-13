/**
 * Verifica un token de reCAPTCHA v3 contra Google.
 * Si RECAPTCHA_SECRET_KEY no está configurada, retorna válido (modo dev).
 */
export async function verifyRecaptcha(
  token: string | null | undefined,
): Promise<{ valid: boolean; score?: number; error?: string }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.log("[recaptcha] (modo dev sin RECAPTCHA_SECRET_KEY) → válido");
    return { valid: true };
  }

  if (!token) {
    return { valid: false, error: "token-missing" };
  }

  try {
    const params = new URLSearchParams({
      secret,
      response: token,
    });
    const resp = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      },
    );
    const json = (await resp.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!json.success) {
      return {
        valid: false,
        error: json["error-codes"]?.join(", ") ?? "recaptcha-failed",
      };
    }

    // Score 0.0-1.0: 1.0 muy probable humano, 0.0 muy probable bot.
    // Umbral conservador: 0.5
    if (typeof json.score === "number" && json.score < 0.5) {
      return { valid: false, score: json.score, error: "low-score" };
    }

    return { valid: true, score: json.score };
  } catch (e) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : "verify-error",
    };
  }
}
