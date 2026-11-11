import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

// Recorre la estructura de navegación de la Etapa 5 con el estado guardado que corresponda a cada caso.
async function abrirApp(estado: { bienvenida?: boolean; acceso?: 'miembro' | 'invitado' }) {
  await AsyncStorage.clear();
  if (estado.bienvenida) await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
  if (estado.acceso) await AsyncStorage.setItem('olegario.tipoAcceso', estado.acceso);
  await renderRouter('./src/app', { initialUrl: '/' });
}

async function tocar(elemento: Parameters<typeof fireEvent.press>[0]) {
  // fireEvent ya es asíncrono y envuelve el toque en act (Testing Library v14).
  await fireEvent.press(elemento);
}

describe('Primera apertura', () => {
  it('muestra la bienvenida y, al terminarla, pasa a Acceso', async () => {
    await abrirApp({});
    await waitFor(() => expect(screen).toHavePathname('/bienvenida'));

    // Cada paso avanza un instante después del toque (se ve el cambio de color del botón).
    for (const paso of [1, 2, 3]) {
      await tocar(await screen.findByRole('button', { name: `Siguiente, paso ${paso} de 3` }));
    }

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

    await tocar(screen.getByRole('button', { name: 'Entrar en modo invitado' }));

    await waitFor(() => expect(screen).toHavePathname('/'));
    expect(
      screen.getByRole('header', { name: /^¡(Buen día|Buenas tardes|Buenas noches)/ }),
    ).toBeTruthy();
  });

  it('iniciar sesión pide los datos y después entra como miembro', async () => {
    await abrirApp({ bienvenida: true });
    await waitFor(() => expect(screen).toHavePathname('/acceso'));

    await tocar(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await waitFor(() => expect(screen).toHavePathname('/iniciar-sesion'));

    await tocar(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByText('Ingresá tu email o usuario.')).toBeTruthy();
    expect(screen.getByText('Ingresá tu contraseña.')).toBeTruthy();
    expect(screen).toHavePathname('/iniciar-sesion');

    await fireEvent.changeText(screen.getByLabelText('Email o usuario'), 'sofi@olegario.work');
    await fireEvent.changeText(screen.getByLabelText('Contraseña'), 'una-clave');
    await tocar(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(screen).toHavePathname('/'));
    expect(await AsyncStorage.getItem('olegario.tipoAcceso')).toBe('miembro');
  });

  it('el registro valida los datos, exige aceptar los términos y guarda el perfil sin la contraseña', async () => {
    await abrirApp({ bienvenida: true });
    await waitFor(() => expect(screen).toHavePathname('/acceso'));
    await tocar(screen.getByRole('button', { name: 'Crear una cuenta' }));
    await waitFor(() => expect(screen).toHavePathname('/registro'));

    await fireEvent.changeText(screen.getByLabelText('Nombre completo'), 'Sofía Prueba');
    await fireEvent.changeText(screen.getByLabelText('Correo profesional'), 'correo-mal');
    await fireEvent.changeText(screen.getByLabelText('Profesión / Área de trabajo'), 'Diseño');
    await fireEvent.changeText(screen.getByLabelText('Contraseña'), 'corta');
    await tocar(screen.getByRole('button', { name: 'Crear cuenta y continuar' }));
    expect(screen.getByText(/Ingresá un correo válido/)).toBeTruthy();
    expect(screen.getByText(/al menos 8 caracteres/)).toBeTruthy();
    expect(screen.getByText(/aceptá los términos/)).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText('Correo profesional'), 'sofia@estudio.design');
    await fireEvent.changeText(screen.getByLabelText('Contraseña'), 'Olegario2026!');
    await tocar(screen.getByRole('checkbox'));
    await tocar(screen.getByRole('button', { name: 'Crear cuenta y continuar' }));

    await waitFor(() => expect(screen).toHavePathname('/'));
    const guardado = await AsyncStorage.getItem('olegario.perfilBasico');
    expect(JSON.parse(guardado ?? '{}')).toEqual({
      nombre: 'Sofía Prueba',
      correo: 'sofia@estudio.design',
      profesion: 'Diseño',
    });
    expect(guardado).not.toContain('Olegario2026!');
  });

  it('el invitado no tiene perfil de cuenta y se le ofrece crear una', async () => {
    await abrirApp({ bienvenida: true, acceso: 'invitado' });
    await waitFor(() => expect(screen).toHavePathname('/'));
    await tocar(screen.getByRole('button', { name: 'Mi perfil y membresía' }));

    expect(screen.getByText('Tu perfil te está esperando')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cambiar foto' })).toBeNull();
    await tocar(screen.getByRole('button', { name: 'Crear mi cuenta' }));
    await waitFor(() => expect(screen).toHavePathname('/acceso'));
  });
});

describe('App principal', () => {
  it.each([
    ['Espacios', '/espacios', 'Tu rincón perfecto'],
    ['Agenda', '/agenda', 'Tu rincón perfecto'],
    ['Comunidad', '/comunidad', 'Colaborá, sumate, conectá'],
  ])('la pestaña %s abre %s', async (etiqueta, ruta, titulo) => {
    await abrirApp({ bienvenida: true, acceso: 'miembro' });
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('tab', { name: etiqueta }));

    expect(screen).toHavePathname(ruta);
    expect(screen.getByRole('header', { name: titulo })).toBeTruthy();
  });

  it('el encabezado lleva al perfil, a la carta del café y de vuelta al inicio', async () => {
    await abrirApp({ bienvenida: true, acceso: 'miembro' });
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('button', { name: 'Mi perfil y membresía' }));
    await waitFor(() => expect(screen).toHavePathname('/perfil'));
    await tocar(screen.getByRole('button', { name: 'Volver' }));
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('button', { name: 'Carta de OLE/CAFÉ' }));
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

  it('cerrar sesión desde el Perfil vuelve a la bienvenida', async () => {
    await abrirApp({ bienvenida: true, acceso: 'miembro' });
    await waitFor(() => expect(screen).toHavePathname('/'));

    await tocar(screen.getByRole('button', { name: 'Mi perfil y membresía' }));
    await tocar(screen.getByRole('button', { name: 'Cerrar sesión' }));

    await waitFor(() => expect(screen).toHavePathname('/bienvenida'));
    expect(await AsyncStorage.getItem('olegario.tipoAcceso')).toBeNull();
    expect(await AsyncStorage.getItem('olegario.bienvenidaVista')).toBeNull();
  });

  it('sin sesión no se puede entrar a la app por enlace directo', async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
    await renderRouter('./src/app', { initialUrl: '/perfil' });
    await waitFor(() => expect(screen).toHavePathname('/acceso'));
  });

  it('la carta del café filtra por categoría', async () => {
    await abrirApp({ bienvenida: true, acceso: 'miembro' });
    await waitFor(() => expect(screen).toHavePathname('/'));
    await tocar(screen.getByRole('button', { name: 'Carta de OLE/CAFÉ' }));
    await waitFor(() => expect(screen.getByText('Cold brew')).toBeTruthy());

    await tocar(screen.getByRole('radio', { name: 'PASTELERÍA' }));

    expect(screen.queryByText('Cold brew')).toBeNull();
    expect(screen.getByText('Cookie de chocolate')).toBeTruthy();
    await tocar(screen.getByRole('radio', { name: 'FRÍOS' }));
    expect(screen.getAllByText('Vegano').length).toBeGreaterThan(0);
  });
});

describe('Foto de perfil', () => {
  it('"Cambiar foto" abre el menú con las opciones y se puede cancelar', async () => {
    await abrirApp({ bienvenida: true, acceso: 'miembro' });
    await waitFor(() => expect(screen).toHavePathname('/'));
    await tocar(screen.getByRole('button', { name: 'Mi perfil y membresía' }));

    await tocar(screen.getByRole('button', { name: 'Cambiar foto' }));
    expect(screen.getByRole('button', { name: 'Elegir de la galería' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sacar una foto' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Quitar foto' })).toBeNull();

    await tocar(screen.getByRole('button', { name: 'Cancelar' }));
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Elegir de la galería' })).toBeNull(),
    );
  });
});
