import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui';
import { colores, espacio, radios, type NombreColor } from '@/theme';

type Props = { texto: string; color?: 'acento' | 'acentoNaranja' };

const BORDE: Record<NonNullable<Props['color']>, string> = {
  acento: colores.bordeAcento,
  acentoNaranja: colores.bordeNaranja,
};

// Pastilla "OLE / EVENTO", "OLE / INSPIRACIÓN", "OLE / AGENDA CREATIVA" (Figma: AGENDA).
export function EtiquetaMarca({ texto, color = 'acento' }: Props) {
  return (
    <View style={[styles.base, { borderColor: BORDE[color] }]}>
      <Texto variante="categoria" color={color as NombreColor}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xxs,
    borderRadius: radios.pastilla,
    borderWidth: 1,
    backgroundColor: colores.fondoChipAcento,
  },
});
