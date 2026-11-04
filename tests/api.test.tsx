// Etapa 13: cuentas con la API en PHP (src/services/api.ts y cuentaServidor.ts).
// 1) Con un servidor SIMULADO (fetch falso): corre siempre.
// 2) Contra la API real en una base LOCAL, solo si se indica su dirección:
//    OLEGARIO_API_PRUEBA=http://localhost:8080 npx jest tests/api.test.tsx
//    (crea y borra cuentas de prueba: nunca usarlo con datos reales).

const mockGuardado = new Map<string, string>();
jest.mock('expo-secure-store', () => ({
  getItemAsync: (k: string) => Promise.resolve(mockGuardado.get(k) ?? null),
  setItemAsync: (k: string, v: string) => Promise.resolve(void mockGuardado.set(k, v)),
  deleteItemAsync: (k: string) => Promise.resolve(void mockGuardado.delete(k)),
}));

type Cuentas = typeof import('@/services/cuentaServidor');
type Api = typeof import('@/services/api');

// La dirección de la API se lee al cargar el módulo: se carga de nuevo con la variable puesta.
function cargar(url: string): { cuentas: Cuentas; api: Api } {
  process.env.EXPO_PUBLIC_API_URL = url;
  let modulos!: { cuentas: Cuentas; api: Api };
  jest.isolateModules(() => {
    modulos = {
      cuentas: require('@/services/cuentaServidor'),
      api: require('@/services/api'),
    };
  });
  return modulos;
}

const fetchReal = globalThis.fetch;
afterEach(() => {
  delete process.env.EXPO_PUBLIC_API_URL;
  globalThis.fetch = fetchReal;
  mockGuardado.clear();
});

function respuesta(estado: number, cuerpo: unknown) {
  return Promise.resolve({
    ok: estado >= 200 && estado < 300,
    status: estado,
    json: () => Promise.resolve(cuerpo),
  } as Response);
}

describe('API simulada', () => {
  it('sin la variable, la app no usa servidor', () => {
    const { api } = cargar('');
    expect(api.apiConfigurada).toBe(false);
  });

  it('al ingresar guarda el token cifrado y lo manda en las siguientes peticiones', async () => {
    const { cuentas } = cargar('http://localhost:8080/');
    const llamadas: [string, RequestInit][] = [];
    globalThis.fetch = jest.fn((url: string, opciones: RequestInit) => {
      llamadas.push([url, opciones]);
      return url.endsWith('/cuentas/ingreso')
        ? respuesta(200, {
            token: 'a'.repeat(64),
            cuenta: { id: 'u1', tipoAcceso: 'miembro', perfil: null },
          })
        : respuesta(200, { id: 'u1', tipoAcceso: 'miembro', perfil: null });
    }) as unknown as typeof fetch;

    const resultado = await cuentas.ingresarConCorreo('ana@ejemplo.com', 'clave-segura-1');
    expect(resultado.ok).toBe(true);
    expect(mockGuardado.get('olegario.tokenSesion')).toBe('a'.repeat(64));
    expect(llamadas[0][0]).toBe('http://localhost:8080/cuentas/ingreso');

    await cuentas.leerCuentaActual();
    expect((llamadas[1][1].headers as Record<string, string>).Authorization).toBe(
      `Bearer ${'a'.repeat(64)}`,
    );
  });

  it('muestra el mensaje en español que manda el servidor', async () => {
    const { cuentas } = cargar('http://localhost:8080');
    globalThis.fetch = jest.fn(() =>
      respuesta(401, { error: 'Correo o contraseña incorrectos.', codigo: 'credenciales' }),
    ) as unknown as typeof fetch;
    expect(await cuentas.ingresarConCorreo('ana@ejemplo.com', 'mal')).toEqual({
      ok: false,
      error: 'Correo o contraseña incorrectos.',
    });
  });

  it('sin internet avisa y no cierra la sesión guardada', async () => {
    const { cuentas } = cargar('http://localhost:8080');
    mockGuardado.set('olegario.tokenSesion', 'b'.repeat(64));
    globalThis.fetch = jest.fn(() =>
      Promise.reject(new Error('Network')),
    ) as unknown as typeof fetch;
    expect(await cuentas.ingresarComoInvitado()).toEqual({
      ok: false,
      error: 'No pudimos conectarnos. Revisá tu conexión a internet.',
    });
    expect(await cuentas.leerCuentaActual()).toBe('sin_conexion');
    expect(mockGuardado.get('olegario.tokenSesion')).toBe('b'.repeat(64));
  });

  it('si la sesión venció, borra el token', async () => {
    const { cuentas } = cargar('http://localhost:8080');
    mockGuardado.set('olegario.tokenSesion', 'c'.repeat(64));
    globalThis.fetch = jest.fn(() =>
      respuesta(401, { error: 'Tu sesión venció. Volvé a ingresar.', codigo: 'sin_sesion' }),
    ) as unknown as typeof fetch;
    expect(await cuentas.leerCuentaActual()).toBeNull();
    expect(mockGuardado.has('olegario.tokenSesion')).toBe(false);
  });
});

