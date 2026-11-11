import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { TarjetaNovedad } from '@/components/novedades/TarjetaNovedad';
import { Texto } from '@/components/ui';
import { useAgenda } from '@/estado/agenda';
import { useSesion } from '@/estado/sesion';
import { useNovedades } from '@/hooks/useNovedades';
import { colores, espacio, radios } from '@/theme';

// Novedades (Figma: NOVEDADES, "PULSO DE OLEGARIO"). Panel que sube desde abajo (aprobado 2026-10-28);
// se cierra deslizando hacia abajo, con el botón atrás o con "Cerrar". Decisiones de la responsable
// (2026-11-04): "Pedir al barista" abre la carta del café; "Últimos cupos" inscribe (simulado, como los
// eventos de la Agenda); el contador del botón flotante muestra siempre cuántas novedades hay.
export default function NovedadesScreen() {
  const { estaInscripto, alternarInscripcion } = useAgenda();
  const { fotoPerfil } = useSesion();
  const novedades = useNovedades();

  return (
    <View style={styles.panel}>
      {/* En el iPhone, el panel pega la lista desplazable a su borde: por eso el encabezado y los
          márgenes van DENTRO de la lista (antes las tarjetas tapaban el título y quedaban corridas). */}
      <ScrollView contentContainerStyle={styles.lista}>
        <View>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Cerrar novedades"
            hitSlop={8}
            style={styles.cerrar}
          >
            <Texto variante="chip">Cerrar</Texto>
          </Pressable>
          <View style={styles.barraSuperior}>
            <View style={styles.titulo}>
              <View style={styles.punto} />
              <Texto variante="tituloSeccion" color="acento" accessibilityRole="header">
                Pulso de Olegario
              </Texto>
            </View>
            <Texto variante="cuerpoChico">Novedades y eventos</Texto>
          </View>
        </View>

        {novedades.map((novedad) => (
          <TarjetaNovedad
            key={novedad.id}
            novedad={novedad}
            fotoPerfil={fotoPerfil}
            inscripto={estaInscripto(novedad.eventoId ?? novedad.id)}
            onVerDetalle={
              novedad.accion.tipo === 'inscripcion'
                ? () => {
                    router.back();
                    router.push(`/evento/${novedad.eventoId ?? novedad.id}`);
                  }
                : undefined
            }
            onAccion={() => {
              if (novedad.accion.tipo === 'carta') {
                router.back();
                router.push('/carta-cafe');
              } else {
                alternarInscripcion(novedad.eventoId ?? novedad.id);
              }
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, backgroundColor: colores.fondo },
  barraSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titulo: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  punto: { width: 10, height: 10, borderRadius: radios.pastilla, backgroundColor: colores.acento },
  cerrar: {
    alignSelf: 'flex-end',
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: espacio.m,
    borderRadius: radios.pastilla,
  },
  lista: {
    gap: espacio.base,
    paddingTop: espacio.base,
    paddingHorizontal: espacio.margenPantalla,
    paddingBottom: espacio.grande * 2,
  },
});
