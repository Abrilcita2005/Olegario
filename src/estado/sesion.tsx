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
import {
  actualizarPerfilServidor,
  cerrarSesionServidor,
  eliminarCuentaServidor,
  ingresarComoInvitado,
  ingresarConCorreo,
  leerCuentaActual,
  registrarCuenta,
  type ResultadoCuenta,
} from '@/services/cuentaServidor';
import { supabaseConfigurado } from '@/services/supabase';

const OK: ResultadoCuenta = { ok: true };

type Sesion = {
  cargando: boolean;
  bienvenidaVista: boolean;
  tipoAcceso: TipoAcceso | null;
  fotoPerfil: string | null;
  perfilBasico: PerfilBasico | null;
  // Con Supabase (Etapa 13) crea la cuenta real; sin servidor, simula el registro en el teléfono.
  // La contraseña nunca se guarda en la app.
  registrarse: (perfil: PerfilBasico, contrasena: string) => Promise<ResultadoCuenta>;
  cambiarFotoPerfil: (foto: string | null) => Promise<void>;
  marcarBienvenidaVista: () => Promise<void>;
  // Con Supabase: miembro con correo y contraseña, invitado con ingreso anónimo. Sin servidor: simulado.
  ingresar: (
    tipo: TipoAcceso,
    credenciales?: { correo: string; contrasena: string },
  ) => Promise<ResultadoCuenta>;
  salir: () => Promise<void>;
  actualizarPerfil: (perfil: PerfilBasico) => Promise<ResultadoCuenta>;
  // Eliminar cuenta: en el servidor (si está) y los datos del teléfono; vuelve a Acceso.
  eliminarCuenta: () => Promise<ResultadoCuenta>;
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
      .then(async (estado) => {
        setBienvenidaVista(estado.bienvenidaVista);
        setTipoAcceso(estado.tipoAcceso);
        setFotoPerfil(estado.fotoPerfil);
        setPerfilBasico(estado.perfilBasico);
        // Con servidor, la sesión real manda: si no hay sesión válida, se vuelve a Acceso.
        if (supabaseConfigurado) {
          const cuenta = await leerCuentaActual().catch(() => null);
          setTipoAcceso(cuenta?.tipoAcceso ?? null);
          if (cuenta?.perfil) setPerfilBasico(cuenta.perfil);
        }
      })
      // Si el almacenamiento falla, se arranca como primera vez en lugar de bloquear la app.
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const marcarBienvenidaVista = useCallback(async () => {
    setBienvenidaVista(true);
    await guardarBienvenidaVista();
  }, []);

  const ingresar = useCallback(
    async (tipo: TipoAcceso, credenciales?: { correo: string; contrasena: string }) => {
      if (supabaseConfigurado) {
        const resultado =
          tipo === 'invitado'
            ? await ingresarComoInvitado()
            : await ingresarConCorreo(credenciales?.correo ?? '', credenciales?.contrasena ?? '');
        if (!resultado.ok) return resultado;
        const cuenta = await leerCuentaActual();
        if (cuenta?.perfil) {
          setPerfilBasico(cuenta.perfil);
          await guardarPerfilBasico(cuenta.perfil);
        }
        tipo = cuenta?.tipoAcceso ?? tipo;
      }
      setTipoAcceso(tipo);
      await guardarTipoAcceso(tipo);
      return OK;
    },
    [],
  );

  const registrarse = useCallback(async (perfil: PerfilBasico, contrasena: string) => {
    if (supabaseConfigurado) {
      const resultado = await registrarCuenta(perfil, contrasena);
      // Si hay que confirmar el correo, todavía no se entra a la app.
      if (!resultado.ok || resultado.requiereConfirmacion) return resultado;
    }
    setPerfilBasico(perfil);
    setTipoAcceso('miembro');
    await Promise.all([guardarPerfilBasico(perfil), guardarTipoAcceso('miembro')]);
    return OK;
  }, []);

  const cambiarFotoPerfil = useCallback(async (foto: string | null) => {
    setFotoPerfil(foto);
    await guardarFotoPerfil(foto);
  }, []);

  const salir = useCallback(async () => {
    setTipoAcceso(null);
    await Promise.all([guardarTipoAcceso(null), cerrarSesionServidor()]);
  }, []);

  const [versionDatos, setVersionDatos] = useState(0);

  const actualizarPerfil = useCallback(async (perfil: PerfilBasico) => {
    if (supabaseConfigurado) {
      const resultado = await actualizarPerfilServidor(perfil);
      if (!resultado.ok) return resultado;
    }
    setPerfilBasico(perfil);
    await guardarPerfilBasico(perfil);
    return OK;
  }, []);

  const eliminarCuenta = useCallback(async () => {
    if (supabaseConfigurado) {
      const resultado = await eliminarCuentaServidor();
      if (!resultado.ok) return resultado;
    }
    await borrarDatosDeCuenta();
    setPerfilBasico(null);
    setFotoPerfil(null);
    setTipoAcceso(null);
    setVersionDatos((v) => v + 1);
    return OK;
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
