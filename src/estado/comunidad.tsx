import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { ModoComunidad, Persona, Publicacion, Taller } from '@/models/comunidad';
import {
  COMUNIDAD_INICIAL,
  guardarComunidad,
  leerComunidad,
  type ComunidadGuardada,
  type PublicacionGuardada,
} from '@/services/almacenamiento';
import { apiConfigurada } from '@/services/api';
import {
  cambiarModoServidor,
  eliminarPublicacionServidor,
  enviarSolicitudServidor,
  leerComunidadServidor,
  publicarServidor,
  type DatosComunidad,
} from '@/services/datosServidor';

import {
  personasDePrueba,
  publicacionesDePrueba,
  talleresDePrueba,
} from '../../data/mock/comunidad';
import { useSesion } from './sesion';

// Comunidad. Con la API configurada (Etapa 13) todo viene del servidor (personas visibles, publicaciones,
// talleres, Modo Foco y solicitudes). Sin servidor (y en las pruebas): personas, proyectos y talleres de
// prueba de Figma; el modo, las solicitudes y las publicaciones propias se guardan en el teléfono (Etapa 10).

export type NuevaPublicacion = Omit<PublicacionGuardada, 'id'>;

type EstadoComunidad = {
  modo: ModoComunidad;
  cambiarModo: (modo: ModoComunidad) => Promise<void>;
  personas: Persona[];
  publicaciones: Publicacion[];
  talleres: Taller[];
  solicitudEnviada: (id: string) => boolean;
  // Devuelven false si no se pudo guardar (por ejemplo, sin conexión con el servidor).
  enviarSolicitud: (id: string, mensaje: string) => Promise<boolean>;
  publicar: (datos: NuevaPublicacion) => Promise<boolean>;
  eliminarPublicacion: (id: string) => Promise<void>;
  // Vuelve a leer del servidor; sinConexion: la última lectura falló.
  actualizar: () => Promise<void>;
  sinConexion: boolean;
};

const ContextoComunidad = createContext<EstadoComunidad | null>(null);

export function ProveedorComunidad({ children }: { children: ReactNode }) {
  return apiConfigurada ? (
    <ProveedorComunidadServidor>{children}</ProveedorComunidadServidor>
  ) : (
    <ProveedorComunidadLocal>{children}</ProveedorComunidadLocal>
  );
}

const sinServidor = async () => {};

const COMUNIDAD_VACIA: DatosComunidad = {
  modo: 'abierta',
  personas: [],
  publicaciones: [],
  talleres: [],
  solicitudesEnviadas: [],
};

function ProveedorComunidadServidor({ children }: { children: ReactNode }) {
  const { tipoAcceso } = useSesion();
  const [datos, setDatos] = useState<DatosComunidad>(COMUNIDAD_VACIA);
  const [sinConexion, setSinConexion] = useState(false);

  const recargar = useCallback(async () => {
    const leidos = await leerComunidadServidor();
    setSinConexion(!leidos);
    if (leidos) setDatos(leidos);
  }, []);

  // Solo miembros: el invitado no usa Comunidad (el servidor también se lo impide).
  useEffect(() => {
    if (tipoAcceso !== 'miembro') return;
    let activo = true;
    leerComunidadServidor().then((leidos) => {
      if (!activo) return;
      setSinConexion(!leidos);
      if (leidos) setDatos(leidos);
    });
    return () => {
      activo = false;
    };
  }, [tipoAcceso]);

  const cambiarModo = useCallback(
    async (modo: ModoComunidad) => {
      const anterior = datos.modo;
      setDatos((actual) => ({ ...actual, modo }));
      if (!(await cambiarModoServidor(modo))) setDatos((actual) => ({ ...actual, modo: anterior }));
    },
    [datos.modo],
  );

  const solicitudEnviada = useCallback(
    (id: string) => datos.solicitudesEnviadas.includes(id),
    [datos.solicitudesEnviadas],
  );

  const enviarSolicitud = useCallback(async (id: string, mensaje: string) => {
    const enviada = await enviarSolicitudServidor(id, mensaje);
    if (enviada)
      setDatos((actual) => ({
        ...actual,
        solicitudesEnviadas: [...actual.solicitudesEnviadas.filter((e) => e !== id), id],
      }));
    return enviada;
  }, []);

  const publicar = useCallback(
    async (nueva: NuevaPublicacion) => {
      const publicada = await publicarServidor(nueva);
      if (publicada) await recargar();
      return publicada;
    },
    [recargar],
  );

  const eliminarPublicacion = useCallback(
    async (id: string) => {
      if (await eliminarPublicacionServidor(id)) await recargar();
    },
    [recargar],
  );

  const valor = useMemo(
    () => ({
      modo: datos.modo,
      cambiarModo,
      personas: datos.personas,
      publicaciones: datos.publicaciones,
      talleres: datos.talleres,
      solicitudEnviada,
      enviarSolicitud,
      publicar,
      eliminarPublicacion,
      actualizar: recargar,
      sinConexion,
    }),
    [
      datos,
      cambiarModo,
      solicitudEnviada,
      enviarSolicitud,
      publicar,
      eliminarPublicacion,
      recargar,
      sinConexion,
    ],
  );

  return <ContextoComunidad.Provider value={valor}>{children}</ContextoComunidad.Provider>;
}

function ProveedorComunidadLocal({ children }: { children: ReactNode }) {
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
    async (id: string, mensaje: string) => {
      await actualizar({ ...guardado, solicitudes: { ...guardado.solicitudes, [id]: mensaje } });
      return true;
    },
    [actualizar, guardado],
  );

  const publicar = useCallback(
    async (datos: NuevaPublicacion) => {
      await actualizar({
        ...guardado,
        publicaciones: [
          ...guardado.publicaciones,
          { ...datos, id: `publicacion-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
        ],
      });
      return true;
    },
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
      actualizar: sinServidor,
      sinConexion: false,
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
