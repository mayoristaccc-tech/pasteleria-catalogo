import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CreateAdminModal = ({ onClose, onCreated }: Props) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const crearAdmin = async () => {
    setError("");
    setLoading(true);

    if (!email) {
      setError("Debes ingresar un email válido");
      setLoading(false);
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setError("No hay sesión activa. Inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      const token = sessionData.session.access_token;

      const res = await fetch(
        "https://amqfvzcltdyradkuxkjw.supabase.co/functions/v1/create-admin-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            email,
            role,
          }),
        }
      );

      const data = await res.json();

      setLoading(false);

      console.log("Respuesta completa:", res.status, data);

      if (!res.ok) {
        setError(data.error || "Error al crear administrador");
        return;
      }

      onCreated();
      onClose();

    } catch (err: any) {
      console.error("Error inesperado:", err);
      setLoading(false);
      setError(err.message || "Error inesperado al crear administrador");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          Crear Administrador
        </h2>

        <Input
          placeholder="Email del administrador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3"
        />

        <select
          className="border p-2 rounded w-full mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>

        {error && (
          <p className="text-red-600 text-sm mb-3">
            {error}
          </p>
        )}

        <div className="flex gap-2 justify-end">
          <Button onClick={crearAdmin} disabled={loading}>
            {loading ? "Creando..." : "Crear"}
          </Button>

          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>

      </div>
    </div>
  );
};

export default CreateAdminModal;
