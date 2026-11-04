import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

import { separarEtiquetas, validarPublicacion } from '@/utils/comunidad';

const mockAhora = new Date(2026, 10, 4, 11, 0);
jest.mock('@/hooks/useAhora', () => ({ useAhora: () => mockAhora }));

describe('lógica de Comunidad', () => {
  it('valida la publicación', () => {
    const base = {
      tipo: 'colaborador' as const,
      busca: '',
      titulo: 'Hola',
      descripcion: 'corta',
      etiquetas: '',
    };
    expect(Object.keys(validarPublicacion(base)).sort()).toEqual([
      'busca',
      'descripcion',
      'titulo',
    ]);
    expect(
      validarPublicacion({
        ...base,
        tipo: 'iniciativa',
        titulo: 'Huerta compartida',
        descripcion: 'Armamos una huerta en la terraza entre todos.',
      }),
    ).toEqual({});
  });

  it('separa las etiquetas sin vacías ni repetidas', () => {
    expect(separarEtiquetas('Figma, Mobile UX ,  , figma')).toEqual(['Figma', 'Mobile UX']);
    expect(separarEtiquetas('a,b,c,d,e,f')).toHaveLength(5);
  });
});

describe('pantalla Comunidad', () => {
  async function abrir(acceso: 'miembro' | 'invitado' = 'miembro', url = '/comunidad') {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('olegario.bienvenidaVista', 'si');
    await AsyncStorage.setItem('olegario.tipoAcceso', acceso);
    await AsyncStorage.setItem(
      'olegario.perfilBasico',
      JSON.stringify({ nombre: 'Sofía Prueba', correo: 's@p.com', profesion: 'Diseñadora' }),
    );
    await renderRouter('./src/app', { initialUrl: url });
  }

  it('muestra proyectos, talentos y talleres; en Conexión Abierta aparecés en Talentos', async () => {
    await abrir();
    await screen.findByRole('header', { name: 'Colaborá, sumate, conectá' });
    expect(screen.getByText('3 Convocatorias activas')).toBeTruthy();
    expect(
      screen.getByRole('header', { name: 'EcoTrack: App de impacto y huella de carbono' }),
    ).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Clara Méndez' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Club de Lectura Tech & Diseño' })).toBeTruthy();
    // La reserva de prueba está en curso a las 11: se muestra dónde estás.
    expect(screen.getByRole('header', { name: 'Sofía Prueba (vos)' })).toBeTruthy();
    expect(screen.getByText('OLE/COWORK · Mesa con Luz Natural')).toBeTruthy();
  });

  it('Modo Foco te oculta de las listas y se guarda', async () => {
    await abrir();
    await screen.findByRole('header', { name: 'Sofía Prueba (vos)' });
    await fireEvent.press(screen.getByRole('radio', { name: 'Modo Foco' }));
    expect(screen.queryByRole('header', { name: 'Sofía Prueba (vos)' })).toBeNull();
    expect(screen.getByText('No aparecés en las listas ni se muestra dónde estás')).toBeTruthy();
    expect(JSON.parse((await AsyncStorage.getItem('olegario.comunidad')) ?? '{}').modo).toBe(
      'foco',
    );
  });

  it('filtra las oportunidades', async () => {
    await abrir();
    await screen.findByText('3 Convocatorias activas');
    await fireEvent.press(screen.getByRole('button', { name: 'Iniciativas' }));
    expect(screen.getByText('1 Convocatoria activa')).toBeTruthy();
    expect(
      screen.queryByRole('header', { name: 'EcoTrack: App de impacto y huella de carbono' }),
    ).toBeNull();
  });

  it('contactar envía una solicitud simulada', async () => {
    await abrir();
    await fireEvent.press(await screen.findByRole('button', { name: 'Contactar' }));
    await fireEvent.changeText(screen.getByLabelText('Mensaje'), 'Hola Clara, me interesa.');
    await fireEvent.press(screen.getByRole('button', { name: 'Enviar solicitud' }));
    expect(await screen.findByLabelText('Contactar: solicitud enviada')).toBeTruthy();
    const guardado = JSON.parse((await AsyncStorage.getItem('olegario.comunidad')) ?? '{}');
    expect(guardado.solicitudes['clara-mendez']).toBe('Hola Clara, me interesa.');
  });

  it('publicar valida los datos y agrega la publicación a la lista', async () => {
    await abrir();
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Publicar proyecto o búsqueda' }),
    );
    await waitFor(() => expect(screen).toHavePathname('/publicar'));
    await fireEvent.press(screen.getByRole('button', { name: 'Publicar' }));
    expect(screen.getByText(/Contá qué perfil buscás/)).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText('¿Qué perfil buscás?'), 'Ilustrador/a');
    await fireEvent.changeText(screen.getByLabelText('Título'), 'Libro ilustrado de Mendoza');
    await fireEvent.changeText(
      screen.getByLabelText('Descripción'),
      'Buscamos ilustraciones para un libro sobre los barrios de Mendoza.',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Etiquetas (separadas por coma, opcional)'),
      'Ilustración, Editorial',
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Publicar' }));
    await waitFor(() => expect(screen).toHavePathname('/comunidad'));
    expect(screen.getByRole('header', { name: 'Libro ilustrado de Mendoza' })).toBeTruthy();
    expect(screen.getByText('4 Convocatorias activas')).toBeTruthy();
    expect(screen.getByText('Tu publicación está visible para la comunidad.')).toBeTruthy();
  });

  it('el nombre de una persona abre su perfil público', async () => {
    await abrir();
    await fireEvent.press(await screen.findByRole('link', { name: 'Ver perfil de Clara Méndez' }));
    await waitFor(() => expect(screen).toHavePathname('/persona/clara-mendez'));
    expect(screen.getByText(/Asesoría técnica en arquitectura web/)).toBeTruthy();
  });

  it('el perfil de Martina muestra el "Sobre mí" de Figma', async () => {
    await abrir('miembro', '/persona/martina-rossi');
    expect(await screen.findByRole('header', { name: 'Martina Rossi' })).toBeTruthy();
    expect(screen.getByText(/Apasionada por crear interfaces elegantes/)).toBeTruthy();
    expect(screen.getByText('En Ole/Café ahora · Mesa 12')).toBeTruthy();
  });

  it('el invitado no usa Comunidad', async () => {
    await abrir('invitado');
    expect(await screen.findByText('Sumate a la comunidad')).toBeTruthy();
    expect(screen.queryByText('3 Convocatorias activas')).toBeNull();
  });
});
