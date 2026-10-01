"use client";

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useStore();
  const pathname = usePathname();

  return (
    <>
      {/* Overlay para móviles */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border h-full flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">AdminStore</h2>
          <button 
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {[
            { name: 'Dashboard', href: '/' },
            { name: 'Productos y Servicios', href: '/productos' },
            { name: 'Ventas', href: '/ventas' },
            { name: 'Resumen', href: '/resumen' },
            { name: 'Configuración', href: '/configuracion' }
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-md transition-colors ${
                pathname === item.href 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
