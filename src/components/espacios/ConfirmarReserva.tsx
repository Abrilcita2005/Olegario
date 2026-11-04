import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Boton, PanelInferior, Texto } from '@/components/ui';
import type { ResultadoReserva } from '@/estado/reservas';
import type { Espacio } from '@/models/espacio';
import type { Reserva } from '@/models/reserva';
import { espacio as espaciado } from '@/theme';
import { MENSAJES_ERROR_RESERVA, type ErrorReserva } from '@/utils/disponibilidad';
import { duracionHoras, textoHoras } from '@/utils/fechas';
import { NOMBRE_SERVICIO } from '@/utils/espacios';

type Props = {
  espacio: Espacio;
  horario: string;
  inicio: Date;
  fin: Date;
  horasDisponibles: number;
  onReservar: () => Promise<ResultadoReserva>;
  onVerReserva: (reserva: Reserva) => void;
  onCerrar: () => void;
};

// Confirmación de la reserva (no diseñada en Figma: estilo de la app). Se monta solo mientras está abierta.
export function ConfirmarReserva({
  espacio,
  horario,
  inicio,
  fin,
  horasDisponibles,
  onReservar,
  onVerReserva,
  onCerrar,
}: Props) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<ErrorReserva | null>(null);
  const [hecha, setHecha] = useState<Reserva | null>(null);
  const horas = duracionHoras(inicio, fin);

  const confirmar = async () => {
    setEnviando(true);
    const resultado = await onReservar();
    setEnviando(false);
    if (resultado.ok) setHecha(resultado.reserva);
    else setError(resultado.error);
  };

  if (hecha) {
    return (
      <PanelInferior visible titulo="¡Reserva lista!" onCerrar={onCerrar}>
        <Texto variante="cuerpo" color="textoSecundario">
          Te esperamos en {espacio.nombre}. {horario}.
        </Texto>
        <Boton texto="Ver mi reserva" onPress={() => onVerReserva(hecha)} />
        <Boton texto="Seguir explorando" variante="secundario" onPress={onCerrar} />
      </PanelInferior>
    );
  }

  return (
    <PanelInferior visible titulo="Confirmá tu reserva" onCerrar={onCerrar}>
      <View style={styles.datos}>
        <Texto variante="categoria" color="acentoNaranja">
          {NOMBRE_SERVICIO[espacio.servicio]} · {espacio.tipo}
        </Texto>
        <Texto variante="tituloTarjeta" color="textoSobreOscuro">
          {espacio.nombre}
        </Texto>
        <Texto variante="cuerpoChico" color="textoSecundario">
          {horario}
        </Texto>
        <Texto variante="cuerpoChico" color="textoSecundario">
          Descuenta {textoHoras(horas)} de tu plan (te quedan {textoHoras(horasDisponibles)}).
        </Texto>
      </View>
      {error ? (
        <Texto variante="cuerpoChico" color="error" accessibilityRole="alert">
          {MENSAJES_ERROR_RESERVA[error]}
        </Texto>
      ) : null}
      <Boton texto="Confirmar reserva" onPress={confirmar} cargando={enviando} />
      <Boton texto="Volver" variante="secundario" onPress={onCerrar} />
    </PanelInferior>
  );
}

const styles = StyleSheet.create({
  datos: { gap: espaciado.xs },
});
