import { Producto, Servicio, Etiqueta, Venta, Configuracion } from "@/types";

/**
 * Esta es la capa de abstracción de Base de Datos.
 * Actualmente la aplicación utiliza Zustand y LocalStorage para mantener un prototipo rápido,
 * pero esta clase sirve como interfaz para conectar en el futuro un ORM como Prisma
 * con PostgreSQL (ej. Vercel Postgres) o Supabase.
 */

export interface DatabaseAdapter {
  // Productos
  getProductos(): Promise<Producto[]>;
  createProducto(producto: Omit<Producto, 'id'>): Promise<Producto>;
  updateProducto(id: string, producto: Partial<Producto>): Promise<Producto>;
  deleteProducto(id: string): Promise<boolean>;

  // Servicios
  getServicios(): Promise<Servicio[]>;
  createServicio(servicio: Omit<Servicio, 'id'>): Promise<Servicio>;
  updateServicio(id: string, servicio: Partial<Servicio>): Promise<Servicio>;
  deleteServicio(id: string): Promise<boolean>;

  // Ventas
  getVentas(): Promise<Venta[]>;
  createVenta(venta: Omit<Venta, 'id'>): Promise<Venta>;

  // Etiquetas
  getEtiquetas(): Promise<Etiqueta[]>;
  createEtiqueta(etiqueta: Omit<Etiqueta, 'id'>): Promise<Etiqueta>;
}

// Ejemplo de cómo se instanciaría el adaptador en el futuro:
// export const db: DatabaseAdapter = new PrismaAdapter();
