import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PieHospitalidad } from '@/components/acceso/PieHospitalidad';
import {
  IconoAgenda,
  IconoCaja,
  IconoEstrella,
  IconoMasCirculo,
  IconoMensaje,
  IconoRegalo,
  IconoTarjeta,
} from '@/components/iconos/Iconos';
import { Logo } from '@/components/marca/Logo';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { AnilloHoras } from '@/components/perfil/AnilloHoras';
import { FilaServicio } from '@/components/perfil/FilaServicio';
import {
  Avatar,
  Boton,
  Chip,
  EstadoVacio,
  MenuOpciones,
  PanelInferior,
  Texto,
  type OpcionMenu,
} from '@/components/ui';
import { useComunidad } from '@/estado/comunidad';
import { useReservas } from '@/estado/reservas';
import { useSesion } from '@/estado/sesion';
import { useAhora } from '@/hooks/useAhora';
import { elegirFotoPerfil } from '@/services/fotoPerfil';
import { colores, degradados, espacio, radios } from '@/theme';
import { textoHoras } from '@/utils/fechas';
import { puede } from '@/utils/permisos';
import { fechaLarga, porcentajeLibre, textoProximaReserva } from '@/utils/perfil';

import { membresiaDePrueba, paquetesDeHorasDePrueba } from '../../data/mock/membresia';

type Panel = 'horas' | 'plan' | 'planes' | 'eliminar' | null;

