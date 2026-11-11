import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { BannerMarca } from '@/components/home/BannerMarca';
import { TarjetaReserva } from '@/components/home/TarjetaReserva';
import { TarjetaServicio } from '@/components/home/TarjetaServicio';
import { IconoCamara } from '@/components/iconos/Iconos';
import type { Submarca } from '@/components/marca/IconoSubmarca';
import { PantallaBase } from '@/components/navegacion/PantallaBase';
import { FilaServicio } from '@/components/perfil/FilaServicio';
import { Boton, Chip, Tarjeta, Texto } from '@/components/ui';
import { useReservas } from '@/estado/reservas';
import { useSesion } from '@/estado/sesion';
import { useAhora } from '@/hooks/useAhora';
import type { Espacio } from '@/models/espacio';
import type { Reserva } from '@/models/reserva';
import { apiConfigurada } from '@/services/api';
import { abrirEnlace } from '@/services/enlacesExternos';
import { colores, espacio } from '@/theme';
import { lugaresLibres } from '@/utils/disponibilidad';
import { puede } from '@/utils/permisos';
import { estadoReserva, reservaParaMostrar, textoHorario } from '@/utils/reservas';
import { textoSaludo } from '@/utils/saludo';

import { ENLACE_CONOCE_OLEGARIO } from '../../../data/enlaces';
import { serviciosHomeDePrueba } from '../../../data/mock/espacios';

// Home (Figma: HOME). Con servidor, la disponibilidad de los servicios se calcula con los espacios y
// reservas reales de ahora (Etapa 14); sin servidor, son los datos de prueba de Figma.
// Cada servicio abre Espacios filtrado por ese servicio; "Ver todo" lo abre sin filtro.
export default function InicioScreen() {
  const { perfilBasico, tipoAcceso } = useSesion();
  const ahora = useAhora();
  const { reservas, espacios } = useReservas();
  const servicios = useMemo(
    () => (apiConfigurada ? disponibilidadAhora(espacios, reservas, ahora) : serviciosHomeDePrueba),
    [espacios, reservas, ahora],
  );
  const esMiembro = puede(tipoAcceso, 'reservarEspacio');
  const reserva = useMemo(
    () => (esMiembro ? reservaParaMostrar(reservas, ahora) : null),
    [esMiembro, reservas, ahora],
  );

  return (
    <PantallaBase>
      <View style={styles.saludo}>
        <Texto variante="tituloPantalla" accessibilityRole="header">
          {textoSaludo(ahora, perfilBasico?.nombre)}
        </Texto>
        <Texto variante="cuerpo">¿Cómo querés impulsar tu día hoy en Olegario?</Texto>
      </View>

      <BannerMarca />

      <View style={styles.seccion}>
        {reserva ? (
          <>
            <View style={styles.tituloSeccion}>
              <Texto variante="tituloSeccion" accessibilityRole="header">
                Tu reserva actual
              </Texto>
              <Chip texto={estadoReserva(reserva, ahora) === 'enCurso' ? 'En curso' : 'Próxima'} />
            </View>
            <TarjetaReserva
              reserva={reserva}
              estado={estadoReserva(reserva, ahora)}
              horario={textoHorario(reserva, ahora)}
              onVerDetalles={() => router.push(`/reserva/${reserva.id}`)}
              onComoLlegar={() => router.push(`/reserva/${reserva.id}`)}
            />
          </>
        ) : (
          <SinReserva esMiembro={esMiembro} />
        )}
      </View>

      <View style={styles.seccion}>
        <View style={styles.tituloSeccion}>
          <Texto variante="tituloSeccion" accessibilityRole="header">
            Espacios Olegario
          </Texto>
          <Chip
            texto="Ver todo >"
            variante="enlace"
            onPress={() => router.navigate({ pathname: '/espacios', params: { servicio: '' } })}
          />
        </View>
        <View style={styles.servicios}>
          {servicios.map((servicio) => (
            <TarjetaServicio
              key={servicio.submarca}
              submarca={servicio.submarca}
              nombre={servicio.nombre}
              disponibilidad={servicio.disponibilidad}
              onPress={() =>
                router.navigate({ pathname: '/espacios', params: { servicio: servicio.submarca } })
              }
            />
          ))}
        </View>
      </View>

      {/* Recorrido en video (Vercel): discreto, al final; se abre solo si lo tocan. */}
      <View style={styles.conoce}>
        <FilaServicio
          icono={IconoCamara}
          color={colores.acentoLima}
          fondo={colores.fondoIconoLima}
          titulo="Conocé Olegario"
          detalle="Recorrido en video por el coworking"
          onPress={() => abrirEnlace(ENLACE_CONOCE_OLEGARIO)}
        />
      </View>
    </PantallaBase>
  );
}

// Lugares libres por submarca en la próxima media hora (como en Figma: "4 Puestos Libres").
const TARJETAS_HOME: { submarca: Submarca; nombre: string; unidad: [string, string] }[] = [
  { submarca: 'cowork', nombre: 'OLE/COWORK', unidad: ['Puesto Libre', 'Puestos Libres'] },
  { submarca: 'stream', nombre: 'OLE/STREAM', unidad: ['Sala Disponible', 'Salas Disponibles'] },
  { submarca: 'network', nombre: 'OLE/NETWORK', unidad: ['Sala Disponible', 'Salas Disponibles'] },
];

function disponibilidadAhora(espacios: Espacio[], reservas: Reserva[], ahora: Date) {
  const fin = new Date(ahora.getTime() + 30 * 60_000);
  return TARJETAS_HOME.map(({ submarca, nombre, unidad }) => {
    const libres = espacios
      .filter((e) => e.servicio === submarca)
      .reduce((total, e) => total + lugaresLibres(e, ahora, fin, reservas), 0);
    return {
      submarca,
      nombre,
      disponibilidad:
        libres === 0 ? 'Sin lugar ahora' : `${libres} ${unidad[libres === 1 ? 0 : 1]}`,
    };
  });
}

function SinReserva({ esMiembro }: { esMiembro: boolean }) {
  return (
    <Tarjeta style={styles.sinReserva}>
      <Texto variante="tituloTarjeta" color="textoSobreOscuro">
        {esMiembro ? 'Todavía no tenés reservas' : 'Descubrí los espacios de Olegario'}
      </Texto>
      <Texto variante="cuerpoChico" color="textoSecundario">
        {esMiembro
          ? 'Encontrá tu rincón perfecto y reservá tu lugar para hoy.'
          : 'Mirá los espacios, la agenda y las novedades. Para reservar, creá tu cuenta.'}
      </Texto>
      <Boton
        texto={esMiembro ? 'Reservá tu lugar' : 'Ver espacios'}
        onPress={() => router.navigate('/espacios')}
      />
    </Tarjeta>
  );
}

const styles = StyleSheet.create({
  saludo: { gap: espacio.xs, marginBottom: espacio.xl },
  seccion: { gap: espacio.l, marginTop: espacio.grande },
  conoce: { marginTop: espacio.grande },
  tituloSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espacio.xxs,
  },
  servicios: { flexDirection: 'row', gap: espacio.m },
  sinReserva: { gap: espacio.m },
});
