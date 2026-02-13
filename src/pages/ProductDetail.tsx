import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import { ArrowLeft } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState<Product | null>(null);
  const [cargando, setCargando] = useState(true);
  const [imagenError, setImagenError] = useState(false);

  useEffect(() => {
    const cargarProducto = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      setProducto(data);
      setCargando(false);
    };

    if (id) cargarProducto();
  }, [id]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Producto no encontrado</p>
      </div>
    );
  }

  const TU_NUMERO = "541153790146";

  const mensaje = encodeURIComponent(
    `Hola! Quiero pedir este producto:\n\n🧁 ${producto.nombre}\n${
      producto.descripcion || ""
    }\n\n${window.location.href}`
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <img
            src={
              imagenError || !producto.imagen_url
                ? "/placeholder.png"
                : producto.imagen_url
            }
            alt={producto.nombre}
            onError={() => setImagenError(true)}
            className="w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>

          {producto.descripcion && (
            <p className="mt-4 text-muted-foreground text-lg">
              {producto.descripcion}
            </p>
          )}

          <button
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?phone=${TU_NUMERO}&text=${mensaje}`,
                "_blank"
              )
            }
            className="mt-8 w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
          >
            💬 Quiero comprar este producto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
