import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { IconoEstrella } from '@/components/iconos/Iconos';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton, Chip, EstadoVacio, SelectorSegmentado, Tarjeta, Texto } from '@/components/ui';
import { useReservas } from '@/estado/reservas';
import { useAhora } from '@/hooks/useAhora';
import {
  guardarOpiniones,
  leerOpiniones,
  type MensajeEquipo,
  type Opiniones,
} from '@/services/almacenamiento';
import { colores, espacio, radios, tipografia } from '@/theme';
import { estadoReserva, textoHorario } from '@/utils/reservas';

import {
  beneficiosDePrueba,
  membresiaDePrueba,
  paquetesDePrueba,
} from '../../../data/mock/membresia';

// Servicios del Perfil (Figma: PERFIL, "GESTIÓN Y SERVICIOS"). PROVISORIOS: no hay diseño de estas
// pantallas (decisión de la responsable, 2026-11-04). Paquetes, beneficios y pago son datos de prueba;
// valoraciones y mensajes se guardan en el teléfono y no se envían a nadie hasta el servidor.

const TITULOS: Record<string, string> = {
  paquetes: 'Recepción de paquetes',
  beneficios: 'Beneficios y descuentos',
  reservas: 'Historial y próximas reservas',
  valoraciones: 'Valoraciones de la experiencia',
  quejas: 'Libro de quejas y sugerencias',
  pagos: 'Métodos de pago y facturación',
};

export default function ServicioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const titulo = TITULOS[id];

  return (
    <PantallaSecundaria>
      {titulo ? (
        <View style={styles.contenido}>
          <Texto variante="tituloAcceso" accessibilityRole="header">
            {titulo}
          </Texto>
          {id === 'paquetes' ? <Paquetes /> : null}
          {id === 'beneficios' ? <Beneficios /> : null}
          {id === 'reservas' ? <Historial /> : null}
          {id === 'valoraciones' ? <Valoraciones /> : null}
          {id === 'quejas' ? <Quejas /> : null}
          {id === 'pagos' ? <Pagos /> : null}
        </View>
      ) : (
        <PantallaEnConstruccion titulo="Servicio no encontrado" etapa="sin datos" />
      )}
    </PantallaSecundaria>
  );
}

function Paquetes() {
  return (
    <>
      {paquetesDePrueba.map((p) => (
        <Tarjeta key={p.id} style={styles.tarjeta}>
          <Texto variante="tituloTarjeta" color="textoSobreOscuro">
            {p.descripcion}
          </Texto>
          <Texto variante="cuerpoChico" color="acentoLima">
            {p.estado}
          </Texto>
        </Tarjeta>
      ))}
    </>
  );
}

function Beneficios() {
  return (
    <>
      {beneficiosDePrueba.map((b) => (
        <Tarjeta key={b.id} style={styles.tarjeta}>
          <Chip texto={b.lugar} variante="destacado" />
          <Texto variante="tituloTarjeta" color="textoSobreOscuro">
            {b.titulo}
          </Texto>
          <Texto variante="cuerpoChico" color="textoSecundario">
            {b.detalle}
          </Texto>
          <Boton
            texto="Ver la carta"
            variante="contorno"
            onPress={() => router.push('/carta-cafe')}
          />
        </Tarjeta>
      ))}
    </>
  );
}

