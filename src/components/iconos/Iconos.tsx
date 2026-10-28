import { Circle, Line, Path, Svg } from 'react-native-svg';

type Props = {
  tamano?: number;
  color: string;
};

// Íconos lineales genéricos (trazo de 2 px, estilo de Figma). Los íconos de marca están en components/marca.

export function IconoOjo({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconoOjoTachado({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
      <Line x1={3} y1={3} x2={21} y2={21} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconoFlechaVolver({ tamano = 24, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10.5} stroke={color} strokeWidth={1.5} />
      <Path
        d="M13 7.5 8.5 12l4.5 4.5M9 12h7"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Íconos de la barra inferior y del botón Novedades (trazo 1.6–2 px, como en Figma).

export function IconoInicio({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoEspacios({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path d="M5 21V4a1 1 0 0 1 1-1h9v18M3 21h18M15 5h3v16" stroke={color} strokeWidth={1.8} />
      <Circle cx={12} cy={12.5} r={1} fill={color} />
    </Svg>
  );
}

export function IconoAgenda({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6ZM4 10h16M8 3v4M16 3v4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconoComunidad({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill={color}>
      <Circle cx={12} cy={7} r={3} />
      <Circle cx={5} cy={9} r={2.2} />
      <Circle cx={19} cy={9} r={2.2} />
      <Path d="M6 19a6 6 0 0 1 12 0v1H6v-1ZM1 19a4 4 0 0 1 5.2-3.8A7.5 7.5 0 0 0 4.6 20H1v-1ZM23 19a4 4 0 0 0-5.2-3.8 7.5 7.5 0 0 1 1.6 4.8H23v-1Z" />
    </Svg>
  );
}

export function IconoMegafono({ tamano = 14, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10v4a1 1 0 0 0 1 1h3l8 5V4L7 9H4a1 1 0 0 0-1 1ZM19 9a4 4 0 0 1 0 6"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}
