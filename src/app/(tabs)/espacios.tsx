import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BarraHorario } from '@/components/espacios/BarraHorario';
import { ConfirmarReserva } from '@/components/espacios/ConfirmarReserva';
import { SelectorHorario } from '@/components/espacios/SelectorHorario';
import { SelectorSemana } from '@/components/espacios/SelectorSemana';
import { TarjetaEspacio } from '@/components/espacios/TarjetaEspacio';
import { IconoCamara } from '@/components/iconos/Iconos';
import type { Submarca } from '@/components/marca/IconoSubmarca';
import { PantallaBase } from '@/components/navegacion/PantallaBase';
import { Chip, EstadoVacio, Texto } from '@/components/ui';
import { useReservas } from '@/estado/reservas';
import { useSesion } from '@/estado/sesion';
import { useAhora } from '@/hooks/useAhora';
import type { Espacio } from '@/models/espacio';
import { colores, espacio, radios, tipografia } from '@/theme';
import { estadoEspacio, lugaresLibres } from '@/utils/disponibilidad';
import {
  ajustarHorario,
  diasVisibles,
  duracionHoras,
  inicioDelDia,
  proximoPaso,
  sumarMinutos,
  textoHoras,
  textoHorarioElegido,
} from '@/utils/fechas';
import { NOMBRE_SERVICIO, SERVICIOS, esServicio, filtrarEspacios } from '@/utils/espacios';
import { puede } from '@/utils/permisos';

const DURACION_INICIAL_MINUTOS = 120;

// Espacios (Figma: ESPACIOS). Reglas de reserva de la responsable (2026-11-04): horario libre las 24 hs
// en pasos de 30 min, hasta 3 días de anticipación y toda reserva descuenta horas del plan.
// Desde el Home se abre filtrado por servicio (?servicio=cowork).
export default function EspaciosScreen() {
  const ahora = useAhora();
  const { tipoAcceso, salir } = useSesion();
  const { espacios, reservas, horas, reservar } = useReservas();
  const parametros = useLocalSearchParams<{ servicio?: string }>();
  const servicio = esServicio(parametros.servicio) ? parametros.servicio : null;
  const puedeReservar = puede(tipoAcceso, 'reservarEspacio');

  const [busqueda, setBusqueda] = useState('');
  const [horario, setHorario] = useState(() => {
    const inicio = proximoPaso(ahora);
    return ajustarHorario(inicio, inicio, sumarMinutos(inicio, DURACION_INICIAL_MINUTOS), ahora);
  });
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [aReservar, setAReservar] = useState<Espacio | null>(null);

  const dia = inicioDelDia(horario.inicio);
  const textoHorario = textoHorarioElegido(horario.inicio, horario.fin, ahora);
  const horasReserva = duracionHoras(horario.inicio, horario.fin);

  const visibles = useMemo(
    () => filtrarEspacios(espacios, servicio, busqueda),
    [espacios, servicio, busqueda],
  );
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
        <Texto variante="tituloDestacado" accessibilityRole="header">
          Tu rincón{' '}
          <Texto variante="tituloDestacado" color="acentoNaranja">
            perfecto
          </Texto>
        </Texto>
      </View>

      <View style={styles.controles}>
        <SelectorSemana
          dias={diasVisibles(ahora)}
          seleccionado={dia}
          ahora={ahora}
          onElegir={elegirDia}
        />

        <View style={styles.buscador}>
          <IconoCamara color={colores.textoTerciario} />
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscá tu mesa en tiempo real"
            placeholderTextColor={colores.textoTerciario}
            accessibilityLabel="Buscar espacios"
            returnKeyType="search"
            style={styles.textoBuscador}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}
        >
          <Filtro texto="Todos" activo={!servicio} onPress={() => filtrar(null)} />
          {SERVICIOS.map((s) => (
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
            titulo="No encontramos espacios"
            texto={
              busqueda
                ? 'Probá con otra búsqueda o elegí otro servicio.'
                : `Todavía no hay espacios de ${servicio ? NOMBRE_SERVICIO[servicio] : 'Olegario'} para reservar.`
            }
            accion={{
              texto: 'Ver todos los espacios',
              onPress: () => {
                setBusqueda('');
                filtrar(null);
              },
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
  cabecera: { gap: espacio.l, marginBottom: espacio.base },
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
  textoBuscador: {
    flex: 1,
    ...tipografia.input,
    color: colores.textoSobreOscuro,
    paddingVertical: espacio.l,
  },
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
