import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { colores, degradados, espacio, radios, sombras, type NombreColor } from '@/theme';

import { Texto } from './Texto';

type Variante = 'primario' | 'secundario' | 'contorno' | 'siguienteClaro' | 'siguienteOscuro';
type Tamano = 'grande' | 'mediano' | 'chico';

type Props = {
  texto: string;
  onPress: () => void;
  variante?: Variante;
  tamano?: Tamano;
  icono?: ReactNode;
  deshabilitado?: boolean;
  cargando?: boolean;
  etiquetaAccesible?: string;
  // El texto en una sola línea (si no entra, la letra se achica un poco).
  unaLinea?: boolean;
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
  unaLinea = false,
  style,
}: Props) {
  const inactivo = deshabilitado || cargando;
  const esSiguiente = variante === 'siguienteClaro' || variante === 'siguienteOscuro';
  const radio = esSiguiente
    ? radios.pastilla
    : tamano === 'grande'
      ? radios.md
      : tamano === 'chico'
        ? radios.sm
        : radios.lg;
  // Bienvenida: al tocar "Siguiente" el botón se pone rosa con el texto blanco (pedido de la responsable,
  // Etapa 14: el cambio de antes casi no se notaba).
  const contenido = (presionado: boolean) => (
    <View style={styles.contenido}>
      {cargando ? <ActivityIndicator color={colores[colorTexto[variante]]} /> : icono}
      <Texto
        variante={
          esSiguiente
            ? 'display'
            : tamano === 'grande'
              ? 'botonGrande'
              : tamano === 'chico'
                ? 'botonSecundario'
                : 'boton'
        }
        color={esSiguiente && presionado ? 'textoBoton' : colorTexto[variante]}
        numberOfLines={unaLinea ? 1 : undefined}
        adjustsFontSizeToFit={unaLinea}
        minimumFontScale={0.75}
        style={[styles.texto, esSiguiente && styles.textoSiguiente]}
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
        esSiguiente ? styles.siguiente : styles[tamano],
        { borderRadius: radio },
        estilosVariante[variante],
        variante === 'primario' && !inactivo && sombras.accion,
        pressed && (esSiguiente ? styles.siguientePresionado : styles.presionado),
        inactivo && styles.inactivo,
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {variante === 'primario' ? (
            <LinearGradient
              colors={degradados.accion.colores}
              locations={degradados.accion.posiciones}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[StyleSheet.absoluteFill, { borderRadius: radio }]}
            />
          ) : null}
          {contenido(pressed)}
        </>
      )}
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
  chico: { minHeight: 44, paddingHorizontal: 30, alignSelf: 'center' },
  siguiente: { minHeight: 48, minWidth: 224 },
  contenido: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  texto: { textAlign: 'center', flexShrink: 1 },
  presionado: { opacity: 0.85 },
  siguientePresionado: { backgroundColor: colores.acento, transform: [{ scale: 0.97 }] },
  // Poppins tiene más espacio arriba que abajo: sin este ajuste "SIGUIENTE" se veía corrido del centro.
  textoSiguiente: {
    lineHeight: 34,
    includeFontPadding: false,
    textAlignVertical: 'center',
    ...Platform.select({ ios: { paddingTop: 4 }, default: {} }),
  },
  inactivo: { opacity: 0.4 },
});
