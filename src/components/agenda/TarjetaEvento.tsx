import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { IconoAgenda } from '@/components/iconos/Iconos';
import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { Texto } from '@/components/ui';
import type { Evento } from '@/models/agenda';
import { colores, degradados, espacio, radios } from '@/theme';
import { fechaEvento } from '@/utils/agenda';

import { EtiquetaMarca } from './EtiquetaMarca';

type Props = {
  evento: Evento;
  inscripto: boolean;
  onInscribir: () => void;
};

const ETIQUETA: Record<Evento['submarca'], { texto: string; color: 'acento' | 'acentoNaranja' }> = {
  evento: { texto: 'OLE / Evento', color: 'acento' },
  afterOffice: { texto: 'OLE / After office', color: 'acentoNaranja' },
};

// Evento abierto de la comunidad (Figma: AGENDA, "NOVEDADES"). Inscribirse alterna el estado.
export function TarjetaEvento({ evento, inscripto, onInscribir }: Props) {
  const total = evento.inscriptos + (inscripto ? 1 : 0);
  const etiqueta = ETIQUETA[evento.submarca];
  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <IconoSubmarca submarca={evento.submarca} tamano={24} />
        <EtiquetaMarca texto={etiqueta.texto} color={etiqueta.color} />
        <View style={styles.fecha}>
          <IconoAgenda tamano={13} color={colores.textoTerciario} />
          <Texto variante="meta" color="textoTerciario">
            {fechaEvento(evento)}
          </Texto>
        </View>
      </View>

      <View style={styles.contenido}>
        {evento.foto ? (
          <Image
            source={evento.foto}
            style={styles.foto}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : null}
        <View style={styles.flex}>
          <Texto
            variante="tituloTarjeta"
            color="textoSobreOscuro"
            numberOfLines={1}
            accessibilityRole="header"
          >
            {evento.titulo}
          </Texto>
          <Texto variante="cuerpoChico" color="textoTerciario" numberOfLines={1}>
            {evento.detalle}
          </Texto>
        </View>
      </View>

      <View style={styles.pie}>
        <View style={styles.personas} accessible accessibilityLabel={`${total} inscriptos`}>
          {evento.personas.map((foto, i) => (
            <Image
              key={i}
              source={foto}
              style={[styles.persona, i > 0 && styles.superpuesta]}
              accessibilityIgnoresInvertColors
            />
          ))}
          <Texto variante="cuerpoChicoDestacado" color="textoSecundario" style={styles.cantidad}>
            +{total} inscriptos
          </Texto>
        </View>
        <Pressable
          hitSlop={8}
          onPress={onInscribir}
          accessibilityRole="button"
          accessibilityLabel={
            inscripto
              ? `Inscripto a ${evento.titulo}. Dar de baja`
              : `Inscribirme a ${evento.titulo}`
          }
          accessibilityState={{ selected: inscripto }}
          style={({ pressed }) => [
            styles.boton,
            !inscripto && styles.botonContorno,
            pressed && styles.presionado,
          ]}
        >
          {inscripto ? (
            <LinearGradient
              colors={degradados.accion.colores}
              locations={degradados.accion.posiciones}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[StyleSheet.absoluteFill, styles.fondoBoton]}
            />
          ) : null}
          <Texto variante="boton" color={inscripto ? 'textoBoton' : 'acentoNaranja'}>
            {inscripto ? 'Inscripto' : 'Inscribirme'}
          </Texto>
        </Pressable>
      </View>
    </View>
  );
}

const TAMANO_PERSONA = 28;

const styles = StyleSheet.create({
  tarjeta: {
    gap: espacio.l,
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  fecha: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs, marginLeft: 'auto' },
  contenido: { flexDirection: 'row', alignItems: 'center', gap: espacio.xl },
  foto: { width: 56, height: 56, borderRadius: radios.md },
  flex: { flex: 1, gap: espacio.xxs },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: espacio.l,
    borderTopWidth: 1,
    borderTopColor: colores.divisorSobreOscuro,
  },
  personas: { flexDirection: 'row', alignItems: 'center' },
  persona: {
    width: TAMANO_PERSONA,
    height: TAMANO_PERSONA,
    borderRadius: radios.pastilla,
    borderWidth: 2,
    borderColor: colores.superficie,
  },
  superpuesta: { marginLeft: -espacio.m },
  cantidad: { marginLeft: espacio.m },
  boton: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: espacio.base,
    borderRadius: radios.pastilla,
  },
  botonContorno: { borderWidth: 1, borderColor: colores.bordeNaranja },
  fondoBoton: { borderRadius: radios.pastilla },
  presionado: { opacity: 0.85 },
});
