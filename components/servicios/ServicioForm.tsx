import React, { useState } from 'react';
import { Servicio } from '@/types';
import { useStore } from '@/lib/store';

interface ServicioFormProps {
  servicioInicial?: Servicio;
  onClose: () => void;
}

export function ServicioForm({ servicioInicial, onClose }: ServicioFormProps) {
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const { addServicio, updateServicio, etiquetas, addEtiqueta } = useStore();
  
  const [nombre, setNombre] = useState(servicioInicial?.nombre || '');
  const [precio, setPrecio] = useState(servicioInicial?.precio || 0);
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
      precio,
      etiquetas: etiquetasSeleccionadas,
    };

    if (servicioInicial) {
      updateServicio(servicioInicial.id, nuevoServicio);
    } else {
      addServicio(nuevoServicio);
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
        <label className="block text-sm font-medium mb-1">Nombre del Servicio</label>
        <input required type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Precio ($)</label>
        <input required type="number" min="0" value={precio} onChange={e => setPrecio(Number(e.target.value))} className="w-full border border-border rounded-md px-3 py-2 bg-background" />
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
          Guardar Servicio
        </button>
      </div>
    </form>
  );
}
