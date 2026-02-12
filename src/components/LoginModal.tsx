import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  onClose: () => void;
}

const LoginModal = ({ onClose }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    onClose();
  };

  const forgotPassword = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://dolcce-vitta-mas.vercel.app/reset-password",
    });

    setLoading(false);

    if (error) {
      setError("No se pudo enviar el email de recuperación");
      return;
    }

    setInfo("Te enviamos un email para crear una nueva contraseña.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">

        <h2 className="mb-4 text-lg font-semibold text-center">
          Acceso Administrador
        </h2>

        <form onSubmit={login} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-green-600">{info}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            Ingresar
          </Button>
        </form>

        {/* 👇 ESTE ES EL BOTÓN QUE HOY NO TE APARECE */}
        <button
          onClick={forgotPassword}
          disabled={!email || loading}
          className="mt-4 w-full text-sm text-blue-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <Button
          variant="outline"
          onClick={onClose}
          className="mt-4 w-full"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default LoginModal;
