import { X } from "lucide-react";
import { Product } from "@/types/product";

interface Props {
  producto: Product;
  onClose: () => void;
}

const ProductModal = ({ producto, onClose }: Props) => {
  const TU_NUMERO = "541153790146";

  const mensaje = encodeURIComponent(
    `Hola! Quiero pedir este producto:\n\n🧁 ${producto.nombre}\n${
      producto.descripcion || ""
    }\n\n${window.location.origin}/producto/${producto.id}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl animate-scale-in">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          <img
            src={producto.imagen_url || "/placeholder.png"}
            alt={producto.nombre}
            className="w-full rounded-xl object-cover"
          />

          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold">{producto.nombre}</h2>

            {producto.descripcion && (
              <p className="mt-4 text-muted-foreground">
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
              className="mt-6 w-full rounded-xl bg-green-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-green-700"
            >
              💬 Quiero comprar este producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
