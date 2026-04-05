import { supabase } from "@/integrations/supabase/client";

type AdminCheckResult = {
  allowed: boolean;
  message?: string;
};

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

export async function isAdminLoggedIn(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) return false;
  const check = await checkAdminAccess(session.user.id);
  return check.allowed;
}

export function onAdminAuthStateChange(callback: (isLoggedIn: boolean) => void): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user?.id) {
      callback(false);
      return;
    }

    const check = await checkAdminAccess(session.user.id);
    callback(check.allowed);
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
    await supabase.auth.signOut();
    return { success: false, message: "Unable to verify account." };
  }

  const check = await checkAdminAccess(userId);
  if (!check.allowed) {
    await supabase.auth.signOut();
    return {
      success: false,
      message: check.message || "This account is not authorized for admin dashboard.",
    };
  }

  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}
