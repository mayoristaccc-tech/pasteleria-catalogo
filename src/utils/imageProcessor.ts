export const isValidImageFile = (file: File) => {
  return [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
  ].includes(file.type);
};

export const processImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;

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

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Error al procesar imagen"));
              return;
            }

            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, ".webp"),
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );

            resolve(optimizedFile);
          },
          "image/webp",
          0.8
        );
      };

      img.onerror = () => reject(new Error("Error al cargar imagen"));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Error al leer archivo"));
    reader.readAsDataURL(file);
  });
};