import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

// Recorre la estructura de navegación de la Etapa 5 con el estado guardado que corresponda a cada caso.
async function abrirApp(estado: { bienvenida?: boolean; acceso?: 'miembro' | 'invitado' }) {
  await AsyncStorage.clear();
  if (estado.bienvenida) await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
  if (estado.acceso) await AsyncStorage.setItem('olegario.tipoAcceso', estado.acceso);
  await renderRouter('./src/app', { initialUrl: '/' });
}

async function tocar(elemento: Parameters<typeof fireEvent.press>[0]) {
  await act(async () => {
    fireEvent.press(elemento);
  });
}

describe('Primera apertura', () => {
  it('muestra la bienvenida y, al terminarla, pasa a Acceso', async () => {
    await abrirApp({});
    await waitFor(() => expect(screen).toHavePathname('/bienvenida'));

    await tocar(screen.getByRole('button', { name: 'SIGUIENTE' }));

    await waitFor(() => expect(screen).toHavePathname('/acceso'));
    expect(await AsyncStorage.getItem('olegario.bienvenidaVista')).toBe('si');
  });
});

describe('Acceso', () => {
  it('no vuelve a mostrar la bienvenida si ya se vio', async () => {
    await abrirApp({ bienvenida: true });
    await waitFor(() => expect(screen).toHavePathname('/acceso'));
  });

  it('el modo invitado entra a la app', async () => {
    await abrirApp({ bienvenida: true });
    await waitFor(() => expect(screen).toHavePathname('/acceso'));

    await tocar(screen.getByRole('button', { name: 'Modo invitado' }));

    await waitFor(() => expect(screen).toHavePathname('/'));
    expect(screen.getByRole('header', { name: 'Inicio' })).toBeTruthy();
  });

  it('iniciar sesión (simulado) entra a la app como miembro', async () => {
    await abrirApp({ bienvenida: true });
    await waitFor(() => expect(screen).toHavePathname('/acceso'));

    await tocar(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await waitFor(() => expect(screen).toHavePathname('/iniciar-sesion'));
    await tocar(screen.getByRole('button', { name: 'Entrar como miembro (simulado)' }));

    await waitFor(() => expect(screen).toHavePathname('/'));
    expect(await AsyncStorage.getItem('olegario.tipoAcceso')).toBe('miembro');
  });
});

describe('App principal', () => {
  it.each([
    ['Espacios', '/espacios'],
    ['Agenda', '/agenda'],
    ['Comunidad', '/comunidad'],
  ])('la pestaña %s abre %s', async (etiqueta, ruta) => {
    await abrirApp({ bienvenida: true, acceso: 'miembro' });
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('tab', { name: etiqueta }));

    expect(screen).toHavePathname(ruta);
    expect(screen.getByRole('header', { name: etiqueta })).toBeTruthy();
  });

  it('el encabezado lleva al perfil, a la carta del café y de vuelta al inicio', async () => {
    await abrirApp({ bienvenida: true, acceso: 'miembro' });
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('button', { name: 'Mi perfil y membresía' }));
    await waitFor(() => expect(screen).toHavePathname('/perfil'));
    await tocar(screen.getByRole('button', { name: 'Volver' }));
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('button', { name: 'Carta del café' }));
    await waitFor(() => expect(screen).toHavePathname('/carta-cafe'));
    await tocar(screen.getByRole('button', { name: 'Volver' }));
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('tab', { name: 'Agenda' }));
    await tocar(screen.getByRole('button', { name: 'Ir al inicio' }));
    await waitFor(() => expect(screen).toHavePathname('/'));
  });

  it('el botón Novedades abre el panel y se puede cerrar', async () => {
    await abrirApp({ bienvenida: true, acceso: 'invitado' });
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('button', { name: 'Novedades, 2 nuevas' }));
    await waitFor(() => expect(screen).toHavePathname('/novedades'));

    await tocar(screen.getByRole('button', { name: 'Cerrar novedades' }));
    await waitFor(() => expect(screen).toHavePathname('/'));
  });

  it('cerrar sesión vuelve a Acceso', async () => {
    await abrirApp({ bienvenida: true, acceso: 'miembro' });
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('button', { name: 'Mi perfil y membresía' }));
    await tocar(screen.getByRole('button', { name: 'Cerrar sesión' }));

    await waitFor(() => expect(screen).toHavePathname('/acceso'));
    expect(await AsyncStorage.getItem('olegario.tipoAcceso')).toBeNull();
  });

  it('sin sesión no se puede entrar a la app por enlace directo', async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
    await renderRouter('./src/app', { initialUrl: '/perfil' });
    await waitFor(() => expect(screen).toHavePathname('/acceso'));
  });
});
