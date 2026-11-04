import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { ModoComunidad, Persona, Publicacion } from '@/models/comunidad';
import {
  COMUNIDAD_INICIAL,
  guardarComunidad,
  leerComunidad,
  type ComunidadGuardada,
  type PublicacionGuardada,
} from '@/services/almacenamiento';

import {
  personasDePrueba,
  publicacionesDePrueba,
  talleresDePrueba,
} from '../../data/mock/comunidad';
import { useSesion } from './sesion';

// Comunidad. PROVISIONAL (Etapa 10): personas, proyectos y talleres de prueba de Figma; el modo, las
// solicitudes y las publicaciones propias se guardan en el teléfono. En la Etapa 13, en el servidor.

export type NuevaPublicacion = Omit<PublicacionGuardada, 'id'>;

type EstadoComunidad = {
  modo: ModoComunidad;
  cambiarModo: (modo: ModoComunidad) => Promise<void>;
  personas: Persona[];
  publicaciones: Publicacion[];
  talleres: typeof talleresDePrueba;
  solicitudEnviada: (id: string) => boolean;
  enviarSolicitud: (id: string, mensaje: string) => Promise<void>;
  publicar: (datos: NuevaPublicacion) => Promise<void>;
  eliminarPublicacion: (id: string) => Promise<void>;
};

const ContextoComunidad = createContext<EstadoComunidad | null>(null);

export function ProveedorComunidad({ children }: { children: ReactNode }) {
  const { perfilBasico } = useSesion();
  const [guardado, setGuardado] = useState<ComunidadGuardada>(COMUNIDAD_INICIAL);

  useEffect(() => {
    leerComunidad()
      .then(setGuardado)
      .catch(() => {});
  }, []);

  const actualizar = useCallback(async (siguiente: ComunidadGuardada) => {
    setGuardado(siguiente);
    await guardarComunidad(siguiente);
  }, []);

  const publicaciones = useMemo<Publicacion[]>(
    () => [
      ...guardado.publicaciones
        .slice()
        .reverse()
        .map((p) => ({
          ...p,
          autores: [{ nombre: perfilBasico?.nombre || 'Vos' }],
          rolAutor: perfilBasico?.profesion || undefined,
          actividad: 'Activo hoy',
          accion: '',
          esPropia: true,
        })),
      ...publicacionesDePrueba,
    ],
    [guardado.publicaciones, perfilBasico],
  );

  const cambiarModo = useCallback(
    (modo: ModoComunidad) => actualizar({ ...guardado, modo }),
    [actualizar, guardado],
  );

  const solicitudEnviada = useCallback(
    (id: string) => id in guardado.solicitudes,
    [guardado.solicitudes],
  );

  const enviarSolicitud = useCallback(
    (id: string, mensaje: string) =>
      actualizar({ ...guardado, solicitudes: { ...guardado.solicitudes, [id]: mensaje } }),
    [actualizar, guardado],
  );

  const publicar = useCallback(
    (datos: NuevaPublicacion) =>
      actualizar({
        ...guardado,
        publicaciones: [
          ...guardado.publicaciones,
          { ...datos, id: `publicacion-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
        ],
      }),
    [actualizar, guardado],
  );

  const eliminarPublicacion = useCallback(
    (id: string) =>
      actualizar({
        ...guardado,
        publicaciones: guardado.publicaciones.filter((p) => p.id !== id),
      }),
    [actualizar, guardado],
  );

  const valor = useMemo(
    () => ({
      modo: guardado.modo,
      cambiarModo,
      personas: personasDePrueba,
      publicaciones,
      talleres: talleresDePrueba,
      solicitudEnviada,
      enviarSolicitud,
      publicar,
      eliminarPublicacion,
    }),
    [
      guardado.modo,
      cambiarModo,
      publicaciones,
      solicitudEnviada,
      enviarSolicitud,
      publicar,
      eliminarPublicacion,
    ],
  );

  return <ContextoComunidad.Provider value={valor}>{children}</ContextoComunidad.Provider>;
}

export function useComunidad(): EstadoComunidad {
  const estado = useContext(ContextoComunidad);
  if (!estado) throw new Error('useComunidad debe usarse dentro de ProveedorComunidad');
  return estado;
}
