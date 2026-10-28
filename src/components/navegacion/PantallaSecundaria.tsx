import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colores, espacio } from '@/theme';

import { EncabezadoVolver } from './EncabezadoVolver';

// Pantalla sin barra inferior, con flecha para volver (acceso, perfil, carta del café, etc.).
export function PantallaSecundaria({
  children,
  conIsotipo = true,
}: {
  children: ReactNode;
  conIsotipo?: boolean;
}) {
  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <EncabezadoVolver conIsotipo={conIsotipo} />
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: {
    flexGrow: 1,
    paddingHorizontal: espacio.margenPantalla,
    paddingBottom: espacio.grande,
  },
});
