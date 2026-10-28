import { StyleSheet, View } from 'react-native';

import { colores, espacio, radios, type NombreColor } from '@/theme';

import { Texto } from './Texto';

type Variante = 'estado' | 'enlace' | 'descuento' | 'destacado';

type Props = {
  texto: string;
  variante?: Variante;
};

const colorTexto: Record<Variante, NombreColor> = {
  estado: 'acento',
  enlace: 'acento',
  descuento: 'textoSobreOscuro',
  destacado: 'acentoLima',
};

// Etiquetas de Figma: estado ("En curso", con punto), enlace ("Ver todo >"),
// descuento ("20% OFF", fondo naranja) y destacado (texto lima sobre oscuro).
export function Chip({ texto, variante = 'estado' }: Props) {
  return (
    <View style={[styles.base, estilosVariante[variante]]}>
      {variante === 'estado' ? <View style={styles.punto} /> : null}
      <Texto variante="chip" color={colorTexto[variante]}>
        {texto}
      </Texto>
    </View>
  );
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
