export async function convertImageToWebp(file: File, maxWidth = 800, quality = 0.85): Promise<File> {
  // If already WebP and small enough, return as is
  if (file.type === "image/webp" && file.size < 500 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Clean white background for transparency fallback if desired
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const convertedFile = new File([blob], `${baseName}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve(convertedFile);
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };
    };

    reader.onerror = (err) => {
      reject(err);
    };
  });
}
