"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Producto, Servicio } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { ProductoForm } from "@/components/productos/ProductoForm";
import { ServicioForm } from "@/components/servicios/ServicioForm";

export default function ProductosPage() {
  const [tab, setTab] = useState<"productos" | "servicios">("productos");
  const { productos, servicios, deleteProducto, deleteServicio, etiquetas } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | undefined>(undefined);
  const [servicioEditando, setServicioEditando] = useState<Servicio | undefined>(undefined);

  const openAddModal = () => {
    setProductoEditando(undefined);
    setServicioEditando(undefined);
    setIsModalOpen(true);
  };

  const openEditProducto = (producto: Producto) => {
    setProductoEditando(producto);
    setIsModalOpen(true);
  };

  const openEditServicio = (servicio: Servicio) => {
    setServicioEditando(servicio);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getEtiquetasNombres = (ids: string[]) => {
    return ids.map(id => etiquetas.find(e => e.id === id)?.nombre).filter(Boolean).join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Catálogo</h1>
        <div className="flex bg-border p-1 rounded-lg">
          <button
            onClick={() => setTab("productos")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              tab === "productos"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setTab("servicios")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              tab === "servicios"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Servicios
          </button>
        </div>

        <div className="flex space-x-2 w-full sm:w-auto mt-4 sm:mt-0">
          <button onClick={openAddModal} className="btn-premium px-4 py-2 rounded-md font-medium flex-1 sm:flex-none">
            {tab === "productos" ? "+ Nuevo Producto" : "+ Nuevo Servicio"}
          </button>
        </div>
      </div>

      {tab === "productos" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-muted flex items-center justify-center">
                {producto.fotoUrl ? (
                  <img 
                    src={producto.fotoUrl} 
                    alt={producto.nombre} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext fill='%23999' x='50' y='50' font-family='sans-serif' font-size='12' text-anchor='middle' alignment-baseline='middle'%3EError de enlace%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">Sin imagen</span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1">{producto.nombre}</h3>
                {producto.etiquetas.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-2">🏷️ {getEtiquetasNombres(producto.etiquetas)}</p>
                )}
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-muted-foreground">Stock: {producto.cantidad}</span>
                  <span className="font-semibold text-primary">${producto.precioVenta.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                  <span>Costo: ${producto.precioCompra.toLocaleString()}</span>
                  <span className="text-green-600 dark:text-green-400">Ganancia: ${(producto.precioVenta - producto.precioCompra).toLocaleString()}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-end space-x-2">
                  <button onClick={() => openEditProducto(producto)} className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1 bg-accent rounded-md">Editar</button>
                  <button onClick={() => deleteProducto(producto.id)} className="text-sm font-medium text-red-500 hover:text-red-600 px-3 py-1 bg-red-500/10 rounded-md">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
          {productos.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-dashed border-border rounded-lg">
              No hay productos registrados.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2">{servicio.nombre}</h3>
                {servicio.etiquetas.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-2">🏷️ {getEtiquetasNombres(servicio.etiquetas)}</p>
                )}
                <p className="font-semibold text-primary text-xl mt-auto">${servicio.precio.toLocaleString()}</p>
                <div className="mt-6 pt-4 border-t border-border flex justify-end space-x-2">
                  <button onClick={() => openEditServicio(servicio)} className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1 bg-accent rounded-md">Editar</button>
                  <button onClick={() => deleteServicio(servicio.id)} className="text-sm font-medium text-red-500 hover:text-red-600 px-3 py-1 bg-red-500/10 rounded-md">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
          {servicios.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-dashed border-border rounded-lg">
              No hay servicios registrados.
            </div>
          )}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={
          tab === 'productos' 
            ? (productoEditando ? 'Editar Producto' : 'Nuevo Producto')
            : (servicioEditando ? 'Editar Servicio' : 'Nuevo Servicio')
        }
      >
        {tab === 'productos' ? (
          <ProductoForm productoInicial={productoEditando} onClose={handleCloseModal} />
        ) : (
          <ServicioForm servicioInicial={servicioEditando} onClose={handleCloseModal} />
        )}
      </Modal>
    </div>
  );
}
