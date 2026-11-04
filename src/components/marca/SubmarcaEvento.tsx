// Generado a partir de `assets/marca/ole-evento.svg` (original de la marca; se quita el nombre "OLE / …", que en la app va como texto aparte).
import { useId } from 'react';
import { Svg, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';

type Props = {
  ancho: number;
};

export function SubmarcaEvento({ ancho }: Props) {
  const idDegradado = useId();
  return (
    <Svg width={ancho} height={ancho} viewBox="0 0 561.5 561.5">
      <Defs>
        <LinearGradient
          id={idDegradado}
          x1="94.92"
          y1="280.44"
          x2="469.29"
          y2="280.44"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FE016D" />
          <Stop offset="0.52" stopColor="#F83B11" />
          <Stop offset="1" stopColor="#CAF22C" />
        </LinearGradient>
      </Defs>
      <Circle cx="280.75" cy="280.75" r="280.75" fill="#262020" />
      <Path
        fill={`url(#${idDegradado})`}
        d="M449.47,316.65c-23.71,41.81-59.31,66.08-79.52,54.2-10.37-6.1-14.66-20.53-13.18-38.79-11.6,31.47-28.27,51.44-44.28,49.39-8.98-1.15-16.48-9.06-21.97-21.69-2.78,22-10.16,36.93-21.58,39.82-23.59,5.96-55.48-41.68-71.25-106.39-15.76-64.72-9.42-122.01,14.16-127.96,23.13-5.84,54.25,39.86,70.32,102.66.09-.76.18-1.52.27-2.29,7.51-60.9,33.14-107.77,57.26-104.69,24.11,3.08,37.57,54.95,30.06,115.85-.6,4.91-1.33,9.72-2.16,14.42,2.49-5.83,5.39-11.71,8.71-17.56,23.71-41.81,59.31-66.08,79.52-54.2,20.21,11.88,17.37,55.41-6.34,97.22ZM133.42,296.47c-21.26,0-38.5,17.24-38.5,38.5s17.24,38.5,38.5,38.5,38.5-17.24,38.5-38.5-17.24-38.5-38.5-38.5Z"
      />
    </Svg>
  );
}
