import React, { useState } from 'react';
import { Servicio } from '@/types';
import { useStore } from '@/lib/store';

interface ServicioFormProps {
  servicioInicial?: Servicio;
  onClose: () => void;
}

export function ServicioForm({ servicioInicial, onClose }: ServicioFormProps) {
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const { addServicio, updateServicio, etiquetas, addEtiqueta, deleteEtiqueta, ventas, productos, servicios } = useStore();
  
  const [nombre, setNombre] = useState(servicioInicial?.nombre || '');
  const [precio, setPrecio] = useState<number | ''>(servicioInicial !== undefined ? servicioInicial.precio : '');
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<string[]>(servicioInicial?.etiquetas || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (etiquetasSeleccionadas.length === 0) {
      alert("Por favor, selecciona al menos una etiqueta para clasificar este servicio.");
      return;
    }

    const nuevoServicio: Servicio = {
      id: servicioInicial?.id || Date.now().toString(),
      nombre,
      precio: Number(precio) || 0,
      etiquetas: etiquetasSeleccionadas,
    };

    if (servicioInicial) {
      updateServicio(servicioInicial.id, nuevoServicio);
    } else {
      addServicio(nuevoServicio);
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
        <label className="block text-sm font-medium mb-1">Nombre del Servicio</label>
        <input required type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Precio ($)</label>
        <input required type="number" min="0" value={precio} onChange={e => setPrecio(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
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
          Guardar Servicio
        </button>
      </div>
    </form>
  );
}
