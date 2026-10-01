"use client";

import { useStore } from "@/lib/store";
import { useMemo, useState } from "react";
import { ReembolsoModal } from "@/components/resumen/ReembolsoModal";

type FiltroTiempo = 'diario' | 'mensual' | 'anual' | 'todo';

export default function ResumenPage() {
  const { ventas, etiquetas, deleteEtiqueta } = useStore();
  const [filtro, setFiltro] = useState<FiltroTiempo>('todo');
  const [reembolsoEtiqueta, setReembolsoEtiqueta] = useState<{id: string, nombre: string} | null>(null);

  const ventasFiltradas = useMemo(() => {
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0];
    const mesStr = hoyStr.substring(0, 7);
    const anoStr = hoyStr.substring(0, 4);

    return ventas.filter(v => {
      const fechaVenta = v.fecha.split('T')[0];
      if (filtro === 'diario') return fechaVenta === hoyStr;
      if (filtro === 'mensual') return fechaVenta.substring(0, 7) === mesStr;
      if (filtro === 'anual') return fechaVenta.substring(0, 4) === anoStr;
      return true;
    });
  }, [ventas, filtro]);

  // Agrupar por etiquetas y calcular totales reales
  const { resumenPorEtiqueta, totalVentas, totalGanancias } = useMemo(() => {
    const mapa = new Map<string, { unidades: number; total: number; ganancia: number }>();
    
    etiquetas.forEach(e => {
      mapa.set(e.id, { unidades: 0, total: 0, ganancia: 0 });
    });

    const storeState = useStore.getState();
    const mapItems = new Map<string, string[]>(); 
    storeState.productos.forEach(p => mapItems.set(p.id, p.etiquetas));
    storeState.servicios.forEach(s => mapItems.set(s.id, s.etiquetas));

    let sumaTotal = 0;
    let sumaGanancia = 0;

    ventasFiltradas.forEach(v => {
      let ventaContabilizada = false;
      v.detalles.forEach(d => {
        const etiqIds = mapItems.get(d.itemId) || [];
        // Filtramos para ver si alguna etiqueta existe actualmente en el mapa
        const etiquetasValidas = etiqIds.filter(id => mapa.has(id));
        
        if (etiquetasValidas.length > 0) {
          // Si el item tiene etiquetas válidas, suma a los totales globales (evita contar ítems sin etiqueta o con etiqueta borrada)
          sumaTotal += d.subtotal;
          sumaGanancia += d.ganancia;

          // Y lo suma a cada tarjeta de etiqueta individual
          etiquetasValidas.forEach(idEtiqueta => {
            const stats = mapa.get(idEtiqueta)!;
            stats.unidades += d.cantidad;
            stats.total += d.subtotal;
            stats.ganancia += d.ganancia;
          });
        }
      });
    });

    const resultado = etiquetas.map(e => ({
      ...e,
      stats: mapa.get(e.id)!,
    })).filter(e => e.stats.unidades > 0);

    return { 
      resumenPorEtiqueta: resultado,
      totalVentas: sumaTotal,
      totalGanancias: sumaGanancia
    };
  }, [ventasFiltradas, etiquetas]);




  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Análisis y Resumen</h1>
        
        <select 
          value={filtro} 
          onChange={(e) => setFiltro(e.target.value as FiltroTiempo)}
          className="border border-border bg-card px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="diario">Hoy</option>
          <option value="mensual">Este Mes</option>
          <option value="anual">Este Año</option>
          <option value="todo">Histórico Completo</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium">Total de Ventas ({filtro})</h3>
          <p className="text-4xl font-bold mt-2 text-foreground">${totalVentas.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium">Total de Ganancias ({filtro})</h3>
          <p className="text-4xl font-bold mt-2 text-primary">${totalGanancias.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Resumen por Etiquetas</h2>
        
        {resumenPorEtiqueta.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground bg-card border border-dashed border-border rounded-lg">
            No hay ventas registradas con etiquetas para este período.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {resumenPorEtiqueta.map(etiqueta => (
              <div key={etiqueta.id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
                  <h3 className="font-bold text-lg uppercase tracking-wider flex items-center">
                    🏷️ {etiqueta.nombre}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setReembolsoEtiqueta({ id: etiqueta.id, nombre: etiqueta.nombre })}
                      className="text-amber-600 hover:text-amber-800 text-sm font-medium px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 rounded-md transition-colors"
                    >
                      Reembolso
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Seguro que deseas eliminar la etiqueta "${etiqueta.nombre}" y todo su historial de resumen?`)) {
                          deleteEtiqueta(etiqueta.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="p-0">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-muted/10">
                        <th className="p-4 font-medium text-muted-foreground">Métrica</th>
                        <th className="p-4 font-medium text-muted-foreground text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border last:border-0 hover:bg-muted/5">
                        <td className="p-4">Unidades Vendidas</td>
                        <td className="p-4 text-right font-semibold">{etiqueta.stats.unidades}</td>
                      </tr>
                      <tr className="border-b border-border last:border-0 hover:bg-muted/5">
                        <td className="p-4">Total de Ingresos</td>
                        <td className="p-4 text-right font-semibold text-primary">${etiqueta.stats.total.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b border-border last:border-0 hover:bg-muted/5">
                        <td className="p-4">Ganancia Total</td>
                        <td className="p-4 text-right font-bold text-primary">${etiqueta.stats.ganancia.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reembolsoEtiqueta && (
        <ReembolsoModal
          isOpen={!!reembolsoEtiqueta}
          onClose={() => setReembolsoEtiqueta(null)}
          etiquetaId={reembolsoEtiqueta.id}
          etiquetaNombre={reembolsoEtiqueta.nombre}
          ventasFiltradas={ventasFiltradas}
        />
      )}
    </div>
  );
}
