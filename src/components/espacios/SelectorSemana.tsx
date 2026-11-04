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
  // Días en los que la persona tiene algo agendado (reserva; eventos en la Etapa 9).
  diasConActividad?: Date[];
  onElegir: (dia: Date) => void;
};

// Selector de día (Figma: ESPACIOS, LUN–DOM). Solo se pueden elegir hoy y los 3 días siguientes.
export function SelectorSemana({
  dias,
  seleccionado,
  ahora,
  diasConActividad = [],
  onElegir,
}: Props) {
  return (
    <View style={styles.contenedor}>
      {dias.map((dia) => {
        const activo = mismoDia(dia, seleccionado);
        const habilitado = diaReservable(dia, ahora);
        const nombre = diaCorto(dia);
        const conActividad = diasConActividad.some((d) => mismoDia(d, dia));
        return (
          <Pressable
            key={dia.getTime()}
            onPress={() => onElegir(dia)}
            disabled={!habilitado}
            accessibilityRole="button"
            accessibilityLabel={`${nombre} ${dia.getDate()}${conActividad ? ', tenés una reserva' : ''}`}
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
            {/* Punto como en Figma: ese día tenés algo agendado (blanco sobre el día elegido). */}
            <View
              style={[
                styles.punto,
                conActividad && {
                  backgroundColor: activo ? colores.textoSobreOscuro : colores.acentoNaranja,
                },
              ]}
            />
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
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.md,
  },
  fondoActivo: { borderRadius: radios.md },
  punto: { width: 5, height: 5, marginTop: espacio.xxs, borderRadius: radios.pastilla },
  deshabilitado: { opacity: 0.4 },
});
