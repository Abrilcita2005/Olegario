import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colores, espacio } from '@/theme';

import { Encabezado } from './Encabezado';
import { ESPACIO_INFERIOR_CONTENIDO } from './medidas';

type Props = {
  children: ReactNode;
  conEncabezado?: boolean;
};

// Estructura común de las pantallas principales: fondo, encabezado y contenido desplazable
// con espacio abajo para que la barra inferior y el botón Novedades no lo tapen.
export function PantallaBase({ children, conEncabezado = true }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        {conEncabezado ? <Encabezado /> : null}
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
    paddingBottom: ESPACIO_INFERIOR_CONTENIDO,
  },
});
