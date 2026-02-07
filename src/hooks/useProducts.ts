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

    if (error) {
      console.error("Error al cargar productos:", error);
    } else {
      setProductos(data || []);
    }

    setCargando(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const subirImagen = async (imagen: File) => {
    const fileName = `${Date.now()}-${imagen.name}`;

    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(fileName, imagen);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const agregarProducto = async (
    nombre: string,
    descripcion: string,
    imagen: File
  ) => {
    try {
      const imagenUrl = await subirImagen(imagen);

      const { error } = await supabase.from("products").insert([
        {
          nombre,
          descripcion,
          imagen_url: imagenUrl,
        },
      ]);

      if (error) {
        console.error("Error al agregar producto:", error);
        return;
      }

      await cargarProductos();
    } catch (err) {
      console.error("Error general:", err);
    }
  };

  const editarProducto = async (
    id: string,
    nombre: string,
    descripcion: string,
    imagen?: File
  ) => {
    try {
      let imagenUrl: string | undefined;

      if (imagen) {
        imagenUrl = await subirImagen(imagen);
      }

      const updateData: any = {
        nombre,
        descripcion,
      };

      if (imagenUrl) {
        updateData.imagen_url = imagenUrl;
      }

      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("Error al editar producto:", error);
        return;
      }

      await cargarProductos();
    } catch (err) {
      console.error("Error general:", err);
    }
  };

  const eliminarProducto = async (id: string) => {
    console.log("Intentando eliminar producto con ID:", id);

    try {

      const { data: producto, error: fetchError } = await supabase
        .from("products")
        .select("imagen_url")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error al obtener producto:", fetchError);
        return;
      }


      if (producto?.imagen_url) {
        const url = new URL(producto.imagen_url);
        const path = url.pathname.split("/").pop();

        if (path) {
          const { error: storageError } = await supabase.storage
            .from("productos")
            .remove([path]);

          if (storageError) {
            console.error("Error al eliminar imagen del bucket:", storageError);
          } else {
            console.log("Imagen eliminada del bucket:", path);
          }
        }
      }

      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Error al eliminar producto:", deleteError);
        return;
      }

      console.log("Producto eliminado correctamente");


      await cargarProductos();

    } catch (err) {
      console.error("Error general al eliminar:", err);
    }
  };

  return {
    productos,
    cargando,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  };
};
