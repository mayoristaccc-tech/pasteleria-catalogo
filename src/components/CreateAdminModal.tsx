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
      setError("Debes ingresar un email");
      setLoading(false);
      return;
    }

    try {
      const response = await supabase.functions.invoke("create-admin-user", {
        body: {
          email,
          role,
        },
      });

      setLoading(false);

      if (response.error) {
        setError(response.error.message);
        return;
      }

      // Si todo salió bien
      onCreated();
      onClose();

    } catch (err: any) {
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
