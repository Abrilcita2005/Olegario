import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

import {
  fechaEfemeride,
  fechaEvento,
  marcasDeActividad,
  pinDeReserva,
  textoFaltante,
} from '@/utils/agenda';

import { efemeridesDePrueba, eventosDePrueba } from '../data/mock/agenda';
import { reservasDePrueba } from '../data/mock/reservas';

const DIA = new Date(2026, 10, 4); // miércoles 4 de noviembre de 2026
const a = (hora: number, minuto = 0, dias = 0) => new Date(2026, 10, 4 + dias, hora, minuto);

let mockAhora = a(9, 15);
jest.mock('@/hooks/useAhora', () => ({ useAhora: () => mockAhora }));
jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn(() => Promise.resolve(true)) }));

const [reserva] = reservasDePrueba(DIA); // hoy 10:00 a 14:00
const [storytelling, sunset] = eventosDePrueba(DIA);

describe('lógica de la agenda', () => {
  it('el PIN de prueba tiene 4 cifras y es siempre el mismo para una reserva', () => {
    expect(pinDeReserva('reserva-prueba-1')).toMatch(/^\d{4}$/);
    expect(pinDeReserva('reserva-prueba-1')).toBe(pinDeReserva('reserva-prueba-1'));
    expect(pinDeReserva('otra')).not.toBe(pinDeReserva('reserva-prueba-1'));
  });

  it('dice cuánto falta como en Figma', () => {
    expect(textoFaltante(reserva, a(9, 15))).toBe('En 45 min');
    expect(textoFaltante(reserva, a(7))).toBe('En 3 h');
    expect(textoFaltante(reserva, a(11))).toBe('En curso');
    expect(textoFaltante(reserva, a(20, 0, -1))).toBe('Mañana');
  });

  it('arma las fechas de eventos y efemérides', () => {
    expect(fechaEvento(storytelling)).toBe('Jue 5 · 17:00 hs');
    expect(fechaEvento(sunset)).toBe('Vie 6 · 18:30 hs');
    expect(fechaEfemeride(efemeridesDePrueba(DIA)[0])).toBe('4 de noviembre');
  });

  it('marca los días con reserva (naranja), evento (lima) y after office (rosa)', () => {
    const marcas = marcasDeActividad([reserva], [storytelling, sunset]);
    expect(marcas.map((m) => m.color)).toEqual(['acentoNaranja', 'acentoLima', 'acento']);
  });
});

describe('pantalla Agenda', () => {
  async function abrir(acceso: 'miembro' | 'invitado' = 'miembro') {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
    await AsyncStorage.setItem('olegario.tipoAcceso', acceso);
    await renderRouter('./src/app', { initialUrl: '/agenda' });
    await screen.findByRole('header', { name: 'Tu rincón perfecto' });
  }

  beforeEach(() => {
    mockAhora = a(9, 15);
  });

  it('muestra la reserva y la efeméride de hoy, y copia el PIN', async () => {
    await abrir();
    expect(screen.getByRole('header', { name: 'Mesa con Luz Natural' })).toBeTruthy();
    expect(screen.getByText('En 45 min')).toBeTruthy();
    expect(screen.getByText('10:00 - 14:00 hs')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Día mundial del diseño gráfico' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mis reservas (1)' })).toBeTruthy();

    const pin = pinDeReserva('reserva-prueba-1');
    await fireEvent.press(screen.getByRole('button', { name: /^PIN de acceso/ }));
    expect(Clipboard.setStringAsync).toHaveBeenCalledWith(pin);
    expect(await screen.findByText('PIN copiado')).toBeTruthy();
  });

  it('"Modificar" abre el detalle de la reserva', async () => {
    await abrir();
    await fireEvent.press(screen.getByRole('button', { name: 'Modificar' }));
    await waitFor(() => expect(screen).toHavePathname('/reserva/reserva-prueba-1'));
  });

  it('los filtros muestran solo reservas o solo efemérides', async () => {
    await abrir();
    await fireEvent.press(screen.getByRole('button', { name: 'Efemérides' }));
    expect(screen.queryByRole('header', { name: 'Mesa con Luz Natural' })).toBeNull();
    expect(screen.getByRole('header', { name: 'Día mundial del diseño gráfico' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Mis reservas (1)' }));
    expect(screen.getByRole('header', { name: 'Mesa con Luz Natural' })).toBeTruthy();
    expect(screen.queryByRole('header', { name: 'Día mundial del diseño gráfico' })).toBeNull();
  });

  it('al tocar otro día muestra sus eventos y se puede inscribir', async () => {
    await abrir();
    await fireEvent.press(screen.getByRole('button', { name: 'JUE 5, hay un evento' }));
    expect(screen.getByRole('header', { name: 'Storytelling para Emprendedores' })).toBeTruthy();
    expect(screen.queryByRole('header', { name: 'Mesa con Luz Natural' })).toBeNull();
    expect(screen.getByText('+14 inscriptos')).toBeTruthy();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Inscribirme a Storytelling para Emprendedores' }),
    );
    expect(screen.getByText('Inscripto')).toBeTruthy();
    expect(screen.getByText('+15 inscriptos')).toBeTruthy();
    expect(JSON.parse((await AsyncStorage.getItem('olegario.inscripciones')) ?? '[]')).toEqual([
      'evento-storytelling',
    ]);
  });

  it('se puede pasar a la semana siguiente', async () => {
    await abrir();
    await fireEvent.press(screen.getByRole('button', { name: 'Semana siguiente' }));
    expect(screen.getByRole('button', { name: 'MIÉ 11' })).toBeTruthy();
    expect(screen.getByText('Nada agendado este día')).toBeTruthy();
  });

  it('el invitado no ve reservas pero puede inscribirse a eventos', async () => {
    await abrir('invitado');
    expect(screen.queryByRole('header', { name: 'Mesa con Luz Natural' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Mis reservas (0)' }));
    expect(screen.getByText('Reservar es para miembros')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Todo' }));
    await fireEvent.press(screen.getByRole('button', { name: 'VIE 6, hay un evento' }));
    await fireEvent.press(
      screen.getByRole('button', { name: 'Inscribirme a Sunset Beats & Vinyl Session' }),
    );
    expect(screen.getByText('Inscripto')).toBeTruthy();
  });
});
