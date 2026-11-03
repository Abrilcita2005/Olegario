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
// la de arriba se arrastra con el dedo y las demás se mueven y giran levemente, cada una hacia un lado
// distinto, como un juego de cartas que se desordena. Al soltar todas vuelven a su lugar y, si la de
// arriba se soltó lejos, pasa al fondo de la pila, dejando ver la siguiente.

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

// Cuánto acompaña cada foto al dedo según su profundidad en la pila (1 = la de abajo de la de arriba):
// proporción del arrastre en X e Y y giro extra máximo en grados. Signos distintos = se desordenan.
const MOVIMIENTO_POR_PROFUNDIDAD = [
  { x: 1, y: 1, giro: 10 },
  { x: 0.32, y: 0.22, giro: -7 },
  { x: -0.2, y: 0.28, giro: 6 },
  { x: 0.24, y: -0.16, giro: -5 },
  { x: -0.14, y: -0.2, giro: 4 },
];
const RECORRIDO_PARA_GIRO = 200;

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
          // Todas vuelven a su lugar; recién entonces la de arriba pasa al fondo (sin saltos).
          Animated.spring(arrastre, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 50,
            useNativeDriver: usarDriverNativo,
          }).start(() => {
            if (lejos) enviarAlFondo();
          });
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
      {orden.map((indice, posicionEnPila) => {
        const foto = fotos[indice];
        const esArriba = indice === indiceArriba;
        const profundidad = orden.length - 1 - posicionEnPila;
        const movimiento =
          MOVIMIENTO_POR_PROFUNDIDAD[profundidad % MOVIMIENTO_POR_PROFUNDIDAD.length];
        const giroExtra = arrastre.x.interpolate({
          inputRange: [-RECORRIDO_PARA_GIRO, 0, RECORRIDO_PARA_GIRO],
          outputRange: [
            `${foto.rotacion - movimiento.giro}deg`,
            `${foto.rotacion}deg`,
            `${foto.rotacion + movimiento.giro}deg`,
          ],
          extrapolate: 'clamp',
        });
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
                  { translateX: Animated.multiply(arrastre.x, movimiento.x) },
                  { translateY: Animated.multiply(arrastre.y, movimiento.y) },
                  { rotate: giroExtra },
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
