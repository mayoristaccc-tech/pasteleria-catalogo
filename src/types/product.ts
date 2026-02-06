// Tipos para los productos de pastelería

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string; // Base64 de la imagen
  fechaCreacion: number;
}

// Genera un ID único simple
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
