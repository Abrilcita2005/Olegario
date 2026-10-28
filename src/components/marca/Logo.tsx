import { LogoBlanco } from './LogoBlanco';
import { LogoNegro } from './LogoNegro';

type Props = {
  // "sobreClaro" usa el logo negro; "sobreOscuro", el blanco.
  fondo: 'sobreClaro' | 'sobreOscuro';
  ancho?: number;
};

// Logo horizontal "OLEGARIO EN MOVIMIENTO" (223 px de ancho en el encabezado de Figma).
export function Logo({ fondo, ancho = 223 }: Props) {
  return fondo === 'sobreClaro' ? <LogoNegro ancho={ancho} /> : <LogoBlanco ancho={ancho} />;
}
