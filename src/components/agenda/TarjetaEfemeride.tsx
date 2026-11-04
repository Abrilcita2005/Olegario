import { Pressable, StyleSheet, View } from 'react-native';

import { IconoFlechaDerecha } from '@/components/iconos/Iconos';
import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { Texto } from '@/components/ui';
import type { Efemeride } from '@/models/agenda';
import { colores, espacio, radios } from '@/theme';
import { fechaEfemeride } from '@/utils/agenda';

import { EtiquetaMarca } from './EtiquetaMarca';

type Props = { efemeride: Efemeride; onConocerMas: () => void };

// Efeméride del día (Figma: AGENDA). El beneficio en OLE/CAFÉ se muestra solo si la efeméride lo tiene.
export function TarjetaEfemeride({ efemeride, onConocerMas }: Props) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <EtiquetaMarca texto="OLE / Inspiración" />
        <Texto variante="categoria" color="acentoNaranja">
          {fechaEfemeride(efemeride)}
        </Texto>
      </View>
      <Texto variante="tituloSeccion" color="textoSobreOscuro" accessibilityRole="header">
        {efemeride.titulo}
      </Texto>
      <View style={styles.cita}>
        <Texto variante="cuerpoChico" color="textoSecundario">
          {efemeride.texto}
        </Texto>
      </View>
      {efemeride.beneficio ? (
        <View style={styles.beneficio}>
          <IconoSubmarca submarca="cafe" tamano={44} />
          <View style={styles.flex}>
            <Texto variante="categoria" color="acentoNaranja">
              Beneficio en OLE/CAFÉ
            </Texto>
            <Texto variante="cuerpoChico" color="textoSobreOscuro">
              {efemeride.beneficio.antes}
              <Texto variante="cuerpoChicoDestacado" color="textoSobreOscuro">
                {efemeride.beneficio.destacado}
              </Texto>
              {efemeride.beneficio.despues}
            </Texto>
          </View>
        </View>
      ) : null}
      <Pressable onPress={onConocerMas} accessibilityRole="link" hitSlop={8} style={styles.enlace}>
        <Texto variante="categoria" color="textoSobreOscuro">
          Conocer manifiesto & comunidad
        </Texto>
        <IconoFlechaDerecha color={colores.textoSobreOscuro} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    gap: espacio.l,
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cita: { paddingLeft: espacio.l, borderLeftWidth: 2, borderLeftColor: colores.acento },
  beneficio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.l,
    padding: espacio.l,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.divisorSobreOscuro,
  },
  flex: { flex: 1, gap: espacio.xxs },
  enlace: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: espacio.s,
    minHeight: 32,
  },
});