function Historial() {
  const ahora = useAhora();
  const { reservas } = useReservas();
  const proximas = reservas.filter((r) => estadoReserva(r, ahora) !== 'finalizada');
  const pasadas = reservas.filter((r) => estadoReserva(r, ahora) === 'finalizada').reverse();

  if (reservas.length === 0) {
    return (
      <EstadoVacio
        titulo="Todavía no tenés reservas"
        texto="Cuando reserves un espacio, lo vas a ver acá."
        accion={{ texto: 'Reservá tu lugar', onPress: () => router.navigate('/espacios') }}
      />
    );
  }

  const fila = (r: (typeof reservas)[number]) => (
    <Pressable
      key={r.id}
      onPress={() => router.push(`/reserva/${r.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${r.espacio}, ${textoHorario(r, ahora)}`}
    >
      <Tarjeta style={styles.tarjeta}>
        <Texto variante="tituloTarjeta" color="textoSobreOscuro">
          {r.espacio}
        </Texto>
        <Texto variante="cuerpoChico" color="textoSecundario">
          {textoHorario(r, ahora)}
        </Texto>
      </Tarjeta>
    </Pressable>
  );

  return (
    <>
      <Texto variante="tituloSeccion">Próximas</Texto>
      {proximas.length > 0 ? (
        proximas.map(fila)
      ) : (
        <Texto variante="cuerpoChico">No tenés reservas próximas.</Texto>
      )}
      {pasadas.length > 0 ? (
        <>
          <Texto variante="tituloSeccion">Historial</Texto>
          {pasadas.map(fila)}
        </>
      ) : null}
    </>
  );
}

function useOpiniones() {
  const [opiniones, setOpiniones] = useState<Opiniones>({ valoraciones: [], mensajes: [] });
  useEffect(() => {
    leerOpiniones()
      .then(setOpiniones)
      .catch(() => {});
  }, []);
  const guardar = async (siguientes: Opiniones) => {
    setOpiniones(siguientes);
    await guardarOpiniones(siguientes);
  };
  return { opiniones, guardar };
}

function Valoraciones() {
  const { espacios } = useReservas();
  const { opiniones, guardar } = useOpiniones();
  const [espacioId, setEspacioId] = useState(espacios[0]?.id ?? '');
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviada, setEnviada] = useState(false);

  if (enviada) {
    return (
      <EstadoVacio
        titulo="¡Gracias por tu valoración!"
        texto="La guardamos para el equipo de Olegario."
        accion={{ texto: 'Valorar otro espacio', onPress: () => setEnviada(false) }}
      />
    );
  }

  return (
    <>
      <Texto variante="cuerpo">¿Qué espacio querés valorar?</Texto>
      <View style={styles.opciones}>
        {espacios.map((e) => (
          <Pressable
            key={e.id}
            onPress={() => setEspacioId(e.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: espacioId === e.id }}
            style={[styles.opcion, espacioId === e.id && styles.opcionActiva]}
          >
            <Texto
              variante="chip"
              color={espacioId === e.id ? 'textoSobreOscuro' : 'textoSobreClaro'}
            >
              {e.nombre}
            </Texto>
          </Pressable>
        ))}
      </View>
      <View style={styles.estrellas} accessibilityRole="radiogroup" accessibilityLabel="Puntaje">
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            onPress={() => setEstrellas(n)}
            accessibilityRole="radio"
            accessibilityLabel={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
            accessibilityState={{ checked: estrellas === n }}
            hitSlop={6}
          >
            <IconoEstrella
              tamano={32}
              color={colores.acentoNaranja}
              relleno={n <= estrellas ? colores.acentoNaranja : undefined}
            />
          </Pressable>
        ))}
      </View>
      <TextInput
        value={comentario}
        onChangeText={setComentario}
        multiline
        maxLength={300}
        placeholder="Contanos tu experiencia (opcional)"
        placeholderTextColor={colores.textoTerciario}
        accessibilityLabel="Comentario"
        style={styles.texto}
      />
      <Boton
        texto="Enviar valoración"
        deshabilitado={estrellas === 0 || !espacioId}
        onPress={async () => {
          await guardar({
            ...opiniones,
            valoraciones: [
              ...opiniones.valoraciones,
              {
                id: `valoracion-${Date.now()}`,
                espacioId,
                estrellas,
                comentario: comentario.trim(),
                fecha: new Date().toISOString(),
              },
            ],
          });
          setEstrellas(0);
          setComentario('');
          setEnviada(true);
        }}
      />
      {opiniones.valoraciones.length > 0 ? (
        <Texto variante="cuerpoChico">
          Ya enviaste {opiniones.valoraciones.length}{' '}
          {opiniones.valoraciones.length === 1 ? 'valoración' : 'valoraciones'}.
        </Texto>
      ) : null}
    </>
  );
}

