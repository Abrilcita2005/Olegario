import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

import { fechaLarga, porcentajeLibre, textoProximaReserva } from '@/utils/perfil';

import { reservasDePrueba } from '../data/mock/reservas';

const mockAhora = new Date(2026, 10, 4, 9, 0); // miércoles 4 de noviembre, 9:00
jest.mock('@/hooks/useAhora', () => ({ useAhora: () => mockAhora }));

describe('lógica del perfil', () => {
  it('calcula el porcentaje libre como en Figma (42 / 80 hs = 53%)', () => {
    expect(porcentajeLibre(42, 80)).toBe(53);
    expect(porcentajeLibre(0, 80)).toBe(0);
    expect(porcentajeLibre(90, 80)).toBe(100);
  });

  it('arma la fecha larga y el texto de la próxima reserva', () => {
    expect(fechaLarga(new Date(2026, 10, 30))).toBe('30 de noviembre de 2026');
    const reservas = reservasDePrueba(new Date(2026, 10, 4));
    expect(textoProximaReserva(reservas, mockAhora)).toBe(
      'Mesa con Luz Natural hoy a las 10:00 hs',
    );
    expect(textoProximaReserva(reservas, new Date(2026, 10, 4, 11))).toBe(
      'Mesa con Luz Natural ahora, hasta las 14:00 hs',
    );
    expect(textoProximaReserva([], mockAhora)).toBe('No tenés reservas próximas');
  });
});

describe('pantalla Perfil', () => {
  async function abrir(url = '/perfil') {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
    await AsyncStorage.setItem('olegario.tipoAcceso', 'miembro');
    await AsyncStorage.setItem(
      'olegario.perfilBasico',
      JSON.stringify({
        nombre: 'Sofía Valenzuela',
        correo: 'sofi@olegario.work',
        profesion: 'Diseñadora UI/UX',
      }),
    );
    await renderRouter('./src/app', { initialUrl: url });
  }

  it('muestra la membresía, las horas de Figma y los servicios', async () => {
    await abrir();
    expect(await screen.findByRole('header', { name: 'Sofía Valenzuela' })).toBeTruthy();
    expect(screen.getByText('Disponible para colaborar')).toBeTruthy();
    expect(screen.getByText('Plan Pro Creativo')).toBeTruthy();
    expect(screen.getByText('Vence el 30 de noviembre de 2026')).toBeTruthy();
    expect(screen.getByLabelText('42 de 80 horas disponibles')).toBeTruthy();
    expect(screen.getByLabelText('53% de horas libres')).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: 'Historial y Próximas Reservas. Mesa con Luz Natural hoy a las 10:00 hs',
      }),
    ).toBeTruthy();
    expect(screen.getByText('Visa terminada en •••• 4092')).toBeTruthy();
  });

  it('cargar horas extras es una simulación que suma horas', async () => {
    await abrir();
    await fireEvent.press(await screen.findByRole('button', { name: 'Cargar horas extras' }));
    expect(screen.getByText('Simulación: todavía no hay pagos, no se cobra nada.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Sumar 10 hs' }));
    expect(await screen.findByLabelText('52 de 90 horas disponibles')).toBeTruthy();
    expect(await AsyncStorage.getItem('olegario.horasExtra')).toBe('10');
  });

  it('editar perfil cambia el nombre', async () => {
    await abrir();
    await fireEvent.press(await screen.findByRole('button', { name: 'Editar perfil' }));
    await waitFor(() => expect(screen).toHavePathname('/editar-perfil'));
    await fireEvent.changeText(screen.getByLabelText('Nombre completo'), 'Sofi V.');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(screen).toHavePathname('/perfil'));
    expect(screen.getByRole('header', { name: 'Sofi V.' })).toBeTruthy();
  });

  it('eliminar cuenta pide confirmación, borra los datos y vuelve a Acceso', async () => {
    await abrir();
    await AsyncStorage.setItem('olegario.horasExtra', '5');
    await fireEvent.press(await screen.findByRole('button', { name: 'Eliminar cuenta' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Sí, eliminar mi cuenta' }));
    await waitFor(() => expect(screen).toHavePathname('/acceso'));
    expect(await AsyncStorage.getItem('olegario.perfilBasico')).toBeNull();
    expect(await AsyncStorage.getItem('olegario.horasExtra')).toBeNull();
    expect(await AsyncStorage.getItem('olegario.bienvenidaVista')).toBe('si');
  });

  it('el historial muestra las reservas y lleva al detalle', async () => {
    await abrir('/servicio/reservas');
    await fireEvent.press(await screen.findByRole('button', { name: /^Mesa con Luz Natural/ }));
    await waitFor(() => expect(screen).toHavePathname('/reserva/reserva-prueba-1'));
  });

  it('las valoraciones y las quejas se guardan (simulado)', async () => {
    await abrir('/servicio/valoraciones');
    await fireEvent.press(await screen.findByRole('radio', { name: '4 estrellas' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Enviar valoración' }));
    expect(await screen.findByText('¡Gracias por tu valoración!')).toBeTruthy();
    const guardadas = JSON.parse((await AsyncStorage.getItem('olegario.opiniones')) ?? '{}');
    expect(guardadas.valoraciones[0]).toMatchObject({
      espacioId: 'rincon-botanico-zen',
      estrellas: 4,
    });
  });

  it('el pago solo muestra la tarjeta enmascarada', async () => {
    await abrir('/servicio/pagos');
    expect(await screen.findByText('Visa terminada en •••• 4092')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Agregar medio de pago' }));
    expect(screen.getByText(/la app nunca guarda datos de tarjetas/)).toBeTruthy();
  });
});
