import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  guardarBienvenidaVista,
  guardarFotoPerfil,
  guardarTipoAcceso,
  leerEstadoGuardado,
  type TipoAcceso,
} from '@/services/almacenamiento';

type Sesion = {
  cargando: boolean;
  bienvenidaVista: boolean;
  tipoAcceso: TipoAcceso | null;
  fotoPerfil: string | null;
  cambiarFotoPerfil: (foto: string | null) => Promise<void>;
  marcarBienvenidaVista: () => Promise<void>;
  // PROVISIONAL (Etapa 5): ingreso simulado sin backend. Se reemplaza en la Etapa 6 y la Etapa 13.
  ingresar: (tipo: TipoAcceso) => Promise<void>;
  salir: () => Promise<void>;
};

const ContextoSesion = createContext<Sesion | null>(null);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const [bienvenidaVista, setBienvenidaVista] = useState(false);
  const [tipoAcceso, setTipoAcceso] = useState<TipoAcceso | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  useEffect(() => {
    leerEstadoGuardado()
      .then((estado) => {
        setBienvenidaVista(estado.bienvenidaVista);
        setTipoAcceso(estado.tipoAcceso);
        setFotoPerfil(estado.fotoPerfil);
      })
      // Si el almacenamiento falla, se arranca como primera vez en lugar de bloquear la app.
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const marcarBienvenidaVista = useCallback(async () => {
    setBienvenidaVista(true);
    await guardarBienvenidaVista();
  }, []);

  const ingresar = useCallback(async (tipo: TipoAcceso) => {
    setTipoAcceso(tipo);
    await guardarTipoAcceso(tipo);
  }, []);

  const cambiarFotoPerfil = useCallback(async (foto: string | null) => {
    setFotoPerfil(foto);
    await guardarFotoPerfil(foto);
  }, []);

  const salir = useCallback(async () => {
    setTipoAcceso(null);
    await guardarTipoAcceso(null);
  }, []);

  const valor = useMemo(
    () => ({
      cargando,
      bienvenidaVista,
      tipoAcceso,
      fotoPerfil,
      cambiarFotoPerfil,
      marcarBienvenidaVista,
      ingresar,
      salir,
    }),
    [
      cargando,
      bienvenidaVista,
      tipoAcceso,
      fotoPerfil,
      cambiarFotoPerfil,
      marcarBienvenidaVista,
      ingresar,
      salir,
    ],
  );

  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>;
}

export function useSesion(): Sesion {
  const sesion = useContext(ContextoSesion);
  if (!sesion) throw new Error('useSesion debe usarse dentro de ProveedorSesion');
  return sesion;
}
