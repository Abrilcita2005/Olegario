import { Text, type TextProps } from 'react-native';

import { colores, tipografia, type NombreColor, type VarianteTexto } from '@/theme';

type Props = TextProps & {
  variante?: VarianteTexto;
  color?: NombreColor;
};

// Texto con la escala tipográfica del proyecto. Respeta el tamaño de letra del sistema.
export function Texto({ variante = 'cuerpo', color = 'textoSobreClaro', style, ...props }: Props) {
  return <Text {...props} style={[tipografia[variante], { color: colores[color] }, style]} />;
}
