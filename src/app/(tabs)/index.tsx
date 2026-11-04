import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { BannerMarca } from '@/components/home/BannerMarca';
import { TarjetaReserva } from '@/components/home/TarjetaReserva';
import { TarjetaServicio } from '@/components/home/TarjetaServicio';
import { PantallaBase } from '@/components/navegacion/PantallaBase';
import { Boton, Chip, Tarjeta, Texto } from '@/components/ui';
import { useReservas } from '@/estado/reservas';
import { useSesion } from '@/estado/sesion';
import { useAhora } from '@/hooks/useAhora';
import { espacio } from '@/theme';
import { puede } from '@/utils/permisos';
import { estadoReserva, reservaParaMostrar, textoHorario } from '@/utils/reservas';
import { textoSaludo } from '@/utils/saludo';

import { serviciosHomeDePrueba } from '../../../data/mock/espacios';

// Home (Figma: HOME). La disponibilidad de los servicios es dato de prueba hasta el servidor (Etapa 13).
// Cada servicio abre Espacios filtrado por ese servicio; "Ver todo" lo abre sin filtro.
export default function InicioScreen() {
  const { perfilBasico, tipoAcceso } = useSesion();
  const ahora = useAhora();
  const { reservas } = useReservas();
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
          {serviciosHomeDePrueba.map((servicio) => (
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
    </PantallaBase>
  );
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
  tituloSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espacio.xxs,
  },
  servicios: { flexDirection: 'row', gap: espacio.m },
  sinReserva: { gap: espacio.m },
});
