import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  producto: Product;
  modoCreador: boolean;
  onEdit: (producto: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ producto, modoCreador, onEdit, onDelete }: ProductCardProps) => {
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);

  const handleDelete = () => {
    if (confirmandoEliminar) {
      onDelete(producto.id);
    } else {
      setConfirmandoEliminar(true);
      // Auto-reset después de 3 segundos
      setTimeout(() => setConfirmandoEliminar(false), 3000);
    }
  };

  return (
    <article className="group animate-fade-in overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay con botones de edición (solo en modo creador) */}
        {modoCreador && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={() => onEdit(producto)}
              className="rounded-full bg-card p-3 text-foreground shadow-medium transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground"
              aria-label="Editar producto"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={handleDelete}
              className={`rounded-full p-3 shadow-medium transition-all hover:scale-110 ${
                confirmandoEliminar
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-card text-foreground hover:bg-destructive hover:text-destructive-foreground"
              }`}
              aria-label={confirmandoEliminar ? "Confirmar eliminación" : "Eliminar producto"}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {producto.descripcion}
          </p>
        )}
      </div>

      {/* Mensaje de confirmación */}
      {confirmandoEliminar && (
        <div className="border-t border-border bg-destructive/10 px-5 py-2">
          <p className="text-center text-xs text-destructive">
            Clic de nuevo para eliminar
          </p>
        </div>
      )}
    </article>
  );
};

export default ProductCard;
