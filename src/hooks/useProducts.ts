import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { supabase } from "../lib/supabase";

export const useProducts = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarProductos = async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("creado_en", { ascending: false });

    if (!error) {
      setProductos(data || []);
    }

    setCargando(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return {
    productos,
    cargando,
    agregarProducto: async () => {},
    editarProducto: async () => {},
    eliminarProducto: async () => {},
  };
};
