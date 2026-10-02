-- Script para crear las tablas de VentasApp en Supabase

-- 1. Tabla Etiquetas
CREATE TABLE IF NOT EXISTS etiquetas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  color TEXT
);

-- 2. Tabla Productos
CREATE TABLE IF NOT EXISTS productos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  cantidad NUMERIC NOT NULL,
  precio_compra NUMERIC NOT NULL,
  precio_venta NUMERIC NOT NULL,
  foto_url TEXT,
  etiquetas TEXT[] -- Array de IDs de etiquetas
);

-- 3. Tabla Servicios
CREATE TABLE IF NOT EXISTS servicios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  etiquetas TEXT[] -- Array de IDs de etiquetas
);

-- 4. Tabla Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id TEXT PRIMARY KEY,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  total NUMERIC NOT NULL,
  ganancia_total NUMERIC NOT NULL,
  detalles JSONB NOT NULL -- Guardamos el array de DetalleVenta completo aquí para evitar joins complejos y mantener la simpleza de la migración
);

-- Habilitar RLS (Seguridad) temporalmente abierta para permitir lecturas y escrituras desde la app web sin autenticación estricta (ya que tu app actualmente no usa login)
ALTER TABLE etiquetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso anonimo etiquetas" ON etiquetas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso anonimo productos" ON productos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso anonimo servicios" ON servicios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso anonimo ventas" ON ventas FOR ALL USING (true) WITH CHECK (true);
