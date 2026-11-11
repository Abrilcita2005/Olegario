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
  borrarBienvenidaVista,
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
  cambiarFotoServidor,
  leerCuentaActual,
  registrarCuenta,
  type ResultadoCuenta,
} from '@/services/cuentaServidor';
import { apiConfigurada } from '@/services/api';

const OK: ResultadoCuenta = { ok: true };

// "sofi.valenzuela@estudio.com" → "Sofi Valenzuela"; un usuario sin @ se usa tal cual.
export function nombreDesdeUsuario(usuario: string): string {
  const base = usuario.includes('@') ? usuario.split('@')[0] : usuario;
  return base
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

type Sesion = {
  cargando: boolean;
  bienvenidaVista: boolean;
  tipoAcceso: TipoAcceso | null;
  fotoPerfil: string | null;
  perfilBasico: PerfilBasico | null;
  // Con la API (Etapa 13) crea la cuenta real; sin servidor, simula el registro en el teléfono.
  // La contraseña nunca se guarda en la app.
  registrarse: (perfil: PerfilBasico, contrasena: string) => Promise<ResultadoCuenta>;
  // Con la API también la sube al servidor (para que la vea la Comunidad). Devuelve el error si falló.
  cambiarFotoPerfil: (foto: string | null) => Promise<ResultadoCuenta>;
  marcarBienvenidaVista: () => Promise<void>;
  // Vuelve a mostrar la bienvenida (sin cerrar la sesión); al terminarla se vuelve a la app.
  verBienvenidaDeNuevo: () => Promise<void>;
  // Con la API: miembro con correo y contraseña, invitado sin correo. Sin servidor: simulado.
  ingresar: (
    tipo: TipoAcceso,
    credenciales?: { correo: string; contrasena: string },
  ) => Promise<ResultadoCuenta>;
  // volverABienvenida: solo "Cerrar sesión" del Perfil vuelve a la bienvenida (Etapa 14).
  salir: (opciones?: { volverABienvenida?: boolean }) => Promise<void>;
  actualizarPerfil: (perfil: PerfilBasico) => Promise<ResultadoCuenta>;
  // Eliminar cuenta: en el servidor (si está) y los datos del teléfono; vuelve a Acceso.
  eliminarCuenta: () => Promise<ResultadoCuenta>;
  // Cambia al eliminar la cuenta, para que los demás estados se vuelvan a cargar desde cero.
  versionDatos: number;
  // Cuenta del servidor (null sin servidor o sin sesión): al cambiar, se recargan los datos.
  idUsuario: string | null;
};

const ContextoSesion = createContext<Sesion | null>(null);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const [bienvenidaVista, setBienvenidaVista] = useState(false);
  const [tipoAcceso, setTipoAcceso] = useState<TipoAcceso | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [perfilBasico, setPerfilBasico] = useState<PerfilBasico | null>(null);
  const [idUsuario, setIdUsuario] = useState<string | null>(null);

  useEffect(() => {
    leerEstadoGuardado()
      .then(async (estado) => {
        setBienvenidaVista(estado.bienvenidaVista);
        setTipoAcceso(estado.tipoAcceso);
        setFotoPerfil(estado.fotoPerfil);
        setPerfilBasico(estado.perfilBasico);
        // Con servidor, la sesión real manda: si no hay sesión válida, se vuelve a Acceso. Sin conexión,
        // se mantiene lo guardado en el teléfono (no se cierra la sesión por un corte de internet).
        if (apiConfigurada) {
          const cuenta = await leerCuentaActual();
          if (cuenta !== 'sin_conexion') {
            setTipoAcceso(cuenta?.tipoAcceso ?? null);
            setIdUsuario(cuenta?.id ?? null);
            if (cuenta?.perfil) setPerfilBasico(cuenta.perfil);
            // Con servidor, la foto que vale es la guardada ahí.
            if (cuenta?.tipoAcceso === 'miembro') setFotoPerfil(cuenta.fotoUrl);
          }
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

  const verBienvenidaDeNuevo = useCallback(async () => {
    setBienvenidaVista(false);
    await borrarBienvenidaVista();
  }, []);

  const ingresar = useCallback(
    async (tipo: TipoAcceso, credenciales?: { correo: string; contrasena: string }) => {
      if (apiConfigurada) {
        const resultado =
          tipo === 'invitado'
            ? await ingresarComoInvitado()
            : await ingresarConCorreo(credenciales?.correo ?? '', credenciales?.contrasena ?? '');
        if (!resultado.ok) return resultado;
        const cuenta = resultado.cuenta;
        setIdUsuario(cuenta?.id ?? null);
        if (cuenta?.perfil) {
          setPerfilBasico(cuenta.perfil);
          await guardarPerfilBasico(cuenta.perfil);
        }
        if (cuenta) {
          setFotoPerfil(cuenta.fotoUrl);
          await guardarFotoPerfil(cuenta.fotoUrl);
        }
        tipo = cuenta?.tipoAcceso ?? tipo;
      } else if (tipo === 'miembro' && credenciales?.correo) {
        // Sin servidor: se muestra el nombre con el que la persona ingresó (Etapa 14). Si ya se había
        // registrado en este teléfono con ese correo, se usa su perfil.
        const guardado = (await leerEstadoGuardado().catch(() => null))?.perfilBasico;
        const correo = credenciales.correo.trim();
        const perfil =
          guardado && guardado.correo.toLowerCase() === correo.toLowerCase()
            ? guardado
            : { nombre: nombreDesdeUsuario(correo), correo, profesion: '' };
        setPerfilBasico(perfil);
        await guardarPerfilBasico(perfil);
      }
      setTipoAcceso(tipo);
      await guardarTipoAcceso(tipo);
      return OK;
    },
    [],
  );

  const registrarse = useCallback(async (perfil: PerfilBasico, contrasena: string) => {
    if (apiConfigurada) {
      const resultado = await registrarCuenta(perfil, contrasena);
      if (!resultado.ok) return resultado;
      setIdUsuario(resultado.cuenta?.id ?? null);
    }
    setPerfilBasico(perfil);
    setTipoAcceso('miembro');
    await Promise.all([guardarPerfilBasico(perfil), guardarTipoAcceso('miembro')]);
    return OK;
  }, []);

  const cambiarFotoPerfil = useCallback(async (foto: string | null) => {
    if (apiConfigurada) {
      const resultado = await cambiarFotoServidor(foto);
      if (!resultado.ok) return resultado;
    }
    setFotoPerfil(foto);
    await guardarFotoPerfil(foto);
    return OK;
  }, []);

  // "Cerrar sesión" del Perfil vuelve a la bienvenida (pedido de la responsable, Etapa 14); los demás
  // usos (por ejemplo, un invitado que va a crear su cuenta) vuelven a Acceso, como antes.
  const salir = useCallback(async (opciones?: { volverABienvenida?: boolean }) => {
    setTipoAcceso(null);
    setIdUsuario(null);
    if (opciones?.volverABienvenida) {
      setBienvenidaVista(false);
      await borrarBienvenidaVista();
    }
    await Promise.all([guardarTipoAcceso(null), cerrarSesionServidor()]);
  }, []);

  const [versionDatos, setVersionDatos] = useState(0);

  const actualizarPerfil = useCallback(async (perfil: PerfilBasico) => {
    if (apiConfigurada) {
      const resultado = await actualizarPerfilServidor(perfil);
      if (!resultado.ok) return resultado;
    }
    setPerfilBasico(perfil);
    await guardarPerfilBasico(perfil);
    return OK;
  }, []);

  const eliminarCuenta = useCallback(async () => {
    if (apiConfigurada) {
      const resultado = await eliminarCuentaServidor();
      if (!resultado.ok) return resultado;
    }
    await borrarDatosDeCuenta();
    setPerfilBasico(null);
    setFotoPerfil(null);
    setTipoAcceso(null);
    setIdUsuario(null);
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
      verBienvenidaDeNuevo,
      ingresar,
      salir,
      actualizarPerfil,
      eliminarCuenta,
      versionDatos,
      idUsuario,
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
      verBienvenidaDeNuevo,
      ingresar,
      salir,
      actualizarPerfil,
      eliminarCuenta,
      versionDatos,
      idUsuario,
    ],
  );

  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>;
}

export function useSesion(): Sesion {
  const sesion = useContext(ContextoSesion);
  if (!sesion) throw new Error('useSesion debe usarse dentro de ProveedorSesion');
  return sesion;
}
