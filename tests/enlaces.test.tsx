import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import * as WebBrowser from 'expo-web-browser';

import { ENLACE_CONOCE_OLEGARIO, ENLACE_PLANO_RESERVAS } from '../data/enlaces';

// "Conocé Olegario" (Home) y el plano (Espacios): filas discretas que abren las páginas de Vercel en un
// panel sobre la app (expo-web-browser, simulado en las pruebas).
jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(() => Promise.resolve({ type: 'dismiss' })),
  WebBrowserPresentationStyle: { PAGE_SHEET: 'pageSheet' },
}));

async function abrir(ruta: string) {
  await AsyncStorage.clear();
  await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
  await AsyncStorage.setItem('olegario.tipoAcceso', 'miembro');
  await renderRouter('./src/app', { initialUrl: ruta });
  await waitFor(() => expect(screen).toHavePathname(ruta));
}

beforeEach(() => jest.mocked(WebBrowser.openBrowserAsync).mockClear());

it('el Home tiene "Conocé Olegario" al final y abre el recorrido en video', async () => {
  await abrir('/');
  await act(async () => {
    fireEvent.press(
      screen.getByRole('button', {
        name: 'Conocé Olegario. Recorrido en video por el coworking',
      }),
    );
  });
  expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
    ENLACE_CONOCE_OLEGARIO,
    expect.anything(),
  );
});

it('en Espacios, la barra "Buscá tu mesa en tiempo real" abre el plano (con el aviso de que sus reservas van aparte)', async () => {
  await abrir('/espacios');
  expect(screen.getByText(/se guardan aparte/)).toBeTruthy();
  await act(async () => {
    fireEvent.press(
      screen.getByRole('button', {
        name: 'Buscá tu mesa en tiempo real: abrir el plano de Olegario',
      }),
    );
  });
  expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
    ENLACE_PLANO_RESERVAS,
    expect.anything(),
  );
});

describe('plano unido al servidor (D-73)', () => {
  afterEach(() => jest.resetModules());

  function cargar(conectado: boolean, conSesion: boolean) {
    const pedirApi = jest.fn(() =>
      Promise.resolve({ ok: true, datos: { codigo: 'c'.repeat(32) } }),
    );
    jest.doMock('../data/enlaces', () => ({
      ...jest.requireActual('../data/enlaces'),
      PLANO_CONECTADO_AL_SERVIDOR: conectado,
    }));
    jest.doMock('@/services/api', () => ({
      apiConfigurada: true,
      leerToken: () => Promise.resolve(conSesion ? 't'.repeat(64) : null),
      pedirApi,
    }));
    let modulo!: typeof import('@/services/enlacesExternos');
    let navegador!: typeof WebBrowser;
    jest.isolateModules(() => {
      modulo = require('@/services/enlacesExternos');
      navegador = require('expo-web-browser');
    });
    return { abrir: modulo.abrirPlanoDeReservas, pedirApi, navegador };
  }

  it('con el plano conectado y sesión, entra directo con un código de un solo uso', async () => {
    const { abrir, pedirApi, navegador } = cargar(true, true);
    await abrir();
    expect(pedirApi).toHaveBeenCalledWith('POST', '/cuentas/codigo');
    expect(navegador.openBrowserAsync).toHaveBeenCalledWith(
      `${ENLACE_PLANO_RESERVAS}?codigo=${'c'.repeat(32)}`,
      expect.anything(),
    );
  });

  it('sin sesión, o mientras el plano publicado no está conectado, se abre sin código', async () => {
    for (const [conectado, conSesion] of [
      [true, false],
      [false, true],
    ]) {
      const { abrir, pedirApi, navegador } = cargar(conectado, conSesion);
      await abrir();
      expect(pedirApi).not.toHaveBeenCalled();
      expect(navegador.openBrowserAsync).toHaveBeenCalledWith(
        ENLACE_PLANO_RESERVAS,
        expect.anything(),
      );
      jest.resetModules();
    }
  });
});
