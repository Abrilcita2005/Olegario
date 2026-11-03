import { Pressable, StyleSheet, View } from 'react-native';

import { colores, espacio, radios, type NombreColor } from '@/theme';

import { Texto } from './Texto';

type Variante = 'estado' | 'enlace' | 'descuento' | 'destacado' | 'etiqueta';

type Props = {
  texto: string;
  variante?: Variante;
  onPress?: () => void;
};

const colorTexto: Record<Variante, NombreColor> = {
  estado: 'acento',
  enlace: 'acento',
  descuento: 'textoSobreOscuro',
  destacado: 'acentoLima',
  etiqueta: 'acentoLima',
};

// Etiquetas de Figma: estado ("En curso", con punto), enlace ("Ver todo >"),
// descuento ("20% OFF", fondo naranja), destacado (texto lima sobre oscuro) y etiqueta (borde lima,
// para usar sobre tarjetas oscuras: "Vegano", "Sin TACC").
export function Chip({ texto, variante = 'estado', onPress }: Props) {
  const contenido = (
    <>
      {variante === 'estado' ? <View style={styles.punto} /> : null}
      <Texto variante="chip" color={colorTexto[variante]}>
        {texto}
      </Texto>
    </>
  );
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="link"
        hitSlop={10}
        style={[styles.base, estilosVariante[variante]]}
      >
        {contenido}
      </Pressable>
    );
  }
  return <View style={[styles.base, estilosVariante[variante]]}>{contenido}</View>;
}

const estilosVariante = StyleSheet.create({
  estado: {
    backgroundColor: colores.fondoChipAcento,
    borderWidth: 1,
    borderColor: colores.bordeAcento,
  },
  enlace: {
    backgroundColor: colores.fondoChipAcento,
    borderWidth: 1,
    borderColor: colores.bordeAcento,
  },
  descuento: { backgroundColor: colores.acentoNaranja },
  destacado: { backgroundColor: colores.superficie },
  etiqueta: {
    borderWidth: 1,
    borderColor: colores.acentoLima,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: espacio.s,
    paddingHorizontal: 11,
    paddingVertical: 3,
    borderRadius: radios.pastilla,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: radios.pastilla,
    backgroundColor: colores.acento,
  },
});
