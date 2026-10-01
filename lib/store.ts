import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Producto, Servicio, Etiqueta, Venta, Configuracion } from '@/types';

interface StoreState {
  // Datos
  productos: Producto[];
  servicios: Servicio[];
  etiquetas: Etiqueta[];
  ventas: Venta[];
  configuracion: Configuracion;
  isMobileMenuOpen: boolean;

  // Acciones (a implementar luego en sus respectivos módulos)
  setConfiguracion: (config: Partial<Configuracion>) => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  
  // Acciones de Productos
  addProducto: (producto: Producto) => void;
  updateProducto: (id: string, producto: Partial<Producto>) => void;
  deleteProducto: (id: string) => void;

  // Acciones de Servicios
  addServicio: (servicio: Servicio) => void;
  updateServicio: (id: string, servicio: Partial<Servicio>) => void;
  deleteServicio: (id: string) => void;

  // Acciones de Etiquetas
  addEtiqueta: (etiqueta: Etiqueta) => void;
  updateEtiqueta: (id: string, etiqueta: Partial<Etiqueta>) => void;
  deleteEtiqueta: (id: string) => void;

  // Acciones de Ventas
  addVenta: (venta: Venta) => void;
}

// Datos de prueba (mock data)
const mockEtiquetas: Etiqueta[] = [
  { id: '1', nombre: 'Teclado', color: 'blue' },
  { id: '2', nombre: 'Mouse', color: 'green' },
];

const mockProductos: Producto[] = [
  {
    id: '1',
    nombre: 'Teclado Logitech',
    cantidad: 10,
    precioCompra: 40000,
    precioVenta: 60000,
    etiquetas: ['1'],
  },
  {
    id: '2',
    nombre: 'Teclado Redragon',
    cantidad: 5,
    precioCompra: 50000,
    precioVenta: 75000,
    etiquetas: ['1'],
  },
  {
    id: '3',
    nombre: 'Mouse Razer',
    cantidad: 8,
    precioCompra: 30000,
    precioVenta: 45000,
    etiquetas: ['2'],
  }
];

const mockServicios: Servicio[] = [
  {
    id: '1',
    nombre: 'Mantenimiento PC',
    precio: 25000,
    etiquetas: [],
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      productos: mockProductos,
      servicios: mockServicios,
      etiquetas: mockEtiquetas,
      ventas: [],
      configuracion: {
        fontSize: 'medium',
      },
      isMobileMenuOpen: false,
      setConfiguracion: (config) =>
        set((state) => ({
          configuracion: { ...state.configuracion, ...config },
        })),
      setMobileMenuOpen: (isOpen) =>
        set(() => ({
          isMobileMenuOpen: isOpen,
        })),

      addProducto: (producto) =>
        set((state) => ({ productos: [...state.productos, producto] })),
      updateProducto: (id, producto) =>
        set((state) => ({
          productos: state.productos.map((p) =>
            p.id === id ? { ...p, ...producto } : p
          ),
        })),
      deleteProducto: (id) =>
        set((state) => ({
          productos: state.productos.filter((p) => p.id !== id),
        })),

      addServicio: (servicio) =>
        set((state) => ({ servicios: [...state.servicios, servicio] })),
      updateServicio: (id, servicio) =>
        set((state) => ({
          servicios: state.servicios.map((s) =>
            s.id === id ? { ...s, ...servicio } : s
          ),
        })),
      deleteServicio: (id) =>
        set((state) => ({
          servicios: state.servicios.filter((s) => s.id !== id),
        })),

      addEtiqueta: (etiqueta) =>
        set((state) => ({ etiquetas: [...state.etiquetas, etiqueta] })),
      updateEtiqueta: (id, etiqueta) =>
        set((state) => ({
          etiquetas: state.etiquetas.map((e) =>
            e.id === id ? { ...e, ...etiqueta } : e
          ),
        })),
      deleteEtiqueta: (id) =>
        set((state) => ({
          etiquetas: state.etiquetas.filter((e) => e.id !== id),
        })),

      addVenta: (venta) =>
        set((state) => {
          // Descontar stock de productos vendidos
          const nuevosProductos = state.productos.map(p => {
            const detalleVenta = venta.detalles.find(d => d.tipoItem === 'producto' && d.itemId === p.id);
            if (detalleVenta) {
              return { ...p, cantidad: Math.max(0, p.cantidad - detalleVenta.cantidad) };
            }
            return p;
          });

          return {
            ventas: [...state.ventas, venta],
            productos: nuevosProductos,
          };
        }),
    }),
    {
      name: 'adminstore-storage', // Nombre para localStorage
    }
  )
);
