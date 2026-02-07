import { useState, useRef, ChangeEvent } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isValidImageFile, processImage } from "@/utils/imageProcessor";
import { Product } from "@/types/product";

interface ProductFormProps {
  onSubmit: (nombre: string, descripcion: string, imagen: File) => void;
  onClose: () => void;
  productoEditar?: Product;
  onUpdate?: (id: string, nombre: string, descripcion: string, imagen?: File) => void;
}

const ProductForm = ({
  onSubmit,
  onClose,
  productoEditar,
  onUpdate,
}: ProductFormProps) => {
  const [nombre, setNombre] = useState(productoEditar?.nombre || "");
  const [descripcion, setDescripcion] = useState(
    productoEditar?.descripcion || ""
  );
  const [imagenPreview, setImagenPreview] = useState<string | null>(
    productoEditar?.imagen_url || null
  );
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const esEdicion = !!productoEditar;

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setError("Por favor, selecciona una imagen válida");
      return;
    }

    setError("");
    setProcesando(true);

    try {
      const imagenOptimizada = await processImage(file);

      const previewUrl = URL.createObjectURL(imagenOptimizada);

      setImagenPreview(previewUrl);
      setNuevaImagen(imagenOptimizada);
    } catch (err) {
      setError("Error al optimizar la imagen");
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("El nombre del producto es obligatorio");
      return;
    }

    if (!esEdicion && !nuevaImagen) {
      setError("Debes subir una imagen del producto");
      return;
    }

    if (esEdicion && onUpdate) {
      onUpdate(
        productoEditar!.id,
        nombre.trim(),
        descripcion.trim(),
        nuevaImagen || undefined
      );
    } else if (nuevaImagen) {
      onSubmit(nombre.trim(), descripcion.trim(), nuevaImagen);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-md animate-scale-in rounded-2xl bg-card p-6 shadow-elevated">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {esEdicion ? "Editar Producto" : "Nuevo Producto"}
          </h2>

          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Imagen del producto
            </label>

            <div
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed rounded-lg p-4 text-center"
            >
              {imagenPreview ? (
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className="mx-auto max-h-40 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6" />
                  <span>Subir imagen</span>
                </div>
              )}

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nombre del producto
            </label>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Pastel de chocolate"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Descripción
            </label>
            <Textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del producto"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit" disabled={procesando}>
              {esEdicion ? "Guardar cambios" : "Crear producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
