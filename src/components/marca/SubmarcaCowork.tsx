// Generado a partir de `assets/marca/ole-cowork.svg` (original de la marca; se quita el nombre "OLE / …", que en la app va como texto aparte).
import { useId } from 'react';
import { Svg, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';

type Props = {
  ancho: number;
};

export const PROPORCION_SUBMARCACOWORK = 1.0;

export function SubmarcaCowork({ ancho }: Props) {
  const idDegradado = useId();
  return (
    <Svg width={ancho} height={ancho * PROPORCION_SUBMARCACOWORK} viewBox="0 0 565.74 565.74">
      <Defs>
        <LinearGradient
          id={idDegradado}
          x1="94.01"
          y1="371.04"
          x2="471.74"
          y2="371.04"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.18" stopColor="#FE016D" />
          <Stop offset="0.46" stopColor="#F83B11" />
          <Stop offset="0.9" stopColor="#CAF22C" />
        </LinearGradient>
      </Defs>
      <Circle cx="282.87" cy="282.87" r="282.87" fill="#262020" />
      <Path
        fill={`url(#${idDegradado})`}
        d="M223.08,356.01c12.13,13.36,6.41,38.32-12.79,55.76-19.2,17.44-44.59,20.75-56.73,7.39-12.13-13.36-6.41-38.32,12.79-55.76,19.2-17.44,44.59-20.75,56.73-7.39ZM193.39,313.69c-1.62-4.69-6.92-7.66-14.43-8.81,5.61-3.51,8.92-7.82,8.92-12.49,0-11.77-21.01-21.31-46.94-21.31s-46.94,9.54-46.94,21.31c0,10.56,16.94,19.33,39.16,21.01-19.16,8.76-31.32,21.6-28.13,30.84,3.69,10.67,26.46,12.47,50.85,4.04,24.4-8.44,41.18-23.92,37.5-34.59ZM471.74,293.83c0-12.57-21.23-22.75-47.42-22.75s-47.42,10.19-47.42,22.75c0,4.23,2.41,8.18,6.59,11.57-6.14,1.38-10.43,4.17-11.86,8.28-3.69,10.67,13.25,26.2,37.84,34.71,24.59,8.5,47.51,6.75,51.19-3.92,2.93-8.48-7.19-20.04-23.82-28.7,20.11-2.64,34.89-11.46,34.89-21.94ZM399.38,363.4c-19.2-17.44-44.59-20.75-56.73-7.39-12.13,13.36-6.41,38.32,12.79,55.76,19.2,17.44,44.59,20.75,56.73,7.39,12.13-13.36,6.41-38.32-12.79-55.76ZM283.04,375.97c-28.82,0-52.18,21.27-52.18,47.51s23.36,47.51,52.18,47.51,52.18-21.27,52.18-47.51-23.36-47.51-52.18-47.51Z"
      />
    </Svg>
  );
}
