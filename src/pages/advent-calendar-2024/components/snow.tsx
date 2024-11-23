import React from "react";
import Snowfall from "react-snowfall";
import { useEffect, useState } from "react";
import snowflakeSrc1 from "../assets/decorations/snowflake-1.svg";
import snowflakeSrc2 from "../assets/decorations/snowflake-2.svg";

const Snow = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]); // Estado para las imágenes

  useEffect(() => {
    let isMounted = true; // Controla si el componente sigue montado
    const objectURLs: string[] = []; // Almacena los object URLs para liberar memoria después

    async function loadImageToState() {
      try {
        // Lista de URLs o fuentes de las imágenes
        const imageSources = [snowflakeSrc1, snowflakeSrc2];

        // Cargar todas las imágenes
        const loadedImages = await Promise.all(
          imageSources.map((src) => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.src = src;

              img.onload = () => resolve(img);
              img.onerror = () =>
                reject(new Error(`Failed to load image: ${src}`));
            });
          })
        );

        if (isMounted) {
          setImages(loadedImages); // Actualiza el estado con las imágenes cargadas
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    }

    loadImageToState();

    return () => {
      isMounted = false; // Evita actualizaciones del estado tras desmontar el componente
      // Limpieza de memory leaks si las imágenes usan Object URLs
      objectURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <Snowfall
      style={{
        position: "fixed",
        zIndex: "9999999",
      }}
      color="#EEF0FB"
      radius={[50, 50]}
      speed={[1.0, 2.0]} // Velocidad de los copos
      snowflakeCount={20}
      images={images} // Pasamos las imágenes cargadas al componente
    />
  );
};

export default Snow;
