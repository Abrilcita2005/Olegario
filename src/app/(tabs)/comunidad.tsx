import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PanelSolicitud } from '@/components/comunidad/PanelSolicitud';
import { TarjetaProyecto } from '@/components/comunidad/TarjetaProyecto';
import { TarjetaTalento } from '@/components/comunidad/TarjetaTalento';
import { TarjetaTaller } from '@/components/comunidad/TarjetaTaller';
import { IconoAuriculares, IconoMasCirculo, IconoRayo } from '@/components/iconos/Iconos';
import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { PantallaBase } from '@/components/navegacion/PantallaBase';
import { Boton, EstadoVacio, PanelInferior, Texto } from '@/components/ui';
import { useComunidad } from '@/estado/comunidad';
import { useReservas } from '@/estado/reservas';
import { useSesion } from '@/estado/sesion';
import { useAhora } from '@/hooks/useAhora';
import type { ModoComunidad, Persona, Publicacion, TipoPublicacion } from '@/models/comunidad';
import { colores, degradados, espacio, radios } from '@/theme';
import { NOMBRE_SERVICIO } from '@/utils/espacios';
import { puede } from '@/utils/permisos';
import { estadoReserva } from '@/utils/reservas';

type Filtro = 'todos' | TipoPublicacion;
type Solicitud = { id: string; titulo: string; destinatario: string };

const FILTROS: { valor: Filtro; texto: string; punto?: 'acento' | 'acentoNaranja' }[] = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'colaborador', texto: 'Buscan colaborador', punto: 'acento' },
  { valor: 'iniciativa', texto: 'Iniciativas', punto: 'acentoNaranja' },
];

