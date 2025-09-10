import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirección automática al idioma por defecto
  redirect('/es');
}
