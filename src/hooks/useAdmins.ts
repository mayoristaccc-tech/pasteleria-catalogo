import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useAdmins = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarAdmins = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("admin_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando admins:", error);
    } else {
      setAdmins(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarAdmins();
  }, []);

  const eliminarAdmin = async (id: string) => {
    const { error } = await supabase
      .from("admin_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar administrador");
      return;
    }

    await cargarAdmins();
  };

  return {
    admins,
    loading,
    cargarAdmins,
    eliminarAdmin,
  };
};
