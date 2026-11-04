import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

import {
  efemeridesDelDia,
  fechaEfemeride,
  fechaEvento,
  marcasDeActividad,
  pinDeReserva,
  textoFaltante,
} from '@/utils/agenda';

import { efemerides } from '../data/efemerides';
import { eventosDePrueba } from '../data/mock/agenda';
import { reservasDePrueba } from '../data/mock/reservas';

// Jueves 1 de octubre de 2026: Día internacional del café (hay efeméride y la reserva de prueba).
const DIA = new Date(2026, 9, 1);
const a = (hora: number, minuto = 0, dias = 0) => new Date(2026, 9, 1 + dias, hora, minuto);

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
    expect(fechaEvento(storytelling)).toBe('Vie 2 · 17:00 hs');
    expect(fechaEvento(sunset)).toBe('Sáb 3 · 18:30 hs');
    expect(fechaEfemeride(efemeridesDelDia(efemerides, DIA)[0])).toBe('1 de octubre');
  });

  it('el calendario de efemérides solo trae las del día (y ninguna si no hay)', () => {
    expect(efemeridesDelDia(efemerides, DIA).map((e) => e.id)).toEqual(['cafe']);
    expect(efemeridesDelDia(efemerides, new Date(2026, 10, 4))).toEqual([]);
    expect(efemeridesDelDia(efemerides, new Date(2027, 3, 27))[0].fecha).toEqual(
      new Date(2027, 3, 27),
    );
  });

  it('incluye las fechas de Mendoza', () => {
    const titulos = (mes: number, dia: number) =>
      efemeridesDelDia(efemerides, new Date(2026, mes - 1, dia)).map((e) => e.titulo);
    expect(titulos(3, 2)).toEqual(['Aniversario de la fundación de Mendoza']);
    expect(titulos(4, 17)).toEqual(['Día mundial del Malbec']);
    expect(titulos(11, 24)).toEqual(['Día del vino argentino, bebida nacional']);
  });

  it('las efemérides tienen fechas válidas y sin repetir', () => {
    const ids = new Set(efemerides.map((e) => e.id));
    expect(ids.size).toBe(efemerides.length);
    for (const e of efemerides) {
      const fecha = new Date(2026, e.mes - 1, e.dia);
      expect(fecha.getMonth()).toBe(e.mes - 1);
      expect(fecha.getDate()).toBe(e.dia);
    }
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
    expect(screen.getByRole('header', { name: 'Día internacional del café' })).toBeTruthy();
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
    expect(screen.getByRole('header', { name: 'Día internacional del café' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Mis reservas (1)' }));
    expect(screen.getByRole('header', { name: 'Mesa con Luz Natural' })).toBeTruthy();
    expect(screen.queryByRole('header', { name: 'Día internacional del café' })).toBeNull();
  });

  it('al tocar otro día muestra sus eventos y se puede inscribir', async () => {
    await abrir();
    await fireEvent.press(screen.getByRole('button', { name: 'VIE 2, hay un evento' }));
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
    expect(screen.getByRole('button', { name: 'JUE 8' })).toBeTruthy();
    expect(screen.getByText('Nada agendado este día')).toBeTruthy();
  });

  it('el invitado no ve reservas pero puede inscribirse a eventos', async () => {
    await abrir('invitado');
    expect(screen.queryByRole('header', { name: 'Mesa con Luz Natural' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Mis reservas (0)' }));
    expect(screen.getByText('Reservar es para miembros')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Todo' }));
    await fireEvent.press(screen.getByRole('button', { name: 'SÁB 3, hay un evento' }));
    await fireEvent.press(
      screen.getByRole('button', { name: 'Inscribirme a Sunset Beats & Vinyl Session' }),
    );
    expect(screen.getByText('Inscripto')).toBeTruthy();
  });
});
