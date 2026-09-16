"use client";

import { useStore } from "@/lib/store";
import { useMemo, useState } from "react";

type FiltroTiempo = 'diario' | 'mensual' | 'anual' | 'todo';

export default function ResumenPage() {
  const { ventas, etiquetas } = useStore();
  const [filtro, setFiltro] = useState<FiltroTiempo>('todo');

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

  const totalVentas = ventasFiltradas.reduce((sum, v) => sum + v.total, 0);
  const totalGanancias = ventasFiltradas.reduce((sum, v) => sum + v.gananciaTotal, 0);

  // Agrupar por etiquetas
  const resumenPorEtiqueta = useMemo(() => {
    // mapa: idEtiqueta -> { unidades, total, ganancia }
    const mapa = new Map<string, { unidades: number; total: number; ganancia: number }>();
    
    // Inicializar mapa con todas las etiquetas
    etiquetas.forEach(e => {
      mapa.set(e.id, { unidades: 0, total: 0, ganancia: 0 });
    });

    // Como los detalles no tienen las etiquetas guardadas en la venta, necesitamos buscarlas
    // Sin embargo, para hacerlo perfectamente independiente en el tiempo, 
    // idealmente la venta guardaría la etiqueta al momento de vender.
    // Como no es así (solo guarda itemId), buscaremos en productos/servicios actuales.
    // Importamos el store dentro del useMemo (o usamos las referencias)
    const storeState = useStore.getState();
    const mapItems = new Map<string, string[]>(); // itemId -> array de etiqueta ids
    storeState.productos.forEach(p => mapItems.set(p.id, p.etiquetas));
    storeState.servicios.forEach(s => mapItems.set(s.id, s.etiquetas));

    ventasFiltradas.forEach(v => {
      v.detalles.forEach(d => {
        const etiqIds = mapItems.get(d.itemId) || [];
        etiqIds.forEach(idEtiqueta => {
          const stats = mapa.get(idEtiqueta);
          if (stats) {
            stats.unidades += d.cantidad;
            stats.total += d.subtotal;
            stats.ganancia += d.ganancia;
          }
        });
      });
    });

    // Formatear para renderizar, omitiendo las que tienen 0 ventas
    const resultado = etiquetas.map(e => ({
      ...e,
      stats: mapa.get(e.id)!,
    })).filter(e => e.stats.unidades > 0);

    return resultado;
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
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                  <h3 className="font-bold text-lg uppercase tracking-wider flex items-center">
                    🏷️ {etiqueta.nombre}
                  </h3>
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
    </div>
  );
}
