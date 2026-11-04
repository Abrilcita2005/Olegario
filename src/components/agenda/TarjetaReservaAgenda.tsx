import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconoCopiar, IconoLlave, IconoReloj, IconoUbicacion } from '@/components/iconos/Iconos';
import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { Boton, Texto } from '@/components/ui';
import type { Reserva } from '@/models/reserva';
import { colores, degradados, espacio, radios } from '@/theme';
import { pinDeReserva, textoFaltante } from '@/utils/agenda';
import { NOMBRE_SERVICIO } from '@/utils/espacios';
import { horaTexto } from '@/utils/fechas';

type Props = {
  reserva: Reserva;
  ahora: Date;
  onModificar: () => void;
};

const DURACION_AVISO_MS = 2000;

// Tarjeta de reserva de la Agenda (Figma: AGENDA). El PIN es de PRUEBA (P-07): se copia con un aviso.
export function TarjetaReservaAgenda({ reserva, ahora, onModificar }: Props) {
  const pin = pinDeReserva(reserva.id);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const id = setTimeout(() => setCopiado(false), DURACION_AVISO_MS);
    return () => clearTimeout(id);
  }, [copiado]);

  const copiar = async () => {
    await Clipboard.setStringAsync(pin);
    setCopiado(true);
  };

  return (
    <View style={styles.tarjeta}>
      {/* Línea de degradado arriba, como en Figma. */}
      <LinearGradient
        colors={degradados.marca.colores}
        locations={degradados.marca.posiciones}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.linea}
      />
      <View style={styles.cabecera}>
        <IconoSubmarca submarca={reserva.servicio} tamano={56} />
        <View style={styles.titulos}>
          <View style={styles.fila}>
            <View style={styles.etiqueta}>
              <Texto variante="categoria" color="acento">
                {NOMBRE_SERVICIO[reserva.servicio].replace('/', ' / ')}
              </Texto>
            </View>
            <IconoReloj color={colores.acentoLima} />
            <Texto variante="cuerpoChicoDestacado" color="acentoLima">
              {textoFaltante(reserva, ahora)}
            </Texto>
          </View>
          <Texto variante="tituloTarjeta" color="textoSobreOscuro" accessibilityRole="header">
            {reserva.espacio}
          </Texto>
        </View>
      </View>

      <View style={styles.datos}>
        <Dato
          icono={<IconoReloj color={colores.acentoNaranja} />}
          etiqueta="Horario"
          valor={`${horaTexto(reserva.inicio)} - ${horaTexto(reserva.fin)} hs`}
        />
        <Dato
          icono={<IconoUbicacion color={colores.acentoLima} />}
          etiqueta="Ubicación"
          valor={reserva.ubicacion}
        />
      </View>

      <View style={styles.pie}>
        <Pressable
          onPress={copiar}
          accessibilityRole="button"
          accessibilityLabel={`PIN de acceso ${pin.split('').join(' ')}. Copiar`}
          style={({ pressed }) => [styles.pin, pressed && styles.presionado]}
        >
          <IconoLlave color={colores.textoSecundario} />
          <View>
            <Texto variante="micro" color="textoTerciario">
              PIN ACCESO
            </Texto>
            <Texto variante="tituloTarjeta" color="textoSobreOscuro">
              #{pin}
            </Texto>
          </View>
          <IconoCopiar color={colores.textoSecundario} />
        </Pressable>
        <Boton texto="Modificar" onPress={onModificar} style={styles.modificar} />
      </View>
      {copiado ? (
        <Texto
          variante="cuerpoChico"
          color="acentoLima"
          accessibilityLiveRegion="polite"
          style={styles.aviso}
        >
          PIN copiado
        </Texto>
      ) : null}
    </View>
  );
}

function Dato({ icono, etiqueta, valor }: { icono: ReactNode; etiqueta: string; valor: string }) {
  return (
    <View style={styles.dato}>
      <View style={styles.iconoDato}>{icono}</View>
      <View style={styles.flex}>
        <Texto variante="micro" color="textoTerciario" style={styles.etiquetaDato}>
          {etiqueta}
        </Texto>
        <Texto variante="chip" color="textoSobreOscuro" numberOfLines={2}>
          {valor}
        </Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    gap: espacio.base,
    padding: espacio.base,
    paddingTop: espacio.grande,
    borderRadius: radios.xxl,
    overflow: 'hidden',
    backgroundColor: colores.superficie,
  },
  linea: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: espacio.xl },
  titulos: { flex: 1, gap: espacio.xs },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.s, flexWrap: 'wrap' },
  etiqueta: {
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xxs,
    borderRadius: radios.pastilla,
    borderWidth: 1,
    borderColor: colores.bordeAcento,
    backgroundColor: colores.fondoChipAcento,
  },
  datos: {
    flexDirection: 'row',
    gap: espacio.m,
    padding: espacio.l,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.divisorSobreOscuro,
  },
  dato: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  iconoDato: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.pastilla,
    backgroundColor: colores.superficieElevada,
  },
  flex: { flex: 1 },
  etiquetaDato: { textTransform: 'uppercase', lineHeight: 12 },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    paddingTop: espacio.base,
    borderTopWidth: 1,
    borderTopColor: colores.divisorSobreOscuro,
  },
  pin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xs,
    borderRadius: radios.pastilla,
    borderWidth: 1,
    borderColor: colores.divisorSobreOscuro,
  },
  presionado: { opacity: 0.8 },
  modificar: { flex: 1 },
  aviso: { textAlign: 'center', marginTop: -espacio.m },
});
