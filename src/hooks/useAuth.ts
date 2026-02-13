import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRol = async (userId: string) => {
      try {
        const { data } = await supabase
          .from("admin_profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();

        setRole(data?.role ?? null);
      } catch (err) {
        console.error("Error cargando rol:", err);
        setRole(null);
      }
    };

    const handleSession = async (session: any) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (!sessionUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      await cargarRol(sessionUser.id);
      setLoading(false);
    };

    
    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session);
    });

    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    isSuperAdmin: role === "superadmin",
    isAdmin: role === "admin",
    login,
    logout,
  };
};
