import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BarraHorario } from '@/components/espacios/BarraHorario';
import { ConfirmarReserva } from '@/components/espacios/ConfirmarReserva';
import { SelectorHorario } from '@/components/espacios/SelectorHorario';
import { SelectorSemana } from '@/components/espacios/SelectorSemana';
import { TarjetaEspacio } from '@/components/espacios/TarjetaEspacio';
import { IconoCamara } from '@/components/iconos/Iconos';
import type { Submarca } from '@/components/marca/IconoSubmarca';
import { PantallaBase } from '@/components/navegacion/PantallaBase';
import { Chip, EstadoVacio, Texto, TextoDegradado } from '@/components/ui';
import { useAgenda } from '@/estado/agenda';
import { useReservas } from '@/estado/reservas';
import { useSesion } from '@/estado/sesion';
import { useAhora } from '@/hooks/useAhora';
import { apiConfigurada } from '@/services/api';
import { abrirPlanoDeReservas } from '@/services/enlacesExternos';
import type { Espacio } from '@/models/espacio';
import { colores, espacio, radios } from '@/theme';
import { marcasDeActividad } from '@/utils/agenda';
import { diaReservable, estadoEspacio, lugaresLibres } from '@/utils/disponibilidad';
import {
  ajustarHorario,
  diasVisibles,
  duracionHoras,
  inicioDelDia,
  primerDiaConHorario,
  proximoPaso,
  sumarMinutos,
  textoHorarioElegido,
  textoHoras,
} from '@/utils/fechas';
import { NOMBRE_SERVICIO, SERVICIOS, esServicio, filtrarEspacios } from '@/utils/espacios';

import { PLANO_CONECTADO_AL_SERVIDOR } from '../../../data/enlaces';
import { puede } from '@/utils/permisos';

const DURACION_INICIAL_MINUTOS = 120;

