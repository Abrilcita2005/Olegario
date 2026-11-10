import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useAhora } from '@/hooks/useAhora';
import type { Espacio } from '@/models/espacio';
import type { Reserva } from '@/models/reserva';
import {
  guardarHorasExtra,
  guardarReservas,
  leerHorasExtra,
  leerReservas,
  type ReservaGuardada,
  type ReservasGuardadas,
} from '@/services/almacenamiento';
import { apiConfigurada } from '@/services/api';
import {
  cancelarReservaServidor,
  crearReservaServidor,
  leerReservasServidor,
  reservaDesdeApi,
  sumarHorasExtraServidor,
  type DatosReservas,
} from '@/services/datosServidor';
import {
  horasUsadas,
  puedeCancelar,
  validarReserva,
  type ErrorReserva,
} from '@/utils/disponibilidad';
import { DIAS_ANTICIPACION, inicioDelDia, sumarDias } from '@/utils/fechas';

import { espaciosDePrueba, planDePrueba } from '../../data/mock/espaciosOlegario';
import { reservasDePrueba } from '../../data/mock/reservas';

// Espacios y reservas. Con la API configurada (Etapa 13) todo viene del servidor, que también controla las
// reglas. Sin servidor (y en las pruebas), los espacios y la reserva de Figma son datos de prueba y las
// reservas que hace la persona se guardan en el teléfono (Etapa 8).

export type HorasPlan = { totales: number; usadas: number; disponibles: number };

export type ResultadoReserva = { ok: true; reserva: Reserva } | { ok: false; error: ErrorReserva };

type EstadoReservas = {
  espacios: Espacio[];
  // Reservas vigentes y pasadas (sin las canceladas).
  reservas: Reserva[];
  horas: HorasPlan;
  reservar: (espacio: Espacio, inicio: Date, fin: Date) => Promise<ResultadoReserva>;
  cancelar: (id: string) => Promise<boolean>;
  // SIMULACIÓN de compra de horas extras (decisión de la responsable, 2026-11-04): no se cobra nada.
  cargarHorasExtra: (horas: number) => Promise<void>;
};

const ContextoReservas = createContext<EstadoReservas | null>(null);

const SIN_RESERVAS: ReservasGuardadas = { propias: [], pruebasCanceladas: [] };

function desdeGuardada(guardada: ReservaGuardada, espacios: Espacio[]): Reserva | null {
  const espacio = espacios.find((e) => e.id === guardada.espacioId);
  if (!espacio) return null;
  return {
    id: guardada.id,
    espacioId: espacio.id,
    servicio: espacio.servicio,
    tipo: espacio.tipo,
    espacio: espacio.nombre,
    ubicacion: espacio.ubicacion,
    inicio: new Date(guardada.inicio),
    fin: new Date(guardada.fin),
    cancelada: guardada.cancelada,
  };
}

export function ProveedorReservas({ children }: { children: ReactNode }) {
  return apiConfigurada ? (
    <ProveedorReservasServidor>{children}</ProveedorReservasServidor>
  ) : (
    <ProveedorReservasLocal>{children}</ProveedorReservasLocal>
  );
}

const SIN_DATOS: DatosReservas = { espacios: [], reservas: [], horas: null };

function leerReservasDelDia(claveDia: number) {
  const hoy = new Date(claveDia);
  return leerReservasServidor(hoy, sumarDias(hoy, DIAS_ANTICIPACION + 1));
}

function ProveedorReservasServidor({ children }: { children: ReactNode }) {
  const ahora = useAhora();
  const claveDia = inicioDelDia(ahora).getTime();
  const [datos, setDatos] = useState<DatosReservas>(SIN_DATOS);

  // Ocupación desde hoy hasta el último día reservable (se vuelve a leer al cambiar de día).
  const recargar = useCallback(async () => {
    const leidos = await leerReservasDelDia(claveDia);
    if (leidos) setDatos(leidos);
  }, [claveDia]);

  useEffect(() => {
    let activo = true;
    leerReservasDelDia(claveDia).then((leidos) => {
      if (activo && leidos) setDatos(leidos);
    });
    return () => {
      activo = false;
    };
  }, [claveDia]);

  const horas = useMemo(
    () => datos.horas ?? { totales: 0, usadas: 0, disponibles: 0 },
    [datos.horas],
  );

  // SIMULACIÓN de compra de horas extras (no se cobra nada): el servidor las suma a la membresía.
  const cargarHorasExtra = useCallback(async (cantidad: number) => {
    const nuevas = await sumarHorasExtraServidor(cantidad);
    if (nuevas) setDatos((actual) => ({ ...actual, horas: nuevas }));
  }, []);

  const reservar = useCallback(
    async (espacio: Espacio, inicio: Date, fin: Date): Promise<ResultadoReserva> => {
      // Primero las reglas en la app (respuesta inmediata); después el servidor las vuelve a controlar.
      const error = validarReserva({
        espacio,
        inicio,
        fin,
        ahora,
        horasDisponibles: horas.disponibles,
        reservas: datos.reservas,
      });
      if (error) return { ok: false, error };
      const resultado = await crearReservaServidor(espacio.id, inicio, fin);
      await recargar();
      if (!resultado.ok) return resultado;
      const reserva = reservaDesdeApi(resultado.reserva, datos.espacios);
      return reserva ? { ok: true, reserva } : { ok: false, error: 'servidor' };
    },
    [ahora, datos, horas.disponibles, recargar],
  );

  const cancelar = useCallback(
    async (id: string): Promise<boolean> => {
      const reserva = datos.reservas.find((r) => r.id === id);
      if (!reserva || !puedeCancelar(reserva, ahora)) return false;
      const cancelada = await cancelarReservaServidor(id);
      await recargar();
      return cancelada;
    },
    [ahora, datos.reservas, recargar],
  );

  const valor = useMemo(
    () => ({
      espacios: datos.espacios,
      reservas: datos.reservas,
      horas,
      reservar,
      cancelar,
      cargarHorasExtra,
    }),
    [datos, horas, reservar, cancelar, cargarHorasExtra],
  );

  return <ContextoReservas.Provider value={valor}>{children}</ContextoReservas.Provider>;
}

