"use client";

import { useStore } from "@/lib/store";
import { useMemo } from "react";

export default function Home() {
  const { ventas, productos } = useStore();

  const {
    ventasHoy,
    gananciasHoy,
    ventasMes,
    gananciasMes,
    ventasAno,
    gananciasAno,
  } = useMemo(() => {
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0];
    const mesStr = hoyStr.substring(0, 7);
    const anoStr = hoyStr.substring(0, 4);

    let vHoy = 0, gHoy = 0;
    let vMes = 0, gMes = 0;
    let vAno = 0, gAno = 0;

    ventas.forEach(v => {
      const fechaVenta = v.fecha.split('T')[0];
      const mesVenta = fechaVenta.substring(0, 7);
      const anoVenta = fechaVenta.substring(0, 4);

      if (fechaVenta === hoyStr) {
        vHoy += v.total;
        gHoy += v.gananciaTotal;
      }
      if (mesVenta === mesStr) {
        vMes += v.total;
        gMes += v.gananciaTotal;
      }
      if (anoVenta === anoStr) {
        vAno += v.total;
        gAno += v.gananciaTotal;
      }
    });

    return {
      ventasHoy: vHoy,
      gananciasHoy: gHoy,
      ventasMes: vMes,
      gananciasMes: gMes,
      ventasAno: vAno,
      gananciasAno: gAno,
    };
  }, [ventas]);

  const totalProductosDisponibles = productos.reduce((sum, p) => sum + p.cantidad, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* HOY */}
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium">Ventas de Hoy</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">${ventasHoy.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium">Ganancias de Hoy</h3>
          <p className="text-3xl font-bold mt-2 text-primary">${gananciasHoy.toLocaleString()}</p>
        </div>
        
        {/* MES */}
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium">Ventas del Mes</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">${ventasMes.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium">Ganancias del Mes</h3>
          <p className="text-3xl font-bold mt-2 text-primary">${gananciasMes.toLocaleString()}</p>
        </div>

        {/* AÑO Y STOCK */}
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm col-span-1 md:col-span-2">
          <h3 className="text-muted-foreground text-sm font-medium">Ventas del Año</h3>
          <p className="text-3xl font-bold mt-2">${ventasAno.toLocaleString()}</p>
          <div className="mt-4 text-sm text-primary font-medium">
            Ganancia anual: ${gananciasAno.toLocaleString()}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg shadow-sm col-span-1 md:col-span-2">
          <h3 className="text-muted-foreground text-sm font-medium">Inventario</h3>
          <p className="text-3xl font-bold mt-2">{productos.length}</p>
          <div className="mt-4 text-sm text-muted-foreground">
            Total de unidades en stock: {totalProductosDisponibles}
          </div>
        </div>
      </div>
    </div>
  );
}
