import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validar = () => {
    if (!password || !confirmPassword) {
      setError("Debes completar ambos campos");
      return false;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const cambiarClave = async () => {
    setError("");
    setSuccess("");

    if (!validar()) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message || "Error al actualizar la contraseña");
        setLoading(false);
        return;
      }

      setSuccess("Contraseña actualizada correctamente 🎉");
      setPassword("");
      setConfirmPassword("");

    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-xl font-bold mb-4 text-center">
          Crear nueva contraseña
        </h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Define la contraseña que usarás para ingresar como administrador
        </p>

        <Input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3"
        />

        <Input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-3"
        />

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-sm mb-3 text-center">
            {success}
          </p>
        )}

        <Button
          className="w-full"
          onClick={cambiarClave}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Guardar contraseña"}
        </Button>

        {success && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Ya puedes cerrar esta ventana e iniciar sesión normalmente.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
