import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colores, espacio, radios } from '@/theme';

import { Boton } from './Boton';
import { Texto } from './Texto';

// Estados de interfaz PROVISIONALES: Figma no los diseña (docs/DISENO.md §C.10). Requieren aprobación.

export function EstadoCargando({ texto = 'Cargando…' }: { texto?: string }) {
  return (
    <View style={styles.centro} accessibilityRole="progressbar" accessibilityLabel={texto}>
      <ActivityIndicator color={colores.acento} size="large" />
      <Texto variante="cuerpoChico">{texto}</Texto>
    </View>
  );
}

export function Esqueleto({ alto = 80 }: { alto?: number }) {
  return <View style={[styles.esqueleto, { height: alto }]} accessibilityElementsHidden />;
}

type PropsMensaje = {
  titulo: string;
  texto: string;
  accion?: { texto: string; onPress: () => void };
};

export function EstadoVacio({ titulo, texto, accion }: PropsMensaje) {
  return (
    <View style={styles.centro}>
      <Texto variante="tituloTarjeta">{titulo}</Texto>
      <Texto variante="cuerpoChico" style={styles.textoCentrado}>
        {texto}
      </Texto>
      {accion ? <Boton texto={accion.texto} onPress={accion.onPress} /> : null}
    </View>
  );
}

export function EstadoError({ titulo, texto, accion }: PropsMensaje) {
  return (
    <View style={styles.centro} accessibilityRole="alert">
      <Texto variante="tituloTarjeta" color="error">
        {titulo}
      </Texto>
      <Texto variante="cuerpoChico" style={styles.textoCentrado}>
        {texto}
      </Texto>
      {accion ? (
        <Boton texto={accion.texto} onPress={accion.onPress} variante="secundario" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.xl,
    padding: espacio.grande,
  },
  textoCentrado: { textAlign: 'center' },
  esqueleto: { borderRadius: radios.xxl, backgroundColor: colores.superficieElevada },
});
