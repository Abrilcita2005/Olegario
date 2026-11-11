import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

// Etapa 14: correcciones pedidas por la responsable después de probar la app en el teléfono.
async function abrir(ruta: string) {
  await AsyncStorage.clear();
  await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
  await AsyncStorage.setItem('olegario.tipoAcceso', 'miembro');
  await renderRouter('./src/app', { initialUrl: ruta });
  await waitFor(() => expect(screen).toHavePathname(ruta));
}

it('carta de OLE/CAFÉ: pedir, elegir la entrega y ver que estará listo en 10 minutos', async () => {
  await abrir('/carta-cafe');
  expect(screen.getByText('OLE/CAFÉ')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: /^Pedir la promo cafetería/ }));
  expect(await screen.findByText('¡El barista recibió tu pedido!')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Llevar a mi mesa' }));
  expect(await screen.findByText('Tu pedido fue recibido')).toBeTruthy();
  expect(screen.getByText(/Estará listo en 10 minutos\. Te lo llevamos a tu mesa\./)).toBeTruthy();
});

it('detalle de un evento: descripción, inscriptos y anotarse', async () => {
  await abrir('/evento/evento-sunset-beats');
  expect(await screen.findByRole('header', { name: 'Sunset Beats & Vinyl Session' })).toBeTruthy();
  expect(screen.getByText(/DJ set de vinilos/)).toBeTruthy();
  expect(screen.getByText('14 personas inscriptas')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Inscribirme' }));
  expect(await screen.findByText('15 personas inscriptas')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Inscripto · Darme de baja' })).toBeTruthy();
});

it('detalle del coworkeo itinerante (novedad)', async () => {
  await abrir('/evento/coworkeo-itinerante');
  expect(await screen.findByRole('header', { name: 'Coworkeo itinerante' })).toBeTruthy();
  expect(screen.getByText(/jornada de trabajo fuera de Olegario/)).toBeTruthy();
});
