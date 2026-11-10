import { act, cleanup, render, waitFor } from '@testing-library/react-native';

import { ProveedorAgenda, useAgenda } from '@/estado/agenda';
import { ProveedorReservas, useReservas, type ResultadoReserva } from '@/estado/reservas';
import {
  errorReservaDesdeCodigo,
  espacioDesdeApi,
  eventoDesdeApi,
  type EspacioApi,
  type EventoApi,
  type ReservaApi,
} from '@/services/datosServidor';

// Etapa 13: reservas y agenda de la app con la API. Se usa un servidor SIMULADO en memoria (no el real;
// la prueba contra la API real está en tests/api.test.tsx).
type Respuesta =
  { ok: true; datos: unknown } | { ok: false; estado: number; error: string; codigo: string };

const mockServidor = {
  espacios: [] as EspacioApi[],
  reservas: [] as ReservaApi[],
  horas: { totales: 80, usadas: 0, disponibles: 80 } as unknown,
  eventos: [] as EventoApi[],
  rechazarReserva: null as string | null,
  fallarInscripcion: false,
  llamadas: [] as string[],
};

const error = (codigo: string): Respuesta => ({ ok: false, estado: 422, error: codigo, codigo });

jest.mock('@/services/api', () => ({
  apiConfigurada: true,
  pedirApi: (metodo: string, ruta: string, datos?: Record<string, string>) => {
    const s = mockServidor;
    s.llamadas.push(`${metodo} ${ruta.split('?')[0]}`);
    const resolver = (r: Respuesta) => Promise.resolve(r);
    if (ruta.startsWith('/espacios')) return resolver({ ok: true, datos: s.espacios });
    if (ruta === '/horas') return resolver({ ok: true, datos: s.horas });
    if (ruta === '/reservas' && metodo === 'GET')
      return resolver({ ok: true, datos: s.reservas.filter((r) => !r.cancelada) });
    if (ruta === '/reservas' && metodo === 'POST') {
      if (s.rechazarReserva) return resolver(error(s.rechazarReserva));
      const nueva = {
        id: `r-${s.reservas.length + 1}`,
        espacioId: datos!.espacioId,
        inicio: datos!.inicio,
        fin: datos!.fin,
        cancelada: false,
      };
      s.reservas.push(nueva);
      return resolver({ ok: true, datos: nueva });
    }
    const cancelar = ruta.match(/^\/reservas\/(.+)\/cancelar$/);
    if (cancelar) {
      s.reservas.forEach((r) => r.id === cancelar[1] && (r.cancelada = true));
      return resolver({ ok: true, datos: { ok: true } });
    }
    if (ruta === '/horas/extra') {
      s.horas = { totales: 85, usadas: 0, disponibles: 85 };
      return resolver({ ok: true, datos: s.horas });
    }
    if (ruta === '/eventos') return resolver({ ok: true, datos: s.eventos });
    const inscripcion = ruta.match(/^\/eventos\/(.+)\/inscripcion$/);
    if (inscripcion) {
      if (s.fallarInscripcion) return resolver(error('sin_conexion'));
      s.eventos.forEach((e) => {
        if (e.id !== inscripcion[1]) return;
        const antes = e.inscripto;
        e.inscripto = metodo === 'POST';
        e.inscriptos += Number(e.inscripto) - Number(antes);
      });
      return resolver({ ok: true, datos: {} });
    }
    return resolver(error('no_existe'));
  },
}));

// Cada prueba desmonta su pantalla y olvida el estado anterior (ver `abrir`).
afterEach(cleanup);

function manana(hora: number, minuto = 0): Date {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  fecha.setHours(hora, minuto, 0, 0);
  return fecha;
}

const espacioApi = (id: string, ocupaciones: EspacioApi['ocupaciones'] = []): EspacioApi => ({
  id,
  servicio: 'cowork',
  nombre: `Espacio ${id}`,
  tipo: 'Puesto individual',
  ubicacion: 'Planta baja',
  ambiente: [],
  equipamiento: ['WiFi'],
  etiqueta: null,
  fotoUrl: null,
  capacidad: 1,
  ocupaciones,
});

const eventoApi = (id: string, submarca: string, inscriptos: number): EventoApi => ({
  id,
  submarca,
  titulo: `Evento ${id}`,
  detalle: '',
  inicio: manana(17).toISOString(),
  fotoUrl: null,
  inscriptos,
  inscripto: false,
});

describe('conversión de datos de la API', () => {
  it('usa la foto de la app si el servidor no tiene y la del servidor si la tiene', () => {
    expect(espacioDesdeApi(espacioApi('mesa-luz-natural')).foto).toBeDefined();
    expect(espacioDesdeApi(espacioApi('sin-foto')).foto).toBeUndefined();
    expect(
      espacioDesdeApi({ ...espacioApi('x'), fotoUrl: 'https://ejemplo.com/a.jpg' }).foto,
    ).toEqual({ uri: 'https://ejemplo.com/a.jpg' });
  });

  it.each([
    ['sinLugar', 'sinLugar'],
    ['horasInsuficientes', 'horasInsuficientes'],
    ['pasado', 'pasado'],
    ['invitado', 'servidor'],
    ['sin_conexion', 'servidor'],
  ])('traduce el código "%s" del servidor', (codigo, esperado) => {
    expect(errorReservaDesdeCodigo(codigo)).toBe(esperado);
  });

  it('la Agenda muestra eventos y after office, no el coworkeo itinerante', () => {
    expect(eventoDesdeApi({ ...eventoApi('e', 'evento', 5), inscripto: true })?.inscriptos).toBe(4);
    expect(eventoDesdeApi(eventoApi('i', 'itinerante', 5))).toBeNull();
  });
});

