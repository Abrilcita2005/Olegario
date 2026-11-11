import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

// Etapa 14: errores encontrados en el recorrido con servidor.
// 1) "Iniciar sesión" no mandaba el correo ni la contraseña (quedaba cargando sin avisar nada).
// 2) Sin conexión, las pestañas mostraban pantallas vacías que parecían ciertas.
const mockServidorCaido = { valor: false };
const mockIngresar = jest.fn();
const mockCuenta = { conSesion: true };

jest.mock('@/services/api', () => ({
  apiConfigurada: true,
  leerToken: () => Promise.resolve('t'.repeat(64)),
  guardarToken: () => Promise.resolve(),
  pedirApi: () =>
    Promise.resolve(
      mockServidorCaido.valor
        ? { ok: false, estado: 0, error: 'No pudimos conectarnos.', codigo: 'sin_conexion' }
        : { ok: true, datos: [] },
    ),
}));

jest.mock('@/services/cuentaServidor', () => ({
  ingresarConCorreo: (...args: unknown[]) => mockIngresar(...args),
  ingresarComoInvitado: jest.fn(),
  registrarCuenta: jest.fn(),
  cerrarSesionServidor: jest.fn(() => Promise.resolve()),
  eliminarCuentaServidor: jest.fn(),
  actualizarPerfilServidor: jest.fn(),
  cambiarFotoServidor: jest.fn(),
  leerCuentaActual: () =>
    Promise.resolve(
      mockServidorCaido.valor
        ? 'sin_conexion'
        : mockCuenta.conSesion
          ? { id: 'u1', tipoAcceso: 'miembro', perfil: null, fotoUrl: null }
          : null,
    ),
}));

beforeEach(async () => {
  mockIngresar.mockReset();
  mockServidorCaido.valor = false;
  mockCuenta.conSesion = true;
  await AsyncStorage.clear();
  await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
});

it('iniciar sesión manda el correo y la contraseña, y muestra el motivo si el servidor rechaza', async () => {
  mockIngresar.mockResolvedValue({ ok: false, error: 'Correo o contraseña incorrectos.' });
  // Sin sesión guardada: arranca en Acceso.
  mockCuenta.conSesion = false;
  await renderRouter('./src/app', { initialUrl: '/iniciar-sesion' });
  await waitFor(() => expect(screen).toHavePathname('/iniciar-sesion'));
  await fireEvent.changeText(screen.getByLabelText('Email o usuario'), 'ana@ejemplo.com');
  await fireEvent.changeText(screen.getByLabelText('Contraseña'), 'clave-segura-1');
  await act(async () => {
    await fireEvent.press(screen.getByRole('button', { name: 'Iniciar sesión' }));
  });
  await waitFor(() => expect(mockIngresar).toHaveBeenCalled());
  expect(mockIngresar).toHaveBeenCalledWith('ana@ejemplo.com', 'clave-segura-1');
  expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.');
});

it('sin conexión, las pestañas lo avisan en lugar de mostrar pantallas vacías', async () => {
  mockServidorCaido.valor = true;
  await AsyncStorage.setItem('olegario.tipoAcceso', 'miembro');
  await renderRouter('./src/app', { initialUrl: '/espacios' });
  await waitFor(() => expect(screen).toHavePathname('/espacios'));
  expect(await screen.findByText('Sin conexión con Olegario')).toBeTruthy();
  expect(screen.getByText('No pudimos cargar los espacios')).toBeTruthy();
});
