import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colores, degradados, espacio, radios, sombras, type NombreColor } from '@/theme';

import { Texto } from './Texto';

type Variante = 'primario' | 'secundario' | 'contorno' | 'siguienteClaro' | 'siguienteOscuro';
type Tamano = 'grande' | 'mediano';

type Props = {
  texto: string;
  onPress: () => void;
  variante?: Variante;
  tamano?: Tamano;
  icono?: ReactNode;
  deshabilitado?: boolean;
  cargando?: boolean;
  etiquetaAccesible?: string;
  style?: ViewStyle;
};

const colorTexto: Record<Variante, NombreColor> = {
  primario: 'textoBoton',
  secundario: 'textoSobreOscuroSuave',
  contorno: 'textoSobreOscuro',
  siguienteClaro: 'textoSobreClaro',
  siguienteOscuro: 'botonClaro',
};

// Botón base. Variantes de Figma: primario (degradado), secundario (oscuro), contorno (oscuro con borde
// de acento) y "Siguiente" de las bienvenidas (claro sobre fondo oscuro / oscuro sobre fondo claro).
export function Boton({
  texto,
  onPress,
  variante = 'primario',
  tamano = 'mediano',
  icono,
  deshabilitado = false,
  cargando = false,
  etiquetaAccesible,
  style,
}: Props) {
  const inactivo = deshabilitado || cargando;
  const esSiguiente = variante === 'siguienteClaro' || variante === 'siguienteOscuro';
  const radio = esSiguiente ? radios.pastilla : tamano === 'grande' ? radios.md : radios.lg;
  const contenido = (
    <View style={styles.contenido}>
      {cargando ? <ActivityIndicator color={colores[colorTexto[variante]]} /> : icono}
      <Texto
        variante={esSiguiente ? 'display' : tamano === 'grande' ? 'botonGrande' : 'boton'}
        color={colorTexto[variante]}
      >
        {texto}
      </Texto>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityLabel={etiquetaAccesible ?? texto}
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={({ pressed }) => [
        styles.base,
        esSiguiente ? styles.siguiente : tamano === 'grande' ? styles.grande : styles.mediano,
        { borderRadius: radio },
        estilosVariante[variante],
        variante === 'primario' && !inactivo && sombras.accion,
        pressed && styles.presionado,
        inactivo && styles.inactivo,
        style,
      ]}
    >
      {variante === 'primario' ? (
        <LinearGradient
          colors={degradados.accion.colores}
          locations={degradados.accion.posiciones}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radio }]}
        />
      ) : null}
      {contenido}
    </Pressable>
  );
}

const estilosVariante = StyleSheet.create({
  primario: {},
  secundario: { backgroundColor: colores.superficie },
  contorno: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.bordeAcento,
  },
  siguienteClaro: { backgroundColor: colores.botonClaro },
  siguienteOscuro: { backgroundColor: colores.superficie },
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espacio.base,
  },
  grande: { minHeight: 56 },
  mediano: { minHeight: 44 },
  siguiente: { minHeight: 48, minWidth: 224 },
  contenido: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  presionado: { opacity: 0.85 },
  inactivo: { opacity: 0.4 },
});
