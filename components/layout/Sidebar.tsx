import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">AdminStore</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
          Dashboard
        </Link>
        <Link href="/productos" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
          Productos y Servicios
        </Link>
        <Link href="/ventas" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
          Ventas
        </Link>
        <Link href="/resumen" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
          Resumen
        </Link>
        <Link href="/configuracion" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
          Configuración
        </Link>
      </nav>
    </aside>
  );
}
