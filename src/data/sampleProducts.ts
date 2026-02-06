// Productos de ejemplo para mostrar la galería
import sampleChocolateCake from "@/assets/sample-chocolate-cake.jpg";
import sampleCupcakes from "@/assets/sample-cupcakes.jpg";
import sampleCheesecake from "@/assets/sample-cheesecake.jpg";
import sampleMacarons from "@/assets/sample-macarons.jpg";
import sampleTiramisu from "@/assets/sample-tiramisu.jpg";
import sampleAppleTart from "@/assets/sample-apple-tart.jpg";

export interface SampleProduct {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  fechaCreacion: number;
}

export const sampleProducts: SampleProduct[] = [
  {
    id: "sample-1",
    nombre: "Torta de Chocolate con Frutos Rojos",
    descripcion: "Exquisita torta de chocolate con ganache oscuro, decorada con fresas frescas, moras y un delicado toque de oro comestible. Perfecta para celebraciones especiales.",
    imagen: sampleChocolateCake,
    fechaCreacion: Date.now() - 1000,
  },
  {
    id: "sample-2",
    nombre: "Cupcakes Artesanales",
    descripcion: "Deliciosos cupcakes con buttercream en colores pastel y sprinkles. Ideales para cumpleaños, baby showers y eventos especiales.",
    imagen: sampleCupcakes,
    fechaCreacion: Date.now() - 2000,
  },
  {
    id: "sample-3",
    nombre: "Cheesecake de Frutillas",
    descripcion: "Cremoso cheesecake con base de galleta, cubierto con frutillas frescas y coulis de frutos rojos. Una delicia irresistible.",
    imagen: sampleCheesecake,
    fechaCreacion: Date.now() - 3000,
  },
  {
    id: "sample-4",
    nombre: "Macarons Franceses",
    descripcion: "Elegantes macarons artesanales en sabores de rosa, menta y lavanda. Perfectos para regalar o acompañar el té de la tarde.",
    imagen: sampleMacarons,
    fechaCreacion: Date.now() - 4000,
  },
  {
    id: "sample-5",
    nombre: "Tiramisú Italiano",
    descripcion: "Auténtico tiramisú con capas de bizcocho embebido en café, crema de mascarpone y cacao en polvo. Receta tradicional italiana.",
    imagen: sampleTiramisu,
    fechaCreacion: Date.now() - 5000,
  },
  {
    id: "sample-6",
    nombre: "Tarta de Manzana Caramelizada",
    descripcion: "Rústica tarta con manzanas caramelizadas dispuestas en espiral sobre una base de masa crocante. Espolvoreada con azúcar impalpable.",
    imagen: sampleAppleTart,
    fechaCreacion: Date.now() - 6000,
  },
];
