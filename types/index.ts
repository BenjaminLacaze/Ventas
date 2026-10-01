export interface Etiqueta {
  id: string;
  nombre: string;
  color?: string; // Para mostrar colores en la UI si lo deseamos
}

export interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  precioCompra: number;
  precioVenta: number;
  fotoUrl?: string;
  etiquetas: string[]; // Array de IDs de etiquetas
}

export interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  etiquetas: string[]; // Array de IDs de etiquetas
}

export type TipoItemVenta = 'producto' | 'servicio';

export interface DetalleVenta {
  id: string;
  tipoItem: TipoItemVenta;
  itemId: string; // ID del producto o servicio
  nombre: string; // Guardamos el nombre al momento de la venta por si luego cambia
  cantidad: number; // Siempre será 1 para servicios
  precioUnitario: number;
  subtotal: number;
  ganancia: number; // Ganancia calculada para este item en esta venta
}

export interface Venta {
  id: string;
  fecha: string; // ISO String
  detalles: DetalleVenta[];
  total: number;
  gananciaTotal: number;
}

export interface Configuracion {
  fontSize: 'small' | 'medium' | 'large';
}