// Comunidad (Figma: COMUNIDAD). Decisiones de la responsable (2026-11-04): contactar, postularse y
// sumarse envían una solicitud simulada; publicar abre un formulario provisorio; Modo Foco oculta a la
// persona de las listas y su ubicación; el perfil público es un diseño provisorio.
export default function ComunidadScreen() {
  const ahora = useAhora();
  const { tipoAcceso, perfilBasico, fotoPerfil, salir } = useSesion();
  const { reservas } = useReservas();
  const {
    modo,
    cambiarModo,
    personas,
    publicaciones,
    talleres,
    solicitudEnviada,
    enviarSolicitud,
    eliminarPublicacion,
  } = useComunidad();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [detalle, setDetalle] = useState<Publicacion | null>(null);

  // El invitado no usa Comunidad (D-34).
  if (!puede(tipoAcceso, 'usarComunidad')) {
    return (
      <PantallaBase>
        <EstadoVacio
          titulo="Sumate a la comunidad"
          texto="Como invitado podés mirar la agenda e inscribirte a eventos. Para conectar con otros coworkers, publicar proyectos y sumarte a talleres, creá tu cuenta."
          accion={{ texto: 'Crear mi cuenta', onPress: salir }}
        />
      </PantallaBase>
    );
  }

  const visibles = publicaciones.filter((p) => filtro === 'todos' || p.tipo === filtro);
  const reservaEnCurso = reservas.find((r) => estadoReserva(r, ahora) === 'enCurso');
  const vos: Persona | null =
    modo === 'abierta' && perfilBasico
      ? {
          id: 'vos',
          nombre: perfilBasico.nombre,
          profesion: perfilBasico.profesion,
          ofrezco: perfilBasico.ofrezco,
          busco: perfilBasico.busco,
          foto: fotoPerfil ? { uri: fotoPerfil } : undefined,
          ubicacion: reservaEnCurso
            ? `${NOMBRE_SERVICIO[reservaEnCurso.servicio]} · ${reservaEnCurso.espacio}`
            : undefined,
          disponible: true,
        }
      : null;
  const talentos = personas.filter((p) => p.disponible);
  const verPersona = (id: string) => router.push(`/persona/${id}`);

  return (
    <PantallaBase>
      <ModoActivo modo={modo} onCambiar={cambiarModo} />

      <View style={styles.marca}>
        <IconoSubmarca submarca="network" tamano={28} />
        <Texto variante="categoria">OLE/NETWORK • Comunidad</Texto>
      </View>
      <View accessible accessibilityRole="header" accessibilityLabel="Colaborá, sumate, conectá">
        <Texto variante="tituloAcceso" style={styles.mayusculas}>
          Colaborá, sumate,
        </Texto>
        <Texto variante="tituloAcceso" color="naranjaTitulo">
          CONECTÁ
        </Texto>
      </View>
      <Texto variante="cuerpo" style={styles.bajada}>
        Proyectos que buscan tu talento, iniciativas de la comunidad y sinergias en Olegario.
      </Texto>
      <Boton
        texto="Publicar proyecto o búsqueda"
        icono={<IconoMasCirculo color={colores.textoBoton} />}
        onPress={() => router.push('/publicar')}
      />

      <Texto variante="tituloSeccion" style={styles.tituloFiltros} accessibilityRole="header">
        Filtrar oportunidades
      </Texto>
      <View style={styles.filtros}>
        {FILTROS.map((f) => (
          <ChipFiltro
            key={f.valor}
            texto={f.texto}
            punto={f.punto}
            activo={filtro === f.valor}
            onPress={() => setFiltro(f.valor)}
          />
        ))}
      </View>

      <Seccion
        antetitulo={`${visibles.length} ${visibles.length === 1 ? 'Convocatoria activa' : 'Convocatorias activas'}`}
        titulo="Proyectos & oportunidades"
      />
      <View style={styles.lista}>
        {visibles.map((p) => (
          <TarjetaProyecto
            key={p.id}
            publicacion={p}
            enviada={solicitudEnviada(p.id)}
            onAccion={() =>
              setSolicitud({ id: p.id, titulo: p.accion, destinatario: p.autores[0].nombre })
            }
            onVerPersona={verPersona}
            onVerDetalle={() => setDetalle(p)}
            onEliminar={p.esPropia ? () => eliminarPublicacion(p.id) : undefined}
          />
        ))}
      </View>

      <Seccion antetitulo="Coworkers en línea" titulo="Talentos disponibles" />
      <View style={styles.lista}>
        {vos ? <TarjetaTalento persona={vos} esVos /> : null}
        {talentos.map((t) => (
          <TarjetaTalento
            key={t.id}
            persona={t}
            enviada={solicitudEnviada(t.id)}
            onVerPerfil={() => verPersona(t.id)}
            onContactar={() =>
              setSolicitud({ id: t.id, titulo: 'Contactar', destinatario: t.nombre })
            }
          />
        ))}
      </View>

      <Seccion antetitulo="Iniciativas de la comunidad" titulo="Talleres entre pares" />
      <View style={styles.lista}>
        {talleres.map((t) => (
          <TarjetaTaller
            key={t.id}
            taller={t}
            enviada={solicitudEnviada(t.id)}
            onSumarse={() =>
              setSolicitud({ id: t.id, titulo: t.titulo, destinatario: 'quienes organizan' })
            }
          />
        ))}
      </View>

      {solicitud ? (
        <PanelSolicitud
          titulo={solicitud.titulo}
          destinatario={solicitud.destinatario}
          onEnviar={(mensaje) => enviarSolicitud(solicitud.id, mensaje)}
          onCerrar={() => setSolicitud(null)}
        />
      ) : null}

      {detalle ? (
        <PanelInferior visible titulo={detalle.titulo} onCerrar={() => setDetalle(null)}>
          <Texto variante="cuerpo" color="textoSecundario">
            {detalle.descripcion}
          </Texto>
          {detalle.busca ? (
            <Texto variante="cuerpoChicoDestacado" color="acentoNaranja">
              Busca: {detalle.busca}
            </Texto>
          ) : null}
          {detalle.etiquetas.length > 0 ? (
            <Texto variante="cuerpoChico" color="textoTerciario">
              {detalle.etiquetas.join(' · ')}
            </Texto>
          ) : null}
          {detalle.autores
            .filter((a) => a.personaId)
            .map((a) => (
              <Boton
                key={a.nombre}
                texto={`Ver perfil de ${a.nombre}`}
                variante="contorno"
                onPress={() => {
                  setDetalle(null);
                  verPersona(a.personaId!);
                }}
              />
            ))}
          <Boton texto="Cerrar" variante="secundario" onPress={() => setDetalle(null)} />
        </PanelInferior>
      ) : null}
    </PantallaBase>
  );
}

