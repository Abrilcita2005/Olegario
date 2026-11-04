import MaskedViewOriginal from '@react-native-masked-view/masked-view';
import type { ComponentType, ReactElement } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, type TextStyle, type ViewProps } from 'react-native';

import { degradados, type VarianteTexto } from '@/theme';

import { Texto } from './Texto';

// Los tipos de masked-view son de una versión anterior de React: se declaran acá con sus props reales.
const MaskedView = MaskedViewOriginal as unknown as ComponentType<
  ViewProps & { maskElement: ReactElement }
>;

type Props = {
  children: string;
  variante?: VarianteTexto;
};

// Texto con el degradado de acento de Figma (rosa → naranja), p. ej. "CREATIVO" y "PERFECTO".
// En iOS y Android se recorta el degradado con la forma de las letras (masked-view, aprobado 2026-11-04);
// en la web se usa el recorte de fondo de CSS, porque masked-view no lo soporta ahí.
export function TextoDegradado({ children, variante = 'tituloDestacado' }: Props) {
  const [desde, hasta] = degradados.acento.colores;

  if (Platform.OS === 'web') {
    const estiloWeb = {
      backgroundImage: `linear-gradient(90deg, ${desde}, ${hasta})`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    } as unknown as TextStyle;
    return (
      <Texto variante={variante} style={[styles.margenCursiva, estiloWeb]}>
        {children}
      </Texto>
    );
  }

  return (
    <MaskedView
      accessible
      accessibilityLabel={children}
      maskElement={
        <Texto variante={variante} style={styles.margenCursiva}>
          {children}
        </Texto>
      }
    >
      <LinearGradient
        colors={[desde, hasta]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Copia invisible: da el tamaño al degradado. */}
      <Texto variante={variante} style={[styles.margenCursiva, styles.invisible]}>
        {children}
      </Texto>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  invisible: { opacity: 0 },
  // Lugar para la última letra en cursiva, que si no queda recortada por el degradado.
  margenCursiva: { paddingRight: 4 },
});
