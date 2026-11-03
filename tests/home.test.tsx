import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

import { estadoReserva, reservaParaMostrar, textoHorario } from '@/utils/reservas';
import { primerNombre, saludoSegunHora, textoSaludo } from '@/utils/saludo';

import { reservasDePrueba } from '../data/mock/reservas';

const DIA = new Date(2026, 10, 3); // martes 3 de noviembre de 2026
const a = (hora: number, minuto = 0) => new Date(2026, 10, 3, hora, minuto);

// La hora que "ve" la app en cada prueba del Home.
let mockAhora = a(11);
jest.mock('@/hooks/useAhora', () => ({ useAhora: () => mockAhora }));

describe('saludo', () => {
  it.each([
    [5, 'Buen día'],
    [11, 'Buen día'],
    [12, 'Buenas tardes'],
    [19, 'Buenas tardes'],
    [20, 'Buenas noches'],
    [3, 'Buenas noches'],
  ])('a las %i hs dice "%s"', (hora, esperado) => {
    expect(saludoSegunHora(hora)).toBe(esperado);
  });

  it('usa el primer nombre si lo hay', () => {
    expect(primerNombre('  Sofía Valenzuela ')).toBe('Sofía');
    expect(textoSaludo(a(9), 'Sofía Valenzuela')).toBe('¡Buen día, Sofía!');
    expect(textoSaludo(a(21), null)).toBe('¡Buenas noches!');
  });
});

describe('reservas', () => {
  const [reserva] = reservasDePrueba(DIA);

  it('calcula el estado según la hora', () => {
    expect(estadoReserva(reserva, a(9))).toBe('proxima');
    expect(estadoReserva(reserva, a(11))).toBe('enCurso');
    expect(estadoReserva(reserva, a(14))).toBe('finalizada');
  });

  it('el Home no muestra reservas finalizadas', () => {
    expect(reservaParaMostrar([reserva], a(11))).toBe(reserva);
    expect(reservaParaMostrar([reserva], a(15))).toBeNull();
  });

  it('arma el horario como en Figma', () => {
    expect(textoHorario(reserva, a(9))).toBe('Hoy: 10:00 - 14:00 hs');
    expect(textoHorario(reserva, new Date(2026, 10, 2, 18))).toBe('Mañana: 10:00 - 14:00 hs');
  });
});

describe('Home', () => {
  async function abrirHome(hora: number, acceso: 'miembro' | 'invitado', nombre?: string) {
    mockAhora = a(hora);
    await AsyncStorage.clear();
    await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
    await AsyncStorage.setItem('olegario.tipoAcceso', acceso);
    if (nombre)
      await AsyncStorage.setItem(
        'olegario.perfilBasico',
        JSON.stringify({ nombre, correo: 'x@y.com', profesion: 'Diseño' }),
      );
    await renderRouter('./src/app', { initialUrl: '/' });
    await waitFor(() => expect(screen).toHavePathname('/'));
  }

  it('a las 11 muestra el saludo con el nombre y la reserva en curso', async () => {
    await abrirHome(11, 'miembro', 'Sofía Prueba');
    expect(screen.getByRole('header', { name: '¡Buen día, Sofía!' })).toBeTruthy();
    expect(screen.getByText('En curso')).toBeTruthy();
    expect(screen.getByText('Hoy: 10:00 - 14:00 hs')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ver detalles y check-in' })).toBeTruthy();
  });

  it('a las 9 la reserva figura como próxima', async () => {
    await abrirHome(9, 'miembro');
    expect(screen.getByText('Próxima')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ver detalles' })).toBeTruthy();
  });

  it('a las 16 ya no hay reserva y se invita a reservar', async () => {
    await abrirHome(16, 'miembro');
    expect(screen.getByText('Todavía no tenés reservas')).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Reservá tu lugar' }));
    });
    await waitFor(() => expect(screen).toHavePathname('/espacios'));
  });

  it('el invitado no ve reservas y se lo invita a explorar', async () => {
    await abrirHome(11, 'invitado');
    expect(screen.queryByText('Tu reserva actual')).toBeNull();
    expect(screen.getByText('Descubrí los espacios de Olegario')).toBeTruthy();
  });

  it('"Ver detalles" abre el detalle y las tarjetas de servicio llevan a Espacios', async () => {
    await abrirHome(11, 'miembro');
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Ver detalles y check-in' }));
    });
    await waitFor(() => expect(screen).toHavePathname('/reserva/reserva-prueba-1'));
    expect(screen.getByText('Sector Jardín · Puesto #14')).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Volver' }));
    });
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'OLE/STREAM, 2 Salas Disponibles' }));
    });
    await waitFor(() => expect(screen).toHavePathname('/espacios'));
  });
});
