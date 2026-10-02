import { create } from 'zustand';
import { Producto, Servicio, Etiqueta, Venta, Configuracion } from '@/types';
import { supabase } from './supabase';

interface StoreState {
  // Datos
  productos: Producto[];
  servicios: Servicio[];
  etiquetas: Etiqueta[];
  ventas: Venta[];
  configuracion: Configuracion;
  isMobileMenuOpen: boolean;
  isInitialized: boolean;

  // Inicialización
  fetchInitialData: () => Promise<void>;

  // Acciones (a implementar luego en sus respectivos módulos)
  setConfiguracion: (config: Partial<Configuracion>) => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  
  // Acciones de Productos
  addProducto: (producto: Producto) => Promise<void>;
  updateProducto: (id: string, producto: Partial<Producto>) => Promise<void>;
  deleteProducto: (id: string) => Promise<void>;

  // Acciones de Servicios
  addServicio: (servicio: Servicio) => Promise<void>;
  updateServicio: (id: string, servicio: Partial<Servicio>) => Promise<void>;
  deleteServicio: (id: string) => Promise<void>;

  // Acciones de Etiquetas
  addEtiqueta: (etiqueta: Etiqueta) => Promise<void>;
  updateEtiqueta: (id: string, etiqueta: Partial<Etiqueta>) => Promise<void>;
  deleteEtiqueta: (id: string) => Promise<void>;

  // Acciones de Ventas
  addVenta: (venta: Venta) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  productos: [],
  servicios: [],
  etiquetas: [],
  ventas: [],
  configuracion: {
    fontSize: 'medium',
  },
  isMobileMenuOpen: false,
  isInitialized: false,

  fetchInitialData: async () => {
    // Si ya inicializó, no hace falta volver a buscar
    if (get().isInitialized) return;

    try {
      const [etiqRes, prodRes, servRes, ventRes] = await Promise.all([
        supabase.from('etiquetas').select('*'),
        supabase.from('productos').select('*'),
        supabase.from('servicios').select('*'),
        supabase.from('ventas').select('*').order('fecha', { ascending: true })
      ]);

      set({
        etiquetas: etiqRes.data?.map(e => ({ id: e.id, nombre: e.nombre, color: e.color })) || [],
        productos: prodRes.data?.map(p => ({
          id: p.id,
          nombre: p.nombre,
          cantidad: Number(p.cantidad),
          precioCompra: Number(p.precio_compra),
          precioVenta: Number(p.precio_venta),
          fotoUrl: p.foto_url,
          etiquetas: p.etiquetas || []
        })) || [],
        servicios: servRes.data?.map(s => ({
          id: s.id,
          nombre: s.nombre,
          precio: Number(s.precio),
          etiquetas: s.etiquetas || []
        })) || [],
        ventas: ventRes.data?.map(v => ({
          id: v.id,
          fecha: v.fecha,
          total: Number(v.total),
          gananciaTotal: Number(v.ganancia_total),
          detalles: typeof v.detalles === 'string' ? JSON.parse(v.detalles) : v.detalles
        })) || [],
        isInitialized: true
      });
    } catch (e) {
      console.error("Error cargando datos de Supabase:", e);
    }
  },

  setConfiguracion: (config) =>
    set((state) => ({
      configuracion: { ...state.configuracion, ...config },
    })),
  setMobileMenuOpen: (isOpen) =>
    set(() => ({
      isMobileMenuOpen: isOpen,
    })),

  addProducto: async (producto) => {
    set((state) => ({ productos: [...state.productos, producto] }));
    await supabase.from('productos').insert([{
      id: producto.id,
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      precio_compra: producto.precioCompra,
      precio_venta: producto.precioVenta,
      foto_url: producto.fotoUrl,
      etiquetas: producto.etiquetas
    }]);
  },
  updateProducto: async (id, producto) => {
    set((state) => ({
      productos: state.productos.map((p) => p.id === id ? { ...p, ...producto } : p),
    }));
    
    const updatePayload: any = {};
    if (producto.nombre !== undefined) updatePayload.nombre = producto.nombre;
    if (producto.cantidad !== undefined) updatePayload.cantidad = producto.cantidad;
    if (producto.precioCompra !== undefined) updatePayload.precio_compra = producto.precioCompra;
    if (producto.precioVenta !== undefined) updatePayload.precio_venta = producto.precioVenta;
    if (producto.fotoUrl !== undefined) updatePayload.foto_url = producto.fotoUrl;
    if (producto.etiquetas !== undefined) updatePayload.etiquetas = producto.etiquetas;

    await supabase.from('productos').update(updatePayload).eq('id', id);
  },
  deleteProducto: async (id) => {
    set((state) => ({
      productos: state.productos.filter((p) => p.id !== id),
    }));
    await supabase.from('productos').delete().eq('id', id);
  },

