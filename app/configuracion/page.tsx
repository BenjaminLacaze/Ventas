"use client";

import { useStore } from "@/lib/store";
import { Tema } from "@/types";

export default function ConfiguracionPage() {
  const { configuracion, setConfiguracion } = useStore();

  const handleTemaChange = (tema: Tema) => {
    setConfiguracion({ tema });
  };

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
          {/* Tema Visual */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Tema Visual</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => handleTemaChange('light')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${configuracion.tema === 'light' ? 'border-zinc-900 ring-2 ring-zinc-900/50' : 'border-border hover:border-zinc-400'}`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-white border border-zinc-300"></div>
                  <span className="font-medium text-zinc-900">Modo Claro</span>
                </div>
                <p className="text-xs text-muted-foreground">Estética blanca clásica, minimalista con botones en tono oscuro.</p>
              </button>

              <button 
                onClick={() => handleTemaChange('celeste')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${configuracion.tema === 'celeste' ? 'border-sky-500 ring-2 ring-sky-500/50' : 'border-border hover:border-sky-300'}`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-sky-500"></div>
                  <span className="font-medium text-sky-700">Celeste</span>
                </div>
                <p className="text-xs text-muted-foreground">Fondo blanco puro, pero menús, textos y botones en tonos celestes.</p>
              </button>

              <button 
                onClick={() => handleTemaChange('dark')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${configuracion.tema === 'dark' ? 'border-zinc-300 ring-2 ring-zinc-300/50' : 'border-border hover:border-zinc-500'}`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-950 border border-zinc-500"></div>
                  <span className="font-medium">Oscuro Profundo</span>
                </div>
                <p className="text-xs text-muted-foreground">Tonos grises oscuros para máximo descanso visual.</p>
              </button>
            </div>
          </div>

          <div className="h-px bg-border w-full"></div>

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
