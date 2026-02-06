import { useState, useEffect, useCallback } from "react";

export interface LogoPosition {
  x: number;
  y: number;
}

interface SiteConfig {
  logoUrl: string | null;
  coverUrl: string | null;
  logoPosition: LogoPosition;
}

const STORAGE_KEY = "dolcce-vitta-site-config";

const defaultLogoPosition: LogoPosition = { x: 0, y: 0 };

const defaultConfig: SiteConfig = {
  logoUrl: null,
  coverUrl: null,
  logoPosition: defaultLogoPosition,
};

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [cargando, setCargando] = useState(true);

  // Cargar configuración del localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Asegurar que logoPosition existe (migración)
        if (!parsed.logoPosition) {
          parsed.logoPosition = defaultLogoPosition;
        }
        setConfig(parsed);
      }
    } catch (error) {
      console.error("Error al cargar configuración del sitio:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  // Guardar en localStorage
  const guardarConfig = useCallback((newConfig: SiteConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
    }
  }, []);

  // Actualizar logo
  const actualizarLogo = useCallback((logoUrl: string | null) => {
    const newConfig = { 
      ...config, 
      logoUrl,
      // Resetear posición cuando se cambia el logo
      logoPosition: logoUrl ? config.logoPosition : defaultLogoPosition 
    };
    guardarConfig(newConfig);
  }, [config, guardarConfig]);

  // Actualizar posición del logo
  const actualizarLogoPosition = useCallback((logoPosition: LogoPosition) => {
    const newConfig = { ...config, logoPosition };
    guardarConfig(newConfig);
  }, [config, guardarConfig]);

  // Resetear posición del logo
  const resetearLogoPosition = useCallback(() => {
    const newConfig = { ...config, logoPosition: defaultLogoPosition };
    guardarConfig(newConfig);
  }, [config, guardarConfig]);

  // Actualizar fondo de portada
  const actualizarCover = useCallback((coverUrl: string | null) => {
    const newConfig = { ...config, coverUrl };
    guardarConfig(newConfig);
  }, [config, guardarConfig]);

  // Restablecer a valores por defecto
  const restablecerConfig = useCallback(() => {
    guardarConfig(defaultConfig);
  }, [guardarConfig]);

  return {
    logoUrl: config.logoUrl,
    coverUrl: config.coverUrl,
    logoPosition: config.logoPosition,
    cargando,
    actualizarLogo,
    actualizarLogoPosition,
    resetearLogoPosition,
    actualizarCover,
    restablecerConfig,
  };
};
