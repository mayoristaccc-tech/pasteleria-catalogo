export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
  image_path?: string | null;
  creado_en?: string | null;
}
