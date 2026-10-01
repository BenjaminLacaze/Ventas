"use client";

import { useStore } from "@/lib/store";
import { Menu } from "lucide-react"; // Assuming lucide-react is installed, if not we'll use a basic svg

export default function Header() {
  const { setMobileMenuOpen } = useStore();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-4 md:px-8">
      <div className="flex items-center md:hidden mr-4">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-2 text-primary hover:bg-accent rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
      <div className="flex-1 flex items-center">
        <h1 className="text-lg font-bold text-primary md:hidden">AdminStore</h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* Aquí podemos poner otras acciones globales */}
      </div>
    </header>
  );
}
