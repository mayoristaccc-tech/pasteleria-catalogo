import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { supabase } from "../lib/supabase";

export const useProducts = () => {
  console.log("useProducts montado");

  const [productos, setProductos] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarProductos = async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("products")        //
      .select("*")
      .order("creado_en", { ascending: false });

    if (error) {
      console.error("Error al cargar productos:", JSON.stringify(error, null, 2));
    }
    else {
      setProductos(data || []);
    }

    setCargando(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarProducto = async (
    nombre: string,
    descripcion: string,
    imagen: File
  ) => {
    console.log("Iniciando subida de producto...");
    console.log("Datos recibidos:", { nombre, descripcion, imagen });

    try {
      const fileName = `${Date.now()}-${imagen.name}`;
      console.log("Intentando subir imagen con nombre:", fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("productos")      // 
        .upload(fileName, imagen);

      if (uploadError) {
        console.error("ERROR AL SUBIR IMAGEN:", uploadError);
        return;
      }

      console.log("Imagen subida correctamente:", uploadData);

      const { data: urlData } = supabase.storage
        .from("productos")
        .getPublicUrl(fileName);

      const imagenUrl = urlData.publicUrl;

      console.log("URL pública generada:", imagenUrl);

      const { data: insertData, error: insertError } = await supabase
        .from("products")       //
        .insert([
          {
            nombre,
            descripcion,
            imagen_url: imagenUrl,
          },
        ]);

      if (insertError) {
        console.error("ERROR AL GUARDAR EN TABLA:", JSON.stringify(insertError, null, 2));
        return;
      }

      console.log("Producto guardado en base de datos:", insertData);

      await cargarProductos();
    } catch (err) {
      console.error("ERROR GENERAL:", err);
    }
  };

  return {
    productos,
    cargando,
    agregarProducto,
  };
};
