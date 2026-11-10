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
import type { Evento } from '@/models/agenda';
import { guardarInscripciones, leerInscripciones } from '@/services/almacenamiento';
import { apiConfigurada } from '@/services/api';
import {
  cambiarInscripcionServidor,
  leerAgendaServidor,
  type DatosAgenda,
} from '@/services/datosServidor';
import { inicioDelDia } from '@/utils/fechas';

import { eventosDePrueba } from '../../data/mock/agenda';

// Eventos e inscripciones (las efemérides salen de `data/efemerides.ts`). Con la API configurada
// (Etapa 13) vienen del servidor. Sin servidor (y en las pruebas): eventos de prueba de Figma y las
// inscripciones se guardan en el teléfono (Etapa 9).

type EstadoAgenda = {
  eventos: Evento[];
  estaInscripto: (id: string) => boolean;
  // Inscribe o da de baja (alterna). Devuelve el nuevo estado.
  alternarInscripcion: (id: string) => Promise<boolean>;
};

const ContextoAgenda = createContext<EstadoAgenda | null>(null);

export function ProveedorAgenda({ children }: { children: ReactNode }) {
  return apiConfigurada ? (
    <ProveedorAgendaServidor>{children}</ProveedorAgendaServidor>
  ) : (
    <ProveedorAgendaLocal>{children}</ProveedorAgendaLocal>
  );
}

const AGENDA_VACIA: DatosAgenda = { eventos: [], inscripciones: [] };

function ProveedorAgendaServidor({ children }: { children: ReactNode }) {
  const ahora = useAhora();
  const claveDia = inicioDelDia(ahora).getTime();
  const [datos, setDatos] = useState<DatosAgenda>(AGENDA_VACIA);

  const recargar = useCallback(async () => {
    const leidos = await leerAgendaServidor();
    if (leidos) setDatos(leidos);
  }, []);

  // Se vuelve a leer al cambiar de día (los eventos pasados dejan de mostrarse).
  useEffect(() => {
    let activo = true;
    leerAgendaServidor().then((leidos) => {
      if (activo && leidos) setDatos(leidos);
    });
    return () => {
      activo = false;
    };
  }, [claveDia]);

  const estaInscripto = useCallback(
    (id: string) => datos.inscripciones.includes(id),
    [datos.inscripciones],
  );

  const alternarInscripcion = useCallback(
    async (id: string) => {
      const inscribir = !datos.inscripciones.includes(id);
      // Se muestra el cambio enseguida; si el servidor no lo guarda, se vuelve atrás.
      const aplicar = (sumar: boolean) =>
        setDatos((actual) => ({
          ...actual,
          inscripciones: sumar
            ? [...actual.inscripciones.filter((e) => e !== id), id]
            : actual.inscripciones.filter((e) => e !== id),
        }));
      aplicar(inscribir);
      const guardado = await cambiarInscripcionServidor(id, inscribir);
      if (!guardado) {
        aplicar(!inscribir);
        return !inscribir;
      }
      await recargar();
      return inscribir;
    },
    [datos.inscripciones, recargar],
  );

  const valor = useMemo(
    () => ({ eventos: datos.eventos, estaInscripto, alternarInscripcion }),
    [datos.eventos, estaInscripto, alternarInscripcion],
  );

  return <ContextoAgenda.Provider value={valor}>{children}</ContextoAgenda.Provider>;
}

function ProveedorAgendaLocal({ children }: { children: ReactNode }) {
  const ahora = useAhora();
  const [inscripciones, setInscripciones] = useState<string[]>([]);

  useEffect(() => {
    leerInscripciones()
      .then(setInscripciones)
      .catch(() => {});
  }, []);

  const claveDia = inicioDelDia(ahora).getTime();
  const eventos = useMemo(() => eventosDePrueba(new Date(claveDia)), [claveDia]);

  const estaInscripto = useCallback((id: string) => inscripciones.includes(id), [inscripciones]);

  const alternarInscripcion = useCallback(
    async (id: string) => {
      const inscripto = !inscripciones.includes(id);
      const siguientes = inscripto
        ? [...inscripciones, id]
        : inscripciones.filter((actual) => actual !== id);
      setInscripciones(siguientes);
      await guardarInscripciones(siguientes);
      return inscripto;
    },
    [inscripciones],
  );

  const valor = useMemo(
    () => ({ eventos, estaInscripto, alternarInscripcion }),
    [eventos, estaInscripto, alternarInscripcion],
  );

  return <ContextoAgenda.Provider value={valor}>{children}</ContextoAgenda.Provider>;
}

export function useAgenda(): EstadoAgenda {
  const estado = useContext(ContextoAgenda);
  if (!estado) throw new Error('useAgenda debe usarse dentro de ProveedorAgenda');
  return estado;
}
