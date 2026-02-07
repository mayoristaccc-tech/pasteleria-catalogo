// Tipos para los productos de pastelería

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  creado_en?: string | null;
}
