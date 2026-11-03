import { Pressable, StyleSheet } from 'react-native';

import type { NombreColor, VarianteTexto } from '@/theme';

import { Texto } from './Texto';

type Props = {
  texto: string;
  onPress: () => void;
  variante?: VarianteTexto;
  color?: NombreColor;
  subrayado?: boolean;
};

// Texto tocable con área táctil ampliada (p. ej. "Iniciar sesión", "¿Olvidaste tu contraseña?").
export function EnlaceTexto({
  texto,
  onPress,
  variante = 'enlace',
  color,
  subrayado = false,
}: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" hitSlop={10} style={styles.base}>
      <Texto variante={variante} color={color} style={subrayado ? styles.subrayado : undefined}>
        {texto}
      </Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 24, justifyContent: 'center' },
  subrayado: { textDecorationLine: 'underline' },
});