// Perfil de cuenta (Figma: PERFIL, captura de la responsable 2026-11-04). Decisiones de la responsable:
// horas extras y pagos SIMULADOS (no se cobra nada), los 6 servicios con pantallas provisorias, y editar
// perfil, cerrar sesión y eliminar cuenta al final.
export default function PerfilScreen() {
  const ahora = useAhora();
  const { fotoPerfil, cambiarFotoPerfil, salir, tipoAcceso, perfilBasico, eliminarCuenta } =
    useSesion();
  const { reservas, horas, cargarHorasExtra } = useReservas();
  const { modo } = useComunidad();
  const [aviso, setAviso] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [cargadas, setCargadas] = useState<number | null>(null);
  const membresia = membresiaDePrueba(ahora);

  async function cambiarFoto(origen: 'galeria' | 'camara') {
    setAviso(null);
    try {
      const resultado = await elegirFotoPerfil(origen);
      if (resultado.estado === 'elegida') await cambiarFotoPerfil(resultado.foto);
      if (resultado.estado === 'sinPermiso') {
        setAviso(
          origen === 'camara'
            ? 'Para sacar una foto, permití el uso de la cámara en los ajustes del teléfono.'
            : 'Para elegir una foto, permití el acceso a tus fotos en los ajustes del teléfono.',
        );
      }
    } catch {
      setAviso('No pudimos cargar la foto. Probá de nuevo.');
    }
  }

  const opciones: OpcionMenu[] = [
    { texto: 'Elegir de la galería', onPress: () => cambiarFoto('galeria') },
    { texto: 'Sacar una foto', onPress: () => cambiarFoto('camara') },
    ...(fotoPerfil
      ? [{ texto: 'Quitar foto', onPress: () => cambiarFotoPerfil(null), destructiva: true }]
      : []),
  ];

  // El invitado no tiene perfil de cuenta (decisión 2026-11-03): se le ofrece crear una.
  if (!puede(tipoAcceso, 'verPerfilCuenta')) {
    return (
      <PantallaSecundaria>
        <EstadoVacio
          titulo="Tu perfil te está esperando"
          texto="Como invitado podés mirar todo e inscribirte a eventos. Para tener tu perfil, reservar espacios y sumarte a la comunidad, creá tu cuenta."
          accion={{ texto: 'Crear mi cuenta', onPress: salir }}
        />
      </PantallaSecundaria>
    );
  }

  const abrirServicio = (id: string) => router.push(`/servicio/${id}`);

  return (
    <PantallaSecundaria conIsotipo={false}>
      <View style={styles.logo}>
        <Logo fondo="sobreClaro" ancho={190} />
      </View>

      <View style={styles.identidad}>
        <Pressable
          onPress={() => setMenuAbierto(true)}
          accessibilityRole="button"
          accessibilityLabel="Cambiar foto"
        >
          <LinearGradient
            colors={degradados.acento.colores}
            locations={degradados.acento.posiciones}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aro}
          >
            <Avatar foto={fotoPerfil} tamano={94} />
          </LinearGradient>
        </Pressable>
        <View style={styles.datos}>
          <Chip texto={modo === 'abierta' ? 'Disponible para colaborar' : 'Modo Foco'} />
          <Texto variante="tituloReencuentro" accessibilityRole="header">
            {perfilBasico?.nombre || 'Tu nombre'}
          </Texto>
          <Texto variante="cuerpoChico">{perfilBasico?.profesion || 'Coworker en Olegario'}</Texto>
        </View>
      </View>
      {aviso ? (
        <Texto variante="cuerpoChico" color="error" accessibilityLiveRegion="polite">
          {aviso}
        </Texto>
      ) : null}

      <Encabezado titulo="Membresía actual" extra="Suscripción al día" />
      <View style={styles.tarjeta}>
        <LinearGradient
          colors={degradados.acento.colores}
          locations={degradados.acento.posiciones}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.linea}
        />
        <View style={styles.filaPlan}>
          <Texto variante="tituloTarjeta" color="textoSobreOscuro">
            {membresia.plan}
          </Texto>
          <View style={styles.activo}>
            <Texto variante="chip" color="textoSobreClaro">
              ACTIVO
            </Texto>
          </View>
        </View>
        <Texto variante="cuerpoChico" color="textoTerciario">
          {membresia.acceso}
        </Texto>
        <View style={styles.vencimiento}>
          <Texto variante="cuerpoChico" color="textoSobreOscuro">
            Vence el {fechaLarga(membresia.vence)}
          </Texto>
          <Texto variante="cuerpoChicoDestacado" color="textoSobreOscuro">
            Renovación automática · Factura {membresia.factura}
          </Texto>
        </View>
        <View style={styles.botones}>
          <Boton texto="Administrar plan" onPress={() => setPanel('plan')} style={styles.flex} />
          <Boton
            texto="Ver planes"
            variante="secundario"
            onPress={() => setPanel('planes')}
            style={styles.botonPlan}
          />
        </View>
      </View>

      <Encabezado titulo="Bolsa de horas mensual" />
      <View style={styles.tarjeta}>
        <View style={styles.filaHoras}>
          <AnilloHoras porcentaje={porcentajeLibre(horas.disponibles, horas.totales)} />
          <View>
            <Texto variante="categoria" color="textoSecundario">
              Balance disponible
            </Texto>
            <View
              style={styles.balance}
              accessible
              accessibilityLabel={`${horas.disponibles} de ${horas.totales} horas disponibles`}
            >
              <Texto variante="display" color="acentoLima">
                {horas.disponibles}
              </Texto>
              <Texto variante="tituloTarjeta" color="textoSobreOscuro">
                / {horas.totales} hs
              </Texto>
            </View>
          </View>
        </View>
        <Boton
          texto="Cargar horas extras"
          variante="secundario"
          icono={<IconoMasCirculo color={colores.acentoLima} />}
          onPress={() => {
            setCargadas(null);
            setPanel('horas');
          }}
          style={styles.botonElevado}
        />
      </View>

      <Encabezado titulo="Gestión y servicios" />
      <View style={styles.servicios}>
        <FilaServicio
          icono={IconoCaja}
          color={colores.acentoNaranja}
          fondo={colores.fondoIconoNaranja}
          titulo="Recepción de Paquetes"
          detalle="Listo para retirar en recepción principal"
          onPress={() => abrirServicio('paquetes')}
        />
        <FilaServicio
          icono={IconoRegalo}
          color={colores.acento}
          fondo={colores.fondoIconoRosa}
          titulo="Beneficios y Descuentos"
          detalle="Cafeterías asociadas y convenios"
          onPress={() => abrirServicio('beneficios')}
        />
        <FilaServicio
          icono={IconoAgenda}
          color={colores.acentoLima}
          fondo={colores.fondoIconoLima}
          titulo="Historial y Próximas Reservas"
          detalle={textoProximaReserva(reservas, ahora)}
          onPress={() => abrirServicio('reservas')}
        />
        <FilaServicio
          icono={IconoEstrella}
          color={colores.textoSobreOscuro}
          fondo={colores.superficieElevada}
          titulo="Valoraciones de la Experiencia"
          detalle="Calificá espacios y compartí opiniones"
          onPress={() => abrirServicio('valoraciones')}
        />
        <FilaServicio
          icono={IconoMensaje}
          color={colores.textoSobreOscuro}
          fondo={colores.superficieElevada}
          titulo="Libro de Quejas y Sugerencias"
          detalle="Canal directo con el equipo"
          onPress={() => abrirServicio('quejas')}
        />
        <FilaServicio
          icono={IconoTarjeta}
          color={colores.textoSobreOscuro}
          fondo={colores.superficieElevada}
          titulo="Métodos de Pago y Facturación"
          detalle={`${membresia.tarjeta.marca} terminada en •••• ${membresia.tarjeta.ultimos}`}
          onPress={() => abrirServicio('pagos')}
        />
      </View>

      <View style={styles.cuenta}>
        <Boton
          texto="Editar perfil"
          variante="contorno"
          onPress={() => router.push('/editar-perfil')}
        />
        <Boton texto="Cerrar sesión" variante="secundario" onPress={salir} />
        <Pressable
          onPress={() => setPanel('eliminar')}
          accessibilityRole="button"
          hitSlop={8}
          style={styles.eliminar}
        >
          <Texto variante="enlaceChico" color="error">
            Eliminar cuenta
          </Texto>
        </Pressable>
      </View>

      <PieHospitalidad />

      <MenuOpciones
        visible={menuAbierto}
        titulo="Foto de perfil"
        opciones={opciones}
        onCerrar={() => setMenuAbierto(false)}
      />

      {panel === 'horas' ? (
        <PanelInferior visible titulo="Cargar horas extras" onCerrar={() => setPanel(null)}>
          <Texto variante="cuerpoChico" color="acentoLima">
            Simulación: todavía no hay pagos, no se cobra nada.
          </Texto>
          {cargadas ? (
            <>
              <Texto variante="cuerpo" color="textoSobreOscuro" accessibilityLiveRegion="polite">
                ¡Listo! Sumaste {textoHoras(cargadas)} a tu plan. Ahora tenés{' '}
                {textoHoras(horas.disponibles)} disponibles.
              </Texto>
              <Boton texto="Cerrar" variante="secundario" onPress={() => setPanel(null)} />
            </>
          ) : (
            <>
              {paquetesDeHorasDePrueba.map((cantidad) => (
                <Boton
                  key={cantidad}
                  texto={`Sumar ${textoHoras(cantidad)}`}
                  variante="secundario"
                  onPress={async () => {
                    await cargarHorasExtra(cantidad);
                    setCargadas(cantidad);
                  }}
                  style={styles.botonElevado}
                />
              ))}
              <Boton texto="Cancelar" variante="secundario" onPress={() => setPanel(null)} />
            </>
          )}
        </PanelInferior>
      ) : null}

      {panel === 'plan' ? (
        <PanelInferior visible titulo={membresia.plan} onCerrar={() => setPanel(null)}>
          <Dato etiqueta="Acceso" valor={membresia.acceso} />
          <Dato etiqueta="Horas del plan" valor={`${horas.totales} hs por mes`} />
          <Dato etiqueta="Vencimiento" valor={fechaLarga(membresia.vence)} />
          <Dato etiqueta="Renovación" valor="Automática" />
          <Dato etiqueta="Última factura" valor={membresia.factura} />
          <Texto variante="cuerpoChico" color="textoTerciario">
            Los cambios de plan llegan con los pagos reales.
          </Texto>
          <Boton texto="Cerrar" variante="secundario" onPress={() => setPanel(null)} />
        </PanelInferior>
      ) : null}

      {panel === 'planes' ? (
        <PanelInferior visible titulo="Planes de Olegario" onCerrar={() => setPanel(null)}>
          <Texto variante="cuerpo" color="textoSecundario">
            Pronto vas a poder ver y comparar los planes desde la app, cuando estén los pagos
            reales.
          </Texto>
          <Boton texto="Cerrar" variante="secundario" onPress={() => setPanel(null)} />
        </PanelInferior>
      ) : null}

      {panel === 'eliminar' ? (
        <PanelInferior visible titulo="¿Eliminar tu cuenta?" onCerrar={() => setPanel(null)}>
          <Texto variante="cuerpo" color="textoSecundario">
            Se borran tu perfil, tu foto, tus reservas, inscripciones y publicaciones guardadas en
            este teléfono. No se puede deshacer.
          </Texto>
          <Boton
            texto="Sí, eliminar mi cuenta"
            variante="contorno"
            onPress={async () => {
              setPanel(null);
              await eliminarCuenta();
            }}
          />
          <Boton texto="No, volver" variante="secundario" onPress={() => setPanel(null)} />
        </PanelInferior>
      ) : null}
    </PantallaSecundaria>
  );
}

