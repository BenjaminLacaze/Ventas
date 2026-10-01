"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { configuracion } = useStore();
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratación renderizando hijos recién cuando monta el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Limpiar clases previas de fuente
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');

    // Aplicar tamaño de fuente
    const sizeMap = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };
    document.documentElement.classList.add(sizeMap[configuracion.fontSize]);

  }, [configuracion.fontSize, mounted]);

  // Si no ha montado, mostramos children tal cual pero sin clases dinámicas
  // para evitar mismatch SSR vs CSR
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
