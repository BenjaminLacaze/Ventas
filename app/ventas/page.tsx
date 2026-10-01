"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Producto, Servicio, DetalleVenta, Venta } from "@/types";

export default function VentasPage() {
  const { productos, servicios, addVenta } = useStore();
  const [carrito, setCarrito] = useState<DetalleVenta[]>([]);
  const [tab, setTab] = useState<"productos" | "servicios">("productos");

  const agregarAlCarrito = (item: Producto | Servicio, tipo: "producto" | "servicio") => {
    setCarrito((prev) => {
      const existe = prev.find(d => d.itemId === item.id && d.tipoItem === tipo);
      
      if (tipo === "producto") {
        const prod = item as Producto;
        if (existe) {
          if (existe.cantidad >= prod.cantidad) {
            alert("No hay más stock disponible");
            return prev;
          }
          return prev.map(d => 
            d.itemId === item.id && d.tipoItem === tipo
              ? { ...d, cantidad: d.cantidad + 1, subtotal: (d.cantidad + 1) * d.precioUnitario, ganancia: (d.cantidad + 1) * (prod.precioVenta - prod.precioCompra) }
              : d
          );
        }
        return [...prev, {
          id: Date.now().toString(),
          tipoItem: tipo,
          itemId: item.id,
          nombre: item.nombre,
          cantidad: 1,
          precioUnitario: prod.precioVenta,
          subtotal: prod.precioVenta,
          ganancia: prod.precioVenta - prod.precioCompra,
        }];
      } else {
        const serv = item as Servicio;
        if (existe) {
          return prev.map(d => 
            d.itemId === item.id && d.tipoItem === tipo
              ? { ...d, cantidad: d.cantidad + 1, subtotal: (d.cantidad + 1) * d.precioUnitario, ganancia: (d.cantidad + 1) * serv.precio }
              : d
          );
        }
        return [...prev, {
          id: Date.now().toString(),
          tipoItem: tipo,
          itemId: item.id,
          nombre: item.nombre,
          cantidad: 1,
          precioUnitario: serv.precio,
          subtotal: serv.precio,
          ganancia: serv.precio, // Servicios tienen 100% de ganancia según lógica
        }];
      }
    });
  };

  const eliminarDelCarrito = (id: string) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const modificarCantidad = (id: string, delta: number) => {
    setCarrito(prev => prev.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + delta;
        if (nuevaCantidad <= 0) return item; // No bajar de 1, usar botón de eliminar
        
        if (item.tipoItem === 'producto') {
          const prod = productos.find(p => p.id === item.itemId);
          if (prod && nuevaCantidad > prod.cantidad) {
            alert("No hay más stock disponible");
            return item;
          }
        }
        
        const unitGanancia = item.ganancia / item.cantidad;
        return {
          ...item,
          cantidad: nuevaCantidad,
          subtotal: nuevaCantidad * item.precioUnitario,
          ganancia: nuevaCantidad * unitGanancia
        };
      }
      return item;
    }));
  };

  const totalVenta = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const totalGanancia = carrito.reduce((sum, item) => sum + item.ganancia, 0);

  const finalizarVenta = () => {
    if (carrito.length === 0) return;
    
    if (!window.confirm(`¿Está seguro de que desea registrar esta venta por un total de $${totalVenta.toLocaleString()}?`)) {
      return;
    }
    
    const nuevaVenta: Venta = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      detalles: carrito,
      total: totalVenta,
      gananciaTotal: totalGanancia,
    };

    addVenta(nuevaVenta);
    setCarrito([]);
    alert("Venta registrada con éxito");
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-8rem)] min-h-[600px] gap-6">
      {/* Catálogo */}
      <div className="flex-1 flex flex-col min-h-[400px] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex space-x-2">
          <button
            onClick={() => setTab("productos")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              tab === "productos" ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setTab("servicios")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              tab === "servicios" ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            Servicios
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {tab === "productos" ? (
              productos.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => agregarAlCarrito(p, "producto")}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary hover:shadow-md ${p.cantidad === 0 ? "opacity-50 grayscale cursor-not-allowed" : "border-border bg-card"}`}
                >
                  <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    {p.fotoUrl ? (
                      <img 
                        src={p.fotoUrl} 
                        alt={p.nombre} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext fill='%23999' x='50' y='50' font-family='sans-serif' font-size='10' text-anchor='middle' alignment-baseline='middle'%3EError%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin img</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm leading-tight mb-1">{p.nombre}</h4>
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-primary">${p.precioVenta.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Stock: {p.cantidad}</span>
                  </div>
                </div>
              ))
            ) : (
              servicios.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => agregarAlCarrito(s, "servicio")}
                  className="p-4 border border-border bg-card rounded-lg cursor-pointer transition-all hover:border-primary hover:shadow-md flex flex-col aspect-square justify-between"
                >
                  <h4 className="font-semibold text-sm">{s.nombre}</h4>
                  <span className="font-bold text-primary text-lg">${s.precio.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Carrito */}
      <div className="w-full lg:w-96 flex flex-col bg-card border border-border rounded-lg shadow-sm overflow-hidden shrink-0">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-bold text-lg">Resumen de Venta</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {carrito.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
              El carrito está vacío
            </div>
          ) : (
            carrito.map(item => (
              <div key={item.id} className="flex flex-col p-3 bg-muted/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-sm leading-tight">{item.nombre}</h5>
                  <button 
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="text-red-500 hover:text-red-700 bg-red-500/10 p-1 rounded-md transition-colors ml-2"
                    title="Quitar"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center space-x-2 bg-background border border-border rounded-md px-1 py-0.5">
                    <button 
                      onClick={() => modificarCantidad(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold w-4 text-center">{item.cantidad}</span>
                    <button 
                      onClick={() => modificarCantidad(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">${item.precioUnitario.toLocaleString()} c/u</div>
                    <div className="font-bold text-sm text-primary">${item.subtotal.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border bg-muted/10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground font-medium">Total</span>
            <span className="text-2xl font-bold text-primary">${totalVenta.toLocaleString()}</span>
          </div>
          <button 
            onClick={finalizarVenta}
            disabled={carrito.length === 0}
            className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
              carrito.length > 0 
                ? "btn-premium" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
}
