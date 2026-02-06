// Utilidades para procesar imágenes usando Canvas API
// Mejora automática: brillo, contraste y colores naturales

// Procesar imagen y mejorarla automáticamente
export const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("No se pudo crear el contexto del canvas"));
            return;
          }

          // Redimensionar si es muy grande (max 800px)
          const maxSize = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Dibujar imagen original
          ctx.drawImage(img, 0, 0, width, height);

          // Obtener datos de la imagen
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          // Aplicar mejoras suaves
          // Aumentar brillo ligeramente (+10)
          // Aumentar contraste ligeramente (factor 1.1)
          const brightnessAdjust = 10;
          const contrastFactor = 1.1;
          const contrastAdjust = (contrastFactor - 1) * 128;

          for (let i = 0; i < data.length; i += 4) {
            // Rojo
            data[i] = clamp(
              (data[i] - 128) * contrastFactor + 128 + brightnessAdjust
            );
            // Verde
            data[i + 1] = clamp(
              (data[i + 1] - 128) * contrastFactor + 128 + brightnessAdjust
            );
            // Azul
            data[i + 2] = clamp(
              (data[i + 2] - 128) * contrastFactor + 128 + brightnessAdjust
            );
            // Alpha se mantiene igual (data[i + 3])
          }

          // Aplicar los cambios
          ctx.putImageData(imageData, 0, 0);

          // Convertir a base64 con calidad optimizada
          const base64 = canvas.toDataURL("image/jpeg", 0.85);
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Error al cargar la imagen"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };

    reader.readAsDataURL(file);
  });
};

// Función auxiliar para mantener valores entre 0 y 255
const clamp = (value: number): number => {
  return Math.max(0, Math.min(255, Math.round(value)));
};

// Validar que el archivo sea una imagen
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  return validTypes.includes(file.type);
};
