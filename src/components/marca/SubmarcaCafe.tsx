// Generado a partir de `assets/marca/ole-cafe.svg` (original de la marca; se quita el nombre "OLE / …", que en la app va como texto aparte).
import { useId } from 'react';
import { Svg, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';

type Props = {
  ancho: number;
};

export const PROPORCION_SUBMARCACAFE = 1.0;

export function SubmarcaCafe({ ancho }: Props) {
  const idDegradado = useId();
  return (
    <Svg width={ancho} height={ancho * PROPORCION_SUBMARCACAFE} viewBox="0 0 563.62 563.62">
      <Defs>
        <LinearGradient
          id={idDegradado}
          x1="187.28"
          y1="322.91"
          x2="391.71"
          y2="118.48"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FE016D" />
          <Stop offset="0.4" stopColor="#F83B11" />
          <Stop offset="0.79" stopColor="#CAF22C" />
        </LinearGradient>
      </Defs>
      <Circle cx="281.81" cy="281.81" r="281.81" fill="#262020" />
      <Path
        fill={`url(#${idDegradado})`}
        d="M298.77,280.35c43.8,4.06,77.01,23.56,77.01,47,0,26.39-42.07,47.78-93.97,47.78s-93.97-21.39-93.97-47.78c0-23.45,33.21-42.95,77.01-47-43.8-3.99-77.01-23.16-77.01-46.21,0-25.94,42.07-46.97,93.97-46.97s93.97,21.03,93.97,46.97c0,23.05-33.21,42.22-77.01,46.21ZM281.81,151.59c51.9,0,93.97-13.07,93.97-29.2s-42.07-29.2-93.97-29.2-93.97,13.07-93.97,29.2,42.07,29.2,93.97,29.2Z"
      />
    </Svg>
  );
}
