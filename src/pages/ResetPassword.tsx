import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  // 🔑 Paso CLAVE: intercambiar el code del email por una sesión válida
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      setError("El enlace es inválido o ha expirado.");
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          setError("El enlace es inválido o ya fue utilizado.");
        } else {
          setReady(true);
        }
      });
  }, []);

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

    if (!validar()) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Limpiamos sesión temporal
      await supabase.auth.signOut();

      alert("Contraseña actualizada correctamente. Ahora podés iniciar sesión.");
      navigate("/");

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

        {!ready ? (
          <p className="text-center text-sm text-gray-600">
            Validando enlace...
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Definí la contraseña con la que vas a ingresar al sistema
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

            <Button
              className="w-full"
              onClick={cambiarClave}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Guardar contraseña"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
