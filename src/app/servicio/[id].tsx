import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { IconoEstrella } from '@/components/iconos/Iconos';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton, Chip, EstadoVacio, SelectorSegmentado, Tarjeta, Texto } from '@/components/ui';
import { useReservas } from '@/estado/reservas';
import { useAhora } from '@/hooks/useAhora';
import { useBeneficios, useMembresia, useOpiniones, usePaquetes } from '@/hooks/useServiciosPerfil';
import type { MensajeEquipo } from '@/services/almacenamiento';
import { colores, espacio, radios, tipografia } from '@/theme';
import { estadoReserva, textoHorario } from '@/utils/reservas';

// Servicios del Perfil (Figma: PERFIL, "GESTIÓN Y SERVICIOS"). PROVISORIOS: no hay diseño de estas
// pantallas (decisión de la responsable, 2026-11-04). Con la API (Etapa 13), paquetes, beneficios,
// membresía, valoraciones y mensajes vienen del servidor o se guardan ahí (src/hooks/useServiciosPerfil.ts).
// El pago sigue SIMULADO: la tarjeta y la factura son datos de prueba.

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

const MENSAJE_FALLO = 'No pudimos enviarlo. Revisá tu conexión y probá de nuevo.';

function Paquetes() {
  const paquetes = usePaquetes();
  if (paquetes.length === 0) {
    return (
      <EstadoVacio
        titulo="No tenés paquetes en recepción"
        texto="Cuando llegue algo a tu nombre, lo vas a ver acá."
      />
    );
  }
  return (
    <>
      {paquetes.map((p) => (
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
  const beneficios = useBeneficios();
  if (beneficios.length === 0) {
    return (
      <EstadoVacio
        titulo="Sin beneficios por ahora"
        texto="Pronto vas a ver acá las promos de Olegario."
      />
    );
  }
  return (
    <>
      {beneficios.map((b) => (
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
      hitSlop={8}
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

function Valoraciones() {
  const { espacios } = useReservas();
  const { cantidad, valorar } = useOpiniones();
  const [espacioElegido, setEspacioId] = useState<string | null>(null);
  // Con servidor, los espacios llegan un instante después: por defecto, el primero.
  const espacioId = espacioElegido ?? espacios[0]?.id ?? '';
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviada, setEnviada] = useState(false);
  const [fallo, setFallo] = useState(false);

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
            hitSlop={8}
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
          if (!(await valorar(espacioId, estrellas, comentario.trim()))) {
            setFallo(true);
            return;
          }
          setFallo(false);
          setEstrellas(0);
          setComentario('');
          setEnviada(true);
        }}
      />
      {fallo ? (
        <Texto variante="cuerpoChico" color="error" accessibilityRole="alert">
          {MENSAJE_FALLO}
        </Texto>
      ) : null}
      {cantidad.valoraciones > 0 ? (
        <Texto variante="cuerpoChico">
          Ya enviaste {cantidad.valoraciones}{' '}
          {cantidad.valoraciones === 1 ? 'valoración' : 'valoraciones'}.
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
  const { enviarMensaje } = useOpiniones();
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
          if (!(await enviarMensaje(tipo, texto.trim()))) {
            setError(MENSAJE_FALLO);
            return;
          }
          setTexto('');
          setEnviado(true);
        }}
      />
    </>
  );
}

function Pagos() {
  const membresia = useMembresia();
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
