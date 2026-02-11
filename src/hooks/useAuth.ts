import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const sessionResponse = await supabase.auth.getSession();
        const sessionUser = sessionResponse.data.session?.user ?? null;

        setUser(sessionUser);

        
        setLoading(false);

        if (!sessionUser) {
          setRole(null);
          return;
        }

        
        cargarRol(sessionUser.id);

      } catch (err) {
        console.error("Error cargando sesión:", err);
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    };

    const cargarRol = async (userId: string) => {
      try {
        const profileResponse = await supabase
          .from("admin_profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();

        setRole(profileResponse.data?.role ?? null);
      } catch (err) {
        console.error("Error cargando rol:", err);
        setRole(null);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

       
        setLoading(false);

        if (!sessionUser) {
          setRole(null);
          return;
        }

        cargarRol(sessionUser.id);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setLoading(false);
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