function Encabezado({ titulo, extra }: { titulo: string; extra?: string }) {
  return (
    <View style={styles.encabezado}>
      <Texto variante="categoria" accessibilityRole="header">
        {titulo}
      </Texto>
      {extra ? (
        <View style={styles.extra}>
          <View style={styles.punto} />
          <Texto variante="meta">{extra}</Texto>
        </View>
      ) : null}
    </View>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.dato}>
      <Texto variante="cuerpoChico" color="textoTerciario">
        {etiqueta}
      </Texto>
      <Texto variante="cuerpoChicoDestacado" color="textoSobreOscuro">
        {valor}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { marginTop: espacio.base, marginBottom: espacio.grande },
  identidad: { flexDirection: 'row', alignItems: 'center', gap: espacio.base },
  aro: { padding: 3, borderRadius: radios.pastilla },
  datos: { flex: 1, gap: espacio.xs },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: espacio.grande,
    marginBottom: espacio.m,
  },
  extra: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs },
  punto: {
    width: 5,
    height: 5,
    borderRadius: radios.pastilla,
    backgroundColor: colores.textoSobreClaro,
  },
  tarjeta: {
    gap: espacio.l,
    padding: espacio.base,
    borderRadius: radios.xxl,
    overflow: 'hidden',
    backgroundColor: colores.superficie,
  },
  linea: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  filaPlan: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  activo: {
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.xxs,
    borderRadius: radios.pastilla,
    backgroundColor: colores.acentoLima,
  },
  vencimiento: {
    gap: espacio.xs,
    padding: espacio.l,
    borderRadius: radios.lg,
    backgroundColor: colores.superficieElevada,
  },
  botones: { flexDirection: 'row', gap: espacio.m },
  flex: { flex: 1 },
  botonElevado: { backgroundColor: colores.superficieElevada },
  botonPlan: { flex: 1, backgroundColor: colores.superficieElevada },
  filaHoras: { flexDirection: 'row', alignItems: 'center', gap: espacio.grande },
  balance: { flexDirection: 'row', alignItems: 'baseline', gap: espacio.xs },
  servicios: { gap: espacio.m },
  cuenta: { gap: espacio.m, marginTop: espacio.grande },
  eliminar: { alignSelf: 'center', paddingVertical: espacio.s },
  dato: { flexDirection: 'row', justifyContent: 'space-between', gap: espacio.m },
});
