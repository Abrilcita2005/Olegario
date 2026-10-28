import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { archivosDeFuentes, colores } from '@/theme';

// Navegación raíz. Espera a que carguen las fuentes para no mostrar texto con la fuente equivocada.
// En la Etapa 5 se suman acá las pantallas de bienvenida y acceso.
export default function RootLayout() {
  const [fuentesCargadas, errorFuentes] = useFonts(archivosDeFuentes);

  if (!fuentesCargadas && !errorFuentes) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colores.fondo } }}
      />
    </>
  );
}
