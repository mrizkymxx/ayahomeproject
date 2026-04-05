import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginAdmin, isAdminLoggedIn } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PandaPose = "normal" | "watching" | "covering";

function useNextPath(): string {
  const location = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    const next = params.get("next");
    return next && next.startsWith("/admin") ? next : "/admin";
  }, [location.search]);
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const nextPath = useNextPath();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [pandaPose, setPandaPose] = useState<PandaPose>("normal");

  useEffect(() => {
    isAdminLoggedIn().then((ok) => {
      setLoggedIn(ok);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setPandaPose("normal");
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobileView(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  if (ready && loggedIn) {
    return <Navigate to={nextPath} replace />;
  }

  if (!ready) {
    return (
      <section className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="animate-spin" size={28} />
      </section>
    );
  }

  const resetPoseIfNoFocus = () => {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active !== emailRef.current && active !== passwordRef.current) {
        setPandaPose("normal");
      }
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const result = await loginAdmin(email, password);
    setSubmitting(false);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: result.message || "Invalid credentials.",
      });
      return;
    }

    toast({
      title: "Welcome back",
      description: "You are now signed in to admin.",
    });
    navigate(nextPath, { replace: true });
  };

  return (
    <section className="panda-login-page">
      <div className="panda-login-shell" ref={wrapperRef}>
        <form onSubmit={onSubmit} className="panda-login-form">
          <h1>Admin Login</h1>
          <p>ayahomeproject</p>

          <label htmlFor="admin-email">Email:</label>
          <input
            ref={emailRef}
            id="admin-email"
            type="email"
            value={email}
            onFocus={() => setPandaPose(isMobileView ? "normal" : "watching")}
            onBlur={resetPoseIfNoFocus}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@yourdomain.com"
            autoComplete="email"
            required
          />

          <label htmlFor="admin-password">Password:</label>
          <input
            ref={passwordRef}
            id="admin-password"
            type="password"
            value={password}
            onFocus={() => setPandaPose(isMobileView ? "normal" : "covering")}
            onBlur={resetPoseIfNoFocus}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password here.."
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing In..." : "Login"}
          </button>
        </form>

        {!isMobileView && (
          <>
            <div className="panda-ear-left" />
            <div className="panda-ear-right" />

            <div className="panda-face">
              <div className="panda-blush-left" />
              <div className="panda-blush-right" />

              <div className="panda-eye-left">
                <div className={cn("panda-eyeball-left", pandaPose === "watching" && "panda-eyeball-look")} />
              </div>

              <div className="panda-eye-right">
                <div className={cn("panda-eyeball-right", pandaPose === "watching" && "panda-eyeball-look")} />
              </div>

              <div className="panda-nose" />
              <div className="panda-mouth" />
            </div>

            <div className={cn("panda-hand-left", pandaPose === "covering" && "panda-hand-left-cover")} />
            <div className={cn("panda-hand-right", pandaPose === "covering" && "panda-hand-right-cover")} />

            <div className="panda-paw-left" />
            <div className="panda-paw-right" />
          </>
        )}
      </div>
    </section>
  );
};

export default AdminLogin;
