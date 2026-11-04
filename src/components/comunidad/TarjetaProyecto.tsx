import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconoUbicacion } from '@/components/iconos/Iconos';
import { Boton, Texto } from '@/components/ui';
import type { Publicacion } from '@/models/comunidad';
import { colores, espacio, radios } from '@/theme';

import { BotonSolicitud } from './BotonSolicitud';

type Props = {
  publicacion: Publicacion;
  enviada: boolean;
  onAccion: () => void;
  onVerPersona: (personaId: string) => void;
  onVerDetalle?: () => void;
  onEliminar?: () => void;
};

// Proyecto u oportunidad (Figma: COMUNIDAD, "PROYECTOS & OPORTUNIDADES").
export function TarjetaProyecto({
  publicacion: p,
  enviada,
  onAccion,
  onVerPersona,
  onVerDetalle,
  onEliminar,
}: Props) {
  const esIniciativa = p.tipo === 'iniciativa';
  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <View
          style={[styles.etiqueta, esIniciativa ? styles.etiquetaLima : styles.etiquetaNaranja]}
        >
          <Texto variante="chip" color={esIniciativa ? 'textoSobreClaro' : 'acentoNaranja'}>
            {esIniciativa ? 'INICIATIVA COMUNITARIA' : `BUSCA: ${p.busca ?? 'Colaborador/a'}`}
          </Texto>
        </View>
        {p.actividad ? (
          <Texto variante="meta" color="textoTerciario">
            {p.actividad}
          </Texto>
        ) : null}
      </View>

      <Texto variante="tituloBienvenida" color="textoSobreOscuro" accessibilityRole="header">
        {p.titulo}
      </Texto>

      <View style={styles.autores}>
        {p.autores.map((autor, i) => (
          <Fragment key={autor.nombre}>
            {i > 0 ? (
              <Texto variante="cuerpoChicoDestacado" color="textoSobreOscuro">
                {' & '}
              </Texto>
            ) : null}
            <Texto
              variante="cuerpoChicoDestacado"
              color="textoSobreOscuro"
              accessibilityRole={autor.personaId ? 'link' : undefined}
              onPress={autor.personaId ? () => onVerPersona(autor.personaId!) : undefined}
              suppressHighlighting
            >
              {autor.nombre}
            </Texto>
          </Fragment>
        ))}
        {p.rolAutor ? (
          <Texto variante="cuerpoChico" color="textoTerciario">
            {' '}
            • {p.rolAutor}
          </Texto>
        ) : null}
        {p.lugar ? (
          <View style={styles.lugar}>
            {p.rolAutor ? <IconoUbicacion color={colores.acentoNaranja} /> : null}
            <Texto variante="cuerpoChico" color="textoTerciario">
              {p.rolAutor ? p.lugar : ` • ${p.lugar}`}
            </Texto>
          </View>
        ) : null}
      </View>

      <Texto variante="cuerpo" color="textoSecundario">
        {p.descripcion}
      </Texto>

      {p.etiquetas.length > 0 ? (
        <View style={styles.etiquetas}>
          {p.etiquetas.map((e) => (
            <View key={e} style={styles.tag}>
              <Texto variante="meta" color="textoSecundario">
                {e}
              </Texto>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.acciones}>
        {p.esPropia ? (
          <>
            <Texto variante="cuerpoChico" color="acentoLima" style={styles.centro}>
              Tu publicación está visible para la comunidad.
            </Texto>
            {onEliminar ? (
              <Boton texto="Eliminar publicación" variante="contorno" onPress={onEliminar} />
            ) : null}
          </>
        ) : (
          <BotonSolicitud
            texto={p.accion}
            enviada={enviada}
            onPress={onAccion}
            variante={esIniciativa ? 'contorno' : 'primario'}
          />
        )}
        {p.conDetalle && onVerDetalle ? (
          <Boton texto="Ver detalles del proyecto" variante="contorno" onPress={onVerDetalle} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    gap: espacio.l,
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  etiqueta: {
    flexShrink: 1,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xxs,
    borderRadius: radios.pastilla,
  },
  etiquetaNaranja: {
    borderWidth: 1,
    borderColor: colores.bordeNaranja,
    backgroundColor: colores.fondoChipAcento,
  },
  etiquetaLima: { backgroundColor: colores.acentoLima },
  autores: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  lugar: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs, marginLeft: espacio.m },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s },
  tag: {
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xs,
    borderRadius: radios.sm,
    borderWidth: 1,
    borderColor: colores.divisorSobreOscuro,
  },
  acciones: { gap: espacio.m, marginTop: espacio.xs },
  centro: { textAlign: 'center' },
});
