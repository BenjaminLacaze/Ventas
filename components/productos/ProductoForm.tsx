import React, { useState, useEffect } from 'react';
import { Producto } from '@/types';
import { useStore } from '@/lib/store';

interface ProductoFormProps {
  productoInicial?: Producto;
  onClose: () => void;
}

export function ProductoForm({ productoInicial, onClose }: ProductoFormProps) {
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const { addProducto, updateProducto, etiquetas, addEtiqueta, deleteEtiqueta, ventas, productos, servicios } = useStore();

  const [nombre, setNombre] = useState(productoInicial?.nombre || '');
  const [cantidad, setCantidad] = useState<number | ''>(productoInicial !== undefined ? productoInicial.cantidad : '');
  const [precioCompra, setPrecioCompra] = useState<number | ''>(productoInicial !== undefined ? productoInicial.precioCompra : '');
  const [precioVenta, setPrecioVenta] = useState<number | ''>(productoInicial !== undefined ? productoInicial.precioVenta : '');
  const [fotoUrl, setFotoUrl] = useState(productoInicial?.fotoUrl || '');
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<string[]>(productoInicial?.etiquetas || []);

  const ganancia = (Number(precioVenta) || 0) - (Number(precioCompra) || 0);
  const porcentajeGanancia = (Number(precioCompra) || 0) > 0 ? (ganancia / (Number(precioCompra) || 1)) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (etiquetasSeleccionadas.length === 0) {
      alert("Por favor, selecciona al menos una etiqueta para clasificar este producto.");
      return;
    }

    let finalFotoUrl = fotoUrl.trim();
    if (finalFotoUrl && !finalFotoUrl.startsWith('http://') && !finalFotoUrl.startsWith('https://')) {
      finalFotoUrl = 'https://' + finalFotoUrl;
    }

    const nuevoProducto: Producto = {
      id: productoInicial?.id || Date.now().toString(),
      nombre,
      cantidad: Number(cantidad) || 0,
      precioCompra: Number(precioCompra) || 0,
      precioVenta: Number(precioVenta) || 0,
      fotoUrl: finalFotoUrl,
      etiquetas: etiquetasSeleccionadas,
    };

    if (productoInicial) {
      updateProducto(productoInicial.id, nuevoProducto);
    } else {
      addProducto(nuevoProducto);
    }
    onClose();
  };

  const handleDeleteEtiquetaSegura = (id: string, nombreEtiqueta: string) => {
    const tieneHistorial = ventas.some(v => v.detalles.some(d => {
      const etiqIds = d.tipoItem === 'producto'
        ? productos.find(p => p.id === d.itemId)?.etiquetas
        : servicios.find(s => s.id === d.itemId)?.etiquetas;
      return etiqIds?.includes(id);
    }));

    if (tieneHistorial) {
      alert(`La etiqueta "${nombreEtiqueta}" tiene historial de ventas en la pestaña Resumen. Por favor, elimínala desde allí.`);
      return;
    }

    if (window.confirm(`¿Seguro que deseas eliminar la etiqueta "${nombreEtiqueta}" por completo del sistema?`)) {
      deleteEtiqueta(id);
    }
  };

  const toggleEtiqueta = (id: string) => {
    setEtiquetasSeleccionadas(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleCrearEtiqueta = () => {
    if (nuevaEtiqueta.trim()) {
      const nueva = { id: Date.now().toString(), nombre: nuevaEtiqueta.trim() };
      addEtiqueta(nueva);
      setEtiquetasSeleccionadas(prev => [...prev, nueva.id]);
      setNuevaEtiqueta('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input required type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad</label>
          <input required type="number" min="0" value={cantidad} onChange={e => setCantidad(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Foto URL (Opcional)</label>
          <input type="text" value={fotoUrl} onChange={e => setFotoUrl(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio Compra ($)</label>
          <input required type="number" min="0" value={precioCompra} onChange={e => setPrecioCompra(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Precio Venta ($)</label>
          <input required type="number" min="0" value={precioVenta} onChange={e => setPrecioVenta(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
        </div>
      </div>

      <div className="bg-muted p-4 rounded-md flex justify-between items-center text-sm">
        <div>
          <span className="block text-muted-foreground">Ganancia</span>
          <span className="font-bold text-green-600 dark:text-green-400">${ganancia.toLocaleString()}</span>
        </div>
        <div className="text-right">
          <span className="block text-muted-foreground">Margen</span>
          <span className="font-bold">{porcentajeGanancia.toFixed(2)}%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Etiquetas</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {etiquetas.map(etiq => (
            <div key={etiq.id} className="flex items-center">
              <button
                type="button"
                onClick={() => toggleEtiqueta(etiq.id)}
                className={`px-3 py-1 text-sm rounded-l-full border border-r-0 transition-colors ${
                  etiquetasSeleccionadas.includes(etiq.id)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent border-border text-foreground hover:border-primary'
                }`}
              >
                {etiq.nombre}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEtiquetaSegura(etiq.id, etiq.nombre)}
                className={`px-2 py-1 text-sm rounded-r-full border transition-colors hover:bg-red-500 hover:text-white hover:border-red-500 ${
                  etiquetasSeleccionadas.includes(etiq.id)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent border-border text-foreground'
                }`}
                title="Eliminar etiqueta"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Nueva etiqueta..." 
            value={nuevaEtiqueta} 
            onChange={e => setNuevaEtiqueta(e.target.value)}
            className="flex-1 border border-border rounded-md px-3 py-1 text-sm bg-background" 
          />
          <button 
            type="button" 
            onClick={handleCrearEtiqueta}
            className="px-3 py-1 text-sm bg-accent text-accent-foreground rounded-md hover:opacity-90"
          >
            Crear
          </button>
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-3 border-t border-border mt-6">
        <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-md hover:bg-muted text-sm font-medium transition-colors">
          Cancelar
        </button>
        <button type="submit" className="btn-premium px-6 py-2 rounded-md font-medium">
          Guardar Producto
        </button>
      </div>
    </form>
  );
}
