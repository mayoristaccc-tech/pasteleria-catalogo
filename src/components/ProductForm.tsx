import { useState, useRef, ChangeEvent } from "react";
import { X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { processImage, isValidImageFile } from "@/utils/imageProcessor";
import { Product } from "@/types/product";

interface ProductFormProps {
  onSubmit: (nombre: string, descripcion: string, imagen: string) => void;
  onClose: () => void;
  productoEditar?: Product;
  onUpdate?: (id: string, nombre: string, descripcion: string, imagen?: string) => void;
}

const ProductForm = ({ onSubmit, onClose, productoEditar, onUpdate }: ProductFormProps) => {
  const [nombre, setNombre] = useState(productoEditar?.nombre || "");
  const [descripcion, setDescripcion] = useState(productoEditar?.descripcion || "");
  const [imagenPreview, setImagenPreview] = useState<string | null>(productoEditar?.imagen || null);
  const [nuevaImagen, setNuevaImagen] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const esEdicion = !!productoEditar;

  // Manejar selección de imagen
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!isValidImageFile(file)) {
      setError("Por favor, selecciona una imagen válida (JPG, PNG, WEBP o GIF)");
      return;
    }

    setError("");
    setProcesando(true);

    try {
      // Procesar y mejorar la imagen
      const imagenProcesada = await processImage(file);
      setImagenPreview(imagenProcesada);
      setNuevaImagen(imagenProcesada);
    } catch (err) {
      setError("Error al procesar la imagen. Intenta con otra.");
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("El nombre del producto es obligatorio");
      return;
    }

    if (!esEdicion && !imagenPreview) {
      setError("Debes subir una imagen del producto");
      return;
    }

    if (esEdicion && onUpdate) {
      onUpdate(productoEditar.id, nombre.trim(), descripcion.trim(), nuevaImagen || undefined);
    } else if (imagenPreview) {
      onSubmit(nombre.trim(), descripcion.trim(), imagenPreview);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-md animate-scale-in rounded-2xl bg-card p-6 shadow-elevated">
        {/* Encabezado */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {esEdicion ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subir imagen */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Imagen del producto
            </label>
            <div
              onClick={() => inputRef.current?.click()}
              className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-secondary/30 transition-all hover:border-primary hover:bg-secondary/50"
            >
              {imagenPreview ? (
                <div className="relative aspect-video">
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-lg bg-card px-3 py-2 text-sm font-medium text-foreground">
                      Cambiar imagen
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-3 p-6">
                  {procesando ? (
                    <>
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <span className="text-sm text-muted-foreground">Mejorando imagen...</span>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-primary/20 p-4">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <span className="font-medium text-foreground">Subir imagen</span>
                        <p className="mt-1 text-xs text-muted-foreground">
                          JPG, PNG o WEBP • Se mejorará automáticamente
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Nombre del producto */}
          <div>
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-foreground">
              Nombre del producto
            </label>
            <Input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Pastel de Tres Leches"
              className="border-border bg-card"
              maxLength={60}
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-foreground">
              Descripción corta
            </label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Suave bizcocho bañado en tres leches con crema batida"
              className="min-h-[80px] border-border bg-card resize-none"
              maxLength={150}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={procesando}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {esEdicion ? "Guardar Cambios" : "Agregar Producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
