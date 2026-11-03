import { useCallback, useMemo, useState } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Platform,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { radios } from '@/theme';

// Collage interactivo de la Bienvenida 2 (pedido de la responsable): las fotos están apiladas como en Figma;
// la de arriba se arrastra con el dedo y, al soltarla lejos, vuelve a su lugar pero pasa al fondo
// de la pila, dejando ver la siguiente.

export type FotoMazo = {
  fuente: ImageSourcePropType;
  descripcion: string;
  // Centro y rotación de la foto en el frame de Figma (402 px de ancho).
  centroX: number;
  centroY: number;
  rotacion: number;
};

type Props = {
  fotos: FotoMazo[];
  ancho: number;
  alto: number;
};

const ANCHO_FOTO = 149;
const ALTO_FOTO = 193;
const ANCHO_FIGMA = 402;
const DISTANCIA_PARA_PASAR = 60;
const usarDriverNativo = Platform.OS !== 'web';

export function MazoFotos({ fotos, ancho, alto }: Props) {
  // Orden de dibujo: el último índice queda arriba.
  const [orden, setOrden] = useState(() => fotos.map((_, i) => i));
  const [arrastre] = useState(() => new Animated.ValueXY());
  const escala = Math.min(1, ancho / ANCHO_FIGMA);
  const desplazamiento = (ancho - ANCHO_FIGMA * escala) / 2;

  const enviarAlFondo = useCallback(
    () => setOrden((actual) => [actual[actual.length - 1], ...actual.slice(0, -1)]),
    [],
  );

  const gestos = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) + Math.abs(g.dy) > 4,
        onPanResponderMove: Animated.event([null, { dx: arrastre.x, dy: arrastre.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, g) => {
          const lejos = Math.hypot(g.dx, g.dy) > DISTANCIA_PARA_PASAR;
          if (lejos) enviarAlFondo();
          Animated.spring(arrastre, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            useNativeDriver: usarDriverNativo,
          }).start();
        },
      }),
    [arrastre, enviarAlFondo],
  );

  const indiceArriba = orden[orden.length - 1];

  return (
    <View
      style={{ width: ancho, height: alto }}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={`Fotos de Olegario. ${fotos[indiceArriba].descripcion}`}
      accessibilityHint="Deslizá la foto de arriba para ver la siguiente"
      accessibilityActions={[{ name: 'increment' }, { name: 'activate' }]}
      onAccessibilityAction={enviarAlFondo}
    >
      {orden.map((indice) => {
        const foto = fotos[indice];
        const esArriba = indice === indiceArriba;
        const posicion = {
          left: desplazamiento + (foto.centroX - ANCHO_FOTO / 2) * escala,
          top: (foto.centroY - ALTO_FOTO / 2) * escala,
          width: ANCHO_FOTO * escala,
          height: ALTO_FOTO * escala,
        };
        return (
          <Animated.View
            key={indice}
            testID={esArriba ? 'foto-arriba' : undefined}
            {...(esArriba ? gestos.panHandlers : {})}
            style={[
              styles.foto,
              posicion,
              {
                transform: [
                  ...(esArriba ? arrastre.getTranslateTransform() : []),
                  { rotate: `${foto.rotacion}deg` },
                ],
              },
            ]}
          >
            <Image source={foto.fuente} style={styles.imagen} resizeMode="cover" />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  foto: {
    position: 'absolute',
    borderRadius: radios.md + 2,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  imagen: { width: '100%', height: '100%' },
});
