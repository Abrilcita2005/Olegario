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
  borrarDatosDeCuenta,
  guardarBienvenidaVista,
  guardarFotoPerfil,
  guardarPerfilBasico,
  guardarTipoAcceso,
  leerEstadoGuardado,
  type PerfilBasico,
  type TipoAcceso,
} from '@/services/almacenamiento';

type Sesion = {
  cargando: boolean;
  bienvenidaVista: boolean;
  tipoAcceso: TipoAcceso | null;
  fotoPerfil: string | null;
  perfilBasico: PerfilBasico | null;
  // PROVISIONAL: registro simulado sin servidor. Guarda el perfil (sin contraseña) y entra como miembro.
  registrarse: (perfil: PerfilBasico) => Promise<void>;
  cambiarFotoPerfil: (foto: string | null) => Promise<void>;
  marcarBienvenidaVista: () => Promise<void>;
  // PROVISIONAL (Etapa 5): ingreso simulado sin backend. Se reemplaza en la Etapa 6 y la Etapa 13.
  ingresar: (tipo: TipoAcceso) => Promise<void>;
  salir: () => Promise<void>;
  actualizarPerfil: (perfil: PerfilBasico) => Promise<void>;
  // Eliminar cuenta (simulado, Etapa 11): borra los datos del teléfono y vuelve a Acceso.
  eliminarCuenta: () => Promise<void>;
  // Cambia al eliminar la cuenta, para que los demás estados se vuelvan a cargar desde cero.
  versionDatos: number;
};

const ContextoSesion = createContext<Sesion | null>(null);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const [bienvenidaVista, setBienvenidaVista] = useState(false);
  const [tipoAcceso, setTipoAcceso] = useState<TipoAcceso | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [perfilBasico, setPerfilBasico] = useState<PerfilBasico | null>(null);

  useEffect(() => {
    leerEstadoGuardado()
      .then((estado) => {
        setBienvenidaVista(estado.bienvenidaVista);
        setTipoAcceso(estado.tipoAcceso);
        setFotoPerfil(estado.fotoPerfil);
        setPerfilBasico(estado.perfilBasico);
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

  const registrarse = useCallback(async (perfil: PerfilBasico) => {
    setPerfilBasico(perfil);
    setTipoAcceso('miembro');
    await Promise.all([guardarPerfilBasico(perfil), guardarTipoAcceso('miembro')]);
  }, []);

  const cambiarFotoPerfil = useCallback(async (foto: string | null) => {
    setFotoPerfil(foto);
    await guardarFotoPerfil(foto);
  }, []);

  const salir = useCallback(async () => {
    setTipoAcceso(null);
    await guardarTipoAcceso(null);
  }, []);

  const [versionDatos, setVersionDatos] = useState(0);

  const actualizarPerfil = useCallback(async (perfil: PerfilBasico) => {
    setPerfilBasico(perfil);
    await guardarPerfilBasico(perfil);
  }, []);

  const eliminarCuenta = useCallback(async () => {
    await borrarDatosDeCuenta();
    setPerfilBasico(null);
    setFotoPerfil(null);
    setTipoAcceso(null);
    setVersionDatos((v) => v + 1);
  }, []);

  const valor = useMemo(
    () => ({
      cargando,
      bienvenidaVista,
      tipoAcceso,
      fotoPerfil,
      perfilBasico,
      registrarse,
      cambiarFotoPerfil,
      marcarBienvenidaVista,
      ingresar,
      salir,
      actualizarPerfil,
      eliminarCuenta,
      versionDatos,
    }),
    [
      cargando,
      bienvenidaVista,
      tipoAcceso,
      fotoPerfil,
      perfilBasico,
      registrarse,
      cambiarFotoPerfil,
      marcarBienvenidaVista,
      ingresar,
      salir,
      actualizarPerfil,
      eliminarCuenta,
      versionDatos,
    ],
  );

  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>;
}

export function useSesion(): Sesion {
  const sesion = useContext(ContextoSesion);
  if (!sesion) throw new Error('useSesion debe usarse dentro de ProveedorSesion');
  return sesion;
}
