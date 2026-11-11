import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { IconoUbicacion } from '@/components/iconos/Iconos';
import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { Texto } from '@/components/ui';
import type { Espacio } from '@/models/espacio';
import { colores, degradados, espacio, radios, type NombreColor } from '@/theme';
import type { EstadoEspacio } from '@/utils/disponibilidad';
import { NOMBRE_SERVICIO } from '@/utils/espacios';

type Accion = { etiqueta: string; valor: string; boton: string; onPress: () => void };

type Props = {
  espacio: Espacio;
  estado: EstadoEspacio;
  accion: Accion;
};

const ESTILO_ESTADO: Record<EstadoEspacio['tipo'], { color: NombreColor; borde: string }> = {
  libre: { color: 'acento', borde: colores.bordeAcento },
  cupos: { color: 'acentoNaranja', borde: colores.bordeNaranja },
  ocupado: { color: 'acentoLima', borde: colores.bordeLima },
};

function textoEstado(estado: EstadoEspacio): string {
  if (estado.tipo === 'libre') return 'LIBRE';
  if (estado.tipo === 'cupos')
    return `${estado.libres} ${estado.libres === 1 ? 'LIBRE' : 'LIBRES'}`;
  return `Ocupado hasta ${estado.hasta}`;
}

// Tarjeta de espacio (Figma: ESPACIOS). Muestra la foto del espacio; si no tiene, el degradado de marca
// con el ícono del servicio (como la miniatura de la reserva del Home).
export function TarjetaEspacio({ espacio: datos, estado, accion }: Props) {
  const estiloEstado = ESTILO_ESTADO[estado.tipo];
  return (
    <View style={styles.tarjeta}>
      <LinearGradient
        colors={degradados.marca.colores}
        locations={degradados.marca.posiciones}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.imagen}
      >
        {datos.foto ? (
          <>
            <Image
              source={datos.foto}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              style={styles.foto}
            />
            {/* Sombra abajo para que las etiquetas se lean sobre cualquier foto. */}
            <LinearGradient
              colors={[colores.transparente, colores.veloFoto]}
              start={{ x: 0.5, y: 0.45 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </>
        ) : (
          <IconoSubmarca submarca={datos.servicio} tamano={88} conAro={false} />
        )}
        <View style={[styles.pastilla, styles.arribaIzquierda]}>
          <IconoSubmarca submarca={datos.servicio} tamano={18} conAro={false} />
          <Texto variante="categoria" color="textoSobreOscuro">
            {NOMBRE_SERVICIO[datos.servicio]}
          </Texto>
        </View>
        <View style={[styles.pastilla, styles.arribaDerecha, { borderColor: estiloEstado.borde }]}>
          {estado.tipo === 'libre' ? (
            <View style={[styles.punto, { backgroundColor: colores[estiloEstado.color] }]} />
          ) : null}
          <Texto variante="chip" color={estiloEstado.color}>
            {textoEstado(estado)}
          </Texto>
        </View>
        <View style={styles.ambiente}>
          {datos.ambiente.map((item) => (
            <View key={item} style={styles.pastilla}>
              <Texto variante="meta" color="textoSobreOscuro">
                {item}
              </Texto>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.cuerpo}>
        <View style={styles.titulo}>
          <Texto
            variante="tituloReencuentro"
            color="textoSobreOscuro"
            accessibilityRole="header"
            style={styles.nombre}
          >
            {datos.nombre}
          </Texto>
          {datos.etiqueta ? (
            <View style={styles.etiqueta}>
              <Texto variante="categoria" color="acento">
                {datos.etiqueta}
              </Texto>
            </View>
          ) : null}
        </View>
        <View style={styles.ubicacion}>
          <IconoUbicacion color={colores.acentoNaranja} />
          <Texto variante="cuerpoChico" color="textoSecundario" style={styles.flex}>
            {datos.ubicacion}
          </Texto>
        </View>
        <View style={styles.equipamiento}>
          {datos.equipamiento.map((item) => (
            <View key={item} style={styles.chipEquipo}>
              <Texto variante="meta" color="textoSecundario">
                {item}
              </Texto>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.pie}>
        <View style={styles.flex}>
          {/* En una sola línea (si no entra, la letra se achica un poco): antes cortaba en "plan". */}
          <Texto
            variante="meta"
            color="textoTerciario"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {accion.etiqueta}
          </Texto>
          <Texto
            variante="tituloTarjeta"
            color={estado.tipo === 'ocupado' ? 'acentoLima' : 'textoSobreOscuro'}
          >
            {accion.valor}
          </Texto>
        </View>
        <Pressable
          onPress={accion.onPress}
          accessibilityRole="button"
          accessibilityLabel={`${accion.boton}: ${datos.nombre}`}
          style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
        >
          <Texto variante="boton" color="acentoNaranja">
            {accion.boton}
          </Texto>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    gap: espacio.base,
    padding: espacio.base,
    borderRadius: radios.xxl * 1.5,
    backgroundColor: colores.superficie,
  },
  imagen: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.xxl,
    overflow: 'hidden',
  },
  pastilla: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xs,
    borderRadius: radios.pastilla,
    borderWidth: 1,
    borderColor: colores.divisorSobreOscuro,
    backgroundColor: colores.fondoPastillaFoto,
  },
  // Tamaño explícito: en la web, absoluteFill solo no escala la imagen.
  foto: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  arribaIzquierda: { position: 'absolute', top: espacio.l, left: espacio.l },
  arribaDerecha: { position: 'absolute', top: espacio.l, right: espacio.l },
  punto: { width: 6, height: 6, borderRadius: radios.pastilla },
  ambiente: {
    position: 'absolute',
    left: espacio.l,
    right: espacio.l,
    bottom: espacio.l,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacio.s,
  },
  cuerpo: { gap: espacio.m },
  titulo: { flexDirection: 'row', alignItems: 'flex-start', gap: espacio.m },
  nombre: { flex: 1 },
  etiqueta: {
    marginTop: espacio.xs,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xxs,
    borderRadius: radios.sm,
    borderWidth: 1,
    borderColor: colores.bordeAcento,
  },
  ubicacion: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  equipamiento: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s },
  chipEquipo: {
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xs,
    borderRadius: radios.pastilla,
    borderWidth: 1,
    borderColor: colores.divisorSobreOscuro,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    paddingTop: espacio.base,
    borderTopWidth: 1,
    borderTopColor: colores.divisorSobreOscuro,
  },
  flex: { flex: 1 },
  boton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: espacio.base,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.bordeNaranja,
  },
  presionado: { opacity: 0.8 },
});
