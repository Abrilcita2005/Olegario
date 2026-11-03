import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { MazoFotos } from '@/components/bienvenida/MazoFotos';
import { puede } from '@/utils/permisos';
import {
  validarCorreo,
  validarContrasenaNueva,
  validarNombre,
  validarRegistro,
} from '@/utils/validaciones';

describe('validaciones', () => {
  it.each([
    ['sofia@estudio.design', null],
    ['  sofia@estudio.design  ', null],
    ['sofia@estudio', 'error'],
    ['sofia estudio.com', 'error'],
    ['', 'error'],
  ])('correo "%s"', (valor, esperado) => {
    expect(validarCorreo(valor) === null ? null : 'error').toBe(esperado);
  });

  it('nombre y contraseña', () => {
    expect(validarNombre('  ')).not.toBeNull();
    expect(validarNombre('Sofía')).toBeNull();
    expect(validarContrasenaNueva('1234567')).not.toBeNull();
    expect(validarContrasenaNueva('12345678')).toBeNull();
  });

  it('registro completo sin errores', () => {
    expect(
      validarRegistro({
        nombre: 'Sofía',
        correo: 'sofia@estudio.design',
        profesion: 'Diseño',
        contrasena: 'Olegario2026!',
        aceptaTerminos: true,
      }),
    ).toEqual({});
  });
});

describe('permisos', () => {
  it('el invitado mira e inscribe a eventos, pero no reserva, no usa Comunidad ni tiene perfil', () => {
    expect(puede('invitado', 'verContenido')).toBe(true);
    expect(puede('invitado', 'inscribirseEvento')).toBe(true);
    expect(puede('invitado', 'reservarEspacio')).toBe(false);
    expect(puede('invitado', 'usarComunidad')).toBe(false);
    expect(puede('invitado', 'verPerfilCuenta')).toBe(false);
  });

  it('el miembro puede todo y sin sesión no se puede nada', () => {
    expect(puede('miembro', 'reservarEspacio')).toBe(true);
    expect(puede('miembro', 'verPerfilCuenta')).toBe(true);
    expect(puede(null, 'verContenido')).toBe(false);
  });
});

describe('MazoFotos', () => {
  const fotos = ['Primera', 'Segunda', 'Tercera'].map((descripcion, i) => ({
    fuente: { uri: `foto-${i}.jpg` },
    descripcion,
    centroX: 100 + i * 50,
    centroY: 120,
    rotacion: 0,
  }));

  it('la acción de accesibilidad pasa la foto de arriba al fondo', async () => {
    await render(<MazoFotos fotos={fotos} ancho={402} alto={360} />);
    const mazo = screen.getByRole('adjustable');
    expect(mazo.props.accessibilityLabel).toContain('Tercera');

    await act(async () => {
      fireEvent(mazo, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    });

    expect(screen.getByRole('adjustable').props.accessibilityLabel).toContain('Segunda');
  });
});
