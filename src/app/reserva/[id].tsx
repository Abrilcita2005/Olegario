import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton, EstadoVacio, PanelInferior, Tarjeta, Texto } from '@/components/ui';
import { useReservas } from '@/estado/reservas';
import { useAhora } from '@/hooks/useAhora';
import { espacio } from '@/theme';
import { puedeCancelar } from '@/utils/disponibilidad';
import { MINUTOS_LIMITE_CANCELACION, duracionHoras, textoHoras } from '@/utils/fechas';
import { estadoReserva, textoHorario } from '@/utils/reservas';

// Detalle de la reserva. PROVISORIO: no hay diseño en Figma (P-31). Check-in, PIN y mapa: Etapa 9.
// Se puede cancelar hasta 30 min antes del inicio (decisión de la responsable, 2026-11-04).
export default function DetalleReservaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ahora = useAhora();
  const { reservas, cancelar } = useReservas();
  const reserva = reservas.find((r) => r.id === id);
  const [confirmando, setConfirmando] = useState(false);
  const [cancelada, setCancelada] = useState(false);

  if (cancelada) {
    return (
      <PantallaSecundaria>
        <EstadoVacio
          titulo="Cancelaste tu reserva"
          texto="Las horas volvieron a tu plan."
          accion={{ texto: 'Ver espacios', onPress: () => router.navigate('/espacios') }}
        />
      </PantallaSecundaria>
    );
  }

  if (!reserva) {
    return (
      <PantallaSecundaria>
        <PantallaEnConstruccion titulo="Reserva no encontrada" etapa="sin datos" />
      </PantallaSecundaria>
    );
  }

  const cancelable = puedeCancelar(reserva, ahora);
  const finalizada = estadoReserva(reserva, ahora) === 'finalizada';

  return (
    <PantallaSecundaria>
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
          <Texto variante="categoria" color="acentoNaranja">
            Horas de tu plan
          </Texto>
          <Texto variante="cuerpo" color="textoSobreOscuro">
            {textoHoras(duracionHoras(reserva.inicio, reserva.fin))}
          </Texto>
        </Tarjeta>
        {cancelable ? (
          <Boton
            texto="Cancelar reserva"
            variante="contorno"
            onPress={() => setConfirmando(true)}
          />
        ) : finalizada ? null : (
          <Texto variante="cuerpoChico" style={styles.aviso}>
            Las reservas se pueden cancelar hasta {MINUTOS_LIMITE_CANCELACION} minutos antes de que
            empiecen.
          </Texto>
        )}
        <PantallaEnConstruccion titulo="Check-in y cómo llegar" etapa="Etapa 9" />
      </View>

      {confirmando ? (
        <PanelInferior
          visible
          titulo="¿Cancelar tu reserva?"
          onCerrar={() => setConfirmando(false)}
        >
          <Texto variante="cuerpoChico" color="textoSecundario">
            {reserva.espacio} · {textoHorario(reserva, ahora)}. Las horas vuelven a tu plan.
          </Texto>
          <Boton
            texto="Sí, cancelar"
            onPress={async () => {
              const ok = await cancelar(reserva.id);
              setConfirmando(false);
              if (ok) setCancelada(true);
            }}
          />
          <Boton
            texto="No, mantenerla"
            variante="secundario"
            onPress={() => setConfirmando(false)}
          />
        </PanelInferior>
      ) : null}
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
  tarjeta: { gap: espacio.xs },
  aviso: { textAlign: 'center' },
});
