"use client";

import { useStore } from "@/lib/store";

export default function ConfiguracionPage() {
  const { configuracion, setConfiguracion } = useStore();

  const handleFontSizeChange = (fontSize: "small" | "medium" | "large") => {
    setConfiguracion({ fontSize });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-muted-foreground">Personaliza la apariencia y el comportamiento de AdminStore.</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="font-bold text-lg">Apariencia</h2>
        </div>
        
        <div className="p-6 space-y-8">

          {/* Tamaño de Fuente */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Tamaño de Fuente</h3>
            <div className="flex bg-muted p-1 rounded-lg w-fit">
              <button 
                onClick={() => handleFontSizeChange('small')}
                className={`px-6 py-2 rounded-md transition-all ${configuracion.fontSize === 'small' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className="text-sm">Pequeño</span>
              </button>
              <button 
                onClick={() => handleFontSizeChange('medium')}
                className={`px-6 py-2 rounded-md transition-all ${configuracion.fontSize === 'medium' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className="text-base">Normal</span>
              </button>
              <button 
                onClick={() => handleFontSizeChange('large')}
                className={`px-6 py-2 rounded-md transition-all ${configuracion.fontSize === 'large' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className="text-lg">Grande</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
