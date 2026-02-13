import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const enviarMail = async () => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    setLoading(false);

    if (error) {
      setError("No se pudo enviar el email");
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">

        <h2 className="text-xl font-bold mb-4 text-center">
          Recuperar contraseña
        </h2>

        {success ? (
          <p className="text-green-600 text-center">
            Te enviamos un email para restablecer tu contraseña.
          </p>
        ) : (
          <>
            <Input
              type="email"
              placeholder="Ingresá tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3"
            />

            {error && (
              <p className="text-red-600 text-sm mb-3">
                {error}
              </p>
            )}

            <Button
              className="w-full"
              onClick={enviarMail}
              disabled={loading || !email}
            >
              {loading ? "Enviando..." : "Enviar email"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
