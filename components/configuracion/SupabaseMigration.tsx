"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Producto, Servicio, Etiqueta, Venta } from "@/types";

export function SupabaseMigration() {
  const [status, setStatus] = useState<string>("Esperando...");
  const [isMigrating, setIsMigrating] = useState(false);
  const [done, setDone] = useState(false);

  const startMigration = async () => {
    setIsMigrating(true);
    setStatus("Leyendo datos locales...");

    try {
      const rawData = localStorage.getItem('adminstore-storage');
      if (!rawData) {
        setStatus("No se encontraron datos locales para migrar.");
        setIsMigrating(false);
        return;
      }

      const parsed = JSON.parse(rawData);
      const state = parsed.state;

      if (!state) {
        setStatus("Formato de datos locales inválido.");
        setIsMigrating(false);
        return;
      }

      const { productos, servicios, etiquetas, ventas } = state as {
        productos: Producto[],
        servicios: Servicio[],
        etiquetas: Etiqueta[],
        ventas: Venta[]
      };

      // 1. Migrar Etiquetas
      setStatus(`Subiendo ${etiquetas.length} etiquetas...`);
      if (etiquetas.length > 0) {
        const { error } = await supabase.from('etiquetas').upsert(
          etiquetas.map(e => ({ id: e.id, nombre: e.nombre, color: e.color }))
        );
        if (error) throw new Error("Error subiendo etiquetas: " + error.message);
      }

      // 2. Migrar Productos
      setStatus(`Subiendo ${productos.length} productos...`);
      if (productos.length > 0) {
        const { error } = await supabase.from('productos').upsert(
          productos.map(p => ({
            id: p.id,
            nombre: p.nombre,
            cantidad: p.cantidad,
            precio_compra: p.precioCompra,
            precio_venta: p.precioVenta,
            foto_url: p.fotoUrl,
            etiquetas: p.etiquetas || []
          }))
        );
        if (error) throw new Error("Error subiendo productos: " + error.message);
      }

      // 3. Migrar Servicios
      setStatus(`Subiendo ${servicios.length} servicios...`);
      if (servicios.length > 0) {
        const { error } = await supabase.from('servicios').upsert(
          servicios.map(s => ({
            id: s.id,
            nombre: s.nombre,
            precio: s.precio,
            etiquetas: s.etiquetas || []
          }))
        );
        if (error) throw new Error("Error subiendo servicios: " + error.message);
      }

      // 4. Migrar Ventas
      setStatus(`Subiendo ${ventas.length} ventas...`);
      if (ventas.length > 0) {
        // Partir en lotes si son muchas para evitar time-outs, pero aquí asumimos pocas para simplificar
        const { error } = await supabase.from('ventas').upsert(
          ventas.map(v => ({
            id: v.id,
            fecha: v.fecha,
            total: v.total,
            ganancia_total: v.gananciaTotal,
            detalles: v.detalles
          }))
        );
        if (error) throw new Error("Error subiendo ventas: " + error.message);
      }

      setStatus("¡Migración completada con éxito!");
      setDone(true);
    } catch (err: any) {
      console.error(err);
      setStatus("Error: " + err.message);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow-sm space-y-4">
      <h3 className="text-xl font-bold">Migración a Supabase (Nube)</h3>
      <p className="text-muted-foreground text-sm">
        Si ya creaste las tablas en Supabase, usa este botón para subir todos los datos locales actuales (productos, etiquetas, ventas) a tu base de datos en la nube.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={startMigration}
          disabled={isMigrating || done}
          className="btn-premium px-6 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {isMigrating ? "Migrando..." : done ? "Migrado exitosamente" : "Subir Datos a la Nube"}
        </button>
        <span className="text-sm font-mono bg-muted px-3 py-1 rounded-md">{status}</span>
      </div>
    </div>
  );
}
