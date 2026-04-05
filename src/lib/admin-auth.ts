import { supabase } from "@/integrations/supabase/client";

type AdminCheckResult = {
  allowed: boolean;
  message?: string;
};

type AdminAuthActionResult = {
  success: boolean;
  message?: string;
};

type AdminSessionLike = {
  user?: {
    id?: string;
  };
} | null;

const MISSING_SESSION_ERROR_FRAGMENT = "auth session missing";
const ADMIN_AUTH_CHECK_TIMEOUT_MS = 8000;

function isMissingSessionError(message?: string): boolean {
  return Boolean(message?.toLowerCase().includes(MISSING_SESSION_ERROR_FRAGMENT));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallbackValue: T): Promise<T> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(fallbackValue);
    }, timeoutMs);

    void promise
      .then((value) => resolve(value))
      .catch(() => resolve(fallbackValue))
      .finally(() => {
        clearTimeout(timeoutId);
      });
  });
}

function extractSessionUserId(session: AdminSessionLike): string | null {
  const userId = session?.user?.id;
  return userId || null;
}

async function clearAdminLocalSession(): Promise<AdminAuthActionResult> {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error && !isMissingSessionError(error.message)) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

async function checkAdminAccess(userId: string): Promise<AdminCheckResult> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (error.code === "42P01") {
      return { allowed: false, message: "Admin access is not configured yet. Run migration 005 and 006." };
    }
    return { allowed: false, message: "Unable to verify admin access." };
  }

  return { allowed: Boolean(data) };
}

async function isAuthorizedAdminUser(userId: string): Promise<boolean> {
  const check = await checkAdminAccess(userId);
  if (!check.allowed) {
    await clearAdminLocalSession();
  }

  return check.allowed;
}

export async function isAdminLoggedIn(): Promise<boolean> {
  return withTimeout(
    (async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        await clearAdminLocalSession();
        return false;
      }

      const userId = extractSessionUserId(session);
      if (!userId) return false;

      return isAuthorizedAdminUser(userId);
    })(),
    ADMIN_AUTH_CHECK_TIMEOUT_MS,
    false
  );
}

export function onAdminAuthStateChange(callback: (isLoggedIn: boolean) => void): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    const userId = extractSessionUserId(session);
    if (!userId) {
      callback(false);
      return;
    }

    // Defer async authorization checks outside of auth callback to avoid lock contention.
    setTimeout(() => {
      void withTimeout(isAuthorizedAdminUser(userId), ADMIN_AUTH_CHECK_TIMEOUT_MS, false).then((isLoggedIn) => {
        callback(isLoggedIn);
      });
    }, 0);
  });

  return () => subscription.unsubscribe();
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    const clearSession = await clearAdminLocalSession();
    if (!clearSession.success) {
      return clearSession;
    }

    return { success: false, message: "Unable to verify account." };
  }

  const check = await checkAdminAccess(userId);
  if (!check.allowed) {
    const clearSession = await clearAdminLocalSession();
    if (!clearSession.success) {
      return clearSession;
    }

    return {
      success: false,
      message: check.message || "This account is not authorized for admin dashboard.",
    };
  }

  return { success: true };
}

export async function logoutAdmin(): Promise<AdminAuthActionResult> {
  return clearAdminLocalSession();
}
