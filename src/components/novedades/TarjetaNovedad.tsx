import { Image, Pressable, StyleSheet, View } from 'react-native';

import { IconoCheck, IconoEtiqueta, IconoFlechaDerecha } from '@/components/iconos/Iconos';
import { Avatar, Texto } from '@/components/ui';
import { colores, espacio, radios } from '@/theme';

import type { Novedad } from '@/models/novedad';

type Props = {
  novedad: Novedad;
  inscripto: boolean;
  fotoPerfil: string | null;
  onAccion: () => void;
};

const COLORES_INICIALES = [colores.acento, colores.acentoNaranja];

// Tarjeta de novedad (Figma: NOVEDADES): foto, descuento, título, texto y botón con flecha.
export function TarjetaNovedad({ novedad, inscripto, fotoPerfil, onAccion }: Props) {
  const esInscripcion = novedad.accion.tipo === 'inscripcion';
  const mas = (novedad.participantes?.mas ?? 0) + (inscripto ? 1 : 0);
  return (
    <View style={styles.tarjeta}>
      <View style={styles.marcoFoto}>
        <Image
          source={novedad.foto}
          resizeMode="cover"
          style={styles.foto}
          accessibilityIgnoresInvertColors
        />
        {/* Sin nadie inscripto no se muestra "+0". */}
        {novedad.participantes && novedad.participantes.iniciales.length + mas > 0 ? (
          <View
            style={styles.participantes}
            accessible
            accessibilityLabel={`${novedad.participantes.iniciales.length + mas} personas inscriptas`}
          >
            {novedad.participantes.iniciales.map((ini, i) => (
              <View
                key={ini}
                style={[
                  styles.circulo,
                  { backgroundColor: COLORES_INICIALES[i % COLORES_INICIALES.length] },
                  i > 0 && styles.superpuesto,
                ]}
              >
                <Texto variante="chip" color="textoSobreOscuro">
                  {ini}
                </Texto>
              </View>
            ))}
            {inscripto ? (
              <View style={[styles.circulo, styles.superpuesto, styles.sinFondo]}>
                <Avatar foto={fotoPerfil} tamano={TAMANO_CIRCULO} />
              </View>
            ) : null}
            <View style={[styles.circulo, styles.superpuesto, styles.mas]}>
              <Texto variante="chip" color="textoSobreOscuro">
                +{mas}
              </Texto>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.fila}>
        {novedad.descuento ? (
          <View style={styles.descuento}>
            <IconoEtiqueta color={colores.textoSobreOscuro} />
            <Texto variante="chip" color="textoSobreOscuro">
              {novedad.descuento}
            </Texto>
          </View>
        ) : null}
        <Texto variante="categoria" color="textoSobreOscuro" accessibilityRole="header">
          {novedad.titulo}
        </Texto>
      </View>

      <View style={styles.pie}>
        <Texto variante="cuerpoChico" color="textoSecundario" style={styles.texto}>
          {novedad.texto}
        </Texto>
        <Pressable
          hitSlop={8}
          onPress={onAccion}
          accessibilityRole="button"
          accessibilityLabel={
            esInscripcion && inscripto
              ? `Inscripto a ${novedad.titulo}. Dar de baja`
              : `${novedad.accion.texto}: ${novedad.titulo}`
          }
          accessibilityState={esInscripcion ? { selected: inscripto } : undefined}
          style={({ pressed }) => [
            styles.boton,
            esInscripcion && inscripto && styles.botonInscripto,
            pressed && styles.presionado,
          ]}
        >
          <Texto
            variante="botonSecundario"
            color={esInscripcion && inscripto ? 'acentoLima' : 'textoSobreOscuro'}
          >
            {esInscripcion && inscripto ? 'Inscripto' : novedad.accion.texto}
          </Texto>
          {esInscripcion && inscripto ? (
            <IconoCheck color={colores.acentoLima} />
          ) : (
            <IconoFlechaDerecha color={colores.textoSobreOscuro} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const TAMANO_CIRCULO = 34;

const styles = StyleSheet.create({
  tarjeta: {
    gap: espacio.l,
    padding: espacio.base,
    borderRadius: radios.xxl * 1.5,
    backgroundColor: colores.superficie,
  },
  marcoFoto: { aspectRatio: 1.22, borderRadius: radios.xxl, overflow: 'hidden' },
  // Tamaño explícito: en la web, absoluteFill solo no escala la imagen.
  foto: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  participantes: {
    position: 'absolute',
    right: espacio.l,
    bottom: espacio.l,
    flexDirection: 'row',
  },
  circulo: {
    width: TAMANO_CIRCULO,
    height: TAMANO_CIRCULO,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.pastilla,
    borderWidth: 2,
    borderColor: colores.superficie,
    overflow: 'hidden',
  },
  superpuesto: { marginLeft: -espacio.s },
  sinFondo: { borderWidth: 0 },
  mas: { backgroundColor: colores.superficie },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.l },
  descuento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.xs,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.xxs,
    borderRadius: radios.pastilla,
    backgroundColor: colores.naranjaTitulo,
  },
  pie: { flexDirection: 'row', alignItems: 'center', gap: espacio.l },
  texto: { flex: 1 },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
    minHeight: 40,
    paddingHorizontal: espacio.xl,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.divisorSobreOscuro,
  },
  botonInscripto: { borderColor: colores.bordeLima },
  presionado: { opacity: 0.85 },
});
