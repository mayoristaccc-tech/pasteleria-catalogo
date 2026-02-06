import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processImage, isValidImageFile } from "@/utils/imageProcessor";
import { toast } from "sonner";

interface ImageUploadButtonProps {
  onImageUpload: (imageUrl: string) => void;
  onImageRemove?: () => void;
  hasImage?: boolean;
  label: string;
  removeLabel?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const ImageUploadButton = ({
  onImageUpload,
  onImageRemove,
  hasImage = false,
  label,
  removeLabel = "Quitar",
  variant = "outline",
  size = "sm",
  className = "",
}: ImageUploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error("Por favor selecciona una imagen válida (JPG, PNG, WebP o GIF)");
      return;
    }

    try {
      const processedImage = await processImage(file);
      onImageUpload(processedImage);
      toast.success("Imagen actualizada correctamente");
    } catch (error) {
      console.error("Error al procesar imagen:", error);
      toast.error("Error al procesar la imagen");
    }

    // Limpiar input para permitir subir la misma imagen
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        className="gap-2"
      >
        <Camera className="h-4 w-4" />
        {label}
      </Button>
      {hasImage && onImageRemove && (
        <Button
          type="button"
          variant="ghost"
          size={size}
          onClick={onImageRemove}
          className="gap-2 text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4" />
          {removeLabel}
        </Button>
      )}
    </div>
  );
};

export default ImageUploadButton;