function ModoActivo({
  modo,
  onCambiar,
}: {
  modo: ModoComunidad;
  onCambiar: (modo: ModoComunidad) => void;
}) {
  return (
    <View style={styles.modo}>
      <View style={styles.filaModo}>
        <View style={styles.puntoLima} />
        <Texto variante="categoria" color="acentoLima">
          Modo activo
        </Texto>
      </View>
      <View style={styles.selector} accessibilityRole="radiogroup" accessibilityLabel="Modo activo">
        <OpcionModo
          texto="Conexión Abierta"
          icono={IconoRayo}
          activo={modo === 'abierta'}
          onPress={() => onCambiar('abierta')}
        />
        <OpcionModo
          texto="Modo Foco"
          icono={IconoAuriculares}
          activo={modo === 'foco'}
          onPress={() => onCambiar('foco')}
        />
      </View>
      <Texto variante="meta" color="textoTerciario" style={styles.ayudaModo}>
        {modo === 'abierta'
          ? 'Visible para matches y charlas'
          : 'No aparecés en las listas ni se muestra dónde estás'}
      </Texto>
    </View>
  );
}

function OpcionModo({
  texto,
  icono: Icono,
  activo,
  onPress,
}: {
  texto: string;
  icono: typeof IconoRayo;
  activo: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      hitSlop={8}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={texto}
      accessibilityState={{ checked: activo }}
      style={styles.opcionModo}
    >
      {activo ? (
        <LinearGradient
          colors={degradados.accion.colores}
          locations={degradados.accion.posiciones}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[StyleSheet.absoluteFill, styles.fondoOpcion]}
        />
      ) : null}
      <View style={styles.contenidoOpcion}>
        <Icono color={activo ? colores.textoSobreOscuro : colores.textoTerciario} />
        <Texto variante="botonSecundario" color={activo ? 'textoSobreOscuro' : 'textoTerciario'}>
          {texto}
        </Texto>
      </View>
    </Pressable>
  );
}

function ChipFiltro({
  texto,
  activo,
  punto,
  onPress,
}: {
  texto: string;
  activo: boolean;
  punto?: 'acento' | 'acentoNaranja';
  onPress: () => void;
}) {
  return (
    <Pressable
      hitSlop={8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      style={[styles.chip, !activo && styles.chipInactivo]}
    >
      {activo ? (
        <LinearGradient
          colors={degradados.accion.colores}
          locations={degradados.accion.posiciones}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[StyleSheet.absoluteFill, styles.fondoChip]}
        />
      ) : null}
      {punto && !activo ? (
        <View style={[styles.punto, { backgroundColor: colores[punto] }]} />
      ) : null}
      <Texto variante="chip" color="textoSobreOscuro">
        {texto}
      </Texto>
    </Pressable>
  );
}

function Seccion({ antetitulo, titulo }: { antetitulo: string; titulo: string }) {
  return (
    <View style={styles.seccion}>
      <Texto variante="meta" color="acento">
        {antetitulo}
      </Texto>
      <Texto variante="tituloSeccion" accessibilityRole="header">
        {titulo}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  modo: {
    gap: espacio.m,
    padding: espacio.l,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  filaModo: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  puntoLima: {
    width: 8,
    height: 8,
    borderRadius: radios.pastilla,
    backgroundColor: colores.acentoLima,
  },
  selector: {
    flexDirection: 'row',
    padding: espacio.xs,
    borderRadius: radios.lg,
    backgroundColor: colores.superficieElevada,
  },
  opcionModo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.s,
    minHeight: 40,
    borderRadius: radios.md,
  },
  fondoOpcion: { borderRadius: radios.md },
  contenidoOpcion: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  ayudaModo: { textAlign: 'right' },
  marca: { flexDirection: 'row', alignItems: 'center', gap: espacio.m, marginTop: espacio.grande },
  mayusculas: { textTransform: 'uppercase', marginTop: espacio.l },
  bajada: { marginVertical: espacio.l },
  tituloFiltros: { marginTop: espacio.grande, marginBottom: espacio.m },
  filtros: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.m },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
    height: 32,
    paddingHorizontal: espacio.xl,
    borderRadius: radios.pastilla,
  },
  fondoChip: { borderRadius: radios.pastilla },
  chipInactivo: { backgroundColor: colores.superficie },
  punto: { width: 6, height: 6, borderRadius: radios.pastilla },
  seccion: { marginTop: espacio.grande * 1.5, marginBottom: espacio.l },
  lista: { gap: espacio.base },
});