// Espacios (Figma: ESPACIOS). Reglas de reserva de la responsable (2026-11-04): horario libre las 24 hs
// en pasos de 30 min, hasta 3 días de anticipación y toda reserva descuenta horas del plan.
// Desde el Home se abre filtrado por servicio (?servicio=cowork).
export default function EspaciosScreen() {
  const ahora = useAhora();
  const { tipoAcceso, salir } = useSesion();
  const { espacios, reservas, horas, reservar, actualizar, sinConexion } = useReservas();
  const { eventos } = useAgenda();
  const marcas = marcasDeActividad(reservas, eventos);
  const parametros = useLocalSearchParams<{ servicio?: string }>();
  const servicio = esServicio(parametros.servicio) ? parametros.servicio : null;
  const puedeReservar = puede(tipoAcceso, 'reservarEspacio');

  // Primer turno libre de 8 a 20 hs: hoy desde el próximo paso de 30 min o, si ya cerró, mañana a las 8.
  const [horario, setHorario] = useState(() => {
    const dia = primerDiaConHorario(ahora);
    const inicio = proximoPaso(ahora);
    return ajustarHorario(dia, inicio, sumarMinutos(inicio, DURACION_INICIAL_MINUTOS), ahora);
  });
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [aReservar, setAReservar] = useState<Espacio | null>(null);

  const dia = inicioDelDia(horario.inicio);
  const textoHorario = textoHorarioElegido(horario.inicio, horario.fin, ahora);
  const horasReserva = duracionHoras(horario.inicio, horario.fin);

  const visibles = useMemo(() => filtrarEspacios(espacios, servicio, ''), [espacios, servicio]);
  const puestosLibres = espacios.reduce(
    (total, e) => total + lugaresLibres(e, horario.inicio, horario.fin, reservas),
    0,
  );

  const elegirDia = (nuevoDia: Date) =>
    setHorario(ajustarHorario(nuevoDia, horario.inicio, horario.fin, ahora));

  const filtrar = (nuevo: Submarca | null) => router.setParams({ servicio: nuevo ?? undefined });

  return (
    <PantallaBase>
      <View style={styles.cabecera}>
        <Chip
          texto={`${puestosLibres} ${puestosLibres === 1 ? 'PUESTO LIBRE' : 'PUESTOS LIBRES'}`}
        />
        <View
          accessible
          accessibilityRole="header"
          accessibilityLabel="Tu rincón perfecto"
          style={styles.titulo}
        >
          <Texto variante="tituloDestacado">Tu rincón</Texto>
          <TextoDegradado>perfecto</TextoDegradado>
        </View>
      </View>

      <View style={styles.controles}>
        <SelectorSemana
          dias={diasVisibles(ahora)}
          seleccionado={dia}
          esHabilitado={(d) => diaReservable(d, ahora)}
          marcas={marcas}
          onElegir={elegirDia}
        />

        {/* "Buscá tu mesa en tiempo real" abre el plano en vivo (pedido de la responsable, Etapa 14). */}
        <Pressable
          onPress={async () => {
            await abrirPlanoDeReservas();
            // Al volver del plano, se leen de nuevo las reservas (lo reservado ahí aparece acá).
            await actualizar();
          }}
          accessibilityRole="button"
          accessibilityLabel="Buscá tu mesa en tiempo real: abrir el plano de Olegario"
          style={({ pressed }) => [styles.buscador, pressed && styles.presionado]}
        >
          <IconoCamara color={colores.textoTerciario} />
          <Texto variante="cuerpo" color="textoTerciario" style={styles.textoBuscador}>
            Buscá tu mesa en tiempo real
          </Texto>
          <Texto variante="cuerpoChicoDestacado" color="acentoLima">
            Ver plano
          </Texto>
        </Pressable>
        {PLANO_CONECTADO_AL_SERVIDOR && apiConfigurada ? null : (
          <Texto variante="meta" color="textoTerciario">
            Las reservas que hagas en el plano se guardan aparte: no aparecen en tus reservas de la
            app.
          </Texto>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}
        >
          <Filtro texto="Todos" activo={!servicio} onPress={() => filtrar(null)} />
          {/* Solo submarcas que tienen espacios (con los espacios reales no hay OLE/CAFÉ). */}
          {SERVICIOS.filter((s) => espacios.some((e) => e.servicio === s)).map((s) => (
            <Filtro
              key={s}
              texto={NOMBRE_SERVICIO[s]}
              activo={servicio === s}
              onPress={() => filtrar(s)}
            />
          ))}
        </ScrollView>

        <BarraHorario horario={textoHorario} onCambiar={() => setSelectorAbierto(true)} />
      </View>

      <View style={styles.lista}>
        {visibles.length === 0 ? (
          <EstadoVacio
            titulo={sinConexion ? 'No pudimos cargar los espacios' : 'No encontramos espacios'}
            texto={
              sinConexion
                ? 'Revisá tu conexión a internet y tocá "Reintentar" arriba.'
                : `Todavía no hay espacios de ${servicio ? NOMBRE_SERVICIO[servicio] : 'Olegario'} para reservar.`
            }
            accion={{
              texto: 'Ver todos los espacios',
              onPress: () => filtrar(null),
            }}
          />
        ) : (
          visibles.map((e) => {
            const estado = estadoEspacio(e, horario.inicio, horario.fin, reservas);
            const accion =
              estado.tipo === 'ocupado'
                ? {
                    etiqueta: 'Libre desde',
                    valor: estado.hasta,
                    boton: 'Usar ese horario',
                    onPress: () => {
                      const duracion = horario.fin.getTime() - horario.inicio.getTime();
                      const inicio = estado.libreDesde;
                      setHorario(
                        ajustarHorario(
                          inicio,
                          inicio,
                          new Date(inicio.getTime() + duracion),
                          ahora,
                        ),
                      );
                    },
                  }
                : puedeReservar
                  ? {
                      etiqueta: 'Descuenta de tu plan',
                      valor: textoHoras(horasReserva),
                      boton: 'Reservá tu lugar',
                      onPress: () => setAReservar(e),
                    }
                  : {
                      etiqueta: 'Reservar es para miembros',
                      valor: 'Creá tu cuenta',
                      boton: 'Crear cuenta',
                      onPress: salir,
                    };
            return <TarjetaEspacio key={e.id} espacio={e} estado={estado} accion={accion} />;
          })
        )}
      </View>

      {selectorAbierto ? (
        <SelectorHorario
          dia={dia}
          inicio={horario.inicio}
          fin={horario.fin}
          ahora={ahora}
          onCerrar={() => setSelectorAbierto(false)}
          onConfirmar={(inicio, fin) => {
            setHorario({ inicio, fin });
            setSelectorAbierto(false);
          }}
        />
      ) : null}

      {aReservar ? (
        <ConfirmarReserva
          espacio={aReservar}
          horario={textoHorario}
          inicio={horario.inicio}
          fin={horario.fin}
          horasDisponibles={horas.disponibles}
          onReservar={() => reservar(aReservar, horario.inicio, horario.fin)}
          onVerReserva={(reserva) => {
            setAReservar(null);
            router.push(`/reserva/${reserva.id}`);
          }}
          onCerrar={() => setAReservar(null)}
        />
      ) : null}
    </PantallaBase>
  );
}

function Filtro({
  texto,
  activo,
  onPress,
}: {
  texto: string;
  activo: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      hitSlop={8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      style={[styles.filtro, activo && styles.filtroActivo]}
    >
      <Texto variante="chip" color={activo ? 'textoSobreOscuro' : 'textoSobreClaro'}>
        {texto}
      </Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  plano: { gap: espacio.s, marginTop: espacio.grande },
  cabecera: { gap: espacio.l, marginBottom: espacio.base },
  titulo: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', columnGap: espacio.s },
  controles: { gap: espacio.base },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.l,
    minHeight: 48,
    paddingHorizontal: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  textoBuscador: { flex: 1, paddingVertical: espacio.l },
  presionado: { opacity: 0.85 },
  filtros: { gap: espacio.m, paddingVertical: espacio.xxs },
  filtro: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: espacio.xl,
    borderRadius: radios.pastilla,
    borderWidth: 1,
    borderColor: colores.textoSobreClaro,
  },
  filtroActivo: { backgroundColor: colores.superficie, borderColor: colores.superficie },
  lista: { gap: espacio.grande, marginTop: espacio.grande },
});