function ProveedorReservasLocal({ children }: { children: ReactNode }) {
  const ahora = useAhora();
  const [guardadas, setGuardadas] = useState<ReservasGuardadas>(SIN_RESERVAS);

  const [horasExtra, setHorasExtra] = useState(0);

  useEffect(() => {
    leerReservas()
      .then(setGuardadas)
      .catch(() => {});
    leerHorasExtra()
      .then(setHorasExtra)
      .catch(() => {});
  }, []);

  // Los datos de prueba se arman respecto del día de hoy (se recalculan al cambiar de día).
  const claveDia = inicioDelDia(ahora).getTime();
  const espacios = useMemo(() => espaciosDePrueba(new Date(claveDia)), [claveDia]);

  const reservas = useMemo(() => {
    const deprueba = reservasDePrueba(new Date(claveDia)).filter(
      (r) => !guardadas.pruebasCanceladas.includes(r.id),
    );
    const propias = guardadas.propias
      .filter((g) => !g.cancelada)
      .map((g) => desdeGuardada(g, espacios))
      .filter((r): r is Reserva => r !== null);
    return [...deprueba, ...propias].sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
  }, [claveDia, guardadas, espacios]);

  const usadas = planDePrueba.horasUsadasPrevias + horasUsadas(reservas);
  const totales = planDePrueba.horasTotales + horasExtra;
  const horas = useMemo(
    () => ({ totales, usadas, disponibles: Math.max(0, totales - usadas) }),
    [totales, usadas],
  );

  const cargarHorasExtra = useCallback(
    async (cantidad: number) => {
      const siguiente = horasExtra + cantidad;
      setHorasExtra(siguiente);
      await guardarHorasExtra(siguiente);
    },
    [horasExtra],
  );

  const actualizar = useCallback(async (siguientes: ReservasGuardadas) => {
    setGuardadas(siguientes);
    await guardarReservas(siguientes);
  }, []);

  const reservar = useCallback(
    async (espacio: Espacio, inicio: Date, fin: Date): Promise<ResultadoReserva> => {
      const error = validarReserva({
        espacio,
        inicio,
        fin,
        ahora,
        horasDisponibles: horas.disponibles,
        reservas,
      });
      if (error) return { ok: false, error };
      const nueva: ReservaGuardada = {
        id: `reserva-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        espacioId: espacio.id,
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
      };
      await actualizar({ ...guardadas, propias: [...guardadas.propias, nueva] });
      return { ok: true, reserva: desdeGuardada(nueva, espacios) as Reserva };
    },
    [actualizar, ahora, espacios, guardadas, horas.disponibles, reservas],
  );

  const cancelar = useCallback(
    async (id: string): Promise<boolean> => {
      const reserva = reservas.find((r) => r.id === id);
      if (!reserva || !puedeCancelar(reserva, ahora)) return false;
      await actualizar(
        reserva.esDatoDePrueba
          ? { ...guardadas, pruebasCanceladas: [...guardadas.pruebasCanceladas, id] }
          : {
              ...guardadas,
              propias: guardadas.propias.map((g) => (g.id === id ? { ...g, cancelada: true } : g)),
            },
      );
      return true;
    },
    [actualizar, ahora, guardadas, reservas],
  );

  const valor = useMemo(
    () => ({ espacios, reservas, horas, reservar, cancelar, cargarHorasExtra }),
    [espacios, reservas, horas, reservar, cancelar, cargarHorasExtra],
  );

  return <ContextoReservas.Provider value={valor}>{children}</ContextoReservas.Provider>;
}

export function useReservas(): EstadoReservas {
  const estado = useContext(ContextoReservas);
  if (!estado) throw new Error('useReservas debe usarse dentro de ProveedorReservas');
  return estado;
}
