import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };
};
