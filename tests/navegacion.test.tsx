import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

// Verifica que la app arranca en Inicio y que las 4 pestañas navegan.
describe('Navegación principal', () => {
  it('arranca en la pestaña Inicio', async () => {
    await renderRouter('./src/app', { initialUrl: '/' });

    expect(screen).toHavePathname('/');
    expect(screen.getByRole('header', { name: 'Inicio' })).toBeTruthy();
  });

  it.each([
    ['Espacios', '/espacios'],
    ['Agenda', '/agenda'],
    ['Comunidad', '/comunidad'],
  ])('la pestaña %s abre %s', async (etiqueta, ruta) => {
    await renderRouter('./src/app', { initialUrl: '/' });

    await act(async () => {
      fireEvent.press(screen.getByRole('tab', { name: etiqueta }));
    });

    expect(screen).toHavePathname(ruta);
    expect(screen.getByRole('header', { name: etiqueta })).toBeTruthy();
  });
});
