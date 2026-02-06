import { useState, useEffect } from "react";
import { Product, generateId } from "@/types/product";
import { sampleProducts } from "@/data/sampleProducts";

// Clave para localStorage
const STORAGE_KEY = "dolcce_vitta_productos";
const SAMPLES_LOADED_KEY = "dolcce_vitta_samples_loaded";

// Hook personalizado para manejar productos con localStorage
export const useProducts = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar productos desde localStorage al iniciar
  useEffect(() => {
    const productosGuardados = localStorage.getItem(STORAGE_KEY);
    const samplesLoaded = localStorage.getItem(SAMPLES_LOADED_KEY);
    
    if (productosGuardados) {
      try {
        const parsed = JSON.parse(productosGuardados);
        // Si hay productos guardados, usarlos
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductos(parsed);
        } else if (!samplesLoaded) {
          // Si el array está vacío y no se han cargado samples, cargarlos
          setProductos(sampleProducts);
          localStorage.setItem(SAMPLES_LOADED_KEY, "true");
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
        if (!samplesLoaded) {
          setProductos(sampleProducts);
          localStorage.setItem(SAMPLES_LOADED_KEY, "true");
        }
      }
    } else if (!samplesLoaded) {
      // Cargar productos de ejemplo si es la primera vez
      setProductos(sampleProducts);
      localStorage.setItem(SAMPLES_LOADED_KEY, "true");
    }
    setCargando(false);
  }, []);

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    if (!cargando) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
    }
  }, [productos, cargando]);

  // Agregar un nuevo producto
  const agregarProducto = (nombre: string, descripcion: string, imagen: string) => {
    const nuevoProducto: Product = {
      id: generateId(),
      nombre,
      descripcion,
      imagen,
      fechaCreacion: Date.now(),
    };
    setProductos((prev) => [nuevoProducto, ...prev]);
  };

  // Editar un producto existente
  const editarProducto = (id: string, nombre: string, descripcion: string, imagen?: string) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === id
          ? {
              ...producto,
              nombre,
              descripcion,
              ...(imagen && { imagen }),
            }
          : producto
      )
    );
  };

  // Eliminar un producto
  const eliminarProducto = (id: string) => {
    setProductos((prev) => prev.filter((producto) => producto.id !== id));
  };

  return {
    productos,
    cargando,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  };
};
