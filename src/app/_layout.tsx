import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Navegación raíz. En la Etapa 5 se suman acá las pantallas de bienvenida y acceso.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
