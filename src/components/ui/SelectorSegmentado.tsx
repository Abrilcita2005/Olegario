import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { colores, degradados, espacio, radios } from '@/theme';

import { Texto } from './Texto';

type Opcion<T extends string> = { valor: T; etiqueta: string };

type Props<T extends string> = {
  opciones: readonly Opcion<T>[];
  seleccionado: T;
  onCambiar: (valor: T) => void;
  etiquetaAccesible: string;
};

// Selector de Figma (rol en el inicio de sesión, modo en Comunidad): la opción activa lleva el degradado de acción.
export function SelectorSegmentado<T extends string>({
  opciones,
  seleccionado,
  onCambiar,
  etiquetaAccesible,
}: Props<T>) {
  return (
    <View
      style={styles.contenedor}
      accessibilityRole="radiogroup"
      accessibilityLabel={etiquetaAccesible}
    >
      {opciones.map((opcion) => {
        const activa = opcion.valor === seleccionado;
        return (
          <Pressable
            key={opcion.valor}
            onPress={() => onCambiar(opcion.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: activa }}
            style={styles.opcion}
          >
            {activa ? (
              <LinearGradient
                colors={degradados.accion.colores}
                locations={degradados.accion.posiciones}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[StyleSheet.absoluteFill, styles.radioOpcion]}
              />
            ) : null}
            <Texto
              variante="etiquetaCampo"
              color={activa ? 'textoBoton' : 'acentoLima'}
              style={styles.texto}
            >
              {opcion.etiqueta.toUpperCase()}
            </Texto>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    padding: espacio.xs,
    borderRadius: radios.md,
    backgroundColor: colores.superficie,
  },
  opcion: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.l,
  },
  radioOpcion: { borderRadius: radios.sm },
  texto: { textAlign: 'center' },
});
