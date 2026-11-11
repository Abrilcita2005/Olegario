import { useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

import { EtiquetaMarca } from '@/components/agenda/EtiquetaMarca';
import { IconoAgenda, IconoUbicacion } from '@/components/iconos/Iconos';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton, EstadoVacio, Texto } from '@/components/ui';
import { useAgenda } from '@/estado/agenda';
import { useEventoDetalle } from '@/hooks/useEventoDetalle';
import { colores, espacio, radios } from '@/theme';
import { horaTexto } from '@/utils/fechas';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

function fechaLarga(fecha: Date): string {
  const dia = DIAS[fecha.getDay()];
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} ${fecha.getDate()} de ${MESES[fecha.getMonth()]} · ${horaTexto(fecha)} hs`;
}

// Detalle de un evento de la Agenda o de una novedad con inscripción (pedido de la responsable, Etapa 14:
// que al tocar no quede vacío y se pueda conocer más). No está en Figma: se arma con el sistema de diseño.
export default function EventoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const evento = useEventoDetalle(id);
  const { estaInscripto, alternarInscripcion } = useAgenda();

  if (evento === undefined) {
    return (
      <PantallaSecundaria>
        <Texto variante="cuerpo">Cargando…</Texto>
      </PantallaSecundaria>
    );
  }
  if (evento === null) {
    return (
      <PantallaSecundaria>
        <EstadoVacio
          titulo="No encontramos este evento"
          texto="Puede que ya haya pasado o que no tengas conexión."
        />
      </PantallaSecundaria>
    );
  }

  const inscripto = estaInscripto(evento.id);
  const total = evento.inscriptos + (inscripto ? 1 : 0);

  return (
    <PantallaSecundaria>
      <View style={styles.contenido}>
        {/* Foto en un cuadrado con esquinas redondeadas, dentro de los márgenes (antes se cortaba al ras). */}
        {evento.foto ? (
          <View style={styles.marcoFoto}>
            <Image
              source={evento.foto}
              style={styles.foto}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          </View>
        ) : null}
        <EtiquetaMarca texto={evento.etiqueta} />
        <Texto variante="tituloAcceso" accessibilityRole="header">
          {evento.titulo}
        </Texto>

        <View style={styles.datos}>
          {evento.inicio ? (
            <View style={styles.dato}>
              <IconoAgenda tamano={16} color={colores.acento} />
              <Texto variante="cuerpoMedio">{fechaLarga(evento.inicio)}</Texto>
            </View>
          ) : null}
          <View style={styles.dato}>
            <IconoUbicacion tamano={16} color={colores.acento} />
            <Texto variante="cuerpoMedio" style={styles.flex}>
              {evento.detalle}
            </Texto>
          </View>
        </View>

        {evento.descripcion ? (
          <View style={styles.descripcion}>
            <Texto variante="categoria" color="acentoNaranja">
              De qué se trata
            </Texto>
            <Texto variante="cuerpo" color="textoSobreOscuro">
              {evento.descripcion}
            </Texto>
          </View>
        ) : null}

        <Texto variante="cuerpoChicoDestacado">
          {total > 0
            ? `${total} ${total === 1 ? 'persona inscripta' : 'personas inscriptas'}`
            : 'Sin inscriptos todavía'}
        </Texto>
        <Boton
          texto={inscripto ? 'Inscripto · Darme de baja' : 'Inscribirme'}
          variante={inscripto ? 'contorno' : 'primario'}
          tamano="grande"
          onPress={() => alternarInscripcion(evento.id)}
        />
      </View>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
  marcoFoto: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radios.xxl,
    overflow: 'hidden',
    backgroundColor: colores.superficie,
  },
  foto: { width: '100%', height: '100%' },
  datos: { gap: espacio.m },
  dato: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  flex: { flex: 1 },
  descripcion: {
    gap: espacio.s,
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
});