describe('reservas con la API', () => {
  let estado: ReturnType<typeof useReservas> | undefined;
  function Captura() {
    estado = useReservas();
    return null;
  }

  beforeEach(() => {
    mockServidor.espacios = [
      espacioApi('mesa-luz-natural'),
      espacioApi('sala', [{ inicio: manana(15).toISOString(), fin: manana(17).toISOString() }]),
    ];
    mockServidor.reservas = [
      {
        id: 'r-mia',
        espacioId: 'mesa-luz-natural',
        inicio: manana(10).toISOString(),
        fin: manana(12).toISOString(),
        cancelada: false,
      },
    ];
    mockServidor.horas = { totales: 80, usadas: 2, disponibles: 78 };
    mockServidor.rechazarReserva = null;
    mockServidor.llamadas = [];
  });

  async function abrir() {
    // La pantalla nueva se dibuja un instante después: sin esto, `waitFor` vería el estado de la
    // prueba anterior.
    estado = undefined;
    render(
      <ProveedorReservas>
        <Captura />
      </ProveedorReservas>,
    );
    await waitFor(() => expect(estado?.espacios).toHaveLength(2));
  }

  it('lee espacios, ocupación, mis reservas y mis horas', async () => {
    await abrir();
    expect(estado!.espacios[1].ocupaciones).toHaveLength(1);
    expect(estado!.reservas.map((r) => r.id)).toEqual(['r-mia']);
    expect(estado!.horas).toEqual({ totales: 80, usadas: 2, disponibles: 78 });
  });

  it('guarda la reserva en el servidor y vuelve a leer', async () => {
    await abrir();
    let resultado: ResultadoReserva | undefined;
    await act(async () => {
      resultado = await estado!.reservar(estado!.espacios[1], manana(9), manana(10));
    });
    expect(resultado?.ok).toBe(true);
    expect(mockServidor.llamadas).toContain('POST /reservas');
    await waitFor(() => expect(estado!.reservas).toHaveLength(2));
  });

  it('muestra el motivo cuando el servidor rechaza la reserva', async () => {
    await abrir();
    mockServidor.rechazarReserva = 'horasInsuficientes';
    let resultado: ResultadoReserva | undefined;
    await act(async () => {
      resultado = await estado!.reservar(estado!.espacios[1], manana(9), manana(10));
    });
    expect(resultado).toEqual({ ok: false, error: 'horasInsuficientes' });
  });

  it('no manda al servidor una reserva sin lugar (la app la frena antes)', async () => {
    await abrir();
    let resultado: ResultadoReserva | undefined;
    await act(async () => {
      resultado = await estado!.reservar(estado!.espacios[1], manana(15, 30), manana(16));
    });
    expect(resultado).toEqual({ ok: false, error: 'sinLugar' });
    expect(mockServidor.llamadas).not.toContain('POST /reservas');
  });

  it('cancela en el servidor', async () => {
    await abrir();
    let cancelada = false;
    await act(async () => {
      cancelada = await estado!.cancelar('r-mia');
    });
    expect(cancelada).toBe(true);
    await waitFor(() => expect(estado!.reservas).toHaveLength(0));
  });

  it('las horas extras simuladas se suman en el servidor', async () => {
    await abrir();
    await act(async () => {
      await estado!.cargarHorasExtra(5);
    });
    expect(mockServidor.llamadas).toContain('POST /horas/extra');
    expect(estado!.horas.disponibles).toBe(85);
  });

  it('el invitado (sin membresía) queda sin horas', async () => {
    mockServidor.horas = null;
    await abrir();
    expect(estado!.horas).toEqual({ totales: 0, usadas: 0, disponibles: 0 });
  });
});

describe('agenda con la API', () => {
  let estado: ReturnType<typeof useAgenda> | undefined;
  function Captura() {
    estado = useAgenda();
    return null;
  }

  beforeEach(() => {
    mockServidor.eventos = [
      eventoApi('evento-storytelling', 'evento', 1),
      eventoApi('coworkeo-itinerante', 'itinerante', 0),
    ];
    mockServidor.fallarInscripcion = false;
  });

  async function abrir() {
    // La pantalla nueva se dibuja un instante después: sin esto, `waitFor` vería el estado de la
    // prueba anterior.
    estado = undefined;
    render(
      <ProveedorAgenda>
        <Captura />
      </ProveedorAgenda>,
    );
    await waitFor(() => expect(estado?.eventos).toHaveLength(1));
  }

  it('lee los eventos con la cantidad de inscriptos, sin fotos de personas', async () => {
    await abrir();
    expect(estado!.eventos[0].inscriptos).toBe(1);
    expect(estado!.eventos[0].personas).toEqual([]);
  });

  it('inscribe y da de baja (también desde Novedades)', async () => {
    await abrir();
    await act(async () => {
      await estado!.alternarInscripcion('coworkeo-itinerante');
    });
    expect(estado!.estaInscripto('coworkeo-itinerante')).toBe(true);
    await act(async () => {
      await estado!.alternarInscripcion('coworkeo-itinerante');
    });
    expect(estado!.estaInscripto('coworkeo-itinerante')).toBe(false);
  });

  it('si el servidor no guarda la inscripción, vuelve atrás', async () => {
    await abrir();
    mockServidor.fallarInscripcion = true;
    let resultado = true;
    await act(async () => {
      resultado = await estado!.alternarInscripcion('evento-storytelling');
    });
    expect(resultado).toBe(false);
    expect(estado!.estaInscripto('evento-storytelling')).toBe(false);
  });
});
