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
    } else {
      console.error("Error cargando productos:", error);
    }

    setCargando(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // 🔹 AGREGAR PRODUCTO
  const agregarProducto = async (
    nombre: string,
    descripcion: string,
    imagen: File
  ) => {
    const filePath = `productos/${Date.now()}-${imagen.name}`;

    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(filePath, imagen);

    if (uploadError) {
      console.error("Error subiendo imagen:", uploadError);
      return;
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(filePath);

    const { error } = await supabase.from("products").insert({
      nombre,
      descripcion,
      imagen_url: data.publicUrl,
      image_path: filePath,
    });

    if (error) {
      console.error("Error guardando producto:", error);
      return;
    }

    await cargarProductos();
  };

  // 🔹 EDITAR PRODUCTO
  const editarProducto = async (
    id: string,
    nombre: string,
    descripcion: string,
    nuevaImagen?: File
  ) => {
    const productoActual = productos.find((p) => p.id === id);
    if (!productoActual) return;

    let imagen_url = productoActual.imagen_url;
    let image_path = productoActual.image_path;

    if (nuevaImagen) {
      const nuevoPath = `productos/${Date.now()}-${nuevaImagen.name}`;

      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(nuevoPath, nuevaImagen);

      if (uploadError) {
        console.error("Error subiendo nueva imagen:", uploadError);
        return;
      }

      const { data } = supabase.storage
        .from("productos")
        .getPublicUrl(nuevoPath);

      imagen_url = data.publicUrl;
      image_path = nuevoPath;

      if (productoActual.image_path) {
        await supabase.storage
          .from("productos")
          .remove([productoActual.image_path]);
      }
    }

    const { error } = await supabase
      .from("products")
      .update({
        nombre,
        descripcion,
        imagen_url,
        image_path,
      })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando producto:", error);
      return;
    }

    await cargarProductos();
  };

  // 🔹 ELIMINAR PRODUCTO COMPLETO
  const eliminarProducto = async (producto: Product) => {
    try {
      if (producto.image_path) {
        await supabase.storage
          .from("productos")
          .remove([producto.image_path]);
      }

      await supabase
        .from("products")
        .delete()
        .eq("id", producto.id);

      await cargarProductos();
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  // 🔹 ELIMINAR SOLO IMAGEN
  const eliminarImagenProducto = async (producto: Product) => {
    try {
      if (producto.image_path) {
        await supabase.storage
          .from("productos")
          .remove([producto.image_path]);
      }

      const { error } = await supabase
        .from("products")
        .update({
          imagen_url: null,
          image_path: null,
        })
        .eq("id", producto.id);

      if (error) {
        console.error("Error UPDATE:", error);
        return;
      }

      await cargarProductos();
    } catch (err) {
      console.error("Error eliminando imagen:", err);
    }
  };

  return {
    productos,
    cargando,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    eliminarImagenProducto,
  };
};