  addServicio: async (servicio) => {
    set((state) => ({ servicios: [...state.servicios, servicio] }));
    await supabase.from('servicios').insert([{
      id: servicio.id,
      nombre: servicio.nombre,
      precio: servicio.precio,
      etiquetas: servicio.etiquetas
    }]);
  },
  updateServicio: async (id, servicio) => {
    set((state) => ({
      servicios: state.servicios.map((s) => s.id === id ? { ...s, ...servicio } : s),
    }));
    
    const updatePayload: any = {};
    if (servicio.nombre !== undefined) updatePayload.nombre = servicio.nombre;
    if (servicio.precio !== undefined) updatePayload.precio = servicio.precio;
    if (servicio.etiquetas !== undefined) updatePayload.etiquetas = servicio.etiquetas;

    await supabase.from('servicios').update(updatePayload).eq('id', id);
  },
  deleteServicio: async (id) => {
    set((state) => ({
      servicios: state.servicios.filter((s) => s.id !== id),
    }));
    await supabase.from('servicios').delete().eq('id', id);
  },

  addEtiqueta: async (etiqueta) => {
    set((state) => ({ etiquetas: [...state.etiquetas, etiqueta] }));
    await supabase.from('etiquetas').insert([{
      id: etiqueta.id,
      nombre: etiqueta.nombre,
      color: etiqueta.color
    }]);
  },
  updateEtiqueta: async (id, etiqueta) => {
    set((state) => ({
      etiquetas: state.etiquetas.map((e) => e.id === id ? { ...e, ...etiqueta } : e),
    }));
    
    const updatePayload: any = {};
    if (etiqueta.nombre !== undefined) updatePayload.nombre = etiqueta.nombre;
    if (etiqueta.color !== undefined) updatePayload.color = etiqueta.color;

    await supabase.from('etiquetas').update(updatePayload).eq('id', id);
  },
  deleteEtiqueta: async (id) => {
    // 1. Borrar de Zustand local (cascada de referencias)
    set((state) => ({
      etiquetas: state.etiquetas.filter((e) => e.id !== id),
      productos: state.productos.map(p => ({
        ...p,
        etiquetas: p.etiquetas.filter(eId => eId !== id)
      })),
      servicios: state.servicios.map(s => ({
        ...s,
        etiquetas: s.etiquetas.filter(eId => eId !== id)
      })),
    }));

    // 2. Borrar etiqueta de la tabla Supabase
    await supabase.from('etiquetas').delete().eq('id', id);

    // 3. Actualizar productos/servicios en Supabase (simplificado buscando todos los que la tenían, o iterando)
    const state = get();
    for (const p of state.productos) {
      // Como Zustand ya limpió el array, p.etiquetas es el array correcto. Solo lo reescribimos si no la tiene.
      // Sería más eficiente rastrear cuáles tenían la etiqueta antes de borrarlas de zustand, 
      // pero por simplicidad subimos todos los que tengan menos etiquetas que antes o simplemente iteramos.
      await supabase.from('productos').update({ etiquetas: p.etiquetas }).eq('id', p.id);
    }
    for (const s of state.servicios) {
      await supabase.from('servicios').update({ etiquetas: s.etiquetas }).eq('id', s.id);
    }
  },

  addVenta: async (venta) => {
    // 1. Actualizar estado local de Zustand
    set((state) => {
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
    });

    // 2. Guardar venta en Supabase
    await supabase.from('ventas').insert([{
      id: venta.id,
      fecha: venta.fecha,
      total: venta.total,
      ganancia_total: venta.gananciaTotal,
      detalles: venta.detalles
    }]);

    // 3. Actualizar cantidades de productos en Supabase
    const state = get();
    for (const d of venta.detalles) {
      if (d.tipoItem === 'producto') {
        const p = state.productos.find(x => x.id === d.itemId);
        if (p) {
          await supabase.from('productos').update({ cantidad: p.cantidad }).eq('id', p.id);
        }
      }
    }
  }
}));
