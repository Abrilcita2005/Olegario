import { useCallback, useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  type ImageSourcePropType,
} from 'react-native';

import { radios } from '@/theme';

// Collage de la Bienvenida 2: las fotos están apiladas como en Figma y se reparten solas, como cartas
// (pedido de la responsable en la Etapa 14, en lugar de arrastrarlas): cada unos segundos la de arriba
// sale hacia un costado girando y vuelve al fondo de la pila, dejando ver la siguiente. Tocar el mazo
// reparte la siguiente enseguida. Con "Reducir movimiento" activado en el teléfono no se anima solo.

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
  // Milisegundos entre una carta y la siguiente (0 = no se reparte solo).
  intervalo?: number;
};

const ANCHO_FOTO = 149;
const ALTO_FOTO = 193;
const ANCHO_FIGMA = 402;
const DURACION_REPARTO = 650;
const usarDriverNativo = Platform.OS !== 'web';

export function MazoFotos({ fotos, ancho, alto, intervalo = 2500 }: Props) {
  // Orden de dibujo: el último índice queda arriba.
  const [orden, setOrden] = useState(() => fotos.map((_, i) => i));
  const [salida] = useState(() => new Animated.Value(0));
  const [repartiendo, setRepartiendo] = useState(false);
  const [sinMovimiento, setSinMovimiento] = useState(false);
  const escala = Math.min(1, ancho / ANCHO_FIGMA);
  const desplazamiento = (ancho - ANCHO_FIGMA * escala) / 2;

  const enviarAlFondo = useCallback(
    () => setOrden((actual) => [actual[actual.length - 1], ...actual.slice(0, -1)]),
    [],
  );

  // Reparte la carta de arriba: sale hacia la derecha girando y, al terminar, pasa al fondo.
  const repartir = useCallback(() => {
    if (repartiendo) return;
    if (sinMovimiento) {
      enviarAlFondo();
      return;
    }
    setRepartiendo(true);
    Animated.timing(salida, {
      toValue: 1,
      duration: DURACION_REPARTO,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: usarDriverNativo,
    }).start(() => {
      enviarAlFondo();
      salida.setValue(0);
      setRepartiendo(false);
    });
  }, [enviarAlFondo, repartiendo, salida, sinMovimiento]);

  useEffect(() => {
    let activo = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reducir) => activo && setSinMovimiento(reducir))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setSinMovimiento);
    return () => {
      activo = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (!intervalo || sinMovimiento) return;
    const id = setInterval(repartir, intervalo);
    return () => clearInterval(id);
  }, [intervalo, repartir, sinMovimiento]);

  const indiceArriba = orden[orden.length - 1];

  return (
    <Pressable
      onPress={repartir}
      style={{ width: ancho, height: alto }}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={`Fotos de Olegario. ${fotos[indiceArriba].descripcion}`}
      accessibilityHint="Tocá para ver la siguiente foto"
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
        // Solo se mueve la de arriba: hacia la derecha y un poco arriba, girando como una carta.
        const transform = esArriba
          ? [
              {
                translateX: salida.interpolate({ inputRange: [0, 1], outputRange: [0, ancho] }),
              },
              { translateY: salida.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }) },
              {
                rotate: salida.interpolate({
                  inputRange: [0, 1],
                  outputRange: [`${foto.rotacion}deg`, `${foto.rotacion + 25}deg`],
                }),
              },
            ]
          : [{ rotate: `${foto.rotacion}deg` }];
        return (
          <Animated.View
            key={indice}
            testID={esArriba ? 'foto-arriba' : undefined}
            style={[styles.foto, posicion, { transform }]}
          >
            <Image source={foto.fuente} style={styles.imagen} resizeMode="cover" />
          </Animated.View>
        );
      })}
    </Pressable>
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
