import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui';
import type { Taller } from '@/models/comunidad';
import { colores, espacio, radios } from '@/theme';

import { BotonSolicitud } from './BotonSolicitud';

type Props = { taller: Taller; enviada: boolean; onSumarse: () => void };

// Taller entre pares (Figma: COMUNIDAD, "TALLERES ENTRE PARES").
export function TarjetaTaller({ taller, enviada, onSumarse }: Props) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <Texto variante="categoria" color="acentoLima">
          {taller.tipo}
        </Texto>
        <Texto variante="meta" color="textoTerciario">
          {taller.cuando}
        </Texto>
      </View>
      <Texto variante="tituloBienvenida" color="textoSobreOscuro" accessibilityRole="header">
        {taller.titulo}
      </Texto>
      <Texto variante="cuerpo" color="textoSecundario">
        {taller.descripcion}
      </Texto>
      <BotonSolicitud texto={taller.accion} enviada={enviada} onPress={onSumarse} />
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
});
