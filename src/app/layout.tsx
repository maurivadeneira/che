import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHE - Corporación Herejía Económica',
  description: 'Un proyecto social global para desarrollo en el mundo entero',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
