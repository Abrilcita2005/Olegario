import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconoCheck, IconoMas, IconoMenos } from '@/components/iconos/Iconos';
import { Boton, BotonIcono, PanelInferior, Texto } from '@/components/ui';
import { colores, espacio, radios } from '@/theme';
import {
  MINUTOS_PASO,
  horaTexto,
  limitesHorario,
  sumarMinutos,
  textoHorarioElegido,
} from '@/utils/fechas';

type Props = {
  dia: Date;
  inicio: Date;
  fin: Date;
  ahora: Date;
  onConfirmar: (inicio: Date, fin: Date) => void;
  onCerrar: () => void;
};

// Selector de horario en pasos de 30 min, de 00:00 a 24:00 (se monta solo mientras está abierto).
export function SelectorHorario({ dia, inicio, fin, ahora, onConfirmar, onCerrar }: Props) {
  const [desde, setDesde] = useState(inicio);
  const [hasta, setHasta] = useState(fin);
  const { minInicio, finDelDia } = limitesHorario(dia, ahora);
  const maxInicio = sumarMinutos(finDelDia, -MINUTOS_PASO);

  const moverInicio = (minutos: number) => {
    const nuevo = sumarMinutos(desde, minutos);
    if (nuevo < minInicio || nuevo > maxInicio) return;
    setDesde(nuevo);
    // Si el inicio alcanza al fin, el fin se corre con él.
    if (hasta <= nuevo) setHasta(sumarMinutos(nuevo, MINUTOS_PASO));
  };

  const moverFin = (minutos: number) => {
    const nuevo = sumarMinutos(hasta, minutos);
    if (nuevo <= desde || nuevo > finDelDia) return;
    setHasta(nuevo);
  };

  const textoFin = hasta.getTime() === finDelDia.getTime() ? '24:00' : horaTexto(hasta);

  return (
    <PanelInferior visible titulo="Elegí tu horario" onCerrar={onCerrar}>
      <Fila
        etiqueta="Desde"
        valor={horaTexto(desde)}
        onMenos={() => moverInicio(-MINUTOS_PASO)}
        onMas={() => moverInicio(MINUTOS_PASO)}
      />
      <Fila
        etiqueta="Hasta"
        valor={textoFin}
        onMenos={() => moverFin(-MINUTOS_PASO)}
        onMas={() => moverFin(MINUTOS_PASO)}
      />
      <Texto variante="cuerpoChico" color="textoSecundario" accessibilityLiveRegion="polite">
        {textoHorarioElegido(desde, hasta, ahora)}
      </Texto>
      <Boton
        texto="Confirmar"
        icono={<IconoCheck color={colores.textoBoton} />}
        onPress={() => onConfirmar(desde, hasta)}
      />
    </PanelInferior>
  );
}

type PropsFila = { etiqueta: string; valor: string; onMenos: () => void; onMas: () => void };

function Fila({ etiqueta, valor, onMenos, onMas }: PropsFila) {
  return (
    <View style={styles.fila}>
      <Texto variante="etiquetaCampo" color="acentoLima" style={styles.etiqueta}>
        {etiqueta}
      </Texto>
      <BotonIcono
        etiquetaAccesible={`${etiqueta}: 30 minutos antes`}
        onPress={onMenos}
        icono={<IconoMenos color={colores.textoSobreOscuro} />}
      />
      <Texto
        variante="tituloTarjeta"
        color="textoSobreOscuro"
        style={styles.valor}
        accessibilityLabel={`${etiqueta} ${valor}`}
      >
        {valor}
      </Texto>
      <BotonIcono
        etiquetaAccesible={`${etiqueta}: 30 minutos después`}
        onPress={onMas}
        icono={<IconoMas color={colores.textoSobreOscuro} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    padding: espacio.m,
    borderRadius: radios.lg,
    backgroundColor: colores.superficieElevada,
  },
  etiqueta: { flex: 1 },
  valor: { minWidth: 64, textAlign: 'center' },
});
