import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Tarjeta, Texto } from '@/components/ui';
import { useAhora } from '@/hooks/useAhora';
import { espacio } from '@/theme';
import { textoHorario } from '@/utils/reservas';

import { reservasDePrueba } from '../../../data/mock/reservas';

// Detalle de la reserva. PROVISORIO: no hay diseño en Figma (P-31). Check-in, PIN y mapa: Etapa 9.
export default function DetalleReservaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ahora = useAhora();
  const reserva = reservasDePrueba(ahora).find((r) => r.id === id);

  return (
    <PantallaSecundaria>
      {reserva ? (
        <View style={styles.contenido}>
          <Texto variante="tituloAcceso" accessibilityRole="header">
            {reserva.espacio}
          </Texto>
          <Tarjeta style={styles.tarjeta}>
            <Texto variante="categoria" color="acentoNaranja">
              Cuándo
            </Texto>
            <Texto variante="cuerpo" color="textoSobreOscuro">
              {textoHorario(reserva, ahora)}
            </Texto>
            <Texto variante="categoria" color="acentoNaranja">
              Dónde
            </Texto>
            <Texto variante="cuerpo" color="textoSobreOscuro">
              {reserva.ubicacion}
            </Texto>
          </Tarjeta>
          <PantallaEnConstruccion titulo="Check-in y cómo llegar" etapa="Etapa 9" />
        </View>
      ) : (
        <PantallaEnConstruccion titulo="Reserva no encontrada" etapa="sin datos" />
      )}
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
  tarjeta: { gap: espacio.xs },
});
