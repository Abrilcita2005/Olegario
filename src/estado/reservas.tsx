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
  guardarReservas,
  leerReservas,
  type ReservaGuardada,
  type ReservasGuardadas,
} from '@/services/almacenamiento';
import {
  horasUsadas,
  puedeCancelar,
  validarReserva,
  type ErrorReserva,
} from '@/utils/disponibilidad';
import { inicioDelDia } from '@/utils/fechas';

import { espaciosDePrueba, planDePrueba } from '../../data/mock/espaciosOlegario';
import { reservasDePrueba } from '../../data/mock/reservas';

// Espacios y reservas. PROVISIONAL (Etapa 8): sin servidor, los espacios y la reserva de Figma son datos de
// prueba y las reservas que hace la persona se guardan en el teléfono. En la Etapa 13 viene todo del servidor.

export type HorasPlan = { totales: number; usadas: number; disponibles: number };

export type ResultadoReserva = { ok: true; reserva: Reserva } | { ok: false; error: ErrorReserva };

type EstadoReservas = {
  espacios: Espacio[];
  // Reservas vigentes y pasadas (sin las canceladas).
  reservas: Reserva[];
  horas: HorasPlan;
  reservar: (espacio: Espacio, inicio: Date, fin: Date) => Promise<ResultadoReserva>;
  cancelar: (id: string) => Promise<boolean>;
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
  const ahora = useAhora();
  const [guardadas, setGuardadas] = useState<ReservasGuardadas>(SIN_RESERVAS);

  useEffect(() => {
    leerReservas()
      .then(setGuardadas)
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
  const horas = useMemo(
    () => ({
      totales: planDePrueba.horasTotales,
      usadas,
      disponibles: Math.max(0, planDePrueba.horasTotales - usadas),
    }),
    [usadas],
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
    () => ({ espacios, reservas, horas, reservar, cancelar }),
    [espacios, reservas, horas, reservar, cancelar],
  );

  return <ContextoReservas.Provider value={valor}>{children}</ContextoReservas.Provider>;
}

export function useReservas(): EstadoReservas {
  const estado = useContext(ContextoReservas);
  if (!estado) throw new Error('useReservas debe usarse dentro de ProveedorReservas');
  return estado;
}
