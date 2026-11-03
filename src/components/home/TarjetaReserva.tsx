import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { IconoNavegar, IconoQr, IconoReloj } from '@/components/iconos/Iconos';
import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { Boton, BotonIcono, Tarjeta, Texto } from '@/components/ui';
import type { EstadoReserva, Reserva } from '@/models/reserva';
import { colores, degradados, espacio, radios } from '@/theme';

const NOMBRE_SERVICIO: Record<Reserva['servicio'], string> = {
  cowork: 'OLE/COWORK',
  stream: 'OLE/STREAM',
  network: 'OLE/NETWORK',
  cafe: 'OLE/CAFÉ',
};

type Props = {
  reserva: Reserva;
  estado: EstadoReserva;
  horario: string;
  onVerDetalles: () => void;
  onComoLlegar: () => void;
};

// Tarjeta "Tu reserva actual" (Figma: HOME, "Section - Tu reserva actual").
export function TarjetaReserva({ reserva, estado, horario, onVerDetalles, onComoLlegar }: Props) {
  return (
    <Tarjeta style={styles.tarjeta}>
      <View style={styles.fila}>
        {/* Miniatura como en Figma: degradado de marca con el ícono del servicio encima. */}
        <LinearGradient
          colors={degradados.marca.colores}
          locations={degradados.marca.posiciones}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.miniatura}
        >
          <IconoSubmarca submarca={reserva.servicio} tamano={60} conAro={false} />
        </LinearGradient>
        <View style={styles.textos}>
          <Texto variante="categoria" color="acentoNaranja">
            {NOMBRE_SERVICIO[reserva.servicio]} · {reserva.tipo}
          </Texto>
          <Texto variante="tituloTarjeta" color="textoSobreOscuro" numberOfLines={1}>
            {reserva.espacio}
          </Texto>
          <View style={styles.horario}>
            <IconoReloj color={colores.acento} />
            <Texto variante="cuerpoChico" color="textoSecundario">
              {horario}
            </Texto>
          </View>
          <Texto variante="meta" color="textoTerciario">
            {reserva.ubicacion}
          </Texto>
        </View>
      </View>
      <View style={styles.acciones}>
        <Boton
          texto={estado === 'enCurso' ? 'Ver detalles y check-in' : 'Ver detalles'}
          variante="contorno"
          icono={<IconoQr color={colores.textoSobreOscuro} />}
          onPress={onVerDetalles}
          style={styles.botonPrincipal}
        />
        <BotonIcono
          etiquetaAccesible="Cómo llegar a tu puesto"
          onPress={onComoLlegar}
          icono={<IconoNavegar color={colores.textoSobreOscuro} />}
        />
      </View>
    </Tarjeta>
  );
}

const styles = StyleSheet.create({
  tarjeta: { gap: espacio.l },
  fila: { flexDirection: 'row', gap: espacio.xxl },
  miniatura: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.lg,
  },
  textos: { flex: 1, justifyContent: 'center', gap: espacio.xxs },
  horario: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  acciones: {
    flexDirection: 'row',
    gap: espacio.m,
    paddingTop: espacio.l,
    borderTopWidth: 1,
    borderTopColor: colores.divisorSobreOscuro,
  },
  botonPrincipal: { flex: 1 },
});
