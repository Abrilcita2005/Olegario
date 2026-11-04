import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

async function abrir(url: string) {
  await AsyncStorage.clear();
  await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
  await AsyncStorage.setItem('olegario.tipoAcceso', 'miembro');
  await renderRouter('./src/app', { initialUrl: url });
}

describe('Novedades', () => {
  it('muestra las dos novedades de Figma con los textos corregidos', async () => {
    await abrir('/novedades');
    expect(await screen.findByRole('header', { name: 'Pulso de Olegario' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Promo cafetería' })).toBeTruthy();
    expect(
      screen.getByText('Flat White de especialidad + Cookie casera de chocolate'),
    ).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Coworkeo itinerante' })).toBeTruthy();
    expect(
      screen.getByText('¡Viajá con Olegario y conocé personas y lugares nuevos!'),
    ).toBeTruthy();
    expect(screen.getAllByText('20% OFF')).toHaveLength(2);
  });

  it('"Pedir al barista" abre la carta del café', async () => {
    await abrir('/novedades');
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Pedir al barista: Promo cafetería' }),
    );
    await waitFor(() => expect(screen).toHavePathname('/carta-cafe'));
  });

  it('"Últimos cupos" inscribe y suma a la persona', async () => {
    await abrir('/novedades');
    expect(await screen.findByLabelText('7 personas inscriptas')).toBeTruthy();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Últimos cupos: Coworkeo itinerante' }),
    );
    expect(screen.getByText('Inscripto')).toBeTruthy();
    expect(screen.getByLabelText('8 personas inscriptas')).toBeTruthy();
    expect(JSON.parse((await AsyncStorage.getItem('olegario.inscripciones')) ?? '[]')).toEqual([
      'coworkeo-itinerante',
    ]);
  });

  it('el contador del botón flotante queda siempre activo', async () => {
    await abrir('/');
    await fireEvent.press(await screen.findByRole('button', { name: 'Novedades, 2 nuevas' }));
    await waitFor(() => expect(screen).toHavePathname('/novedades'));
    await fireEvent.press(screen.getByRole('button', { name: 'Cerrar novedades' }));
    await waitFor(() => expect(screen).toHavePathname('/'));
    expect(screen.getByRole('button', { name: 'Novedades, 2 nuevas' })).toBeTruthy();
  });
});
