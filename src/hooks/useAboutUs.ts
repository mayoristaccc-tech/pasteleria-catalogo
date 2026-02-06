import { useState, useEffect } from "react";

const STORAGE_KEY = "dolcce_vitta_about_us";

const DEFAULT_ABOUT = `Dolcce Vitta+ nació del amor por la repostería artesanal y el deseo de compartir momentos dulces con cada cliente. 

Desde nuestros inicios, nos hemos dedicado a crear postres únicos, elaborados con ingredientes de la más alta calidad y mucho cariño. Cada creación es una obra de arte que busca endulzar tus celebraciones y momentos especiales.

¡Gracias por ser parte de nuestra dulce historia!`;

export const useAboutUs = () => {
  const [aboutText, setAboutText] = useState<string>(DEFAULT_ABOUT);
  const [cargando, setCargando] = useState(true);

  // Cargar texto desde localStorage
  useEffect(() => {
    const textoGuardado = localStorage.getItem(STORAGE_KEY);
    if (textoGuardado) {
      setAboutText(textoGuardado);
    }
    setCargando(false);
  }, []);

  // Guardar texto en localStorage
  const guardarAboutText = (nuevoTexto: string) => {
    setAboutText(nuevoTexto);
    localStorage.setItem(STORAGE_KEY, nuevoTexto);
  };

  return {
    aboutText,
    cargando,
    guardarAboutText,
  };
};
