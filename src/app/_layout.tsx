import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ProveedorSesion, useSesion } from '@/estado/sesion';
import { archivosDeFuentes, colores } from '@/theme';

// Navegación raíz. Espera a que carguen las fuentes y el estado guardado antes de mostrar nada.
export default function RootLayout() {
  const [fuentesCargadas, errorFuentes] = useFonts(archivosDeFuentes);
  if (!fuentesCargadas && !errorFuentes) return null;

  return (
    <ProveedorSesion>
      <StatusBar style="dark" />
      <Navegacion />
    </ProveedorSesion>
  );
}

// Cada grupo de rutas solo existe cuando corresponde (si no, Expo Router redirige al primero disponible):
// 1) bienvenida, solo la primera vez · 2) acceso, si no hay sesión · 3) la app, con sesión (miembro o invitado).
function Navegacion() {
  const { cargando, bienvenidaVista, tipoAcceso } = useSesion();
  if (cargando) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colores.fondo } }}>
      <Stack.Protected guard={!bienvenidaVista}>
        <Stack.Screen name="(bienvenida)" />
      </Stack.Protected>
      <Stack.Protected guard={bienvenidaVista && !tipoAcceso}>
        <Stack.Screen name="(acceso)" />
      </Stack.Protected>
      <Stack.Protected guard={bienvenidaVista && !!tipoAcceso}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="carta-cafe" />
        <Stack.Screen
          name="novedades"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.92],
            sheetGrabberVisible: true,
            sheetCornerRadius: 24,
            animation: 'slide_from_bottom',
            gestureEnabled: true,
          }}
        />
      </Stack.Protected>
      <Stack.Screen name="catalogo" />
    </Stack>
  );
}
