import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui';
import { colores, degradados, espacio, radios } from '@/theme';
import { diaReservable } from '@/utils/disponibilidad';
import { diaCorto, mismoDia } from '@/utils/fechas';

type Props = {
  dias: Date[];
  seleccionado: Date;
  ahora: Date;
  onElegir: (dia: Date) => void;
};

// Selector de día (Figma: ESPACIOS, LUN–DOM). Solo se pueden elegir hoy y los 3 días siguientes.
export function SelectorSemana({ dias, seleccionado, ahora, onElegir }: Props) {
  return (
    <View style={styles.contenedor}>
      {dias.map((dia) => {
        const activo = mismoDia(dia, seleccionado);
        const habilitado = diaReservable(dia, ahora);
        const nombre = diaCorto(dia);
        return (
          <Pressable
            key={dia.getTime()}
            onPress={() => onElegir(dia)}
            disabled={!habilitado}
            accessibilityRole="button"
            accessibilityLabel={`${nombre} ${dia.getDate()}`}
            accessibilityState={{ selected: activo, disabled: !habilitado }}
            style={[styles.dia, !habilitado && styles.deshabilitado]}
          >
            {activo ? (
              <LinearGradient
                colors={degradados.acento.colores}
                locations={degradados.acento.posiciones}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[StyleSheet.absoluteFill, styles.fondoActivo]}
              />
            ) : null}
            <Texto variante="meta" color={activo ? 'textoSobreOscuro' : 'textoTerciario'}>
              {nombre}
            </Texto>
            <Texto variante="tituloTarjeta" color={activo ? 'textoSobreOscuro' : 'textoSecundario'}>
              {dia.getDate()}
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
    justifyContent: 'space-between',
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.l,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  dia: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.md,
  },
  fondoActivo: { borderRadius: radios.md },
  deshabilitado: { opacity: 0.4 },
});
