import MaskedViewOriginal from '@react-native-masked-view/masked-view';
import { useState, type ComponentType, type ReactElement } from 'react';
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

// Puntos de inicio y fin (relativos a la caja) de un degradado lineal de CSS con ese ángulo, para que
// expo-linear-gradient se vea igual que Figma en cajas de cualquier proporción.
export function puntosDeAngulo(angulo: number, ancho: number, alto: number) {
  const radianes = (angulo * Math.PI) / 180;
  const dx = Math.sin(radianes);
  const dy = -Math.cos(radianes);
  const mitadLargo = (Math.abs(ancho * dx) + Math.abs(alto * dy)) / 2;
  const x = ancho > 0 ? (dx * mitadLargo) / ancho : 0;
  const y = alto > 0 ? (dy * mitadLargo) / alto : 0;
  return { start: { x: 0.5 - x, y: 0.5 - y }, end: { x: 0.5 + x, y: 0.5 + y } };
}

// Palabra destacada de los títulos con el degradado exacto de Figma (p. ej. "CREATIVO" y "PERFECTO").
// En iOS y Android se recorta el degradado con la forma de las letras (masked-view, aprobado 2026-11-04);
// en la web se usa el recorte de fondo de CSS, porque masked-view no lo soporta ahí.
export function TextoDegradado({ children, variante = 'tituloDestacado' }: Props) {
  const { colores: listaColores, posiciones, angulo } = degradados.titulo;
  const [desde, hasta] = listaColores;
  const [tamano, setTamano] = useState({ ancho: 1, alto: 1 });
  const puntos = puntosDeAngulo(angulo, tamano.ancho, tamano.alto);

  if (Platform.OS === 'web') {
    const estiloWeb = {
      backgroundImage: `linear-gradient(${angulo}deg, ${desde} 0%, ${hasta} 100%)`,
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
      onLayout={(e) =>
        setTamano({ ancho: e.nativeEvent.layout.width, alto: e.nativeEvent.layout.height })
      }
      maskElement={
        <Texto variante={variante} style={styles.margenCursiva}>
          {children}
        </Texto>
      }
    >
      <LinearGradient
        colors={listaColores}
        locations={posiciones}
        start={puntos.start}
        end={puntos.end}
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
