'use client';

interface FondoItem {
  name: string;
  href: string;
  description: string;
  icon: string;
}

interface SidebarProps {
  fondos: FondoItem[];
}

export function Sidebar({ fondos }: SidebarProps) {
  return (
    <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg overflow-y-auto pt-24">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Fondos Rotatorios</h2>
        <nav className="space-y-2">
          {fondos.map((fondo, index) => (
            <a
              key={index}
              href={fondo.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <span className="text-xl">{fondo.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {fondo.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {fondo.description}
                </div>
              </div>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}