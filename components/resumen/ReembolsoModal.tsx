import React, { useState, useMemo } from 'react';
import { Venta, DetalleVenta } from '@/types';
import { useStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';

interface ReembolsoModalProps {
  isOpen: boolean;
  onClose: () => void;
  etiquetaId: string;
  etiquetaNombre: string;
  ventasFiltradas: Venta[];
}

export function ReembolsoModal({ isOpen, onClose, etiquetaId, etiquetaNombre, ventasFiltradas }: ReembolsoModalProps) {
  const { productos, servicios, addVenta } = useStore();

  // Agrupar los items vendidos bajo esta etiqueta
  const itemsVendidos = useMemo(() => {
    const mapa = new Map<string, { id: string, nombre: string, tipo: 'producto' | 'servicio', cantidadVendida: number, precioPromedio: number, gananciaPromedio: number }>();
    
    ventasFiltradas.forEach(v => {
      v.detalles.forEach(d => {
        // Verificar si el item pertenece a esta etiqueta
        const isProducto = d.tipoItem === 'producto';
        const itemObj = isProducto 
          ? productos.find(p => p.id === d.itemId)
          : servicios.find(s => s.id === d.itemId);
        
        if (itemObj?.etiquetas.includes(etiquetaId)) {
          const stats = mapa.get(d.itemId);
          if (stats) {
            stats.cantidadVendida += d.cantidad;
            stats.precioPromedio = d.precioUnitario; 
            stats.gananciaPromedio = d.ganancia;
          } else {
            mapa.set(d.itemId, {
              id: d.itemId,
              nombre: d.nombre,
              tipo: d.tipoItem,
              cantidadVendida: d.cantidad,
              precioPromedio: d.precioUnitario,
              gananciaPromedio: d.ganancia
            });
          }
        }
      });
    });

    return Array.from(mapa.values());
  }, [ventasFiltradas, etiquetaId, productos, servicios]);

  const [cantidadesADevolver, setCantidadesADevolver] = useState<Record<string, number>>({});

  const handleCantidadChange = (itemId: string, val: number, max: number) => {
    const valor = Math.max(0, Math.min(val, max));
    setCantidadesADevolver(prev => ({ ...prev, [itemId]: valor }));
  };

  const handleReembolso = (e: React.FormEvent) => {
    e.preventDefault();

    const detallesDevolucion: DetalleVenta[] = [];
    let totalDevolucion = 0;
    let gananciaTotalDevolucion = 0;

    itemsVendidos.forEach(item => {
      const cantDevolver = cantidadesADevolver[item.id] || 0;
      if (cantDevolver > 0) {
        const subtotal = cantDevolver * item.precioPromedio;
        detallesDevolucion.push({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
          tipoItem: item.tipo,
          itemId: item.id,
          nombre: `[Devolución] ${item.nombre}`,
          cantidad: -cantDevolver,
          precioUnitario: item.precioPromedio,
          subtotal: -subtotal,
          ganancia: -(cantDevolver * item.gananciaPromedio)
        });
        totalDevolucion += -subtotal;
        gananciaTotalDevolucion += -(cantDevolver * item.gananciaPromedio);
      }
    });

    if (detallesDevolucion.length === 0) {
      alert("Por favor, selecciona al menos un artículo para reembolsar.");
      return;
    }

    const notaDeCredito: Venta = {
      id: `dev-${Date.now()}`,
      fecha: new Date().toISOString(),
      detalles: detallesDevolucion,
      total: totalDevolucion,
      gananciaTotal: gananciaTotalDevolucion
    };

    addVenta(notaDeCredito);
    alert("Reembolso procesado exitosamente. Se ha generado una nota de crédito negativa.");
    setCantidadesADevolver({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reembolso: ${etiquetaNombre}`}>
      <form onSubmit={handleReembolso} className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona la cantidad a reembolsar de los artículos vendidos con esta etiqueta. 
          Esto devolverá el stock y ajustará los ingresos.
        </p>

        <div className="max-h-64 overflow-y-auto space-y-3">
          {itemsVendidos.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-md border border-border">
              <div>
                <p className="font-medium text-sm">{item.nombre}</p>
                <p className="text-xs text-muted-foreground">Vendidos (Neto): {item.cantidadVendida}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Devolver:</span>
                <input 
                  type="number" 
                  min="0"
                  max={Math.max(0, item.cantidadVendida)}
                  value={cantidadesADevolver[item.id] || ''}
                  onChange={(e) => handleCantidadChange(item.id, Number(e.target.value), Math.max(0, item.cantidadVendida))}
                  className="w-16 border border-border rounded-md px-2 py-1 text-sm bg-background text-center"
                />
              </div>
            </div>
          ))}
          {itemsVendidos.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              No hay artículos disponibles para reembolsar en esta etiqueta.
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end space-x-3 border-t border-border mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-md hover:bg-muted text-sm font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={itemsVendidos.length === 0} className="btn-premium px-6 py-2 rounded-md font-medium">
            Confirmar Reembolso
          </button>
        </div>
      </form>
    </Modal>
  );
}
