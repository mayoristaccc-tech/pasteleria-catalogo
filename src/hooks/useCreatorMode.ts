import { useState, useCallback } from "react";

// Contraseña simple definida en el código
// NOTA: Cambiar esta contraseña por una segura antes de usar en producción
const CREATOR_PASSWORD = "dulce2024";

// Hook para manejar el modo creador
export const useCreatorMode = () => {
  const [modoCreador, setModoCreador] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState("");

  // Abrir el modal de contraseña
  const abrirModalPassword = useCallback(() => {
    setError("");
    setMostrarModal(true);
  }, []);

  // Cerrar el modal de contraseña
  const cerrarModalPassword = useCallback(() => {
    setMostrarModal(false);
    setError("");
  }, []);

  // Verificar la contraseña
  const verificarPassword = useCallback((password: string): boolean => {
    if (password === CREATOR_PASSWORD) {
      setModoCreador(true);
      setMostrarModal(false);
      setError("");
      return true;
    } else {
      setError("Contraseña incorrecta. Intenta de nuevo.");
      return false;
    }
  }, []);

  // Salir del modo creador
  const salirModoCreador = useCallback(() => {
    setModoCreador(false);
  }, []);

  return {
    modoCreador,
    mostrarModal,
    error,
    abrirModalPassword,
    cerrarModalPassword,
    verificarPassword,
    salirModoCreador,
  };
};