// En las pruebas, fetch está simulado por Expo: para la API real se usa el módulo http de Node.
function fetchPorHttp(url: string, opciones: RequestInit = {}): Promise<Response> {
  // Tipos mínimos del módulo http de Node (el proyecto no instala los tipos de Node).
  type Respuesta = {
    statusCode?: number;
    on: (evento: string, accion: (parte?: string) => void) => void;
  };
  type Pedido = {
    on: (evento: 'error', accion: (e: Error) => void) => void;
    write: (texto: string) => void;
    end: () => void;
  };
  const http = require('http') as {
    request: (
      url: string,
      opciones: { method?: string; headers: Record<string, string> },
      alResponder: (res: Respuesta) => void,
    ) => Pedido;
  };
  return new Promise((resolver, rechazar) => {
    const pedido = http.request(
      url,
      { method: opciones.method, headers: opciones.headers as Record<string, string> },
      (res) => {
        let texto = '';
        res.on('data', (parte) => (texto += parte ?? ''));
        res.on('end', () =>
          resolver({
            ok: (res.statusCode ?? 0) < 300,
            status: res.statusCode ?? 0,
            json: () => Promise.resolve(JSON.parse(texto)),
          } as Response),
        );
      },
    );
    pedido.on('error', rechazar);
    if (typeof opciones.body === 'string') pedido.write(opciones.body);
    pedido.end();
  });
}

const URL_PRUEBA = process.env.OLEGARIO_API_PRUEBA;
(URL_PRUEBA ? describe : describe.skip)('API real en una base local', () => {
  it('registro, perfil, salir, ingreso, invitado y eliminar cuenta', async () => {
    const { cuentas } = cargar(URL_PRUEBA ?? '');
    globalThis.fetch = fetchPorHttp as typeof fetch;
    const correo = `prueba+${Date.now()}@ejemplo.com`;
    const perfil = { nombre: 'Ana Prueba', correo, profesion: 'Diseño' };

    expect(await cuentas.registrarCuenta(perfil, 'clave-segura-1')).toMatchObject({ ok: true });
    expect(await cuentas.registrarCuenta(perfil, 'clave-segura-1')).toEqual({
      ok: false,
      error: 'Ya existe una cuenta con ese correo. Probá iniciar sesión.',
    });
    expect(await cuentas.actualizarPerfilServidor({ ...perfil, nombre: 'Ana María' })).toEqual({
      ok: true,
    });
    expect(await cuentas.leerCuentaActual()).toMatchObject({
      tipoAcceso: 'miembro',
      perfil: { nombre: 'Ana María', correo },
    });
    await cuentas.cerrarSesionServidor();
    expect(await cuentas.leerCuentaActual()).toBeNull();

    expect(await cuentas.ingresarConCorreo(correo, 'clave-segura-1')).toMatchObject({ ok: true });
    expect(await cuentas.eliminarCuentaServidor()).toEqual({ ok: true });
    expect(await cuentas.ingresarConCorreo(correo, 'clave-segura-1')).toMatchObject({ ok: false });

    expect(await cuentas.ingresarComoInvitado()).toMatchObject({
      ok: true,
      cuenta: { tipoAcceso: 'invitado', perfil: null },
    });
    expect(await cuentas.eliminarCuentaServidor()).toEqual({ ok: true });
  });
});
