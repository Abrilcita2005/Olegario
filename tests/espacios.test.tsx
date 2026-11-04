import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

import {
  diaReservable,
  estadoEspacio,
  lugaresLibres,
  puedeCancelar,
  validarReserva,
} from '@/utils/disponibilidad';
import { filtrarEspacios } from '@/utils/espacios';
import {
  ajustarHorario,
  diaCorto,
  diasVisibles,
  proximoPaso,
  textoHorarioElegido,
} from '@/utils/fechas';

import { espaciosDePrueba } from '../data/mock/espaciosOlegario';
import { reservasDePrueba } from '../data/mock/reservas';

const DIA = new Date(2026, 10, 4); // miércoles 4 de noviembre de 2026
const a = (hora: number, minuto = 0, dias = 0) => new Date(2026, 10, 4 + dias, hora, minuto);

let mockAhora = a(9);
jest.mock('@/hooks/useAhora', () => ({ useAhora: () => mockAhora }));

const espacios = espaciosDePrueba(DIA);
const porId = (id: string) => espacios.find((e) => e.id === id)!;
const reservas = reservasDePrueba(DIA);

describe('fechas', () => {
  it('muestra la semana de lunes a domingo, corrida para ver siempre los 3 días siguientes', () => {
    const semana = diasVisibles(a(9));
    expect(semana.map(diaCorto)).toEqual(['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']);
    expect(semana[0].getDate()).toBe(2);
    const desdeDomingo = diasVisibles(a(9, 0, 4)); // domingo 8
    expect(desdeDomingo[0].getDate()).toBe(5);
    expect(desdeDomingo[6].getDate()).toBe(11);
  });

  it('redondea al próximo paso de 30 minutos', () => {
    expect(proximoPaso(a(9, 10)).getMinutes()).toBe(30);
    expect(proximoPaso(a(9, 40)).getHours()).toBe(10);
    expect(proximoPaso(a(9)).getMinutes()).toBe(0);
  });

  it('arma el horario elegido como en Figma', () => {
    expect(textoHorarioElegido(a(10), a(14), a(9))).toBe('Hoy, 10:00 - 14:00 (4 hrs)');
    expect(textoHorarioElegido(a(22), a(0, 0, 1), a(9))).toBe('Hoy, 22:00 - 24:00 (2 hrs)');
    expect(textoHorarioElegido(a(9, 0, 1), a(10, 30, 1), a(9))).toBe(
      'Mañana, 09:00 - 10:30 (1,5 hrs)',
    );
  });

  it('al cambiar de día conserva el horario y lo recorta a las 24:00', () => {
    const manana = ajustarHorario(a(0, 0, 1), a(10), a(12), a(9));
    expect(manana.inicio).toEqual(a(10, 0, 1));
    expect(manana.fin).toEqual(a(12, 0, 1));
    const tarde = ajustarHorario(DIA, a(23), a(1, 0, 1), a(9));
    expect(tarde.fin).toEqual(a(0, 0, 1));
    // Hoy no se puede empezar antes de ahora.
    expect(ajustarHorario(DIA, a(7), a(8), a(9, 10)).inicio).toEqual(a(9, 30));
  });
});

describe('disponibilidad y reglas de reserva', () => {
  it('calcula el estado de cada espacio en el horario elegido', () => {
    expect(estadoEspacio(porId('rincon-botanico-zen'), a(9), a(11))).toEqual({ tipo: 'libre' });
    expect(estadoEspacio(porId('mesa-comunitaria-cafe'), a(9), a(11))).toEqual({
      tipo: 'cupos',
      libres: 3,
    });
    expect(estadoEspacio(porId('sala-acustica-focus'), a(9), a(11))).toMatchObject({
      tipo: 'ocupado',
      hasta: '11:30',
    });
    // La reserva de prueba ocupa la Mesa con Luz Natural de 10 a 14.
    expect(lugaresLibres(porId('mesa-luz-natural'), a(9), a(11), reservas)).toBe(0);
    expect(lugaresLibres(porId('mesa-luz-natural'), a(14), a(16), reservas)).toBe(1);
  });

  it('valida duración, pasado, anticipación, horas del plan y lugar', () => {
    const base = { espacio: porId('rincon-botanico-zen'), ahora: a(9), horasDisponibles: 10 };
    expect(validarReserva({ ...base, inicio: a(10), fin: a(12) })).toBeNull();
    expect(validarReserva({ ...base, inicio: a(12), fin: a(12) })).toBe('duracion');
    expect(validarReserva({ ...base, inicio: a(8), fin: a(10) })).toBe('pasado');
    expect(validarReserva({ ...base, inicio: a(10, 0, 3), fin: a(11, 0, 3) })).toBeNull();
    expect(validarReserva({ ...base, inicio: a(10, 0, 4), fin: a(11, 0, 4) })).toBe('anticipacion');
    expect(validarReserva({ ...base, inicio: a(10), fin: a(12), horasDisponibles: 1 })).toBe(
      'horasInsuficientes',
    );
    expect(validarReserva({ ...base, inicio: a(16), fin: a(17) })).toBe('sinLugar');
  });

  it('se puede reservar hoy y los 3 días siguientes', () => {
    expect(diaReservable(DIA, a(9))).toBe(true);
    expect(diaReservable(a(0, 0, 3), a(9))).toBe(true);
    expect(diaReservable(a(0, 0, 4), a(9))).toBe(false);
    expect(diaReservable(a(0, 0, -1), a(9))).toBe(false);
  });

  it('se puede cancelar hasta 30 minutos antes', () => {
    const [reserva] = reservas; // 10:00
    expect(puedeCancelar(reserva, a(9, 30))).toBe(true);
    expect(puedeCancelar(reserva, a(9, 31))).toBe(false);
  });

  it('filtra por servicio y busca sin importar tildes', () => {
    expect(filtrarEspacios(espacios, 'stream', '').map((e) => e.id)).toEqual([
      'sala-acustica-focus',
    ]);
    expect(filtrarEspacios(espacios, null, 'cafeteria').map((e) => e.id)).toEqual([
      'mesa-comunitaria-cafe',
    ]);
    expect(filtrarEspacios(espacios, 'network', '')).toEqual([]);
  });
});

