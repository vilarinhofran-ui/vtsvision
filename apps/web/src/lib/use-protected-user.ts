"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabase";
import { clearAuthCookie, setAuthCookie } from "./auth-session";

type UseProtectedUserResult = {
  user: User | null;
  loading: boolean;
  configError: string;
  demoMode: boolean;
};

export function useProtectedUser(): UseProtectedUserResult {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    let mounted = true;
    let unsubscribe = () => {};

    async function checkSession() {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!data.session?.user) {
          clearAuthCookie();
          const target = pathname
            ? encodeURIComponent(pathname)
            : encodeURIComponent("/dashboard");
          router.replace(`/login?next=${target}`);
          return;
        }

        setAuthCookie();
        setUser(data.session.user);
        setLoading(false);

        const listener = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;

          if (!session?.user) {
            clearAuthCookie();
            const target = pathname
              ? encodeURIComponent(pathname)
              : encodeURIComponent("/dashboard");
            router.replace(`/login?next=${target}`);
            return;
          }

          setAuthCookie();
          setUser(session.user);
        });

        unsubscribe = () => listener.data.subscription.unsubscribe();
      } catch {
        if (!mounted) return;
        setDemoMode(true);
        setConfigError("");
        setLoading(false);
      }
    }

    void checkSession();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [router, pathname]);

  return { user, loading, configError, demoMode };
}
