import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ProveedorAgenda } from '@/estado/agenda';
import { ProveedorComunidad } from '@/estado/comunidad';
import { ProveedorReservas } from '@/estado/reservas';
import { ProveedorSesion, useSesion } from '@/estado/sesion';
import { archivosDeFuentes, colores } from '@/theme';

// Navegación raíz. Espera a que carguen las fuentes y el estado guardado antes de mostrar nada.
export default function RootLayout() {
  const [fuentesCargadas, errorFuentes] = useFonts(archivosDeFuentes);
  if (!fuentesCargadas && !errorFuentes) return null;

  return (
    <ProveedorSesion>
      <ProveedorReservas>
        <ProveedorAgenda>
          <ProveedorComunidad>
            <StatusBar style="dark" />
            <Navegacion />
          </ProveedorComunidad>
        </ProveedorAgenda>
      </ProveedorReservas>
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
        <Stack.Screen name="(bienvenida)/bienvenida" />
      </Stack.Protected>
      <Stack.Protected guard={bienvenidaVista && !tipoAcceso}>
        <Stack.Screen name="(acceso)/acceso" />
        <Stack.Screen name="(acceso)/iniciar-sesion" />
        <Stack.Screen name="(acceso)/registro" />
        <Stack.Screen name="(acceso)/recuperar-contrasena" />
      </Stack.Protected>
      <Stack.Protected guard={bienvenidaVista && !!tipoAcceso}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="carta-cafe" />
        <Stack.Screen name="reserva/[id]" />
        <Stack.Screen name="persona/[id]" />
        <Stack.Screen name="publicar" />
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
      <Stack.Screen name="terminos" />
      <Stack.Screen name="catalogo" />
    </Stack>
  );
}