describe('pantalla Espacios', () => {
  async function abrir(
    url: string,
    acceso: 'miembro' | 'invitado' = 'miembro',
    hora = 9,
    minuto = 0,
  ) {
    mockAhora = a(hora, minuto);
    await AsyncStorage.clear();
    await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
    await AsyncStorage.setItem('olegario.tipoAcceso', acceso);
    await renderRouter('./src/app', { initialUrl: url });
  }

  it('muestra los espacios con su estado en el horario elegido', async () => {
    await abrir('/espacios');
    await waitFor(() => expect(screen.getByText('4 PUESTOS LIBRES')).toBeTruthy());
    expect(screen.getByRole('header', { name: 'Rincón Botánico Zen' })).toBeTruthy();
    expect(screen.getByText('Hoy, 09:00 - 11:00 (2 hrs)')).toBeTruthy();
    expect(screen.getByText('Ocupado hasta 11:30')).toBeTruthy();
    expect(screen.getByText('3 LIBRES')).toBeTruthy();
    // Puntos bajo el día: hoy hay una reserva; mañana, un evento.
    expect(screen.getByRole('button', { name: 'MIÉ 4, tenés una reserva' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'JUE 5, hay un evento' })).toBeTruthy();
  });

  it('un miembro reserva y la reserva queda guardada', async () => {
    await abrir('/espacios');
    await waitFor(() => expect(screen.getByText('4 PUESTOS LIBRES')).toBeTruthy());
    await fireEvent.press(
      screen.getByRole('button', { name: 'Reservá tu lugar: Rincón Botánico Zen' }),
    );
    expect(screen.getByText('Descuenta 2 hs de tu plan (te quedan 42 hs).')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Confirmar reserva' }));
    await waitFor(() =>
      expect(screen.getByRole('header', { name: '¡Reserva lista!' })).toBeTruthy(),
    );
    const guardadas = JSON.parse((await AsyncStorage.getItem('olegario.reservas')) ?? '{}');
    expect(guardadas.propias).toHaveLength(1);
    expect(guardadas.propias[0].espacioId).toBe('rincon-botanico-zen');
    await fireEvent.press(screen.getByRole('button', { name: 'Seguir explorando' }));
    expect(screen.getByText('3 PUESTOS LIBRES')).toBeTruthy();
  });

  it('desde el Home se abre filtrado por servicio', async () => {
    await abrir('/');
    await waitFor(() => expect(screen).toHavePathname('/'));
    await fireEvent.press(screen.getByRole('button', { name: 'OLE/STREAM, 2 Salas Disponibles' }));
    await waitFor(() => expect(screen).toHavePathname('/espacios'));
    expect(screen).toHaveSearchParams({ servicio: 'stream' });
    expect(screen.getByRole('header', { name: 'Sala Acústica Focus' })).toBeTruthy();
    expect(screen.queryByRole('header', { name: 'Rincón Botánico Zen' })).toBeNull();
  });

  it('el invitado mira los espacios pero no puede reservar', async () => {
    await abrir('/espacios', 'invitado');
    await waitFor(() => expect(screen.getByText('4 PUESTOS LIBRES')).toBeTruthy());
    expect(screen.queryByRole('button', { name: /Reservá tu lugar/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'Crear cuenta: Rincón Botánico Zen' })).toBeTruthy();
  });

  it('se cancela una reserva hasta 30 minutos antes', async () => {
    await abrir('/reserva/reserva-prueba-1');
    await fireEvent.press(await screen.findByRole('button', { name: 'Cancelar reserva' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Sí, cancelar' }));
    await waitFor(() => expect(screen.getByText('Cancelaste tu reserva')).toBeTruthy());
    const guardadas = JSON.parse((await AsyncStorage.getItem('olegario.reservas')) ?? '{}');
    expect(guardadas.pruebasCanceladas).toEqual(['reserva-prueba-1']);
  });

  it('pasado el límite ya no se puede cancelar', async () => {
    await abrir('/reserva/reserva-prueba-1', 'miembro', 9, 45);
    await screen.findByRole('header', { name: 'Mesa con Luz Natural' });
    expect(screen.queryByRole('button', { name: 'Cancelar reserva' })).toBeNull();
    expect(screen.getByText(/se pueden cancelar hasta 30 minutos antes/)).toBeTruthy();
  });
});
