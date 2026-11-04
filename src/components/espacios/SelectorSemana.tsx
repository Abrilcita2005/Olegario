import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconoChevron } from '@/components/iconos/Iconos';
import { Texto } from '@/components/ui';
import { colores, degradados, espacio, radios } from '@/theme';
import type { MarcaDia } from '@/utils/agenda';
import { diaCorto, mismoDia } from '@/utils/fechas';

type Props = {
  dias: Date[];
  seleccionado: Date;
  // Si se pasa, los días que no cumplen quedan apagados (Espacios: hoy y los 3 siguientes).
  esHabilitado?: (dia: Date) => boolean;
  // Puntos bajo los días: reserva o evento ese día (respuesta de la responsable, 2026-11-04).
  marcas?: MarcaDia[];
  onElegir: (dia: Date) => void;
  // Flechas para cambiar de semana (Agenda). Sin ellas, no se muestran.
  onSemanaAnterior?: () => void;
  onSemanaSiguiente?: () => void;
};

const MAXIMO_PUNTOS = 3;

// Selector de día (Figma: ESPACIOS y AGENDA, LUN–DOM).
export function SelectorSemana({
  dias,
  seleccionado,
  esHabilitado = () => true,
  marcas = [],
  onElegir,
  onSemanaAnterior,
  onSemanaSiguiente,
}: Props) {
  return (
    <View style={styles.contenedor}>
      {onSemanaAnterior ? (
        <Flecha direccion="izquierda" etiqueta="Semana anterior" onPress={onSemanaAnterior} />
      ) : null}
      {dias.map((dia) => {
        const activo = mismoDia(dia, seleccionado);
        const habilitado = esHabilitado(dia);
        const nombre = diaCorto(dia);
        const delDia = marcas.filter((m) => mismoDia(m.dia, dia));
        // Un punto por color (sin repetir), hasta 3.
        const coloresPuntos = [...new Set(delDia.map((m) => m.color))].slice(0, MAXIMO_PUNTOS);
        const descripciones = [...new Set(delDia.map((m) => m.descripcion))];
        return (
          <Pressable
            key={dia.getTime()}
            onPress={() => onElegir(dia)}
            disabled={!habilitado}
            accessibilityRole="button"
            accessibilityLabel={[`${nombre} ${dia.getDate()}`, ...descripciones].join(', ')}
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
            {/* Puntos como en Figma (blancos sobre el día elegido). */}
            <View style={styles.puntos}>
              {coloresPuntos.map((color) => (
                <View
                  key={color}
                  style={[
                    styles.punto,
                    { backgroundColor: activo ? colores.textoSobreOscuro : colores[color] },
                  ]}
                />
              ))}
            </View>
          </Pressable>
        );
      })}
      {onSemanaSiguiente ? (
        <Flecha direccion="derecha" etiqueta="Semana siguiente" onPress={onSemanaSiguiente} />
      ) : null}
    </View>
  );
}

function Flecha({
  direccion,
  etiqueta,
  onPress,
}: {
  direccion: 'izquierda' | 'derecha';
  etiqueta: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      hitSlop={8}
      style={styles.flecha}
    >
      <IconoChevron direccion={direccion} color={colores.textoTerciario} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
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
  puntos: { flexDirection: 'row', gap: 2, height: 5, marginTop: espacio.xxs },
  punto: { width: 5, height: 5, borderRadius: radios.pastilla },
  deshabilitado: { opacity: 0.4 },
  flecha: { width: 18, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
});
