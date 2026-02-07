import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
    onLogin: (email: string, password: string) => Promise<any>;
    onClose: () => void;
}

const LoginModal = ({ onLogin, onClose }: Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const err = await onLogin(email, password);

        if (err) {
            setError("Credenciales incorrectas");
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">
                    Acceso Administrador
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-2">
                        <Button type="submit">
                            Ingresar
                        </Button>

                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;

