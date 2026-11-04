import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EtiquetaMarca } from '@/components/agenda/EtiquetaMarca';
import { TarjetaEfemeride } from '@/components/agenda/TarjetaEfemeride';
import { TarjetaEvento } from '@/components/agenda/TarjetaEvento';
import { TarjetaReservaAgenda } from '@/components/agenda/TarjetaReservaAgenda';
import { SelectorSemana } from '@/components/espacios/SelectorSemana';
import { PantallaBase } from '@/components/navegacion/PantallaBase';
import { EstadoVacio, Texto, TextoDegradado } from '@/components/ui';
import { useAgenda } from '@/estado/agenda';
import { useReservas } from '@/estado/reservas';
import { useSesion } from '@/estado/sesion';
import { useAhora } from '@/hooks/useAhora';
import type { FiltroAgenda } from '@/models/agenda';
import { colores, degradados, espacio, radios } from '@/theme';
import { delDia, marcasDeActividad } from '@/utils/agenda';
import { inicioDelDia, sumarDias } from '@/utils/fechas';
import { puede } from '@/utils/permisos';

function semanaDe(dia: Date): Date[] {
  const lunes = sumarDias(inicioDelDia(dia), -((dia.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
}

// Agenda (Figma: AGENDA). Decisiones de la responsable (2026-11-04): al tocar un día se ve lo de ese día
// y se puede pasar de semana; "MODIFICAR" abre el detalle de la reserva; el PIN es de prueba y se copia.
export default function AgendaScreen() {
  const ahora = useAhora();
  const { tipoAcceso, salir } = useSesion();
  const { reservas } = useReservas();
  const { eventos, efemerides, estaInscripto, alternarInscripcion } = useAgenda();
  const esMiembro = puede(tipoAcceso, 'reservarEspacio');

  const [dia, setDia] = useState(() => inicioDelDia(ahora));
  const [filtro, setFiltro] = useState<FiltroAgenda>('todo');

  const misReservas = esMiembro ? reservas : [];
  const reservasDelDia = delDia(misReservas, dia, (r) => r.inicio);
  const efemeridesDelDia = delDia(efemerides, dia, (e) => e.fecha);
  const eventosDelDia = delDia(eventos, dia, (e) => e.inicio);

  const verReservas = filtro !== 'efemerides';
  const verEfemerides = filtro !== 'reservas';
  const verEventos = filtro === 'todo';
  const hayAlgo =
    (verReservas && reservasDelDia.length > 0) ||
    (verEfemerides && efemeridesDelDia.length > 0) ||
    (verEventos && eventosDelDia.length > 0);

  return (
    <PantallaBase>
      <View style={styles.cabecera}>
        <EtiquetaMarca texto="OLE / Agenda creativa" />
        <View
          accessible
          accessibilityRole="header"
          accessibilityLabel="Tu rincón perfecto"
          style={styles.titulo}
        >
          <Texto variante="tituloDestacado">Tu rincón</Texto>
          <TextoDegradado>perfecto</TextoDegradado>
        </View>
        <Texto variante="cuerpo">
          Sincronizá tus espacios, conectá en workshops y activá la chispa del día en Olegario.
        </Texto>
      </View>

      <View style={styles.filtros}>
        <Filtro texto="Todo" activo={filtro === 'todo'} onPress={() => setFiltro('todo')} />
        <Filtro
          texto="Mis reservas"
          cantidad={reservasDelDia.length}
          activo={filtro === 'reservas'}
          onPress={() => setFiltro('reservas')}
        />
        <Filtro
          texto="Efemérides"
          activo={filtro === 'efemerides'}
          onPress={() => setFiltro('efemerides')}
        />
      </View>

      <SelectorSemana
        dias={semanaDe(dia)}
        seleccionado={dia}
        marcas={marcasDeActividad(misReservas, eventos)}
        onElegir={setDia}
        onSemanaAnterior={() => setDia(sumarDias(dia, -7))}
        onSemanaSiguiente={() => setDia(sumarDias(dia, 7))}
      />

      <View style={styles.lista}>
        {verReservas
          ? reservasDelDia.map((reserva) => (
              <TarjetaReservaAgenda
                key={reserva.id}
                reserva={reserva}
                ahora={ahora}
                onModificar={() => router.push(`/reserva/${reserva.id}`)}
              />
            ))
          : null}

        {verEfemerides
          ? efemeridesDelDia.map((efemeride) => (
              <TarjetaEfemeride
                key={efemeride.id}
                efemeride={efemeride}
                onConocerMas={() => router.navigate('/comunidad')}
              />
            ))
          : null}

        {verEventos && eventosDelDia.length > 0 ? (
          <>
            <View style={styles.seccion}>
              <Texto variante="tituloSeccion" accessibilityRole="header">
                Novedades
              </Texto>
              <Texto variante="cuerpoChico">Actividades abiertas de la comunidad Olegario</Texto>
            </View>
            {eventosDelDia.map((evento) => (
              <TarjetaEvento
                key={evento.id}
                evento={evento}
                inscripto={estaInscripto(evento.id)}
                onInscribir={() => alternarInscripcion(evento.id)}
              />
            ))}
          </>
        ) : null}

        {filtro === 'reservas' && !esMiembro ? (
          <EstadoVacio
            titulo="Reservar es para miembros"
            texto="Como invitado podés mirar la agenda e inscribirte a eventos. Para reservar espacios, creá tu cuenta."
            accion={{ texto: 'Crear mi cuenta', onPress: salir }}
          />
        ) : !hayAlgo ? (
          <EstadoVacio
            titulo="Nada agendado este día"
            texto={
              filtro === 'reservas'
                ? 'No tenés reservas este día.'
                : filtro === 'efemerides'
                  ? 'No hay efemérides este día.'
                  : 'Mirá otros días de la semana o reservá tu lugar.'
            }
            accion={
              esMiembro && filtro !== 'efemerides'
                ? { texto: 'Reservá tu lugar', onPress: () => router.navigate('/espacios') }
                : undefined
            }
          />
        ) : null}
      </View>
    </PantallaBase>
  );
}

type PropsFiltro = { texto: string; activo: boolean; cantidad?: number; onPress: () => void };

function Filtro({ texto, activo, cantidad, onPress }: PropsFiltro) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={cantidad !== undefined ? `${texto} (${cantidad})` : texto}
      accessibilityState={{ selected: activo }}
      style={[styles.filtro, !activo && styles.filtroInactivo]}
    >
      {activo ? (
        <LinearGradient
          colors={degradados.accion.colores}
          locations={degradados.accion.posiciones}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
          style={[StyleSheet.absoluteFill, styles.fondoFiltro]}
        />
      ) : null}
      <Texto
        variante={activo ? 'categoria' : 'meta'}
        color="textoSobreOscuro"
        style={styles.textoFiltro}
      >
        {texto}
      </Texto>
      {activo ? <View style={styles.puntoActivo} /> : null}
      {cantidad !== undefined && cantidad > 0 ? (
        <View style={styles.cantidad}>
          <Texto variante="micro" color="textoSobreOscuro" style={styles.textoCantidad}>
            {cantidad}
          </Texto>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cabecera: { gap: espacio.l, marginBottom: espacio.base },
  titulo: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', columnGap: espacio.s },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espacio.s,
    marginBottom: espacio.m,
  },
  filtro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
    minHeight: 32,
    paddingHorizontal: espacio.base,
    borderRadius: radios.pastilla,
  },
  filtroInactivo: { backgroundColor: colores.superficie },
  fondoFiltro: { borderRadius: radios.pastilla },
  textoFiltro: { textTransform: 'uppercase' },
  puntoActivo: {
    width: 6,
    height: 6,
    borderRadius: radios.pastilla,
    backgroundColor: colores.textoSobreOscuro,
  },
  cantidad: {
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.pastilla,
    backgroundColor: colores.acentoNaranja,
  },
  textoCantidad: { lineHeight: 12 },
  lista: { gap: espacio.base, marginTop: espacio.base },
  seccion: { gap: espacio.xxs, marginTop: espacio.m },
});