const TIPOS = [
  { valor: 'sugerencia', etiqueta: 'Sugerencia' },
  { valor: 'queja', etiqueta: 'Queja' },
] as const;

function Quejas() {
  const { opiniones, guardar } = useOpiniones();
  const [tipo, setTipo] = useState<MensajeEquipo['tipo']>('sugerencia');
  const [texto, setTexto] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  if (enviado) {
    return (
      <EstadoVacio
        titulo="¡Recibimos tu mensaje!"
        texto="Lo guardamos para el equipo de Olegario. Gracias por ayudarnos a mejorar."
        accion={{ texto: 'Escribir otro', onPress: () => setEnviado(false) }}
      />
    );
  }

  return (
    <>
      <Texto variante="cuerpo">Un canal directo con el equipo de Olegario.</Texto>
      <SelectorSegmentado
        opciones={TIPOS}
        seleccionado={tipo}
        onCambiar={setTipo}
        etiquetaAccesible="Tipo de mensaje"
      />
      <TextInput
        value={texto}
        onChangeText={setTexto}
        multiline
        maxLength={600}
        placeholder="Contanos qué pasó o qué te gustaría mejorar"
        placeholderTextColor={colores.textoTerciario}
        accessibilityLabel="Mensaje para el equipo"
        style={styles.texto}
      />
      {error ? (
        <Texto variante="cuerpoChico" color="error" accessibilityRole="alert">
          {error}
        </Texto>
      ) : null}
      <Boton
        texto="Enviar"
        onPress={async () => {
          if (texto.trim().length < 10) {
            setError('Escribí al menos 10 caracteres.');
            return;
          }
          setError(null);
          await guardar({
            ...opiniones,
            mensajes: [
              ...opiniones.mensajes,
              {
                id: `mensaje-${Date.now()}`,
                tipo,
                texto: texto.trim(),
                fecha: new Date().toISOString(),
              },
            ],
          });
          setTexto('');
          setEnviado(true);
        }}
      />
    </>
  );
}

function Pagos() {
  const ahora = useAhora();
  const membresia = membresiaDePrueba(ahora);
  const [aviso, setAviso] = useState(false);
  return (
    <>
      <Tarjeta style={styles.tarjeta}>
        <Texto variante="categoria" color="textoTerciario">
          Medio de pago
        </Texto>
        <Texto variante="tituloTarjeta" color="textoSobreOscuro">
          {membresia.tarjeta.marca} terminada en •••• {membresia.tarjeta.ultimos}
        </Texto>
      </Tarjeta>
      <Tarjeta style={styles.tarjeta}>
        <Texto variante="categoria" color="textoTerciario">
          Última factura
        </Texto>
        <Texto variante="tituloTarjeta" color="textoSobreOscuro">
          Factura {membresia.factura}
        </Texto>
        <Texto variante="cuerpoChico" color="textoSecundario">
          {membresia.plan} · Renovación automática
        </Texto>
      </Tarjeta>
      <Boton texto="Agregar medio de pago" variante="secundario" onPress={() => setAviso(true)} />
      {aviso ? (
        <Texto variante="cuerpoChico" accessibilityLiveRegion="polite">
          Simulación: todavía no hay pagos reales. Por seguridad, la app nunca guarda datos de
          tarjetas.
        </Texto>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
  tarjeta: { gap: espacio.s },
  opciones: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.m },
  opcion: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: espacio.xl,
    borderRadius: radios.pastilla,
    borderWidth: 1,
    borderColor: colores.textoSobreClaro,
  },
  opcionActiva: { backgroundColor: colores.superficie, borderColor: colores.superficie },
  estrellas: { flexDirection: 'row', gap: espacio.l, justifyContent: 'center' },
  texto: {
    ...tipografia.input,
    minHeight: 110,
    padding: espacio.l,
    textAlignVertical: 'top',
    color: colores.textoSobreOscuro,
    borderRadius: radios.lg,
    backgroundColor: colores.superficie,
  },
});
