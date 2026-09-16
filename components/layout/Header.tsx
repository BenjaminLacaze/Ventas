export default function Header() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-6 md:px-8">
      <div className="flex-1">
        {/* Aquí podemos poner título de la página actual o migas de pan */}
      </div>
      <div className="flex items-center space-x-4">
        {/* Aquí podemos poner un botón para menú móvil en md:hidden */}
        <div className="md:hidden text-primary font-bold">AdminStore</div>
      </div>
    </header>
  );
}
