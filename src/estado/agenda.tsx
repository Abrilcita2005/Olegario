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
import type { Efemeride, Evento } from '@/models/agenda';
import { guardarInscripciones, leerInscripciones } from '@/services/almacenamiento';
import { inicioDelDia } from '@/utils/fechas';

import { efemeridesDePrueba, eventosDePrueba } from '../../data/mock/agenda';

// Eventos, efemérides e inscripciones. PROVISIONAL (Etapa 9): datos de prueba de Figma y las inscripciones
// se guardan en el teléfono; en la Etapa 13 viene todo del servidor.

type EstadoAgenda = {
  eventos: Evento[];
  efemerides: Efemeride[];
  estaInscripto: (id: string) => boolean;
  // Inscribe o da de baja (alterna). Devuelve el nuevo estado.
  alternarInscripcion: (id: string) => Promise<boolean>;
};

const ContextoAgenda = createContext<EstadoAgenda | null>(null);

export function ProveedorAgenda({ children }: { children: ReactNode }) {
  const ahora = useAhora();
  const [inscripciones, setInscripciones] = useState<string[]>([]);

  useEffect(() => {
    leerInscripciones()
      .then(setInscripciones)
      .catch(() => {});
  }, []);

  const claveDia = inicioDelDia(ahora).getTime();
  const eventos = useMemo(() => eventosDePrueba(new Date(claveDia)), [claveDia]);
  const efemerides = useMemo(() => efemeridesDePrueba(new Date(claveDia)), [claveDia]);

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
    () => ({ eventos, efemerides, estaInscripto, alternarInscripcion }),
    [eventos, efemerides, estaInscripto, alternarInscripcion],
  );

  return <ContextoAgenda.Provider value={valor}>{children}</ContextoAgenda.Provider>;
}

export function useAgenda(): EstadoAgenda {
  const estado = useContext(ContextoAgenda);
  if (!estado) throw new Error('useAgenda debe usarse dentro de ProveedorAgenda');
  return estado;
}
