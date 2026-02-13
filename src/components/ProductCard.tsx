import { useState } from "react";
import { Pencil, Trash2, Share2, ImageOff } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  producto: Product;
  modoCreador: boolean;
  onEdit: (producto: Product) => void;
  onDelete: (producto: Product) => void;
  onDeleteImage: (producto: Product) => void;
  onClickImage: (producto: Product) => void;
}

const ProductCard = ({
  producto,
  modoCreador,
  onEdit,
  onDelete,
  onDeleteImage,
  onClickImage,
}: ProductCardProps) => {
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [imagenError, setImagenError] = useState(false);

  const handleDelete = () => {
    if (confirmandoEliminar) {
      onDelete(producto);
    } else {
      setConfirmandoEliminar(true);
      setTimeout(() => setConfirmandoEliminar(false), 3000);
    }
  };

  const handleDeleteImage = () => {
    onDeleteImage(producto);
  };

  const compartirWhatsApp = () => {
    const TU_NUMERO = "541153790146";

    const mensaje = encodeURIComponent(
      `Hola! Quiero consultar por este producto:\n\n🧁 ${producto.nombre}\n${
        producto.descripcion || ""
      }\n\n${window.location.origin}/producto/${producto.id}`
    );

    window.open(
      `https://api.whatsapp.com/send?phone=${TU_NUMERO}&text=${mensaje}`,
      "_blank"
    );
  };

  return (
    <article className="group overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={
            imagenError || !producto.imagen_url
              ? "/placeholder.png"
              : producto.imagen_url
          }
          alt={producto.nombre}
          onError={() => setImagenError(true)}
          onClick={() => onClickImage(producto)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          loading="lazy"
        />

        {modoCreador && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={() => onEdit(producto)}
              className="rounded-full bg-card p-3 shadow-medium transition-all hover:scale-110"
            >
              <Pencil className="h-5 w-5" />
            </button>

            {producto.imagen_url && (
              <button
                onClick={handleDeleteImage}
                className="rounded-full bg-yellow-500 p-3 text-white shadow-medium transition-all hover:scale-110 hover:bg-yellow-600"
              >
                <ImageOff className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={handleDelete}
              className={`rounded-full p-3 shadow-medium transition-all hover:scale-110 ${
                confirmandoEliminar
                  ? "bg-destructive text-white"
                  : "bg-card hover:bg-destructive hover:text-white"
              }`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{producto.nombre}</h3>

        {producto.descripcion && (
          <p className="mt-2 text-sm text-muted-foreground">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={compartirWhatsApp}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <Share2 className="h-4 w-4" />
            Pedir por WhatsApp
          </button>
        </div>
      </div>

      {confirmandoEliminar && (
        <div className="border-t px-5 py-2">
          <p className="text-center text-xs text-destructive">
            Clic de nuevo para eliminar
          </p>
        </div>
      )}
    </article>
  );
};

export default ProductCard;
