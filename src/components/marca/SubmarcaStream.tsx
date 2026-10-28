// Generado a partir de `assets/marca/ole-stream.svg` (original de la marca; se quita el nombre "OLE / …", que en la app va como texto aparte).
import { useId } from 'react';
import { Svg, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';

type Props = {
  ancho: number;
};

export const PROPORCION_SUBMARCASTREAM = 1.0;

export function SubmarcaStream({ ancho }: Props) {
  const idDegradado = useId();
  return (
    <Svg width={ancho} height={ancho * PROPORCION_SUBMARCASTREAM} viewBox="0 0 563.84 563.84">
      <Defs>
        <LinearGradient
          id={idDegradado}
          x1="93.69"
          y1="281.68"
          x2="470.14"
          y2="281.68"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FE016D" />
          <Stop offset=".52" stopColor="#F83B11" />
          <Stop offset="1" stopColor="#CAF22C" />
        </LinearGradient>
      </Defs>
      <Circle cx="281.92" cy="281.92" r="281.92" fill="#262020" />
      <Path
        fill={`url(#${idDegradado})`}
        d="M299.55,281.68c0,52.08-8.05,94.3-17.98,94.3s-17.98-42.22-17.98-94.3,8.05-94.3,17.98-94.3,17.98,42.22,17.98,94.3ZM425.88,187.12c-20.15,0-37.14,28.75-42.5,68.1-3.31-39.34-13.8-68.1-26.24-68.1-15.09,0-27.33,42.34-27.33,94.57s12.24,94.57,27.33,94.57c12.44,0,22.93-28.75,26.24-68.1,5.36,39.34,22.36,68.1,42.5,68.1,24.45,0,44.26-42.34,44.26-94.57s-19.82-94.57-44.26-94.57ZM93.69,281.68c0,52.23,19.82,94.57,44.26,94.57,20.15,0,37.14-28.75,42.5-68.1,3.31,39.34,13.8,68.1,26.24,68.1,15.09,0,27.33-42.34,27.33-94.57,0-52.23-12.24-94.57-27.33-94.57-12.44,0-22.93,28.75-26.24,68.1-5.36-39.34-22.36-68.1-42.5-68.1-24.45,0-44.26,42.34-44.26,94.57Z"
      />
    </Svg>
  );
}
