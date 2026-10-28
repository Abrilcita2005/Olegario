import { fireEvent, render, screen } from '@testing-library/react-native';

import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { Boton, CampoFormulario, Casilla, Chip, SelectorSegmentado } from '@/components/ui';
import { colores, marca } from '@/theme';
import { relacionDeContraste } from '@/utils/contraste';
import { calcularFortaleza } from '@/utils/fortalezaContrasena';
import { formatearPrecio } from '@/utils/formatos';

describe('Colores de marca (SVG originales)', () => {
  it('usa los valores aprobados', () => {
    expect(marca).toMatchObject({
      rosa: '#FE016D',
      naranja: '#F83B11',
      lima: '#CAF22C',
      negro: '#262020',
    });
  });

  it('el texto principal cumple contraste AA (4,5:1) sobre su fondo', () => {
    expect(relacionDeContraste(colores.textoSobreClaro, colores.fondo)).toBeGreaterThanOrEqual(4.5);
    expect(
      relacionDeContraste(colores.textoSobreOscuro, colores.superficie),
    ).toBeGreaterThanOrEqual(4.5);
    expect(relacionDeContraste(colores.acentoLima, colores.superficie)).toBeGreaterThanOrEqual(4.5);
    expect(relacionDeContraste(colores.textoTerciario, colores.superficie)).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it('documenta los casos que no llegan a AA para texto chico (ver L-05)', () => {
    expect(relacionDeContraste('#FFFFFF', marca.rosa)).toBeLessThan(4.5);
    expect(relacionDeContraste('#FFFFFF', marca.naranja)).toBeLessThan(4.5);
    expect(relacionDeContraste(marca.rosa, colores.fondo)).toBeLessThan(4.5);
  });
});

describe('calcularFortaleza', () => {
  it.each([
    ['', 0],
    ['abc', 1],
    ['abcdefgh', 1],
    ['Abcdefgh', 2],
    ['Abcdefg1', 3],
    ['Abcdef1!', 4],
  ])('"%s" tiene nivel %i', (contrasena, nivel) => {
    expect(calcularFortaleza(contrasena)).toBe(nivel);
  });
});

describe('Componentes base', () => {
  it('Boton llama a onPress y no lo hace si está deshabilitado', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(<Boton texto="Iniciar sesión" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(<Boton texto="Iniciar sesión" onPress={onPress} deshabilitado />);
    await fireEvent.press(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('CampoFormulario permite mostrar y ocultar la contraseña', async () => {
    await render(<CampoFormulario etiqueta="Contraseña" esContrasena />);
    const input = screen.getByLabelText('Contraseña');
    expect(input.props.secureTextEntry).toBe(true);

    await fireEvent.press(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(screen.getByLabelText('Contraseña').props.secureTextEntry).toBe(false);
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeTruthy();
  });

  it('CampoFormulario muestra el error', async () => {
    await render(<CampoFormulario etiqueta="Correo" error="Ingresá un correo válido." />);
    expect(screen.getByText('Ingresá un correo válido.')).toBeTruthy();
  });

  it('SelectorSegmentado marca la opción elegida', async () => {
    const onCambiar = jest.fn();
    await render(
      <SelectorSegmentado
        opciones={[
          { valor: 'a', etiqueta: 'Miembro' },
          { valor: 'b', etiqueta: 'Invitado' },
        ]}
        seleccionado="a"
        onCambiar={onCambiar}
        etiquetaAccesible="Tipo de acceso"
      />,
    );
    expect(screen.getByRole('radio', { name: 'MIEMBRO' }).props.accessibilityState.checked).toBe(
      true,
    );
    await fireEvent.press(screen.getByRole('radio', { name: 'INVITADO' }));
    expect(onCambiar).toHaveBeenCalledWith('b');
  });

  it('Casilla alterna su estado', async () => {
    const onCambiar = jest.fn();
    await render(<Casilla marcada={false} onCambiar={onCambiar} texto="Acepto los términos" />);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Acepto los términos' }));
    expect(onCambiar).toHaveBeenCalledWith(true);
  });

  it('Chip muestra su texto', async () => {
    await render(<Chip texto="En curso" />);
    expect(screen.getByText('En curso')).toBeTruthy();
  });
});

describe('Marca', () => {
  it('IconoSubmarca expone el nombre del servicio', async () => {
    await render(<IconoSubmarca submarca="cowork" />);
    expect(screen.getByLabelText('OLE/COWORK')).toBeTruthy();
  });
});

describe('formatearPrecio', () => {
  it.each([
    [1500, '$ 1.500'],
    [3800, '$ 3.800'],
    [250, '$ 250'],
    [1234567, '$ 1.234.567'],
  ])('%i → %s', (valor, esperado) => {
    expect(formatearPrecio(valor)).toBe(esperado);
  });
});
