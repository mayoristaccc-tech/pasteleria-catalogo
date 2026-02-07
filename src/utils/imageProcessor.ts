export const isValidImageFile = (file: File) => {
  return file.type.startsWith("image/");
};

export const processImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject("Error al leer archivo");

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => reject("Error al cargar imagen");

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("No se pudo crear contexto de canvas");
          return;
        }

        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        const QUALITY = 0.80;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject("Error al crear blob de imagen");
              return;
            }

            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, ".webp"),
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );

            resolve(optimizedFile);
          },
          "image/webp",
          QUALITY
        );
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
