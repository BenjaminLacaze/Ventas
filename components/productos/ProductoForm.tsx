import React, { useState, useEffect } from 'react';
import { Producto } from '@/types';
import { useStore } from '@/lib/store';

interface ProductoFormProps {
  productoInicial?: Producto;
  onClose: () => void;
}

export function ProductoForm({ productoInicial, onClose }: ProductoFormProps) {
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const { addProducto, updateProducto, etiquetas, addEtiqueta } = useStore();

  const [nombre, setNombre] = useState(productoInicial?.nombre || '');
  const [cantidad, setCantidad] = useState(productoInicial?.cantidad || 0);
  const [precioCompra, setPrecioCompra] = useState(productoInicial?.precioCompra || 0);
  const [precioVenta, setPrecioVenta] = useState(productoInicial?.precioVenta || 0);
  const [fotoUrl, setFotoUrl] = useState(productoInicial?.fotoUrl || '');
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<string[]>(productoInicial?.etiquetas || []);

  const ganancia = precioVenta - precioCompra;
  const porcentajeGanancia = precioCompra > 0 ? (ganancia / precioCompra) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (etiquetasSeleccionadas.length === 0) {
      alert("Por favor, selecciona al menos una etiqueta para clasificar este producto.");
      return;
    }

    const nuevoProducto: Producto = {
      id: productoInicial?.id || Date.now().toString(),
      nombre,
      cantidad,
      precioCompra,
      precioVenta,
      fotoUrl,
      etiquetas: etiquetasSeleccionadas,
    };

    if (productoInicial) {
      updateProducto(productoInicial.id, nuevoProducto);
    } else {
      addProducto(nuevoProducto);
    }
    onClose();
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
          <input required type="number" min="0" value={cantidad} onChange={e => setCantidad(Number(e.target.value))} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Foto URL (Opcional)</label>
          <input type="text" value={fotoUrl} onChange={e => setFotoUrl(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio Compra ($)</label>
          <input required type="number" min="0" value={precioCompra} onChange={e => setPrecioCompra(Number(e.target.value))} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Precio Venta ($)</label>
          <input required type="number" min="0" value={precioVenta} onChange={e => setPrecioVenta(Number(e.target.value))} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
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
            <button
              key={etiq.id}
              type="button"
              onClick={() => toggleEtiqueta(etiq.id)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                etiquetasSeleccionadas.includes(etiq.id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent border-border text-foreground hover:border-primary'
              }`}
            >
              {etiq.nombre}
            </button>
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
